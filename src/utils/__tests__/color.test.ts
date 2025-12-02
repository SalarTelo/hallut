/**
 * Color Utilities Tests
 * Unit tests for color manipulation functions
 */

import { describe, it, expect, vi } from 'vitest';
import { addOpacityToColor, getBackgroundColorStyle } from '../color.js';

describe('Color Utilities', () => {
  describe('addOpacityToColor', () => {
    it('should convert hex color to rgba with opacity', () => {
      const result = addOpacityToColor('#ff0000', 0.5);

      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle hex color without hash', () => {
      const result = addOpacityToColor('ff0000', 0.5);

      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle different opacity values', () => {
      expect(addOpacityToColor('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
      expect(addOpacityToColor('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)');
      expect(addOpacityToColor('#00ff00', 0.25)).toBe('rgba(0, 255, 0, 0.25)');
    });

    it('should handle uppercase hex colors', () => {
      const result = addOpacityToColor('#FF00FF', 0.5);

      expect(result).toBe('rgba(255, 0, 255, 0.5)');
    });

    it('should handle mixed case hex colors', () => {
      const result = addOpacityToColor('#aAbBcC', 0.75);

      expect(result).toBe('rgba(170, 187, 204, 0.75)');
    });

    it('should use fallback for invalid hex color', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = addOpacityToColor('invalid', 0.5);

      expect(result).toBe('rgba(0, 0, 0, 0.5)');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle short hex colors (3 digits)', () => {
      // Note: Current implementation doesn't handle 3-digit hex
      // This test documents current behavior
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = addOpacityToColor('#f00', 0.5);

      expect(result).toBe('rgba(0, 0, 0, 0.5)');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle empty string', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = addOpacityToColor('', 0.5);

      expect(result).toBe('rgba(0, 0, 0, 0.5)');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getBackgroundColorStyle', () => {
    it('should return style object with default backgroundColor', () => {
      const style = getBackgroundColorStyle();

      expect(style).toHaveProperty('backgroundColor');
      expect(style.backgroundColor).toBe('var(--theme-background-color, #1a1a2e)');
    });

    it('should use provided fallback color', () => {
      const style = getBackgroundColorStyle('#ff0000');

      expect(style.backgroundColor).toBe('#ff0000');
    });

    it('should return valid style object', () => {
      const style = getBackgroundColorStyle('#00ff00');

      expect(typeof style).toBe('object');
      expect(style).toHaveProperty('backgroundColor');
      expect(typeof style.backgroundColor).toBe('string');
    });
  });
});

