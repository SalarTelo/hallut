/**
 * Example 3A: Task Unlock Module Objects
 * 
 * Simple object demonstrating this is an unlockable module.
 */

import {
  createObject,
  showNoteViewer,
  position,
} from '@builders/index.js';

/**
 * Information sign
 */
export const infoSign = createObject({
  id: 'info-sign',
  name: 'Information Sign',
  position: position(20, 80),
  avatar: 'note',
  onInteract: showNoteViewer({
    content: 'This module was unlocked by completing the "Unlock New Module" task in the Progression Example. This demonstrates how modules can be unlocked through task completion!',
    title: 'Task Unlock Example',
  }),
});

/**
 * All objects for this module
 */
export const objects = [infoSign];

