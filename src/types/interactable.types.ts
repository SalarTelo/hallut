/**
 * Type-safe interactable type definitions
 */

// Interactable types as const object (no string literals)
export const InteractableType = {
  NPC: 'npc',
  Object: 'object',
} as const;

export type InteractableType = typeof InteractableType[keyof typeof InteractableType];

// Action types as const object (no string literals)
export const InteractableActionType = {
  Dialogue: 'dialogue',
  Component: 'component',
  Task: 'task',
  Function: 'function',
} as const;

export type InteractableActionType = typeof InteractableActionType[keyof typeof InteractableActionType];

// Action definitions with type-safe action type
export type InteractableAction =
  | { type: typeof InteractableActionType.Dialogue; dialogue: string }
  | { type: typeof InteractableActionType.Component; component: string }
  | { type: typeof InteractableActionType.Task; task: string }
  | { type: typeof InteractableActionType.Function; function: () => void };

/**
 * Unlock requirement types for interactables
 * 
 * Examples:
 * - Task requirement: { type: 'task', task: 'task-1' }
 * - Password requirement: { type: 'password', password: 'secret123' }
 * - Story ready: { type: 'storyReady' }
 * - Custom field: { type: 'custom', field: 'hasKey', value: true, message?: 'Custom message' }
 */
export type UnlockRequirement =
  | { type: 'task'; task: string; message?: string }
  | { type: 'password'; password: string; message?: string }
  | { type: 'storyReady'; message?: string }
  | { type: 'custom'; field: string; value: unknown; message?: string };

// Complete Interactable interface
export interface Interactable {
  id: string;
  type: InteractableType;
  name: string;
  position: { x: number; y: number };
  avatar?: string;
  locked: boolean;
  unlockRequirement: UnlockRequirement | null;
  action: InteractableAction;
  /**
   * Tasks assigned to this interactable (only applies when action type is Dialogue)
   * This determines which tasks this interactable can give to the player
   */
  tasks?: string[];
}

