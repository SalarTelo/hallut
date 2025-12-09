/**
 * Module Config Builder
 * Functions for creating module configurations
 */

import type { ModuleConfig } from '@core/module/types/index.js';
import type { UnlockRequirement } from '@core/unlock/types.js';

/**
 * Module configuration options
 */
export interface ModuleConfigOptions {
  manifest: ModuleConfig['manifest'];
  background: ModuleConfig['background'];
  welcome: ModuleConfig['welcome'];
  theme?: ModuleConfig['theme'];
  unlockRequirement?: UnlockRequirement | null;
  worldmap?: {
    position: {
      x: number; // Percentage (0-100)
      y: number; // Percentage (0-100)
    };
    icon?: {
      shape?: 'circle' | 'square' | 'diamond';
      size?: number;
    };
  };
}

/**
 * Create a module configuration
 */
export function createModuleConfig(options: ModuleConfigOptions): ModuleConfig {
  const { manifest, background, welcome, theme, unlockRequirement, worldmap } = options;

  const config: ModuleConfig = {
    manifest,
    background,
    welcome,
  };

  if (theme) {
    config.theme = theme;
  }

  if (unlockRequirement !== undefined) {
    config.unlockRequirement = unlockRequirement;
  }

  if (worldmap) {
    config.worldmap = worldmap;
  }

  return config;
}

