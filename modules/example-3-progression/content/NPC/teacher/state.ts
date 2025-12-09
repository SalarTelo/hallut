/**
 * Teacher NPC State
 * State management for the teacher NPC
 */

import { stateRef } from '@builders/dialogue/index.js';

/**
 * Teacher state reference
 */
export const teacherState = stateRef({ id: 'teacher' });

/**
 * Teacher state type definition
 */
export interface TeacherState {
  hasMet?: boolean;
}

