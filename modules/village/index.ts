/**
 * Village Module
 * A peaceful village to visit
 */

import { defineModule } from '../../src/core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';

const task = createTask({
  id: 'help-villagers',
  name: 'Help the Villagers',
  description: 'Help the villagers with their tasks.',
  submission: textSubmission(),
  validate: textLengthValidator(15, (text) => {
    return success('helped', 'You helped the villagers!', 100);
  }),
  overview: {
    requirements: 'Write at least 15 characters',
    goals: ['Help the villagers', 'Complete their requests'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('village', 'Peaceful Village', '1.0.0', 'A cozy village where villagers need your help'),
  background: colorBackground('#3a2a1a'),
  welcome: createWelcome('Mayor', [
    'Welcome to our village!',
    'We could use your help.',
  ]),
  taskOrder: [task],
  // No requires = accessible from start (will be auto-positioned)
});

export default defineModule({
  id: 'village',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

