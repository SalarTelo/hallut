/**
 * Basic NPC
 * 
 * Demonstrates a simple NPC with a basic dialogue tree.
 * This is the most basic NPC setup with dialogue.
 */

import { createNPC, position } from '@builders/index.js';
import { basicTask } from '../../tasks.js';
import { basicDialogueTree } from './dialogues.js';

/**
 * Basic NPC definition
 * 
 * Demonstrates:
 * - Basic NPC creation
 * - NPC with task and dialogue tree
 * - Simple NPC setup
 */
export const basicNPC = createNPC({
  id: 'basic-npc',
  name: 'Basic NPC',
  position: position(30, 40),
  avatar: '👤',
  tasks: [basicTask],
  dialogueTree: basicDialogueTree,
  meta: {
    role: 'teacher',
  },
});
