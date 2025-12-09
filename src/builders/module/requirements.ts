/**
 * Module Requirement Builders
 * Functions for creating unlock requirements for modules
 */

import type { UnlockRequirement } from '@core/unlock/types.js';

/**
 * Create a password unlock requirement
 */
export function passwordUnlock(
  password: string,
  hint?: string
): UnlockRequirement {
  return { type: 'password', password, hint };
}

/**
 * Create a module completion requirement (for dependencies)
 */
export function moduleComplete(moduleId: string): UnlockRequirement {
  return { type: 'module-complete', moduleId };
}

/**
 * Create an AND requirement (all must be met)
 */
export function andRequirements(
  ...requirements: UnlockRequirement[]
): UnlockRequirement {
  return { type: 'and', requirements };
}

/**
 * Create an OR requirement (any can be met)
 */
export function orRequirements(
  ...requirements: UnlockRequirement[]
): UnlockRequirement {
  return { type: 'or', requirements };
}

