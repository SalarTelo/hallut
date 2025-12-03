/**
 * Example 3: Progression Module
 * 
 * This module demonstrates:
 * - Task chains (task 1 → unlocks task 2 → unlocks task 3)
 * - Locked NPCs and objects
 * - Unlock requirements
 * - Progression between content
 * 
 * Study this alongside the progression.md documentation.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'example-3-progression',
  config,
  content: {
    interactables,
    tasks,
  },
});

