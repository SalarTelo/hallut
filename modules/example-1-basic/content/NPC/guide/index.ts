/**
 * Example 1: Guide NPC
 * 
 * A simple NPC with a complete dialogue tree that offers a task.
 * This demonstrates the minimal NPC setup with proper dialogue structure.
 */

import { createNPC, position } from '@builders/index.js';
import { greetingTask } from '../../tasks.js';
import { guideDialogueTree } from './dialogues.js';

/**
 * Guide NPC definition
 * 
 * This NPC:
 * - Has a complete dialogue tree (required to offer tasks)
 * - Offers a task through dialogue
 * - Remembers if player has met them (state management)
 * - Shows different dialogues based on task state
 */
export const guideNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: position(30, 40),
  avatar: '👤',
  tasks: [greetingTask],
  dialogueTree: guideDialogueTree,
});

