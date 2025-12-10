/**
 * Basic NPC Dialogue Tree
 * 
 * Simple dialogue tree for offering the basic task.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { basicTask } from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m a basic NPC.',
    'I have a simple task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null,
      actions: [
        offerTask(basicTask),
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
  task: basicTask,
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
            context.openTaskSubmission(basicTask);
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
    'You completed the basic task successfully.',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Basic dialogue tree
 */
export const basicDialogueTree = createDialogueTree()
  .nodes(firstGreeting, taskReady, taskComplete)
  .configureEntry()
    .default(firstGreeting)
  .build();
