/**
 * Module Welcome Builder
 * Functions for creating module welcome configurations
 */

import type { ModuleWelcome } from '@core/module/types/index.js';

/**
 * Create a welcome message configuration
 */
export function createWelcome(speaker: string, lines: string[]): ModuleWelcome {
  return { speaker, lines };
}

