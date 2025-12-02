/**
 * Interactable Types
 * Core interactable type definitions
 */

import type { DialogueConfig, DialogueTree } from './dialogue.js';
import type { Task } from './task.js';
import type { UnlockRequirement } from './unlock.js';

// Re-export for convenience
export type { UnlockRequirement } from './unlock.js';

/**
 * State types
 */
export interface InteractableState {
  [key: string]: unknown;
}

export interface ModuleState {
  module: Record<string, unknown>;
  interactables: Record<string, InteractableState>;
}

/**
 * Position on screen (percentage coordinates)
 */
export interface Position {
  x: number; // 0-100
  y: number; // 0-100
}

/**
 * Valid component names for component interactions
 */
export type InteractableComponentName = 
  | 'NoteViewer'
  | 'SignViewer'
  | 'ChatWindow'
  | 'ImageViewer';

/**
 * Component-specific props based on component type
 */
export interface NoteViewerProps {
  content: string;
  title?: string;
}

export interface SignViewerProps {
  content: string;
  title?: string;
}

export interface ChatWindowProps {
  title?: string;
  placeholder?: string;
}

export interface ImageViewerProps {
  imageUrl: string;
  title?: string;
}

/**
 * Object interaction types with type-safe component names
 * Predefined components have type-safe props, custom components use generic props
 */
export type ObjectInteraction =
  | { type: 'dialogue'; dialogue: DialogueConfig }
  | { type: 'component'; component: 'NoteViewer'; props?: NoteViewerProps }
  | { type: 'component'; component: 'SignViewer'; props?: SignViewerProps }
  | { type: 'component'; component: 'ChatWindow'; props?: ChatWindowProps }
  | { type: 'component'; component: 'ImageViewer'; props?: ImageViewerProps }
  | { type: 'component'; component: string; props?: Record<string, unknown> } // Generic fallback for custom components
  | { type: 'none' };

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
  tasks?: Task[]; // Changed from Record<string, Task>
  dialogueTree?: DialogueTree; // New - replaces dialogues
  state?: InteractableState; // Runtime state (not in definition)
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

