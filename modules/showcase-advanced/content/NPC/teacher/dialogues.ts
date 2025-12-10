/**
 * Advanced Teacher Dialogue Tree
 * 
 * Demonstrates dialogue with handler integration.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { advancedTeacherState } from './state.js';
import { advancedTask } from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! Welcome to the Advanced showcase!',
    '',
    'This module demonstrates advanced features:',
    '• Password unlock requirements',
    '• Module handlers (onChoiceAction)',
    '• Custom component renderers',
    '• Complex state management',
    '',
    'I have a task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'I\'ll take the task',
      next: null,
      actions: [
        callFunction((ctx) => {
          advancedTeacherState(ctx).hasMet = true;
        }),
        offerTask(advancedTask),
      ],
    },
    learn: {
      text: 'Tell me more about handlers',
      next: null,
      actions: [
        callFunction((ctx) => {
          advancedTeacherState(ctx).hasMet = true;
          advancedTeacherState(ctx).wantsToLearn = true;
        }),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
      actions: [
        callFunction((ctx) => {
          advancedTeacherState(ctx).hasMet = true;
        }),
      ],
    },
  },
});

/**
 * Dialogue node: State-based greeting
 */
const stateBasedGreeting = createDialogueNode({
  lines: [
    'Hello again!',
    '',
    'I remember you! This demonstrates state management.',
    'The dialogue system tracks our previous interactions.',
  ],
  choices: {
    task: {
      text: 'Tell me about the task',
      next: null,
      actions: [offerTask(advancedTask)],
    },
    later: {
      text: 'Thanks, I\'ll explore',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task ready for submission
 * 
 * This is shown when the player has the task and is ready to submit.
 * The dialogue tree builder handles task-specific dialogue entry automatically.
 */
const taskReady = createDialogueNode({
  task: advancedTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your advanced task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(advancedTask);
          }
        }),
      ],
    },
    not_yet: {
      text: 'Not yet',
      next: null, // Close dialogue
    },
  },
});

/**
 * Dialogue node: Task complete
 * 
 * This is shown after the task is successfully completed.
 */
const taskComplete = createDialogueNode({
  lines: [
    'Excellent work!',
    'You completed the advanced task successfully.',
    'Great job exploring advanced features!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null, // Close dialogue
    },
  },
});

/**
 * Advanced dialogue tree
 */
export const advancedDialogueTree = createDialogueTree()
  .nodes(firstGreeting, stateBasedGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => advancedTeacherState(ctx).hasMet === true).use(stateBasedGreeting)
    .default(firstGreeting)
  .build();
