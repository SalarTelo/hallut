/**
 * Example 3A: Task Unlock Module
 * 
 * This module demonstrates module unlock via task completion.
 * It is unlocked by completing module3UnlockTask in example-3-progression.
 * 
 * Study this alongside the module-3-progression.md documentation.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'example-3a-task-unlock',
  config,
  content: {
    interactables,
    tasks,
  },
});

