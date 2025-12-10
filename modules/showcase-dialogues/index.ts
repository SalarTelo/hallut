/**
 * Showcase: Dialogues
 * 
 * Demonstrates dialogue trees, branching, and state-based conversations.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'showcase-dialogues',
  config,
  content: {
    interactables,
    tasks,
  },
});
