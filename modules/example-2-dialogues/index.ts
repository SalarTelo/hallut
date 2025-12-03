/**
 * Example 2: Dialogues Module
 * 
 * This module demonstrates:
 * - Dialogue trees
 * - State management (NPC remembers player)
 * - Conditional dialogue entry
 * - Actions in dialogues
 * 
 * Study this alongside the dialogues.md documentation.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'example-2-dialogues',
  config,
  content: {
    interactables,
    tasks,
  },
});

