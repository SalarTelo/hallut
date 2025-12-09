/**
 * useThemeBorderColor Hook
 * Extracts repeated borderColor logic with theme fallback
 */

import { getThemeValue } from '@lib/theme.js';

/**
 * Get border color from prop or theme
 * 
 * @param borderColor - Optional border color override
 * @param defaultValue - Default value if theme not set (default: '#FFD700')
 * @returns Border color value
 */
export function useThemeBorderColor(
  borderColor?: string,
  defaultValue: string = '#FFD700'
): string {
  return borderColor || getThemeValue('border-color', defaultValue);
}

