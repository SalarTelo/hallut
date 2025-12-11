/**
 * Progression Guide NPC
 * 
 * NPC that offers the first task in the chain.
 */

import { createNPC, position } from '@builders/index.js';
import { task1, task2 } from '../../tasks.js';
import { progressionGuideDialogueTree } from './dialogues.js';

/**
 * Progression Guide NPC definition
 * 
 * Offers both Task 1 and Task 2 in the progression chain.
 */
export const progressionGuideNPC = createNPC({
  id: 'progression-guide',
  name: 'Progression Guide',
  position: position(30, 40),
  avatar: '👤',
  tasks: [task1, task2],
  dialogueTree: progressionGuideDialogueTree,
  meta: {
    role: 'guide',
  },
});
