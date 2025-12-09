/**
 * Position Helper
 * Function for creating position coordinates
 */

import type { Position } from '@core/module/types/index.js';

/**
 * Create a position coordinate
 * 
 * @param x - X coordinate (0-100, percentage)
 * @param y - Y coordinate (0-100, percentage)
 * @returns Position object with x and y coordinates
 */
export function position(x: number, y: number): Position {
  return { x, y };
}

/**
 * @deprecated Use `position` instead. This alias will be removed in a future version.
 */
export const pos = position;

