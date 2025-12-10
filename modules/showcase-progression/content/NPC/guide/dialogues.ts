/**
 * Progression Guide Dialogue Tree
 * 
 * Dialogue tree for offering the first task in the chain.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { task1 } from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m the Progression Guide.',
    'I have the first task in a progression chain.',
    '',
    'Complete Task 1 to unlock Task 2,',
    'and complete Task 2 to unlock Task 3.',
    '',
    'Would you like to start?',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like to start',
      next: null,
      actions: [
        offerTask(task1),
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
  task: task1,
  lines: [
    'Are you ready to submit Task 1?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(task1);
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
    'You completed Task 1 successfully.',
    'Task 2 is now unlocked!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Progression guide dialogue tree
 */
export const progressionGuideDialogueTree = createDialogueTree()
  .nodes(firstGreeting, taskReady, taskComplete)
  .configureEntry()
    .default(firstGreeting)
  .build();
