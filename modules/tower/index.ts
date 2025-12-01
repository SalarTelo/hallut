/**
 * Tower Module
 * An ancient tower to climb
 */

import { defineModule } from '../../src/core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome, moduleComplete } from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';

const task = createTask({
  id: 'climb-tower',
  name: 'Climb the Tower',
  description: 'Describe your journey up the tower.',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    return success('climbed', 'You reached the top!', 100);
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Climb the tower', 'Reach the top'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('tower', 'Ancient Tower', '1.0.0', 'A mysterious tower reaching into the clouds'),
  background: colorBackground('#2a2a3a'),
  welcome: createWelcome('Wizard', [
    'Welcome to the Ancient Tower!',
    'Many have tried to reach the top...',
  ]),
    taskOrder: [task],
    unlockRequirement: moduleComplete('forest'), // Requires forest to be completed
    worldmap: {
      position: { x: 55, y: 80 }, // From forest, bottom area
      icon: {
        shape: 'square',
        size: 48,
      },
    },
});

export default defineModule({
  id: 'tower',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

