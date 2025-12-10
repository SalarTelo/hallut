/**
 * Showcase: Basics
 * 
 * Demonstrates the fundamental building blocks of module creation.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'showcase-basics',
  config,
  content: {
    interactables,
    tasks,
  },
});
