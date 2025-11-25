/**
 * Ollama API client
 * Handles communication with local Ollama instance
 */

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
}

export interface OllamaChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

/**
 * Default Ollama configuration
 * In development, use Vite proxy to avoid CORS issues
 */
const DEFAULT_OLLAMA_URL = import.meta.env.DEV 
  ? '/api/ollama'  // Use Vite proxy in development
  : 'http://localhost:11434';  // Direct connection in production
const DEFAULT_MODEL = 'llama3.2'; // Change to your preferred model

/**
 * Chat with Ollama
 */
export async function chatWithOllama(
  messages: OllamaMessage[],
  options?: {
    model?: string;
    ollamaUrl?: string;
    stream?: boolean;
  }
): Promise<string> {
  const ollamaUrl = options?.ollamaUrl || DEFAULT_OLLAMA_URL;
  const model = options?.model || DEFAULT_MODEL;
  const stream = options?.stream ?? false;

  try {
    // Use proxy path in dev, direct path in production
    const url = ollamaUrl.startsWith('/')
      ? `${ollamaUrl}/chat`  // Proxy path (Vite rewrites /api/ollama to /api)
      : `${ollamaUrl}/api/chat`;  // Direct connection
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    if (stream) {
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullResponse += data.message.content;
            }
            if (data.done) {
              return fullResponse;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      return fullResponse;
    } else {
      // Handle non-streaming response
      const data: OllamaChatResponse = await response.json();
      return data.message.content;
    }
  } catch (error) {
    console.error('Ollama API error:', error);
    
    // Provide helpful error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Kunde inte ansluta till Ollama. Kontrollera att Ollama körs (ollama serve).');
    }
    
    throw error;
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaAvailable(
  ollamaUrl: string = DEFAULT_OLLAMA_URL
): Promise<boolean> {
  try {
    const url = ollamaUrl.startsWith('/') 
      ? `${ollamaUrl}/tags`  // Proxy path
      : `${ollamaUrl}/api/tags`;  // Direct connection
    const response = await fetch(url, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

