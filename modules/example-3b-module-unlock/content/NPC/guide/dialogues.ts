/**
 * Guide NPC Dialogue Tree
 * 
 * Complete dialogue tree explaining this module was unlocked via module completion.
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@builders/dialogues.js';
import { guideState } from './state.js';
import { welcomeTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 */
const firstGreeting = dialogueNode({
  lines: [
    'Hello!',
    'Welcome to the Module Unlock Example!',
    'This module was unlocked by completing the Progression Example.',
    'This demonstrates how modules can be unlocked.',
    'They unlock through module completion.',
    'I have a simple task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null,
      actions: [
        callFunction((ctx) => {
          guideState(ctx).hasMet = true;
        }),
        acceptTask(welcomeTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
      actions: [
        callFunction((ctx) => {
          guideState(ctx).hasMet = true;
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
  task: welcomeTask,
  lines: [
    'Are you ready to submit your message?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(welcomeTask);
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
    'You completed the task in an unlocked module!',
    'This shows how modules can be unlocked through module completion.',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Guide dialogue tree
 */
export const guideDialogueTree = dialogueTree()
  .nodes(firstGreeting, generalGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => guideState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();

