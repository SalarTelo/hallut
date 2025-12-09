/**
 * Teacher NPC Dialogue Tree
 * 
 * Complete dialogue tree for the teacher NPC.
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@builders/dialogue/index.js';
import { teacherState } from './state.js';
import { introTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 */
const firstGreeting = dialogueNode({
  lines: [
    'Hello!',
    'Welcome to the Progression Example.',
    'I\'m your teacher.',
    'I\'m here to help you learn about progression.',
    'Let\'s start with a simple introduction task.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
        }),
        acceptTask(introTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
        }),
      ],
    },
  },
});

/**
 * Dialogue node: General greeting
 */
const generalGreeting = dialogueNode({
  lines: [
    'Hello again!',
    'What can I help you with?',
  ],
  choices: {
    check_task: {
      text: 'How is my task?',
      next: null,
    },
    talk: {
      text: 'Just talking',
      next: null,
    },
    later: {
      text: 'Never mind',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task ready for submission
 */
const taskReady = dialogueNode({
  task: introTask,
  lines: [
    'Are you ready to submit your introduction?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(introTask);
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
const taskComplete = dialogueNode({
  lines: [
    'Excellent work!',
    'You completed the introduction task successfully.',
    'Now you can talk to the Expert NPC.',
    'They have more tasks for you!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Teacher dialogue tree
 */
export const teacherDialogueTree = dialogueTree()
  .nodes(firstGreeting, generalGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => teacherState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();

