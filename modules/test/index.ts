/**
 * Test Module
 * Module definition - This is the entry point for the module
 * 
 * This file uses defineModule() to create the module with its configuration
 * and content (tasks, NPCs, objects).
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

// Create config with tasks
const config = createConfig();

// Define module
export default defineModule({
  id: 'test',
  config,
  content: {
    interactables,
    tasks,
  },
});
