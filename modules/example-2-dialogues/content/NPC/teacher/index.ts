/**
 * Teacher NPC
 * 
 * An NPC with a dialogue tree that demonstrates state management.
 */

import { createNPC, pos } from '@utils/builders/index.js';
import { reflectionTask } from '../../tasks.js';
import { teacherDialogueTree } from './dialogues.js';

/**
 * Teacher NPC definition
 * 
 * This NPC:
 * - Has a dialogue tree (not just tasks)
 * - Remembers if player has met them (state)
 * - Changes dialogue based on state
 */
export const teacherNPC = createNPC({
  id: 'teacher',
  name: 'Teacher',
  position: pos(50, 50),
  avatar: '👨‍🏫',
  tasks: [reflectionTask],
  dialogueTree: teacherDialogueTree,
});

