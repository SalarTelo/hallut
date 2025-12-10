/**
 * Progression Guide NPC
 * 
 * NPC that offers the first task in the chain.
 */

import { createNPC, position } from '@builders/index.js';
import { task1 } from '../../tasks.js';
import { progressionGuideDialogueTree } from './dialogues.js';

/**
 * Progression Guide NPC definition
 */
export const progressionGuideNPC = createNPC({
  id: 'progression-guide',
  name: 'Progression Guide',
  position: position(30, 40),
  avatar: '👤',
  tasks: [task1],
  dialogueTree: progressionGuideDialogueTree,
  meta: {
    role: 'guide',
  },
});
