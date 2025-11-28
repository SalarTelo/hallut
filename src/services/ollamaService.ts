/**
 * Ollama Service
 * Handles communication with Ollama API for various AI capabilities
 * Extensible architecture for chat, image generation, image recognition, etc.
 */

// ============================================================================
// Shared Types and Configuration
// ============================================================================

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[]; // Base64 encoded images for vision models
}

/**
 * Default models for different capabilities
 */
export const DEFAULT_MODELS = {
  chat: 'llama3.2',
  vision: 'llama3.2-vision', // Example vision model
  image: 'flux', // Example image generation model
} as const;

/**
 * Ollama API base URL (via Vite proxy)
 */
const OLLAMA_API_BASE = '/api/ollama';

/**
 * Base function to make Ollama API requests
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
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if Ollama is available
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
 * Get list of available models
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const data = await ollamaRequest<{ models: Array<{ name: string }> }>('/api/tags');
    return data.models.map((model) => model.name);
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

// ============================================================================
// Chat Capabilities
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
 * Send a chat message to Ollama and get a response
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
    console.error('Ollama chat error:', error);
    throw error;
  }
}

/**
 * Helper function to stream JSON responses from Ollama
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
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No response body reader available');
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
          // Skip invalid JSON lines
        }
      }
    }
  }
}

/**
 * Stream chat messages from Ollama
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
    console.error('Ollama stream error:', error);
    throw error;
  }
}

// ============================================================================
// Vision / Image Recognition Capabilities
// ============================================================================

export interface OllamaVisionRequest {
  model: string;
  prompt: string;
  images: string[]; // Base64 encoded images
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
 * Analyze an image using a vision model
 * @param prompt - Text prompt describing what to analyze
 * @param imageBase64 - Base64 encoded image
 * @param model - Vision model name (default: llama3.2-vision)
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
    console.error('Ollama vision error:', error);
    throw error;
  }
}

/**
 * Chat with images (multimodal conversation)
 * @param message - Text message
 * @param images - Array of base64 encoded images
 * @param conversationHistory - Previous messages in conversation
 * @param model - Vision-capable model name
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
    console.error('Ollama vision chat error:', error);
    throw error;
  }
}

// ============================================================================
// Image Generation Capabilities
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
  response: string; // Base64 encoded image or image URL
  done: boolean;
}

/**
 * Generate an image from a text prompt
 * @param prompt - Text description of the image to generate
 * @param model - Image generation model name (default: flux)
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
    console.error('Ollama image generation error:', error);
    throw error;
  }
}

/**
 * Stream image generation progress
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
    console.error('Ollama image generation stream error:', error);
    throw error;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert a File or Blob to base64 string
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert an image URL to base64 string
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return fileToBase64(blob);
  } catch (error) {
    console.error('Error converting image URL to base64:', error);
    throw error;
  }
}

