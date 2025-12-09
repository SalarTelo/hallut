/**
 * Module Types
 * Core module and interactable type definitions
 */

import type { Task } from '../task/types.js';
import type { ChoiceAction, DialogueConfig, DialogueTree } from '../dialogue/types.js';
import type { UnlockRequirement } from '../unlock/types.js';

// Re-export for convenience
export type { Task, DialogueConfig };

// ============================================================================
// Interactable Types
// ============================================================================

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
export type GetInteractionFunction = (context: ModuleContext) => ObjectInteraction;

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

// ============================================================================
// Module Types
// ============================================================================

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
  unlockRequirement?: UnlockRequirement | null;
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
