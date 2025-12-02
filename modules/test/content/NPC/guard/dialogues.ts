/**
 * Guard Dialogue Tree
 * Dialogue configuration and conversation flow for guard
 * 
 * This file contains all dialogue nodes and the dialogue tree structure.
 * Dialogues are conversations that players have with this NPC.
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@utils/builders/dialogues.js';
import { guardState } from './state.js';
import { exampleTask } from '../../tasks.js';

/**
 * Dialogue node: Initial greeting (first meeting)
 * 
 * This is shown when the player first interacts with guard.
 */
const greeting = dialogueNode({
  lines: [
    'Hello there!',
    'Welcome to the module.',
    'I have a task for you if you\'re interested.',
    'How can I help you?',
  ],
  choices: {
    accept_task: {
      text: 'I\'ll help with that',
      next: null, // Close dialogue after accepting task
      actions: [
        callFunction((ctx) => { guardState(ctx).hasMet = true; }),
        acceptTask(exampleTask),
      ],
    },
    talk: {
      text: 'Just talking',
      next: null, // Close dialogue
      actions: [
        callFunction((ctx) => { guardState(ctx).hasMet = true; }),
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

/**
 * Dialogue node: General greeting (returning player)
 * 
 * This is shown when the player has met guard before.
 */
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


/**
 * Dialogue node: Task ready for submission
 * 
 * This is shown when the player has the task and is ready to submit.
 */
const taskReady = dialogueNode({
  task: exampleTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready to submit',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(exampleTask);
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
 * Guard dialogue tree
 * 
 * Defines entry conditions and connects all dialogue nodes.
 * TODO: Add more dialogue nodes and configure entry logic.
 */
export const guardDialogueTree = dialogueTree()
  .nodes(greeting, generalGreeting, taskReady)
  .configureEntry()
    .when((ctx) => guardState(ctx).hasMet === true).use(generalGreeting)
    .default(greeting)
  .build();

// Note: The taskReady dialogue will automatically be shown when the exampleTask is active.
// The dialogue tree builder handles task-specific dialogue entry automatically.
