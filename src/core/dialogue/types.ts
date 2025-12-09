/**
 * Dialogue Types
 * Core dialogue type definitions
 */

import type { Task } from '../task/types.js';
import type { ModuleContext } from '../module/types/index.js';

/**
 * Dynamic type helpers for runtime resolution
 */
export type DynamicString = string | ((context: ModuleContext) => string);
export type DynamicStringArray = string[] | ((context: ModuleContext) => string[]);
export type DynamicNode = DialogueNode | string | null | ((context: ModuleContext) => DialogueNode | string | null);
export type DynamicCondition = DialogueCondition | ((context: ModuleContext) => boolean);
export type DynamicActions = ChoiceAction[] | ((context: ModuleContext) => ChoiceAction[]);
export type DynamicChoices = Record<string, DialogueChoiceDefinition> | ((context: ModuleContext) => Record<string, DialogueChoiceDefinition>);

/**
 * Dialogue choice definition (used in node definitions)
 * Contains full behavior including text, next, actions, and condition
 */
export interface DialogueChoiceDefinition {
  text: DynamicString;
  next?: DynamicNode;
  actions?: DynamicActions;
  condition?: DynamicCondition;
}

/**
 * Dialogue node definition metadata (stored in builder, not serialized)
 * Contains the raw definitions with functions for runtime resolution
 */
export interface DialogueNodeDefinition {
  id?: string;
  task?: Task;
  lines: DynamicStringArray;
  choices?: DynamicChoices;
  next?: DynamicNode; // For auto-advance when no choices
}

/**
 * Dialogue node (data only - static structure for serialization)
 * Dynamic definitions are stored separately and resolved at runtime
 */
export interface DialogueNode {
  id: string; // Auto-generated if not provided
  lines: string[]; // Resolved at runtime from dynamic definition
  choices?: Record<string, DialogueChoiceData>; // Resolved at runtime from dynamic definition
  task?: Task; // For root dialogue navigation
  // Note: node-level next is stored in definition metadata and resolved at runtime
}

/**
 * Dialogue choice data (runtime structure)
 * This is the resolved, static version used at runtime
 */
export interface DialogueChoiceData {
  text: string;
  // Actions and next are stored in edges, not here
}

/**
 * Dialogue edge (connection with behavior)
 */
export interface DialogueEdge {
  from: DialogueNode;
  next: DialogueNode | null; // null means close dialogue (renamed from 'to')
  choiceKey: string; // Key in choices Record
  condition?: DialogueCondition; // Resolved at runtime
  actions?: ChoiceAction[]; // Resolved at runtime
}

/**
 * Dialogue condition
 * Can be a condition object or a function for convenience
 */
export type DialogueCondition = 
  | { type: 'task-complete'; task: Task }
  | { type: 'task-active'; task: Task }
  | { type: 'state-check'; key: string; value: unknown }
  | { type: 'interactable-state'; interactableId: string; key: string; value: unknown }
  | { type: 'module-state'; key: string; value: unknown }
  | { type: 'and'; conditions: DialogueCondition[] }
  | { type: 'or'; conditions: DialogueCondition[] }
  | { type: 'custom'; check: (context: ModuleContext) => boolean };

/**
 * Dialogue tree
 * Contains static nodes and edges, plus metadata for dynamic resolution
 */
export interface DialogueTree {
  nodes: DialogueNode[];
  edges: DialogueEdge[];
  entry?: DialogueNode | DialogueEntryConfig;
  // Metadata for dynamic field resolution (not serialized)
  _definitions?: Map<string, DialogueNodeDefinition>;
}

/**
 * Entry configuration (conditional entry points)
 */
export interface DialogueEntryConfig {
  conditions: Array<{
    condition: DialogueCondition;
    node: DialogueNode;
  }>;
  default: DialogueNode;
}

/**
 * Choice action types
 * Note: ModuleContext is defined in module.ts to avoid circular dependency
 */
export type ChoiceAction =
  | { type: 'accept-task'; task: Task }
  | { type: 'set-state'; key: string; value: unknown }
  | { type: 'set-interactable-state'; interactableId: string; key: string; value: unknown }
  | { type: 'set-module-state'; key: string; value: unknown }
  | { type: 'call-function'; handler: (context: ModuleContext) => void | Promise<void> }
  | { type: 'go-to'; node: DialogueNode | null }
  | { type: 'close-dialogue' }
  | { type: 'none' };

/**
 * Dialogue choice (for backward compatibility)
 */
export interface DialogueChoice {
  text: string;
  action: ChoiceAction | ChoiceAction[] | null;
}

/**
 * Dialogue configuration (for backward compatibility during migration)
 */
export interface DialogueConfig {
  id: string;
  lines: string[];
  choices?: DialogueChoice[];
}
