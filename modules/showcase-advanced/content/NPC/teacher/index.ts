/**
 * Advanced Teacher NPC
 * 
 * NPC that demonstrates advanced dialogue features with handlers.
 */

import { createNPC, position } from '@builders/index.js';
import { advancedTask } from '../../tasks.js';
import { advancedDialogueTree } from './dialogues.js';

/**
 * Advanced Teacher NPC definition
 */
export const advancedTeacherNPC = createNPC({
  id: 'advanced-teacher',
  name: 'Advanced Teacher',
  position: position(30, 40),
  avatar: '👨‍🏫',
  tasks: [advancedTask],
  dialogueTree: advancedDialogueTree,
  meta: {
    role: 'teacher',
  },
});
