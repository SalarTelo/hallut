/**
 * Modal Styles Utilities Tests
 * Unit tests for modal style utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  getHeaderGradient,
  getFooterGradient,
  getSeparatorGradient,
} from '../modalStyles.js';

describe('modalStyles', () => {
  describe('getHeaderGradient', () => {
    it('should return correct header gradient with border color', () => {
      const result = getHeaderGradient('#FFD700');
      expect(result).toBe('linear-gradient(135deg, #FFD70020 0%, #FFD70008 100%)');
    });

    it('should work with different colors', () => {
      const result = getHeaderGradient('#FF0000');
      expect(result).toBe('linear-gradient(135deg, #FF000020 0%, #FF000008 100%)');
    });

    it('should preserve exact gradient format', () => {
      const result = getHeaderGradient('#ABCDEF');
      expect(result).toContain('linear-gradient(135deg');
      expect(result).toContain('#ABCDEF20');
      expect(result).toContain('#ABCDEF08');
    });
  });

  describe('getFooterGradient', () => {
    it('should return correct footer gradient with border color', () => {
      const result = getFooterGradient('#FFD700');
      expect(result).toBe('linear-gradient(135deg, #FFD70008 0%, transparent 100%)');
    });

    it('should work with different colors', () => {
      const result = getFooterGradient('#00FF00');
      expect(result).toBe('linear-gradient(135deg, #00FF0008 0%, transparent 100%)');
    });

    it('should preserve exact gradient format', () => {
      const result = getFooterGradient('#123456');
      expect(result).toContain('linear-gradient(135deg');
      expect(result).toContain('#12345608');
      expect(result).toContain('transparent');
    });
  });

  describe('getSeparatorGradient', () => {
    it('should return correct separator gradient with border color', () => {
      const result = getSeparatorGradient('#FFD700');
      expect(result).toBe('linear-gradient(90deg, transparent 0%, #FFD70050 50%, transparent 100%)');
    });

    it('should work with different colors', () => {
      const result = getSeparatorGradient('#FF00FF');
      expect(result).toBe('linear-gradient(90deg, transparent 0%, #FF00FF50 50%, transparent 100%)');
    });

    it('should preserve exact gradient format', () => {
      const result = getSeparatorGradient('#FEDCBA');
      expect(result).toContain('linear-gradient(90deg');
      expect(result).toContain('#FEDCBA50');
      expect(result).toContain('transparent');
    });
  });
});

