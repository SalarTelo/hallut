/**
 * Ollama Service Tests
 * Unit tests for Ollama API integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { streamChatMessage, analyzeImage, DEFAULT_MODELS } from '../ollamaService.js';
import type { OllamaMessage } from '../ollamaService.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('Ollama Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('DEFAULT_MODELS', () => {
    it('should have default models defined', () => {
      expect(DEFAULT_MODELS.chat).toBeDefined();
      expect(DEFAULT_MODELS.vision).toBeDefined();
    });
  });

  describe('streamChatMessage', () => {
    it('should stream chat messages', async () => {
      // Mock ReadableStream
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('{"message":{"content":"Hello"}}\n') })
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('{"message":{"content":" World"}}\n') })
          .mockResolvedValueOnce({ done: true }),
      };

      const mockResponse = {
        ok: true,
        body: {
          getReader: () => mockReader,
        },
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const chunks: string[] = [];
      for await (const chunk of streamChatMessage('Hello')) {
        chunks.push(chunk);
      }

      expect(fetch).toHaveBeenCalledWith('/api/ollama/api/chat', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
      
      expect(chunks.length).toBeGreaterThan(0);
    });

    it('should include conversation history', async () => {
      const mockReader = {
        read: vi.fn().mockResolvedValue({ done: true }),
      };

      const mockResponse = {
        ok: true,
        body: { getReader: () => mockReader },
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const history: OllamaMessage[] = [
        { role: 'user', content: 'First message' },
        { role: 'assistant', content: 'Response' },
      ];

      for await (const _ of streamChatMessage('Second message', history)) {
        // Consume generator
      }

      const callArgs = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      
      expect(body.messages).toHaveLength(3); // history + new message
      expect(body.messages[0]).toEqual(history[0]);
    });

    it('should use default model when not specified', async () => {
      const mockReader = {
        read: vi.fn().mockResolvedValue({ done: true }),
      };

      const mockResponse = {
        ok: true,
        body: { getReader: () => mockReader },
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      for await (const _ of streamChatMessage('Test')) {
        // Consume generator
      }

      const callArgs = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      
      expect(body.model).toBe(DEFAULT_MODELS.chat);
    });

    it('should throw error on API failure', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await expect(async () => {
        for await (const _ of streamChatMessage('Test')) {
          // Consume generator
        }
      }).rejects.toThrow();
    });
  });

  describe('analyzeImage', () => {
    it('should analyze image with prompt', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ response: 'Image analysis result' }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await analyzeImage('What is in this image?', 'base64data');

      expect(fetch).toHaveBeenCalledWith('/api/ollama/api/generate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));

      expect(result).toBe('Image analysis result');
    });

    it('should use default vision model when not specified', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ response: 'Result' }),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await analyzeImage('Prompt', 'base64data');

      const callArgs = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      
      expect(body.model).toBe(DEFAULT_MODELS.vision);
    });

    it('should throw error on API failure', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await expect(analyzeImage('Prompt', 'base64data')).rejects.toThrow();
    });

    it('should handle empty response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      };

      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const result = await analyzeImage('Prompt', 'base64data');

      expect(result).toBe('');
    });
  });
});

