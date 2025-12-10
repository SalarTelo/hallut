/**
 * Module Creator Showcase - Hub Module
 * 
 * This is the main hub module that serves as the entry point to all showcase submodules.
 * It demonstrates basic module configuration and serves as a navigation center.
 * 
 * Complete the exploration task to unlock all showcase submodules.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'module-creator-showcase',
  config,
  content: {
    interactables,
    tasks,
  },
});
