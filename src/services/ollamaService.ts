/**
 * Ollama Service
 * Hanterar kommunikation med Ollama API för olika AI-funktioner
 * Utbyggbar arkitektur för chatt, bildgenerering, bildigenkänning, etc.
 */

// ============================================================================
// Delade typer och konfiguration
// ============================================================================

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[]; // Base64-kodade bilder för vision-modeller
}

/**
 * Standardmodeller för olika funktioner
 */
export const DEFAULT_MODELS = {
    chat: 'llama3.2',
    vision: 'llava:7b',
    image: 'flux', // Exempel på bildgenereringsmodell
} as const;

/**
 * Ollama API bas-URL (via Vite proxy)
 */
const OLLAMA_API_BASE = '/api/ollama';

/**
 * Basfunktion för att göra Ollama API-förfrågningar
 */
async function ollamaRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${OLLAMA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Ollama API-fel: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Kontrollera om Ollama är tillgänglig
 */
export async function checkOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_API_BASE}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Hämta lista över tillgängliga modeller
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const data = await ollamaRequest<{ models: Array<{ name: string }> }>('/api/tags');
    return data.models.map((model) => model.name);
  } catch (error) {
    console.error('Fel vid hämtning av modeller:', error);
    return [];
  }
}

// ============================================================================
// Chattfunktioner
// ============================================================================

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
  };
}

export interface OllamaChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
}

/**
 * Skicka ett chattmeddelande till Ollama och få ett svar
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: OllamaMessage[] = [],
  model: string = DEFAULT_MODELS.chat,
  options?: OllamaChatRequest['options']
): Promise<string> {
  const messages: OllamaMessage[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: message,
    },
  ];

  const requestBody: OllamaChatRequest = {
    model,
    messages,
    stream: false,
    ...(options && { options }),
  };

  try {
    const data = await ollamaRequest<OllamaChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    return data.message.content;
  } catch (error) {
    console.error('Ollama chattfel:', error);
    throw error;
  }
}

/**
 * Hjälpfunktion för att streama JSON-svar från Ollama
 */
async function* streamJsonResponse(
  endpoint: string,
  body: unknown
): AsyncGenerator<unknown, void, unknown> {
  const response = await fetch(`${OLLAMA_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Ollama API-fel: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Ingen response body reader tillgänglig');
  }

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          yield JSON.parse(line);
        } catch {
          // Hoppa över ogiltiga JSON-rader
        }
      }
    }
  }
}

/**
 * Streama chattmeddelanden från Ollama
 */
export async function* streamChatMessage(
  message: string,
  conversationHistory: OllamaMessage[] = [],
  model: string = DEFAULT_MODELS.chat,
  options?: OllamaChatRequest['options']
): AsyncGenerator<string, void, unknown> {
  const messages: OllamaMessage[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: message,
    },
  ];

  const requestBody: OllamaChatRequest = {
    model,
    messages,
    stream: true,
    ...(options && { options }),
  };

  try {
    for await (const data of streamJsonResponse('/api/chat', requestBody)) {
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const messageData = data as { message?: { content?: string } };
        if (messageData.message?.content) {
          yield messageData.message.content;
        }
      }
    }
  } catch (error) {
    console.error('Ollama streamfel:', error);
    throw error;
  }
}

// ============================================================================
// Vision / Bildigenkänning
// ============================================================================

export interface OllamaVisionRequest {
  model: string;
  prompt: string;
  images: string[]; // Base64-kodade bilder
  stream?: boolean;
  options?: {
    temperature?: number;
  };
}

export interface OllamaVisionResponse {
  response: string;
  done: boolean;
}

/**
 * Analysera en bild med en vision-modell
 * @param prompt - Textprompt som beskriver vad som ska analyseras
 * @param imageBase64 - Base64-kodad bild
 * @param model - Vision-modellnamn (standard: llama3.2-vision)
 */
export async function analyzeImage(
  prompt: string,
  imageBase64: string,
  model: string = DEFAULT_MODELS.vision
): Promise<string> {
  const requestBody: OllamaVisionRequest = {
    model,
    prompt,
    images: [imageBase64],
    stream: false,
  };

  try {
    const data = await ollamaRequest<OllamaVisionResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    return data.response;
  } catch (error) {
    console.error('Ollama visionfel:', error);
    throw error;
  }
}

/**
 * Chatta med bilder (multimodal konversation)
 * @param message - Textmeddelande
 * @param images - Array av base64-kodade bilder
 * @param conversationHistory - Tidigare meddelanden i konversationen
 * @param model - Vision-kapabel modellnamn
 */
export async function sendChatWithImages(
  message: string,
  images: string[],
  conversationHistory: OllamaMessage[] = [],
  model: string = DEFAULT_MODELS.vision
): Promise<string> {
  const messages: OllamaMessage[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: message,
      images,
    },
  ];

  const requestBody: OllamaChatRequest = {
    model,
    messages,
    stream: false,
  };

  try {
    const data = await ollamaRequest<OllamaChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    return data.message.content;
  } catch (error) {
    console.error('Ollama vision chattfel:', error);
    throw error;
  }
}

// ============================================================================
// Bildgenerering
// ============================================================================

export interface OllamaImageGenerationRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    num_predict?: number;
    temperature?: number;
  };
}

export interface OllamaImageGenerationResponse {
  response: string; // Base64-kodad bild eller bild-URL
  done: boolean;
}

/**
 * Generera en bild från en textprompt
 * @param prompt - Textbeskrivning av bilden som ska genereras
 * @param model - Bildgenereringsmodellnamn (standard: flux)
 */
export async function generateImage(
  prompt: string,
  model: string = DEFAULT_MODELS.image
): Promise<string> {
  const requestBody: OllamaImageGenerationRequest = {
    model,
    prompt,
    stream: false,
  };

  try {
    const data = await ollamaRequest<OllamaImageGenerationResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    return data.response;
  } catch (error) {
    console.error('Ollama bildgenereringsfel:', error);
    throw error;
  }
}

/**
 * Streama bildgenereringsförlopp
 */
export async function* streamImageGeneration(
  prompt: string,
  model: string = DEFAULT_MODELS.image
): AsyncGenerator<string, void, unknown> {
  const requestBody: OllamaImageGenerationRequest = {
    model,
    prompt,
    stream: true,
  };

  try {
    for await (const data of streamJsonResponse('/api/generate', requestBody)) {
      if (typeof data === 'object' && data !== null && 'response' in data) {
        const responseData = data as { response?: string };
        if (responseData.response) {
          yield responseData.response;
        }
      }
    }
  } catch (error) {
    console.error('Ollama bildgenererings streamfel:', error);
    throw error;
  }
}

// ============================================================================
// Hjälpfunktioner
// ============================================================================

/**
 * Konvertera en File eller Blob till base64-sträng
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Ta bort data URL-prefix om det finns
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Konvertera en bild-URL till base64-sträng
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return fileToBase64(blob);
  } catch (error) {
    console.error('Fel vid konvertering av bild-URL till base64:', error);
    throw error;
  }
}

