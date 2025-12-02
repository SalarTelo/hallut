/**
 * Example Module Interactables
 */

import {
  createNPC,
  createObject,
  pos,
  showNoteViewer,
} from '@utils/builders/index.js';
import { greetingTask } from './tasks.js';
import { guardDialogueTree } from '../NPC/guard/dialogue_setup.js';

/**
 * Example NPC: Guard
 */
export const guardNPC = createNPC({
  id: 'guard',
  name: 'Guard',
  position: pos(20, 30),
  avatar: '🛡️',
  tasks: [greetingTask], // Array, not Record
  dialogueTree: guardDialogueTree,
});

/**
 * Example Object: Sign
 */
export const signObject = createObject({
  id: 'sign',
  name: 'Sign',
  position: pos(60, 50),
  avatar: 'note',
  interaction: showNoteViewer({
    content: 'This is an example sign. You can read it!',
    title: 'Welcome Sign',
  }),
});

/**
 * All interactables
 */
export const interactables = [guardNPC, signObject];

