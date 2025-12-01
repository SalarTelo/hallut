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
 * Module configuration
 */
export interface ModuleConfig {
  manifest: ModuleManifest;
  background: ModuleBackground;
  welcome: ModuleWelcome;
  theme?: ModuleTheme;
  taskOrder: Task[]; // Objects, not strings!
  unlockRequirement?: import('./unlock.js').UnlockRequirement | null;
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
  dialogues: Record<string, DialogueConfig>;
}

