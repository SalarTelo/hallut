/**
 * Editing Tests
 * Tests for editing functionality
 */

import { describe, it, expect, vi } from 'vitest';
import * as editingModule from '../editing.js';
import chalk from 'chalk';

vi.mock('chalk', () => ({
  default: {
    yellow: vi.fn((s: string) => s),
    dim: vi.fn((s: string) => s),
  },
}));

describe('Editing', () => {
  describe('editModule', () => {
    it('should display not implemented message', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await editingModule.editModule();

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not yet fully implemented'));

      consoleLogSpy.mockRestore();
    });

    it('should provide helpful message', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await editingModule.editModule();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('manually'));

      consoleLogSpy.mockRestore();
    });
  });
});

