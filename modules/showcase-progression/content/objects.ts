/**
 * Showcase: Progression - Objects
 * 
 * Demonstrates locked objects with unlock requirements.
 */

import {
  createObject,
  showSignViewer,
  position,
  taskComplete,
} from '@builders/index.js';
import { task1 } from './tasks.js';

/**
 * Locked Object
 * 
 * Demonstrates:
 * - Locked objects
 * - Unlock via task completion
 */
export const lockedObject = createObject({
  id: 'locked-object',
  name: 'Locked Object',
  position: position(70, 40),
  avatar: 'note',
  locked: true,
  unlockRequirement: taskComplete(task1),
  onInteract: showSignViewer({
    title: 'Locked Object (Now Unlocked!)',
    content: 'This object was locked until you completed Task 1. Locked objects can be unlocked by completing tasks, modules, or other requirements.',
  }),
});

/**
 * All objects for this module
 */
export const objects = [lockedObject];
