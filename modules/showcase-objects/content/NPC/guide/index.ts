/**
 * Object Guide NPC
 * 
 * NPC that explains object types.
 */

import { createNPC, position } from '@builders/index.js';
import { unlockTask } from '../../tasks.js';
import { objectGuideDialogueTree } from './dialogues.js';

/**
 * Object Guide NPC definition
 */
export const objectGuideNPC = createNPC({
  id: 'object-guide',
  name: 'Object Guide',
  position: position(30, 40),
  avatar: '👤',
  tasks: [unlockTask],
  dialogueTree: objectGuideDialogueTree,
  meta: {
    role: 'guide',
  },
});
