/**
 * Module Theme Builder
 * Functions for creating module theme configurations
 */

import type { ModuleTheme } from '@core/module/types/index.js';

/**
 * Create a theme configuration
 */
export function createTheme(
  borderColor: string,
  accentColors?: {
    primary?: string;
    secondary?: string;
    highlight?: string;
  }
): ModuleTheme {
  const theme: ModuleTheme = { borderColor };
  if (accentColors) {
    theme.accentColors = accentColors;
  }
  return theme;
}

