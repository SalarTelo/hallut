/**
 * Guard NPC
 * NPC definition for guard
 * 
 * This file defines the NPC using createNPC().
 * It imports dialogue and state from other files in this folder.
 */

import { createNPC, pos } from '@utils/builders/index.js';
import { exampleTask } from '../../tasks.js'; // Make sure exampleTask is exported in tasks.ts
import { guardDialogueTree } from './dialogues.js';

/**
 * Guard NPC definition
 * 
 * Position: (20, 30)
 * Avatar: shield
 */
export const guardNPC = createNPC({
  id: 'guard',
  name: 'Guard',
  position: pos(20, 30),
  avatar: 'shield',
  tasks: [exampleTask], // TODO: Update with actual tasks
  dialogueTree: guardDialogueTree,
});
