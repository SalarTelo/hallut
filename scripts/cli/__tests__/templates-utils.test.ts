import { describe, it, expect } from 'vitest';
import { indent, ifCondition } from '../templates/utils.js';

describe('Template Utils', () => {
  // Note: loadTemplate is tested via integration tests since it requires file I/O

  describe('indent', () => {
    it('should indent single line', () => {
      expect(indent('line', 2)).toBe('  line');
    });

    it('should indent multiple lines', () => {
      expect(indent('line1\nline2', 2)).toBe('  line1\n  line2');
    });

    it('should use default indentation of 2 spaces', () => {
      expect(indent('line')).toBe('  line');
    });

    it('should not indent empty lines', () => {
      expect(indent('line1\n\nline2', 2)).toBe('  line1\n\n  line2');
    });

    it('should handle custom indentation', () => {
      expect(indent('line', 4)).toBe('    line');
    });

    it('should handle empty string', () => {
      expect(indent('')).toBe('');
    });
  });

  describe('ifCondition', () => {
    it('should return content when condition is true', () => {
      expect(ifCondition(true, 'content')).toBe('content');
    });

    it('should return empty string when condition is false', () => {
      expect(ifCondition(false, 'content')).toBe('');
    });

    it('should handle empty content', () => {
      expect(ifCondition(true, '')).toBe('');
    });
  });
});

