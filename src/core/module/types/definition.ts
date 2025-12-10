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
 * Component renderer for custom modals
 */
export type ComponentRenderer = (props: {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, unknown>;
  borderColor?: string;
}) => import('react').ReactNode;

/**
 * Task submission component renderer
 */
export type TaskSubmissionComponentRenderer = (props: {
  value?: unknown;
  onChange: (value: unknown) => void;
  config?: Record<string, unknown>;
}) => import('react').ReactNode;

/**
 * Module definition
 */
export interface ModuleDefinition {
  id: string;
  config: ModuleConfig;
  content: ModuleContent;
  handlers?: ModuleHandlers;
  /**
   * Optional custom component renderers for modals
   * Keys are component names, values are render functions
   * Use these to create custom viewers that work like showNoteViewer()
   */
  components?: Record<string, ComponentRenderer>;
  /**
   * Optional custom task submission components
   * Keys are component names, values are render functions
   * Use these to create custom task submission interfaces
   */
  taskSubmissionComponents?: Record<string, TaskSubmissionComponentRenderer>;
}

/**
 * Module data (loaded module)
 */
export interface ModuleData {
  id: string;
  config: ModuleConfig;
  interactables: Interactable[];
  tasks: Task[];
  components?: Record<string, ComponentRenderer>;
  taskSubmissionComponents?: Record<string, TaskSubmissionComponentRenderer>;
}

