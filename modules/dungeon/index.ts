/**
 * Dungeon Module
 * A dangerous dungeon to conquer
 */

import { defineModule } from '../../src/core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';

const task = createTask({
  id: 'defeat-boss',
  name: 'Defeat the Boss',
  description: 'Describe how you defeat the dungeon boss.',
  submission: textSubmission(),
  validate: textLengthValidator(25, (text) => {
    return success('defeated', 'You defeated the boss!', 100);
  }),
  overview: {
    requirements: 'Write at least 25 characters',
    goals: ['Defeat the boss', 'Clear the dungeon'],
  },
});

const config = createModuleConfig({
  manifest: createManifest('dungeon', 'Dark Dungeon', '1.0.0', 'A treacherous dungeon filled with monsters'),
  background: colorBackground('#1a1a1a'),
  welcome: createWelcome('Adventurer', [
    'You enter the dark dungeon...',
    'Be prepared for danger!',
  ]),
  taskOrder: [task],
  requires: ['village'], // Requires village to be completed - creates connection in worldmap
});

export default defineModule({
  id: 'dungeon',
  config,
  content: {
    interactables: [],
    tasks: [task],
  },
});

