/**
 * Module Background Builders
 * Functions for creating module background configurations
 */

import type { ModuleBackground } from '@core/module/types/index.js';

/**
 * Create a background configuration
 */
export function createBackground(options: {
  color?: string;
  image?: string;
}): ModuleBackground {
  return options;
}

/**
 * Shorthand for color background
 */
export function colorBackground(color: string): ModuleBackground {
  return { color };
}

/**
 * Shorthand for image background
 */
export function imageBackground(image: string, fallbackColor?: string): ModuleBackground {
  return { image, color: fallbackColor };
}

