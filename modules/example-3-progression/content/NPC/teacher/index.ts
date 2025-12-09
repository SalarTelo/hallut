/**
 * Teacher NPC
 * 
 * Always available - gives the first task.
 */

import { createNPC, pos } from '@builders/index.js';
import { introTask } from '../../tasks.js';
import { teacherDialogueTree } from './dialogues.js';

export const teacherNPC = createNPC({
  id: 'teacher',
  name: 'Teacher',
  position: pos(30, 40),
  avatar: '👨‍🏫',
  tasks: [introTask],
  dialogueTree: teacherDialogueTree,
});

