/**
 * Example 3: Progression Objects
 * 
 * Demonstrates locked objects with unlock requirements.
 */

import {
  createObject,
  showNoteViewer,
  pos,
} from '@utils/builders/index.js';
import { taskComplete } from '@utils/builders/interactables.js';
import { introTask, quizTask } from './tasks.js';

/**
 * Welcome Sign
 * Always available
 */
export const welcomeSign = createObject({
  id: 'welcome-sign',
  name: 'Welcome Sign',
  position: pos(20, 70),
  avatar: 'note',
  interaction: showNoteViewer({
    content: 'Welcome! Complete tasks to unlock new content. Start with the Teacher NPC.',
    title: 'Welcome',
  }),
});

/**
 * Locked Chest 1
 * Unlocks after Task 1 (introTask)
 */
export const chest1 = createObject({
  id: 'chest-1',
  name: 'Locked Chest',
  position: pos(50, 70),
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(introTask),
  interaction: showNoteViewer({
    content: 'You unlocked this chest by completing the introduction task!',
    title: 'Chest 1 Unlocked',
  }),
});

/**
 * Locked Chest 2
 * Unlocks after Task 2 (quizTask)
 */
export const chest2 = createObject({
  id: 'chest-2',
  name: 'Locked Chest',
  position: pos(80, 70),
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(quizTask),
  interaction: showNoteViewer({
    content: 'You unlocked this chest by completing the quiz! Great job!',
    title: 'Chest 2 Unlocked',
  }),
});

/**
 * All objects for this module
 */
export const objects = [welcomeSign, chest1, chest2];

