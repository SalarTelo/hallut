/**
 * Ollama Service
 * Integration with Ollama API for AI chat and image analysis
 */

/**
 * Ollama message format
 */
export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Default model names
 */
export const DEFAULT_MODELS = {
  chat: 'llama3.2',
  vision: 'llama3.2',
} as const;

/**
 * Stream chat message from Ollama
 * @param message - User message
 * @param history - Conversation history
 * @param model - Model name (default: llama3.2)
 * @returns Async generator yielding text chunks
 */
export async function* streamChatMessage(
  message: string,
  history: OllamaMessage[] = [],
  model: string = DEFAULT_MODELS.chat
): AsyncGenerator<string, void, unknown> {
  const messages: OllamaMessage[] = [
    ...history,
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('/api/ollama/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            yield data.message.content;
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      try {
        const data = JSON.parse(buffer);
        if (data.message?.content) {
          yield data.message.content;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  } catch (error) {
    console.error('Error streaming chat message:', error);
    throw error;
  }
}

/**
 * Analyze an image using Ollama vision model
 * @param prompt - Analysis prompt
 * @param imageBase64 - Base64 encoded image
 * @param model - Vision model name (default: llama3.2)
 * @returns Analysis result text
 */
export async function analyzeImage(
  prompt: string,
  imageBase64: string,
  model: string = DEFAULT_MODELS.vision
): Promise<string> {
  try {
    const response = await fetch('/api/ollama/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        images: [imageBase64],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

