/**
 * Task Sequence
 * Defines the order of tasks across all interactables
 */

import { createTaskSequence } from '../../src/utils/taskSequenceBuilder.js';
import { guard1, guard1Tasks } from './guard1.js';

/**
 * Task sequence for the module
 * Defines which tasks come in what order and which interactable offers them
 */
export const taskSequence = createTaskSequence([
  {
    task: guard1Tasks[0], // storyTask
    offeredBy: guard1,
    after: [], // No prerequisites
  },
  {
    task: guard1Tasks[1], // recipeTask
    offeredBy: guard1,
    after: [guard1Tasks[0]], // Must complete story task first
  },
]);

