/**
 * Module Builders
 * Type-safe builders for creating module configurations
 */

import type {
  ModuleConfig,
  ModuleManifest,
  ModuleBackground,
  ModuleWelcome,
  ModuleTheme,
} from '@core/types/module.js';
import type { Task } from '@core/types/task.js';
import type { UnlockRequirement } from '@core/types/unlock.js';

/**
 * Create a module manifest
 */
export function createManifest(
  id: string,
  name: string,
  version: string = '1.0.0',
  summary?: string
): ModuleManifest {
  return { id, name, version, summary };
}

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

/**
 * Create a welcome message configuration
 */
export function createWelcome(speaker: string, lines: string[]): ModuleWelcome {
  return { speaker, lines };
}

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

/**
 * Module configuration options
 */
export interface ModuleConfigOptions {
  manifest: ModuleManifest;
  background: ModuleBackground;
  welcome: ModuleWelcome;
  theme?: ModuleTheme;
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

/**
 * Create a password unlock requirement
 */
export function passwordUnlock(
  password: string,
  hint?: string
): UnlockRequirement {
  return { type: 'password', password, hint };
}

/**
 * Create a module completion requirement (for dependencies)
 */
export function moduleComplete(moduleId: string): UnlockRequirement {
  return { type: 'module-complete', moduleId };
}

/**
 * Create an AND requirement (all must be met)
 */
export function andRequirements(
  ...requirements: UnlockRequirement[]
): UnlockRequirement {
  return { type: 'and', requirements };
}

/**
 * Create an OR requirement (any can be met)
 */
export function orRequirements(
  ...requirements: UnlockRequirement[]
): UnlockRequirement {
  return { type: 'or', requirements };
}

