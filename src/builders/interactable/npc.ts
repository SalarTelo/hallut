/**
 * NPC Builder
 * Functions for creating NPCs
 */

import type {
  NPC,
  Position,
} from '@core/module/types/index.js';
import type { DialogueTree } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';
import type { UnlockRequirement } from '@core/unlock/types.js';

/**
 * NPC creation options
 */
export interface NPCOptions {
  id: string;
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  tasks?: Task[]; // Changed from Record<string, Task>
  dialogueTree?: DialogueTree; // New - replaces dialogues
}

/**
 * Create an NPC
 */
export function createNPC(options: NPCOptions): NPC {
  const {
    id,
    name,
    position,
    avatar,
    locked = false,
    unlockRequirement = null,
    tasks,
    dialogueTree,
  } = options;

  return {
    id,
    type: 'npc',
    name,
    position,
    avatar,
    locked,
    unlockRequirement,
    tasks,
    dialogueTree,
  };
}

