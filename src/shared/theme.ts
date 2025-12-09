/**
 * Theme Utilities
 * Provides theme management and CSS variable injection for module-specific theming
 */

import { DEFAULT_THEME } from '../config/constants.js';

/**
 * Default JRPG theme
 */
export const defaultTheme = {
  borderColor: DEFAULT_THEME.BORDER_COLOR,
  backgroundColor: DEFAULT_THEME.BACKGROUND_COLOR,
  accentColors: {
    primary: '#FF8C00', // Orange
    secondary: '#FFA500', // Light orange
    highlight: '#87CEEB', // Light blue
  },
};

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  borderColor?: string;
  backgroundColor?: string;
  accentColors?: {
    primary?: string;
    secondary?: string;
    highlight?: string;
  };
}

/**
 * Apply theme to document root via CSS variables
 * 
 * @param theme - Theme configuration
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  const finalTheme = { ...defaultTheme, ...theme };

  // Set CSS variables
  root.style.setProperty('--theme-border-color', finalTheme.borderColor);
  root.style.setProperty('--theme-background-color', finalTheme.backgroundColor);
  
  if (finalTheme.accentColors) {
    if (finalTheme.accentColors.primary) {
      root.style.setProperty('--theme-accent-primary', finalTheme.accentColors.primary);
    }
    if (finalTheme.accentColors.secondary) {
      root.style.setProperty('--theme-accent-secondary', finalTheme.accentColors.secondary);
    }
    if (finalTheme.accentColors.highlight) {
      root.style.setProperty('--theme-accent-highlight', finalTheme.accentColors.highlight);
    }
  }
}

/**
 * Get theme value from CSS variable or default
 * 
 * @param variableName - CSS variable name (without -- prefix)
 * @param defaultValue - Default value if variable not set
 * @returns Theme value
 */
export function getThemeValue(variableName: string, defaultValue: string): string {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(`--theme-${variableName}`).trim();
  return value || defaultValue;
}

/**
 * Reset theme to default
 */
export function resetTheme(): void {
  applyTheme(defaultTheme);
}
