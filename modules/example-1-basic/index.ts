/**
 * Example 1: Basic Module
 * 
 * This is the simplest possible working module.
 * It demonstrates:
 * - Basic module structure
 * - One NPC with a task
 * - One simple object
 * - No dialogues, no state, no unlock requirements
 * 
 * Study this alongside the module-guide.md documentation.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'example-1-basic',
  config,
  content: {
    interactables,
    tasks,
  },
});

