/**
 * Locked NPC Dialogue Tree
 * 
 * Dialogue tree for the locked NPC that offers task 3.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { task2, task3 } from '../../tasks.js';

/**
 * Dialogue node: First greeting (before Task 2 is completed)
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I was locked until you completed Task 1.',
    'Now that you\'ve unlocked me, I can offer you Task 3!',
    'However, Task 3 requires Task 2 to be completed first.',
    'Complete Task 2 with the Progression Guide to unlock Task 3.',
    'This demonstrates how NPCs can be locked and unlocked.',
  ],
  choices: {
    later: {
      text: 'I understand',
      next: null,
    },
  },
});

/**
 * Dialogue node: Greeting after Task 2 is completed
 */
const greetingAfterTask2 = createDialogueNode({
  lines: [
    'Hello! I was locked until you completed Task 1.',
    'Now that you\'ve unlocked me, I can offer you Task 3!',
    'Task 2 is complete! Task 3 is now available.',
    'This demonstrates how NPCs can be locked and unlocked.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like Task 3',
      next: null,
      actions: [
        offerTask(task3),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task ready for submission
 */
const taskReady = createDialogueNode({
  task: task3,
  lines: [
    'Are you ready to submit Task 3?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(task3);
          }
        }),
      ],
    },
    not_yet: {
      text: 'Not yet',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task complete
 */
const taskComplete = createDialogueNode({
  lines: [
    'Excellent work!',
    'You completed Task 3 successfully.',
    'You\'ve completed the entire task chain!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Locked NPC dialogue tree
 */
export const lockedDialogueTree = createDialogueTree()
  .nodes(firstGreeting, greetingAfterTask2, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => ctx.isTaskCompleted(task2)).use(greetingAfterTask2)
    .default(firstGreeting)
  .build();
