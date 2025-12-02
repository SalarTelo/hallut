/**
 * Cave Module
 * A dark cave to explore
 */

import { defineModule } from '@core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome, andRequirements, moduleComplete } from '@utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '@utils/builders/tasks.js';

const task = createTask({
  id: 'explore-cave',
  name: 'Explore the Cave',
  description: 'Describe what you find in the cave.',
  submission: textSubmission(),
  validate: textLengthValidator(22, (text) => {
    return success('explored', 'You explored the cave!', 100);
  }),
  overview: {
    requirements: 'Write at least 22 characters',
    goals: ['Explore the cave', 'Find hidden treasures'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('cave', 'Dark Cave', '1.0.0', 'A mysterious cave with hidden secrets'),
  background: colorBackground('#1a1a2a'),
  welcome: createWelcome('Explorer', [
    'You enter the dark cave...',
    'Who knows what lies within?',
  ]),
    taskOrder: [task],
    unlockRequirement: andRequirements(
      moduleComplete('dungeon'),
      moduleComplete('tower')
    ), // Requires both dungeon and tower
    worldmap: {
      position: { x: 75, y: 50 }, // Center - requires both dungeon and tower
      icon: {
        shape: 'diamond',
        size: 52,
      },
    },
});

export default defineModule({
  id: 'cave',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

