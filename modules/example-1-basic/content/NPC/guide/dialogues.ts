/**
 * Guide NPC Dialogue Tree
 * 
 * A complete dialogue tree demonstrating:
 * - Initial greeting with task offer
 * - Task-ready node for submission
 * - Task-complete node for completion
 * - General greeting for returning players
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { guideState } from './state.js';
import { greetingTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 * 
 * Shown when the player first interacts with the guide.
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello!',
    'Welcome to the Basic Example module.',
    'I\'m your guide.',
    'I\'m here to help you get started.',
    'I have a simple task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null, // Close dialogue after offering task
      actions: [
        callFunction((ctx) => {
          guideState(ctx).hasMet = true;
        }),
        offerTask(greetingTask), // Show task offer modal instead of directly accepting
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
 * 
 * Shown when the player has met the guide before.
 */
const generalGreeting = createDialogueNode({
  lines: [
    'Hello again!',
    'What can I help you with?',
  ],
  choices: {
    check_task: {
      text: 'How is my task?',
      next: null, // Task status shown automatically
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
 * 
 * This is shown when the player has the task and is ready to submit.
 * The dialogue tree builder handles task-specific dialogue entry automatically.
 */
const taskReady = createDialogueNode({
  task: greetingTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your greeting?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(greetingTask);
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
    'You completed the greeting task successfully.',
    'Great job getting started!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null, // Close dialogue
    },
  },
});

/**
 * Guide dialogue tree
 * 
 * Uses conditional entry based on state:
 * - If player has met guide before → generalGreeting
 * - Otherwise → firstGreeting
 * 
 * Task-specific nodes (taskReady, taskComplete) are automatically shown
 * based on task state by the dialogue system.
 */
export const guideDialogueTree = createDialogueTree()
  .nodes(firstGreeting, generalGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => guideState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();

