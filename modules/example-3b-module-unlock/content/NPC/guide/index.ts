/**
 * Example 3B: Guide NPC
 * 
 * Simple NPC explaining this module was unlocked via module completion.
 */

import { createNPC, pos } from '@utils/builders/index.js';
import { welcomeTask, completionTask } from '../../tasks.js';
import { guideDialogueTree } from './dialogues.js';

/**
 * Guide NPC definition
 */
export const guideNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: pos(50, 50),
  avatar: '👤',
  tasks: [welcomeTask, completionTask],
  dialogueTree: guideDialogueTree,
});

