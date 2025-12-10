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
import { task3 } from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I was locked until you completed Task 1.',
    'Now that you\'ve unlocked me, I can offer you Task 3!',
    '',
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
  .nodes(firstGreeting, taskReady, taskComplete)
  .configureEntry()
    .default(firstGreeting)
  .build();
