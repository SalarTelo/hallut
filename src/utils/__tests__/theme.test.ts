/**
 * Theme Utilities Tests
 * Unit tests for theme management functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyTheme, getThemeValue, resetTheme, defaultTheme } from '../theme.js';

describe('Theme Utilities', () => {
  beforeEach(() => {
    // Clear CSS variables before each test
    document.documentElement.style.removeProperty('--theme-border-color');
    document.documentElement.style.removeProperty('--theme-background-color');
    document.documentElement.style.removeProperty('--theme-accent-primary');
    document.documentElement.style.removeProperty('--theme-accent-secondary');
    document.documentElement.style.removeProperty('--theme-accent-highlight');
  });

  describe('applyTheme', () => {
    it('should set border color CSS variable', () => {
      applyTheme({ borderColor: '#ff0000' });

      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-border-color')
        .trim();

      expect(value).toBe('#ff0000');
    });

    it('should set background color CSS variable', () => {
      applyTheme({ backgroundColor: '#00ff00' });

      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-background-color')
        .trim();

      expect(value).toBe('#00ff00');
    });

    it('should merge with default theme', () => {
      applyTheme({ borderColor: '#ff0000' });

      const borderColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-border-color')
        .trim();
      const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-background-color')
        .trim();

      expect(borderColor).toBe('#ff0000');
      expect(backgroundColor).toBe(defaultTheme.backgroundColor);
    });

    it('should set primary accent color', () => {
      applyTheme({
        accentColors: {
          primary: '#0000ff',
        },
      });

      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-primary')
        .trim();

      expect(value).toBe('#0000ff');
    });

    it('should set secondary accent color', () => {
      applyTheme({
        accentColors: {
          secondary: '#ffff00',
        },
      });

      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-secondary')
        .trim();

      expect(value).toBe('#ffff00');
    });

    it('should set highlight accent color', () => {
      applyTheme({
        accentColors: {
          highlight: '#ff00ff',
        },
      });

      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-highlight')
        .trim();

      expect(value).toBe('#ff00ff');
    });

    it('should set all accent colors', () => {
      applyTheme({
        accentColors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          highlight: '#0000ff',
        },
      });

      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-primary')
        .trim();
      const secondary = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-secondary')
        .trim();
      const highlight = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-highlight')
        .trim();

      expect(primary).toBe('#ff0000');
      expect(secondary).toBe('#00ff00');
      expect(highlight).toBe('#0000ff');
    });

    it('should not set undefined accent colors', () => {
      applyTheme({
        accentColors: {
          primary: '#ff0000',
          // secondary and highlight are undefined
        },
      });

      const secondary = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-secondary')
        .trim();
      const highlight = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-highlight')
        .trim();

      expect(secondary).toBe('');
      expect(highlight).toBe('');
    });
  });

  describe('getThemeValue', () => {
    beforeEach(() => {
      // Set up test CSS variable
      document.documentElement.style.setProperty('--theme-test-color', '#ff0000');
    });

    afterEach(() => {
      document.documentElement.style.removeProperty('--theme-test-color');
    });

    it('should retrieve theme value from CSS variable', () => {
      const value = getThemeValue('test-color', '#000000');

      expect(value).toBe('#ff0000');
    });

    it('should use default value when CSS variable not set', () => {
      const value = getThemeValue('non-existent', '#000000');

      expect(value).toBe('#000000');
    });

    it('should trim whitespace from CSS variable value', () => {
      document.documentElement.style.setProperty('--theme-test-color', '  #ff0000  ');
      
      const value = getThemeValue('test-color', '#000000');

      expect(value).toBe('#ff0000');
    });

    it('should handle empty CSS variable', () => {
      document.documentElement.style.setProperty('--theme-test-color', '');
      
      const value = getThemeValue('test-color', '#000000');

      expect(value).toBe('#000000');
    });
  });

  describe('resetTheme', () => {
    it('should reset theme to default values', () => {
      // Set custom theme first
      applyTheme({
        borderColor: '#ff0000',
        backgroundColor: '#00ff00',
      });

      // Reset to default
      resetTheme();

      const borderColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-border-color')
        .trim();
      const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-background-color')
        .trim();

      expect(borderColor).toBe(defaultTheme.borderColor);
      expect(backgroundColor).toBe(defaultTheme.backgroundColor);
    });

    it('should reset accent colors to default', () => {
      applyTheme({
        accentColors: {
          primary: '#ff0000',
        },
      });

      resetTheme();

      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-primary')
        .trim();

      expect(primary).toBe(defaultTheme.accentColors?.primary);
    });
  });

  describe('defaultTheme', () => {
    it('should have all required theme properties', () => {
      expect(defaultTheme).toHaveProperty('borderColor');
      expect(defaultTheme).toHaveProperty('backgroundColor');
      expect(defaultTheme).toHaveProperty('accentColors');
    });

    it('should have all accent colors defined', () => {
      expect(defaultTheme.accentColors).toBeDefined();
      expect(defaultTheme.accentColors?.primary).toBeDefined();
      expect(defaultTheme.accentColors?.secondary).toBeDefined();
      expect(defaultTheme.accentColors?.highlight).toBeDefined();
    });
  });
});

