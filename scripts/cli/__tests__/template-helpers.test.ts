import { describe, it, expect } from 'vitest';
import {
  escapeSingleQuote,
  escapeDoubleQuote,
  singleQuote,
  doubleQuote,
  joinLines,
  cond,
} from '../template-helpers.js';

describe('Template Helpers', () => {
  describe('escapeSingleQuote', () => {
    it('should escape single quotes', () => {
      expect(escapeSingleQuote("I'm here")).toBe("I\\'m here");
    });

    it('should escape backslashes', () => {
      expect(escapeSingleQuote('path\\to\\file')).toBe('path\\\\to\\\\file');
    });

    it('should escape newlines', () => {
      expect(escapeSingleQuote('line1\nline2')).toBe('line1\\nline2');
    });

    it('should escape multiple special characters', () => {
      const input = "I'm a path\\to\\file\nwith\t tabs";
      const result = escapeSingleQuote(input);
      expect(result).toContain("\\'");
      expect(result).toContain('\\\\');
      expect(result).toContain('\\n');
      expect(result).toContain('\\t');
    });

    it('should handle empty strings', () => {
      expect(escapeSingleQuote('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      expect(escapeSingleQuote('hello world')).toBe('hello world');
    });
  });

  describe('escapeDoubleQuote', () => {
    it('should escape double quotes', () => {
      expect(escapeDoubleQuote('Say "hello"')).toBe('Say \\"hello\\"');
    });

    it('should escape backslashes', () => {
      expect(escapeDoubleQuote('path\\to\\file')).toBe('path\\\\to\\\\file');
    });

    it('should handle empty strings', () => {
      expect(escapeDoubleQuote('')).toBe('');
    });
  });

  describe('singleQuote', () => {
    it('should wrap string in single quotes and escape', () => {
      expect(singleQuote("I'm here")).toBe("'I\\'m here'");
    });

    it('should handle apostrophes correctly', () => {
      expect(singleQuote("you're interested")).toBe("'you\\'re interested'");
    });

    it('should handle empty strings', () => {
      expect(singleQuote('')).toBe("''");
    });

    it('should handle strings with newlines', () => {
      expect(singleQuote('line1\nline2')).toBe("'line1\\nline2'");
    });
  });

  describe('doubleQuote', () => {
    it('should wrap string in double quotes and escape', () => {
      expect(doubleQuote('Say "hello"')).toBe('"Say \\"hello\\""');
    });

    it('should handle empty strings', () => {
      expect(doubleQuote('')).toBe('""');
    });
  });

  describe('joinLines', () => {
    it('should join array with commas and newlines', () => {
      const items = ['item1', 'item2', 'item3'];
      expect(joinLines(items)).toBe('item1,\nitem2,\nitem3');
    });

    it('should apply indentation', () => {
      const items = ['item1', 'item2'];
      expect(joinLines(items, 2)).toBe('  item1,\n  item2');
    });

    it('should handle empty array', () => {
      expect(joinLines([])).toBe('');
    });

    it('should handle single item', () => {
      expect(joinLines(['item1'])).toBe('item1');
    });
  });

  describe('cond', () => {
    it('should return content when condition is true', () => {
      expect(cond(true, 'content')).toBe('content');
    });

    it('should return empty string when condition is false', () => {
      expect(cond(false, 'content')).toBe('');
    });
  });
});

