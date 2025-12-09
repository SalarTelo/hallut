/**
 * Expert NPC
 * 
 * Locked until Task 1 is completed.
 * Demonstrates locked NPCs with unlock requirements.
 */

import { createNPC, position } from '@builders/index.js';
import { taskComplete } from '@builders/interactable/index.js';
import { quizTask, reflectionTask, module3UnlockTask } from '../../tasks.js';
import { introTask } from '../../tasks.js';
import { expertDialogueTree } from './dialogues.js';

export const expertNPC = createNPC({
  id: 'expert',
  name: 'Expert',
  position: position(70, 40),
  avatar: '🧙',
  tasks: [quizTask, reflectionTask, module3UnlockTask],
  locked: true,
  unlockRequirement: taskComplete(introTask), // Locked until introTask is done
  dialogueTree: expertDialogueTree,
});

