/**
 * Module Content
 */

export * from './tasks.js';
export * from './NPCs.js';
export * from './objects.js';

import { NPCs } from './NPCs.js';
import { objects } from './objects.js';
export const interactables = [...NPCs, ...objects];
