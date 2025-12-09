/**
 * Object Builder
 * Functions for creating objects
 */

import type {
  Object,
  Position,
  ObjectInteraction,
  GetInteractionFunction,
} from '@core/module/types/index.js';
import type { UnlockRequirement } from '@core/unlock/types.js';
import { showNote, showImage } from './interactions.js';

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

