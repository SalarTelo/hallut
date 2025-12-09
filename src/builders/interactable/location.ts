/**
 * Location Builder
 * Functions for creating locations
 */

import type {
  Location,
  Position,
  ObjectInteraction,
  GetInteractionFunction,
} from '@core/module/types/index.js';
import type { UnlockRequirement } from '@core/unlock/types.js';

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

