/**
 * Modal Style Utilities
 * Utility functions for common modal styling patterns
 */

/**
 * Get header gradient style
 * Returns the standard header gradient used across modals
 * 
 * @param borderColor - Border color to use in gradient
 * @returns CSS gradient string
 */
export function getHeaderGradient(borderColor: string): string {
  return `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}08 100%)`;
}

/**
 * Get footer gradient style
 * Returns the standard footer gradient used across modals
 * 
 * @param borderColor - Border color to use in gradient
 * @returns CSS gradient string
 */
export function getFooterGradient(borderColor: string): string {
  return `linear-gradient(135deg, ${borderColor}08 0%, transparent 100%)`;
}

/**
 * Get separator gradient style
 * Returns the standard separator gradient used in headers/footers
 * 
 * @param borderColor - Border color to use in gradient
 * @returns CSS gradient string
 */
export function getSeparatorGradient(borderColor: string): string {
  return `linear-gradient(90deg, transparent 0%, ${borderColor}50 50%, transparent 100%)`;
}

