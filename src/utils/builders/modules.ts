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
} from '../../core/types/module.js';
import type { Task } from '../../core/types/task.js';

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
  taskOrder: Task[]; // Objects, not strings!
  theme?: ModuleTheme;
  requires?: string[]; // Module IDs (strings for cross-module) - defines worldmap connections
}

/**
 * Create a module configuration
 */
export function createModuleConfig(options: ModuleConfigOptions): ModuleConfig {
  const { manifest, background, welcome, taskOrder, theme, requires } = options;

  const config: ModuleConfig = {
    manifest,
    background,
    welcome,
    taskOrder,
  };

  if (theme) {
    config.theme = theme;
  }

  if (requires && requires.length > 0) {
    config.requires = requires;
  }

  return config;
}

