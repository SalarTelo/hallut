/**
 * Guide NPC State
 * State management for the guide NPC
 */

import { stateRef } from '@builders/dialogues.js';

/**
 * Guide state reference
 */
export const guideState = stateRef({ id: 'guide' });

/**
 * Guide state type definition
 */
export interface GuideState {
  hasMet?: boolean;
}

