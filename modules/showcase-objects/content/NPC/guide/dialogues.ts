/**
 * Object Guide Dialogue Tree
 * 
 * Dialogue tree for offering the unlock task.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { unlockTask } from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m the Object Guide.',
    'I can help you unlock the locked object.',
    'I have a task that will unlock it for you.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null,
      actions: [
        offerTask(unlockTask),
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
  task: unlockTask,
  lines: [
    'Are you ready to submit your task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(unlockTask);
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
    'You completed the task successfully.',
    'The locked object is now unlocked!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Object guide dialogue tree
 */
export const objectGuideDialogueTree = createDialogueTree()
  .nodes(firstGreeting, taskReady, taskComplete)
  .configureEntry()
    .default(firstGreeting)
  .build();
