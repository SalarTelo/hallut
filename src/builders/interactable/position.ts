/**
 * Position Helper
 * Function for creating position coordinates
 */

import type { Position } from '@core/module/types/index.js';

/**
 * Position helper
 */
export function pos(x: number, y: number): Position {
  return { x, y };
}

