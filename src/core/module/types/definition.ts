/**
 * Module Definition Types
 * Types for module definitions, content, handlers, and data
 */

import type { Task } from '../../task/types.js';
import type { ChoiceAction } from '../../dialogue/types.js';
import type { ModuleConfig } from './config.js';
import type { Interactable } from './interactables.js';
import type { ModuleContext } from './context.js';

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

