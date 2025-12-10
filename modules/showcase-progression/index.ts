/**
 * Showcase: Progression
 * 
 * Demonstrates unlock requirements, task chains, and progression systems.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'showcase-progression',
  config,
  content: {
    interactables,
    tasks,
  },
});
