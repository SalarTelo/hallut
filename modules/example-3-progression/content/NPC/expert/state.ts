/**
 * Expert NPC State
 * State management for the expert NPC
 */

import { createStateRef } from '@builders/index.js';

/**
 * Expert state reference
 */
export const expertState = createStateRef({ id: 'expert' });

/**
 * Expert state type definition
 */
export interface ExpertState {
  hasMet?: boolean;
}

