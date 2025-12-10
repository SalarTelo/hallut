/**
 * Task Teacher NPC
 * 
 * NPC that offers all task types for demonstration.
 */

import { createNPC, position } from '@builders/index.js';
import {
  textLengthTask,
  wordCountTask,
  keywordsTask,
  multipleChoiceTask,
  customTask,
} from '../../tasks.js';
import { taskTeacherDialogueTree } from './dialogues.js';

/**
 * Task Teacher NPC definition
 */
export const taskTeacherNPC = createNPC({
  id: 'task-teacher',
  name: 'Task Teacher',
  position: position(30, 40),
  avatar: '👨‍🏫',
  tasks: [
    textLengthTask,
    wordCountTask,
    keywordsTask,
    multipleChoiceTask,
    customTask,
  ],
  dialogueTree: taskTeacherDialogueTree,
  meta: {
    role: 'teacher',
  },
});
