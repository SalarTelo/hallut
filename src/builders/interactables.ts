/**
 * Interactable Builders
 * Type-safe builders for creating NPCs and objects
 */

import type {
  NPC,
  Object,
  Location,
  Position,
  UnlockRequirement,
  ObjectInteraction,
  GetInteractionFunction,
  InteractableComponentName,
  NoteViewerProps,
  SignViewerProps,
  ChatWindowProps,
  ImageViewerProps,
} from '@core/module/types.js';
import type { DialogueTree, DialogueConfig } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';

/**
 * Position helper
 */
export function pos(x: number, y: number): Position {
  return { x, y };
}

// ============================================================================
// Requirement Builders (Type-Safe)
// ============================================================================

/**
 * Create a task completion requirement
 */
export function taskComplete(task: Task): UnlockRequirement {
  return {
    type: 'task-complete',
    task,
  };
}

/**
 * Create a module completion requirement
 */
export function moduleComplete(moduleId: string): UnlockRequirement {
  return {
    type: 'module-complete',
    moduleId,
  };
}

/**
 * Create a state check requirement
 */
export function stateCheck(key: string, value: unknown): UnlockRequirement {
  return {
    type: 'state-check',
    key,
    value,
  };
}

// ============================================================================
// Interaction Builders
// ============================================================================

/**
 * Show dialogue interaction
 */
export function showDialogue(dialogue: DialogueConfig): ObjectInteraction {
  return {
    type: 'dialogue',
    dialogue,
  };
}

/**
 * Show component interaction
 * Accepts predefined type-safe components or custom component names
 */
export function showComponent(
  componentName: InteractableComponentName | string,
  props?: Record<string, unknown>
): ObjectInteraction {
  return {
    type: 'component',
    component: componentName,
    props,
  };
}

/**
 * Show NoteViewer component interaction (type-safe)
 */
export function showNoteViewer(props: NoteViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'NoteViewer',
    props,
  };
}

/**
 * Show SignViewer component interaction (type-safe)
 */
export function showSignViewer(props: SignViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'SignViewer',
    props,
  };
}

/**
 * Show ChatWindow component interaction (type-safe)
 */
export function showChatWindow(props?: ChatWindowProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'ChatWindow',
    props: props || {},
  };
}

/**
 * Show ImageViewer component interaction (type-safe)
 */
export function showImageViewer(props: ImageViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'ImageViewer',
    props,
  };
}

/**
 * Show image interaction (uses component pattern)
 */
export function showImage(imageUrl: string, title?: string): ObjectInteraction {
  return showImageViewer({ imageUrl, title });
}

/**
 * Show note interaction
 */
export function showNote(content: string, title?: string): ObjectInteraction {
  return {
    type: 'component',
    component: 'NoteViewer',
    props: { content, title },
  };
}

// ============================================================================
// NPC Builder
// ============================================================================

/**
 * NPC creation options
 */
export interface NPCOptions {
  id: string;
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  tasks?: Task[]; // Changed from Record<string, Task>
  dialogueTree?: DialogueTree; // New - replaces dialogues
}

/**
 * Create an NPC
 */
export function createNPC(options: NPCOptions): NPC {
  const {
    id,
    name,
    position,
    avatar,
    locked = false,
    unlockRequirement = null,
    tasks,
    dialogueTree,
  } = options;

  return {
    id,
    type: 'npc',
    name,
    position,
    avatar,
    locked,
    unlockRequirement,
    tasks,
    dialogueTree,
  };
}

// ============================================================================
// Object Builder
// ============================================================================

/**
 * Object creation options
 */
export interface ObjectOptions {
  id: string;
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  interaction?: ObjectInteraction;
  getInteraction?: GetInteractionFunction;
}

/**
 * Create an object
 */
export function createObject(options: ObjectOptions): Object {
  const {
    id,
    name,
    position,
    avatar,
    locked = false,
    unlockRequirement = null,
    interaction,
    getInteraction,
  } = options;

  return {
    id,
    type: 'object',
    name,
    position,
    avatar,
    locked,
    unlockRequirement,
    interaction,
    getInteraction,
  };
}

// ============================================================================
// Location Builder
// ============================================================================

/**
 * Location creation options
 */
export interface LocationOptions {
  id: string;
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  interaction?: ObjectInteraction;
  getInteraction?: GetInteractionFunction;
}

/**
 * Create a location
 */
export function createLocation(options: LocationOptions): Location {
  const {
    id,
    name,
    position,
    avatar,
    locked = false,
    unlockRequirement = null,
    interaction,
    getInteraction,
  } = options;

  return {
    id,
    type: 'location',
    name,
    position,
    avatar,
    locked,
    unlockRequirement,
    interaction,
    getInteraction,
  };
}

// ============================================================================
// Shorthand Helpers
// ============================================================================

/**
 * Create a note object (shorthand)
 */
export function createNoteObject(options: {
  id: string;
  name: string;
  position: Position;
  content: string;
  title?: string;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
}): Object {
  return createObject({
    id: options.id,
    name: options.name,
    position: options.position,
    avatar: options.avatar,
    locked: options.locked,
    unlockRequirement: options.unlockRequirement,
    interaction: showNote(options.content, options.title),
  });
}

/**
 * Create an image object (shorthand)
 */
export function createImageObject(options: {
  id: string;
  name: string;
  position: Position;
  imageUrl: string;
  title?: string;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
}): Object {
  return createObject({
    id: options.id,
    name: options.name,
    position: options.position,
    avatar: options.avatar,
    locked: options.locked,
    unlockRequirement: options.unlockRequirement,
    interaction: showImage(options.imageUrl, options.title),
  });
}
