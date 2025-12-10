/**
 * Example 3A: Guide NPC
 * 
 * Simple NPC explaining this module was unlocked via task completion.
 */

import { createNPC, position } from '@builders/index.js';
import { welcomeTask, reflectionTask } from '../../tasks.js';
import { guideDialogueTree } from './dialogues.js';

/**
 * Guide NPC definition
 */
export const guideNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: position(50, 50),
  avatar: '👤',
  tasks: [welcomeTask, reflectionTask],
  dialogueTree: guideDialogueTree,
  meta: {
    role: 'guide',
  },
});

