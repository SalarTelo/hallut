/**
 * Guide NPC State
 * State management for the guide NPC
 */

import { createStateRef } from '@builders/index.js';

/**
 * Guide state reference
 */
export const guideState = createStateRef({ id: 'guide' });

/**
 * Guide state type definition
 */
export interface GuideState {
  hasMet?: boolean;
}

