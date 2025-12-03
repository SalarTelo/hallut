/**
 * Content Aggregation
 * 
 * This file combines all NPCs and objects into the interactables array.
 */

import { NPCs } from './NPCs.js';
import { objects } from './objects.js';
import { tasks } from './tasks.js';

/**
 * All interactables (NPCs + objects) for this module
 */
export const interactables = [...NPCs, ...objects];

/**
 * All tasks for this module
 */
export { tasks };

