/**
 * Module Content
 * Central export for all content (tasks, NPCs, objects)
 * 
 * This file aggregates all content from the module and exports it.
 */

export * from './tasks.js';
export * from './NPCs.js';
export * from './objects.js';

// Combine NPCs and objects into interactables
import { NPCs } from './NPCs.js';
import { objects } from './objects.js';
export const interactables = [...NPCs, ...objects];
