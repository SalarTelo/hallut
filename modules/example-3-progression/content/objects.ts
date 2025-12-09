/**
 * Example 3: Progression Objects
 * 
 * Demonstrates locked objects with unlock requirements.
 */

import {
  createObject,
  showNoteViewer,
  position,
} from '@builders/index.js';
import { taskComplete } from '@builders/interactable/index.js';
import { introTask, quizTask } from './tasks.js';

/**
 * Welcome Sign
 * Always available
 */
export const welcomeSign = createObject({
  id: 'welcome-sign',
  name: 'Welcome Sign',
  position: position(20, 70),
  avatar: 'note',
  onInteract: showNoteViewer({
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
  position: position(50, 70),
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(introTask),
  onInteract: showNoteViewer({
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
  position: position(80, 70),
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(quizTask),
  onInteract: showNoteViewer({
    content: 'You unlocked this chest by completing the quiz! Great job!',
    title: 'Chest 2 Unlocked',
  }),
});

/**
 * All objects for this module
 */
export const objects = [welcomeSign, chest1, chest2];

