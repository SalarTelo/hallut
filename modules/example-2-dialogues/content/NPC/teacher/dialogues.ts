/**
 * Teacher Dialogue Tree
 * 
 * This demonstrates:
 * - Dialogue trees with multiple nodes
 * - State-based conditional entry
 * - Actions in dialogues (accepting tasks, updating state)
 */

import {
  createDialogueTree,
  createDialogueNode,
  acceptTask,
  callFunction,
} from '@builders/index.js';
import { teacherState } from './state.js';
import { reflectionTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 * 
 * Shown when the player first interacts with the teacher.
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello there!',
    'Welcome! I\'m your teacher.',
    'I have a task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the task',
      next: null, // Close dialogue after accepting
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
          teacherState(ctx).conversationCount = 1;
        }),
        acceptTask(reflectionTask),
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
 * Dialogue node: Returning player
 * 
 * Shown when the player has met the teacher before.
 * The dialogue changes based on state!
 */
const generalGreeting = createDialogueNode({
  lines: [
    'Hello again!',
    'Good to see you back.',
    'What can I help you with?',
  ],
  choices: {
    check_task: {
      text: 'How is my task?',
      next: null, // Task status shown automatically
      actions: [
        callFunction((ctx) => {
          const state = teacherState(ctx);
          const currentCount: number = (state.conversationCount as number | undefined) ?? 0;
          state.conversationCount = currentCount + 1;
        }),
      ],
    },
    talk: {
      text: 'Just talking',
      next: null,
      actions: [
        callFunction((ctx) => {
          const state = teacherState(ctx);
          const currentCount: number = (state.conversationCount as number | undefined) ?? 0;
          state.conversationCount = currentCount + 1;
        }),
      ],
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
  task: reflectionTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your reflection?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(reflectionTask);
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
    'You completed the reflection task successfully.',
    'Great job!',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null, // Close dialogue
    },
  },
});

/**
 * Teacher dialogue tree
 * 
 * Uses conditional entry based on state:
 * - If player has met teacher before → generalGreeting
 * - Otherwise → firstGreeting
 * 
 * Task-specific nodes (taskReady, taskComplete) are automatically shown
 * based on task state by the dialogue system.
 */
export const teacherDialogueTree = createDialogueTree()
  .nodes(firstGreeting, generalGreeting, taskReady, taskComplete)
  .configureEntry()
    .when((ctx) => teacherState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();

