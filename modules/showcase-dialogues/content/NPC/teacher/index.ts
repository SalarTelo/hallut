/**
 * Teacher NPC
 * 
 * Demonstrates comprehensive dialogue features:
 * - Dialogue trees
 * - Branching dialogues
 * - State-based dialogues
 * - Conditional entry
 */

import { createNPC, position } from '@builders/index.js';
import { dialogueTask } from '../../tasks.js';
import { teacherDialogueTree } from './dialogues.js';

/**
 * Teacher NPC definition
 */
export const teacherNPC = createNPC({
  id: 'dialogue-teacher',
  name: 'Dialogue Teacher',
  position: position(30, 40),
  avatar: '👨‍🏫',
  tasks: [dialogueTask],
  dialogueTree: teacherDialogueTree,
  meta: {
    role: 'teacher',
  },
});
