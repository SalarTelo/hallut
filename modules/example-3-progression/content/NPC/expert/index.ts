/**
 * Expert NPC
 * 
 * Locked until Task 1 is completed.
 * Demonstrates locked NPCs with unlock requirements.
 */

import { createNPC, pos } from '@utils/builders/index.js';
import { taskComplete } from '@utils/builders/interactables.js';
import { quizTask, reflectionTask, module3UnlockTask } from '../../tasks.js';
import { introTask } from '../../tasks.js';
import { expertDialogueTree } from './dialogues.js';

export const expertNPC = createNPC({
  id: 'expert',
  name: 'Expert',
  position: pos(70, 40),
  avatar: '🧙',
  tasks: [quizTask, reflectionTask, module3UnlockTask],
  locked: true,
  unlockRequirement: taskComplete(introTask), // Locked until introTask is done
  dialogueTree: expertDialogueTree,
});

