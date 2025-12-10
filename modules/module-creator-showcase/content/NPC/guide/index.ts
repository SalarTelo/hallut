/**
 * Showcase Guide NPC
 * 
 * The main guide NPC for the hub module that explains the showcase system.
 */

import { createNPC, position } from '@builders/index.js';
import { explorationTask } from '../../tasks.js';
import { guideDialogueTree } from './dialogues.js';

/**
 * Guide NPC definition
 */
export const guideNPC = createNPC({
  id: 'showcase-guide',
  name: 'Showcase Guide',
  position: position(30, 40),
  avatar: '👤',
  tasks: [explorationTask],
  dialogueTree: guideDialogueTree,
  meta: {
    role: 'guide',
  },
});
