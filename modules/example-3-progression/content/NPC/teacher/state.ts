/**
 * Teacher NPC State
 * State management for the teacher NPC
 */

import { createStateRef } from '@builders/index.js';

/**
 * Teacher state reference
 */
export const teacherState = createStateRef({ id: 'teacher' });

/**
 * Teacher state type definition
 */
export interface TeacherState {
  hasMet?: boolean;
}

