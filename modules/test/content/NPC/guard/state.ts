/**
 * Guard NPC State
 * State management and type definitions for guard
 * 
 * This file manages NPC-specific state that persists across interactions.
 * Use stateRef() to create a reference that can be accessed in dialogues.
 */

import { stateRef } from '@utils/builders/dialogues.js';

/**
 * Guard state reference
 * 
 * Use this to access and modify guard-specific state in dialogues and handlers.
 * Example: guardState(context).hasMet = true;
 */
export const guardState = stateRef({ id: 'guard' });

/**
 * Guard state type definition
 * 
 * Define the shape of state specific to this NPC.
 * This is optional but helps with type safety.
 */
export interface GuardState {
  hasMet?: boolean;
  // TODO: Add other guard-specific state properties here
}
