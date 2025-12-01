/**
 * Secret Module Example
 * Demonstrates various unlock requirement types
 */

import { defineModule } from '../../src/core/module/define.js';
import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
  passwordUnlock,
  // Uncomment these imports if using the commented examples below:
  // moduleComplete,
  // andRequirements,
  // orRequirements,
} from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';
import { createNPC } from '../../src/utils/builders/interactables.js';
import { pos } from '../../src/utils/builders/interactables.js';

const task = createTask({
  id: 'solve-riddle',
  name: 'Solve the Riddle',
  description: 'Answer the guardian\'s riddle to proceed.',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    const answer = text.toLowerCase().trim();
    if (answer.includes('key') || answer.includes('secret')) {
      return success('solved', 'You solved the riddle!', 100);
    }
    return { solved: false, reason: 'incorrect', details: 'That is not the correct answer.' };
  }),
  overview: {
    requirements: 'Answer the riddle correctly',
    goals: ['Solve the riddle', 'Prove your worth'],
  },
});

const guardian = createNPC({
  id: 'guardian',
  name: 'Mysterious Guardian',
  position: pos(50, 50),
  dialogues: {
    greeting: {
      id: 'guardian-greeting',
      speaker: 'Guardian',
      lines: [
        'Welcome, seeker of secrets.',
        'To proceed, you must prove yourself worthy.',
        'Answer my riddle: What opens all doors but cannot be held?',
      ],
    },
  },
});

const config = createModuleConfig({
  manifest: createManifest(
    'secret',
    'Secret Chamber',
    '1.0.0',
    'A hidden chamber protected by ancient magic and riddles'
  ),
  background: colorBackground('#2a1a3a'),
  welcome: createWelcome('Ancient Voice', [
    'You have found the Secret Chamber.',
    'Few have reached this place.',
    'Complete the trials to claim your reward.',
  ]),
  taskOrder: [task],
  // Example 1: Password unlock with hint
  unlockRequirement: passwordUnlock('ancient-key', 'It opens all doors'),
  worldmap: {
    position: { x: 90, y: 50 }, // Far right - password locked
    icon: {
      shape: 'diamond',
      size: 48,
    },
  },
  
  // Example 2: Module dependency (uncomment to use instead)
  // unlockRequirement: moduleComplete('village'),
  
  // Example 3: Combined requirements - password AND module completion
  // unlockRequirement: andRequirements(
  //   moduleComplete('village'),
  //   passwordUnlock('ancient-key', 'It opens all doors')
  // ),
  
  // Example 4: Alternative requirements - either module OR password
  // unlockRequirement: orRequirements(
  //   moduleComplete('village'),
  //   passwordUnlock('ancient-key', 'It opens all doors')
  // ),
});

export default defineModule({
  id: 'secret',
  config,
  content: {
    interactables: [guardian],
    tasks: [task],
  },
});

