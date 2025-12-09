/**
 * Example 3A: Guide NPC
 * 
 * Simple NPC explaining this module was unlocked via task completion.
 */

import { createNPC, pos } from '@builders/index.js';
import { welcomeTask, reflectionTask } from '../../tasks.js';
import { guideDialogueTree } from './dialogues.js';

/**
 * Guide NPC definition
 */
export const guideNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: pos(50, 50),
  avatar: '👤',
  tasks: [welcomeTask, reflectionTask],
  dialogueTree: guideDialogueTree,
});

