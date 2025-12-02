/**
 * NPC Aggregation
 * 
 * This file imports and exports all NPCs from their individual folders.
 * Each NPC should have its own folder in content/NPC/{npc-name}/
 * 
 * To add a new NPC:
 * 1. Create the NPC folder: content/NPC/{npc-name}/
 * 2. Create the NPC files (index.ts, dialogues.ts, state.ts)
 * 3. Import and add to this array below
 */

import { guardNPC } from './NPC/guard/index.js';
// import { guardNPC } from './NPC/guard/index.js';

/**
 * All NPCs for this module
 */
export const NPCs = [guardNPC];

export const _NPCsArray: Array<import('@core/types/interactable.js').NPC> = [];

/**
 * Combined interactables (NPCs + objects)
 * This is exported and used by the module
 */
export const interactables = [...NPCs];
