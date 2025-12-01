/**
 * Marketplace Module
 * A bustling marketplace to explore
 */

import { defineModule } from '../../src/core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';

const task = createTask({
  id: 'trade-items',
  name: 'Trade Items',
  description: 'Describe your trading experience.',
  submission: textSubmission(),
  validate: textLengthValidator(18, (text) => {
    return success('traded', 'You made great trades!', 100);
  }),
  overview: {
    requirements: 'Write at least 18 characters',
    goals: ['Trade items', 'Make deals'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('marketplace', 'Bustling Marketplace', '1.0.0', 'A busy marketplace full of traders and goods'),
  background: colorBackground('#3a2a2a'),
  welcome: createWelcome('Merchant', [
    'Welcome to the Marketplace!',
    'What can I sell you today?',
  ]),
    taskOrder: [task],
    worldmap: {
      position: { x: 35, y: 50 }, // Middle branch
      icon: {
        shape: 'circle',
        size: 48,
      },
    },
});

export default defineModule({
  id: 'marketplace',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

