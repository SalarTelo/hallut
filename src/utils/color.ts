/**
 * Color Utilities
 * Utility functions for color manipulation and formatting
 */

/**
 * Add opacity to a hex color
 * Converts hex color to rgba format with specified opacity
 * 
 * @param hex - Hex color string (with or without #)
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function addOpacityToColor(hex: string, opacity: number): string {
  // Remove # if present
  const hexWithoutHash = hex.replace('#', '');
  
  // Validate hex color
  if (!/^[0-9A-Fa-f]{6}$/.test(hexWithoutHash)) {
    console.warn(`Invalid hex color: ${hex}. Using fallback.`);
    return `rgba(0, 0, 0, ${opacity})`;
  }
  
  // Convert to RGB
  const r = parseInt(hexWithoutHash.substring(0, 2), 16);
  const g = parseInt(hexWithoutHash.substring(2, 4), 16);
  const b = parseInt(hexWithoutHash.substring(4, 6), 16);
  
  // Return rgba
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get background color style with theme fallback
 * 
 * @param fallback - Fallback color if CSS variable not set
 * @returns Style object with backgroundColor
 */
export function getBackgroundColorStyle(fallback?: string): { backgroundColor: string } {
  const fallbackColor = fallback || 'var(--theme-background-color, #1a1a2e)';
  return {
    backgroundColor: fallbackColor,
  };
}

