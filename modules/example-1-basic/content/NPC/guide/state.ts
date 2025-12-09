/**
 * Guide NPC State
 * State management for the guide NPC
 * 
 * This demonstrates how NPCs can "remember" things about the player.
 */

import { stateRef } from '@builders/dialogue/index.js';

/**
 * Guide state reference
 * 
 * Use this to access and modify guide-specific state in dialogues.
 * Example: guideState(context).hasMet = true;
 */
export const guideState = stateRef({ id: 'guide' });

/**
 * Guide state type definition
 */
export interface GuideState {
  hasMet?: boolean;
}

