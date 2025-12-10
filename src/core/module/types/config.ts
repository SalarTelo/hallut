/**
 * Module Configuration Types
 * Types for module configuration, manifest, background, welcome, theme, and worldmap
 */

import type { UnlockRequirement } from '../../unlock/types.js';

/**
 * Module metadata for additional context (AI, UI, etc.)
 */
export interface ModuleMeta {
  [key: string]: unknown; // Flexible for future use
}

/**
 * Module manifest
 */
export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  summary?: string;
  meta?: ModuleMeta;
}

/**
 * Module background
 */
export interface ModuleBackground {
  color?: string;
  image?: string;
}

/**
 * Module welcome
 */
export interface ModuleWelcome {
  speaker: string;
  lines: string[];
}

/**
 * Module theme
 */
export interface ModuleTheme {
  borderColor: string;
  accentColors?: {
    primary?: string;
    secondary?: string;
    highlight?: string;
  };
}

/**
 * Worldmap position configuration for a module
 */
export interface ModuleWorldmapConfig {
  position: {
    x: number; // Percentage (0-100)
    y: number; // Percentage (0-100)
  };
  icon?: {
    shape?: 'circle' | 'square' | 'diamond';
    size?: number;
  };
}

/**
 * Module configuration
 */
export interface ModuleConfig {
  manifest: ModuleManifest;
  background: ModuleBackground;
  welcome: ModuleWelcome;
  theme?: ModuleTheme;
  unlockRequirement?: UnlockRequirement | null;
  worldmap?: ModuleWorldmapConfig; // Optional worldmap position and icon configuration
}

