/**
 * Forest Module
 * A mysterious forest to explore
 */

import { defineModule } from '@core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '@utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success, failure } from '@utils/builders/tasks.js';

const task = createTask({
  id: 'explore-forest',
  name: 'Explore the Forest',
  description: 'Describe what you find in the forest.',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    return success('explored', 'You explored the forest!', 100);
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Explore the forest', 'Describe your findings'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('forest', 'Mysterious Forest', '1.0.0', 'A dark and mysterious forest full of secrets'),
  background: colorBackground('#1a3a1a'),
  welcome: createWelcome('Guide', [
    'Welcome to the Mysterious Forest!',
    'Be careful as you explore...',
  ]),
    taskOrder: [task],
    worldmap: {
      position: { x: 35, y: 70 }, // Bottom left branch
      icon: {
        shape: 'circle',
        size: 48,
      },
    },
});

export default defineModule({
  id: 'forest',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

