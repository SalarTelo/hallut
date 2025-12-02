/**
 * Module Types
 * Core module type definitions
 */

import type { Task } from './task.js';
import type { Interactable } from './interactable.js';
import type { ChoiceAction, DialogueConfig } from './dialogue.js';

// Re-export for convenience
export type { Task, DialogueConfig };

/**
 * Module context provided to modules
 */
export interface ModuleContext {
  moduleId: string;
  locale: string;
  setModuleStateField: (key: string, value: unknown) => void;
  getModuleStateField: (key: string) => unknown;
  acceptTask: (task: Task | string) => void;
  completeTask: (task: Task | string) => void;
  isTaskCompleted: (task: Task | string) => boolean;
  getCurrentTask: () => Task | null;
  getCurrentTaskId: () => string | null;
  openTaskSubmission?: (task: Task | string) => void;
  setInteractableState: (interactableId: string, key: string, value: unknown) => void;
  getInteractableState: (interactableId: string, key: string) => unknown;
  getInteractable: (interactableId: string) => Interactable | null;
}

/**
 * Module manifest
 */
export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  summary?: string;
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
  unlockRequirement?: import('./unlock.js').UnlockRequirement | null;
  worldmap?: ModuleWorldmapConfig; // Optional worldmap position and icon configuration
}

/**
 * Module content
 */
export interface ModuleContent {
  interactables: Interactable[];
  tasks: Task[];
}

/**
 * Module handlers (optional)
 */
export interface ModuleHandlers {
  onChoiceAction?: (
    dialogueId: string,
    action: ChoiceAction,
    context: ModuleContext
  ) => void | Promise<void>;
}

/**
 * Module definition
 */
export interface ModuleDefinition {
  id: string;
  config: ModuleConfig;
  content: ModuleContent;
  handlers?: ModuleHandlers;
}

/**
 * Module data (loaded module)
 */
export interface ModuleData {
  id: string;
  config: ModuleConfig;
  interactables: Interactable[];
  tasks: Task[];
}

