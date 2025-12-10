/**
 * Professor Chen State
 * State management for Professor Chen NPC
 * 
 * Tracks interaction history and learning progress.
 */

import { createStateRef } from '@builders/index.js';

/**
 * Professor Chen state reference
 * 
 * Use this to access and modify professor-specific state in dialogues.
 */
export const professorState = createStateRef({ id: 'professor-chen' });

/**
 * Professor Chen state type definition
 */
export interface ProfessorState {
  hasMet?: boolean;
  tasksCompleted?: number;
  lastTopicDiscussed?: string;
}
