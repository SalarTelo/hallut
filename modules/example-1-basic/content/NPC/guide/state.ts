/**
 * Guide NPC State
 * State management for the guide NPC
 * 
 * This demonstrates how NPCs can "remember" things about the player.
 */

import { createStateRef } from '@builders/index.js';

/**
 * Guide state reference
 * 
 * Use this to access and modify guide-specific state in dialogues.
 * Example: guideState(context).hasMet = true;
 */
export const guideState = createStateRef({ id: 'guide' });

/**
 * Guide state type definition
 */
export interface GuideState {
  hasMet?: boolean;
}

