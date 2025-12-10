/**
 * Locked NPC
 * 
 * Demonstrates NPCs that are locked until requirements are met.
 */

import { createNPC, position, taskComplete } from '@builders/index.js';
import { task1, task3 } from '../../tasks.js';
import { lockedDialogueTree } from './dialogues.js';

/**
 * Locked NPC definition
 * 
 * This NPC is locked until Task 1 is completed.
 * Demonstrates locked NPCs with unlock requirements.
 * Note: Both the locked object and this NPC unlock from the same task (task1),
 * showing that multiple interactables can unlock from a single task completion.
 */
export const lockedNPC = createNPC({
  id: 'locked-npc',
  name: 'Locked NPC',
  position: position(50, 40),
  avatar: '🔒',
  locked: true,
  unlockRequirement: taskComplete(task1),
  tasks: [task3],
  dialogueTree: lockedDialogueTree,
  meta: {
    role: 'teacher',
  },
});
