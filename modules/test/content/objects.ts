/**
 * Module Objects
 * 
 * Define all simple interactable objects (non-NPCs) here.
 * Objects are items that players can interact with (signs, chests, etc.)
 * 
 * TODO: Add your objects below using createObject() or helper functions
 */

import {
  createObject,
  showNoteViewer,
  pos,
} from '@utils/builders/index.js';

/**
 * bomb
 */
export const tempObject = createObject({
  id: 'temp',
  name: 'bomb',
  position: pos(50, 50),
  avatar: 'note',
  interaction: showNoteViewer({
    content: 'Fuck you dude',
    title: 'read content.',
  }),
});


export const objects = [mepmObject];