/**
 * Example 2: Dialogues Objects
 * 
 * Simple information object explaining dialogues.
 */

import {
  createObject,
  showNoteViewer,
  pos,
} from '@utils/builders/index.js';

/**
 * Dialogue Info Note
 * 
 * Information about how dialogues work.
 */
export const dialogueInfo = createObject({
  id: 'dialogue-info',
  name: 'Dialogue Info',
  position: pos(70, 30),
  avatar: 'note',
  interaction: showNoteViewer({
    content: 'This module demonstrates dialogue trees. Talk to the teacher multiple times - notice how the dialogue changes after the first meeting! The NPC "remembers" you using state.',
    title: 'About Dialogues',
  }),
});

/**
 * All objects for this module
 */
export const objects = [dialogueInfo];

