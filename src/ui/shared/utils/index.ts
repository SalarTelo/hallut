/**
 * Shared Utilities
 * Utility functions for UI components
 */

export { getHeaderGradient, getFooterGradient, getSeparatorGradient } from './modalStyles.js';

/**
 * Merge class names together, filtering out falsy values
 * 
 * @param classes - Class names to merge
 * @returns Merged class name string
 * 
 * @example
 * ```tsx
 * cn('base-class', condition && 'conditional-class', className)
 * ```
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get theme-aware color value
 * 
 * @param color - Color value or undefined
 * @param defaultValue - Default color if not provided
 * @returns Color value
 */
export function getThemeColor(color: string | undefined, defaultValue: string): string {
  return color || defaultValue;
}

/**
 * Merge style objects together
 * 
 * @param styles - Style objects to merge
 * @returns Merged style object
 * 
 * @example
 * ```tsx
 * const mergedStyle = mergeStyles(baseStyle, conditionalStyle, propStyle)
 * ```
 */
export function mergeStyles(...styles: (Record<string, unknown> | undefined | null)[]): Record<string, unknown> {
  return Object.assign({}, ...styles.filter(Boolean));
}

