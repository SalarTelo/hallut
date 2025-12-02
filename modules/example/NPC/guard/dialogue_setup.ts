/**
 * Guard Dialogue Setup
 * Dialogue tree configuration with connections and behavior
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
  stateRef,
} from '@utils/builders/dialogues.js';
import { greetingTask } from '../../content/tasks.js';

// Create state reference for guard NPC (using ID to avoid circular dependency)
const guardState = stateRef({ id: 'guard' });

// Define dialogue nodes with consolidated definitions (all behavior in one place)
// Note: taskComplete must be defined before taskReady since taskReady references it
const taskComplete = dialogueNode({
  lines: [
    'Excellent work!',
    'You have completed the task.',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null, // Close dialogue
    },
  },
});

const greeting = dialogueNode({
  lines: [
    'Hello there!',
    'Welcome to the example module.',
    'I have a task for you if you\'re interested.',
  ],
  choices: {
    accept_task: {
      text: 'Accept task',
      next: null, // Close dialogue after accepting task
      actions: [
        callFunction((ctx) => { guardState(ctx).hasMet = true; }),
        acceptTask(greetingTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null, // Close dialogue
      actions: [
        callFunction((ctx) => { guardState(ctx).hasMet = true; }),
      ],
    },
  },
});

const generalGreeting = dialogueNode({
  lines: [
    'Hello!',
    'What can I do for you?',
  ],
  choices: {
    talk: {
      text: 'Just talking',
      next: null, // Close dialogue
    },
    later: {
      text: 'Never mind',
      next: null, // Close dialogue
    },
  },
});

const taskReady = dialogueNode({
  task: greetingTask, // For root dialogue navigation
  lines: [
    'Are you ready to submit your task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready to submit',
      next: taskComplete,
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

// Build dialogue tree with new API
export const guardDialogueTree = dialogueTree()
  .nodes(greeting, generalGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => guardState(ctx).hasMet === true).use(generalGreeting)
    .default(greeting)
  .build();

