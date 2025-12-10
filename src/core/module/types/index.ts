/**
 * Module Types
 * Central export for all module types
 */

// Re-export for convenience
export type { Task } from '../../task/types.js';
// DialogueConfig removed - use DialogueTree for NPCs, component interactions for objects

// Interactable types
export type {
  InteractableState,
  ModuleState,
  Position,
  InteractableComponentName,
  NoteViewerProps,
  SignViewerProps,
  ChatWindowProps,
  ImageViewerProps,
  VideoViewerProps,
  ObjectInteraction,
  GetInteractionFunction,
  InteractableType,
  NPCMeta,
  ObjectMeta,
  NPC,
  Object,
  Location,
  Interactable,
} from './interactables.js';

// Configuration types
export type {
  ModuleMeta,
  ModuleManifest,
  ModuleBackground,
  ModuleWelcome,
  ModuleTheme,
  ModuleWorldmapConfig,
  ModuleConfig,
} from './config.js';

// Context types
export type {
  ModuleContext,
} from './context.js';

// Definition types
export type {
  ModuleContent,
  ModuleHandlers,
  ModuleDefinition,
  ModuleData,
  ComponentRenderer,
} from './definition.js';

