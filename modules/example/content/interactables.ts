/**
 * Example Module Interactables
 */

import {
  createNPC,
  createObject,
  pos,
  choice,
  createDialogue,
  showNoteViewer,
} from '@utils/builders/index.js';
import { greetingTask } from './tasks.js';

/**
 * Example NPC: Guard
 */
export const guardNPC = createNPC({
  id: 'guard',
  name: 'Guard',
  position: pos(20, 30),
  avatar: '🛡️',
  dialogues: {
    greeting: createDialogue({
      id: 'guard-greeting',
      speaker: 'Guard',
      lines: [
        'Hello there!',
        'Welcome to the example module.',
        'I have a task for you if you\'re interested.',
      ],
      choices: [
        choice('Accept task')
          .acceptTask(greetingTask)
          .build(),
        choice('Maybe later')
          .build(),
      ],
    }),
  },
});

/**
 * Example Object: Sign
 */
export const signObject = createObject({
  id: 'sign',
  name: 'Sign',
  position: pos(60, 50),
  avatar: '📜',
  interaction: showNoteViewer({
    content: 'This is an example sign. You can read it!',
    title: 'Welcome Sign',
  }),
});

/**
 * All interactables
 */
export const interactables = [guardNPC, signObject];

