/**
 * Expert NPC State
 * State management for the expert NPC
 */

import { stateRef } from '@builders/dialogues.js';

/**
 * Expert state reference
 */
export const expertState = stateRef({ id: 'expert' });

/**
 * Expert state type definition
 */
export interface ExpertState {
  hasMet?: boolean;
}

