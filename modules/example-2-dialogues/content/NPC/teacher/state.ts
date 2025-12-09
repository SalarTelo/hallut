/**
 * Teacher NPC State
 * State management for the teacher NPC
 * 
 * This demonstrates how NPCs can "remember" things about the player.
 */

import { createStateRef } from '@builders/index.js';

/**
 * Teacher state reference
 * 
 * Use this to access and modify teacher-specific state in dialogues.
 * Example: teacherState(context).hasMet = true;
 */
export const teacherState = createStateRef({ id: 'teacher' });

/**
 * Teacher state type definition
 */
export interface TeacherState {
  hasMet?: boolean;
  conversationCount?: number;
}

