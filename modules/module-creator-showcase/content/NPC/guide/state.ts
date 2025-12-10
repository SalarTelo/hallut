/**
 * Guide NPC State
 * 
 * State management for the showcase guide NPC.
 */

import { createStateRef } from '@builders/index.js';

/**
 * Guide state reference
 * 
 * Tracks whether the player has met the guide before.
 */
export const guideState = createStateRef({ id: 'showcase-guide' });
