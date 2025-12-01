/**
 * Interactable Types
 * Core interactable type definitions
 */

import type { DialogueConfig } from './dialogue.js';
import type { Task } from './task.js';
import type { UnlockRequirement } from './unlock.js';

// Re-export for convenience
export type { UnlockRequirement } from './unlock.js';

/**
 * Position on screen (percentage coordinates)
 */
export interface Position {
  x: number; // 0-100
  y: number; // 0-100
}

/**
 * Object interaction types
 */
export type ObjectInteraction =
  | { type: 'dialogue'; dialogue: DialogueConfig }
  | { type: 'component'; component: string; props?: Record<string, unknown> }
  | { type: 'image'; imageUrl: string; title?: string }
  | { type: 'note'; content: string; title?: string }
  | { type: 'none' };

/**
 * Get dialogue function (for dynamic dialogue selection)
 */
export type GetDialogueFunction = (context: import('./module.js').ModuleContext) => DialogueConfig;

/**
 * Get interaction function (for dynamic object interactions)
 */
export type GetInteractionFunction = (context: import('./module.js').ModuleContext) => ObjectInteraction;

/**
 * Interactable type
 */
export type InteractableType = 'npc' | 'object' | 'location';

/**
 * NPC (Non-Player Character)
 */
export interface NPC {
  id: string;
  type: 'npc';
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  dialogues: Record<string, DialogueConfig>;
  getDialogue?: GetDialogueFunction;
  tasks?: Record<string, Task>;
}

/**
 * Object
 */
export interface Object {
  id: string;
  type: 'object';
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  interaction?: ObjectInteraction;
  getInteraction?: GetInteractionFunction;
}

/**
 * Location
 */
export interface Location {
  id: string;
  type: 'location';
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  interaction?: ObjectInteraction;
  getInteraction?: GetInteractionFunction;
}

/**
 * Interactable union type
 */
export type Interactable = NPC | Object | Location;

