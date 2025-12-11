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
import { task1, task2 } from '../../tasks.js';

/**
 * Dialogue node: First greeting (before Task 1 is completed)
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m the Progression Guide.',
    'I have tasks in a progression chain.',
    'Complete Task 1 to unlock Task 2, and complete Task 2 to unlock Task 3.',
    'Would you like to start with Task 1?',
  ],
  choices: {
    task1: {
      text: 'Yes, I\'d like Task 1',
      next: null,
      actions: [offerTask(task1)],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: Greeting after Task 1 is completed
 */
const greetingAfterTask1 = createDialogueNode({
  lines: [
    'Hello! I\'m the Progression Guide.',
    'I have tasks in a progression chain.',
    'Task 1 is complete! Task 2 is now available.',
    'Complete Task 2 to unlock Task 3.',
    'Which task would you like?',
  ],
  choices: {
    task1: {
      text: 'Task 1: Start the Chain',
      next: null,
      actions: [offerTask(task1)],
    },
    task2: {
      text: 'Task 2: Continue the Chain',
      next: null,
      actions: [offerTask(task2)],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task 1 ready for submission
 */
const task1Ready = createDialogueNode({
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
 * Dialogue node: Task 1 complete
 */
const task1Complete = createDialogueNode({
  lines: [
    'Excellent work!',
    'You completed Task 1 successfully.',
    'Task 2, the locked object, and the locked NPC are now unlocked!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task 2 ready for submission
 */
const task2Ready = createDialogueNode({
  task: task2,
  lines: [
    'Are you ready to submit Task 2?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(task2);
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
 * Dialogue node: Task 2 complete
 */
const task2Complete = createDialogueNode({
  lines: [
    'Excellent work!',
    'You completed Task 2 successfully.',
    'Task 3 is now unlocked!',
    'You can find it with the Locked NPC.',
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
  .nodes(
    firstGreeting,
    greetingAfterTask1,
    task1Ready,
    task1Complete,
    task2Ready,
    task2Complete
  )
  .configureEntry()
    .when((ctx) => ctx.isTaskCompleted(task1)).use(greetingAfterTask1)
    .default(firstGreeting)
  .build();
