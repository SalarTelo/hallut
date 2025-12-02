/**
 * Example Module
 * A simple example module demonstrating the new system
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

// Create config with tasks
const config = createConfig(tasks);

// Define module
export default defineModule({
  id: 'example',
  config,
  content: {
    interactables,
    tasks,
  },
});

