/**
 * Error Service Tests
 * Unit tests for error handling service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleError, getUserFriendlyMessage } from '../errorService.js';

describe('Error Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should log error message in development mode', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      handleError('Test error');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle Error object', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');

      handleError(error);

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should log error stack in development mode', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      handleError(error);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2); // Error message and stack

      consoleErrorSpy.mockRestore();
    });

    it('should include context when provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      handleError('Test error', { moduleId: 'test', action: 'load' });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle string error message', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      handleError('Simple string error');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return network error message for network errors', () => {
      const error = new Error('Network error occurred');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Nätverksfel');
    });

    it('should return network error message for fetch errors', () => {
      const error = new Error('Failed to fetch');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('Nätverksfel');
    });

    it('should return not found message for 404 errors', () => {
      const error = new Error('404 Not Found');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('hittas');
    });

    it('should return server error message for 500 errors', () => {
      const error = new Error('500 Internal Server Error');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('serverfel');
    });

    it('should return timeout message for timeout errors', () => {
      const error = new Error('Request timeout');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('lång tid');
    });

    it('should return original error message if already user-friendly', () => {
      const error = new Error('User-friendly error message');
      const message = getUserFriendlyMessage(error);

      expect(message).toBe('User-friendly error message');
    });

    it('should return generic message for unknown errors', () => {
      const error = new Error('Some unknown error');
      const message = getUserFriendlyMessage(error);

      expect(message).toBe('Some unknown error');
    });

    it('should handle error without message', () => {
      const error = new Error();
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('oväntat fel');
    });

    it('should handle error with empty message', () => {
      const error = new Error('');
      const message = getUserFriendlyMessage(error);

      expect(message).toContain('oväntat fel');
    });
  });
});

