/**
 * NPC Builder
 * Functions for creating NPCs
 */

import type {
  NPC,
  Position,
  NPCMeta,
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
  personality?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  tasks?: Task[]; // Changed from Record<string, Task>
  dialogueTree?: DialogueTree; // New - replaces dialogues
  meta?: NPCMeta;
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
    personality,
    locked = false,
    unlockRequirement = null,
    tasks,
    dialogueTree,
    meta,
  } = options;

  const npc: NPC = {
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

  if (personality) {
    npc.personality = personality;
  }

  if (meta) {
    npc.meta = meta;
  }

  return npc;
}

