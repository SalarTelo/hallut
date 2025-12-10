/**
 * Teacher NPC State
 * 
 * State management for the dialogue teacher NPC.
 * Demonstrates createStateRef for tracking NPC state.
 */

import { createStateRef } from '@builders/index.js';

/**
 * Teacher state reference
 * 
 * Tracks:
 * - Whether player has met the teacher
 * - Whether player chose option A or B in branching dialogue
 */
export const teacherState = createStateRef({ id: 'dialogue-teacher' });
