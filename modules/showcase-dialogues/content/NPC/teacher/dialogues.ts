/**
 * Teacher NPC Dialogue Tree
 * 
 * Comprehensive dialogue tree demonstrating:
 * - Simple linear dialogue
 * - Branching dialogue (choices)
 * - State-based dialogue (conditional entry)
 * - Offering tasks via dialogue
 * - State management
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { teacherState } from './state.js';
import { dialogueTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 * 
 * Shown when player first meets the teacher.
 * Demonstrates simple linear dialogue with task offer.
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m the Dialogue Teacher.',
    'I\'ll teach you about dialogue systems.',
    '',
    'Dialogues can be simple linear conversations,',
    'or they can branch based on player choices.',
    '',
    'I have a task for you if you\'re interested.',
  ],
  choices: {
    accept: {
      text: 'Yes, I want the task',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
        }),
        offerTask(dialogueTask),
      ],
    },
    learn: {
      text: 'Tell me more about dialogues',
      next: null, // Will link to branching dialogue
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
        }),
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
 * Dialogue node: Branching example - Option A
 * 
 * Demonstrates branching dialogue where choices lead to different nodes.
 */
const branchingOptionA = createDialogueNode({
  lines: [
    'You chose Option A!',
    '',
    'Branching dialogues allow players to make choices',
    'that lead to different conversation paths.',
    '',
    'This creates interactive, engaging conversations.',
  ],
  choices: {
    continue: {
      text: 'Tell me about state-based dialogues',
      next: null, // Would link to state dialogue
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).choseOptionA = true;
        }),
      ],
    },
    back: {
      text: 'Go back',
      next: firstGreeting,
    },
  },
});

/**
 * Dialogue node: Branching example - Option B
 */
const branchingOptionB = createDialogueNode({
  lines: [
    'You chose Option B!',
    '',
    'Different choices can lead to different outcomes',
    'and different information being shared.',
    '',
    'This makes dialogues dynamic and interesting.',
  ],
  choices: {
    continue: {
      text: 'Tell me about state-based dialogues',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).choseOptionB = true;
        }),
      ],
    },
    back: {
      text: 'Go back',
      next: firstGreeting,
    },
  },
});

/**
 * Dialogue node: Branching choice
 * 
 * Demonstrates a dialogue node with multiple choices that branch.
 */
const branchingChoice = createDialogueNode({
  lines: [
    'Let me show you branching dialogues!',
    '',
    'Choose an option to see how branching works:',
  ],
  choices: {
    optionA: {
      text: 'Option A - Learn about linear dialogues',
      next: branchingOptionA,
    },
    optionB: {
      text: 'Option B - Learn about interactive dialogues',
      next: branchingOptionB,
    },
    back: {
      text: 'Go back',
      next: firstGreeting,
    },
  },
});

/**
 * Dialogue node: State-based greeting
 * 
 * Shown when player has met the teacher before.
 * Demonstrates state-based conditional dialogue entry.
 */
const stateBasedGreeting = createDialogueNode({
  lines: [
    'Hello again!',
    '',
    'I remember you! This is a state-based dialogue.',
    'The dialogue system remembers our previous interaction.',
    '',
    'State-based dialogues allow NPCs to "remember" things',
    'and change their dialogue based on previous interactions.',
  ],
  choices: {
    branching: {
      text: 'Show me branching dialogues',
      next: branchingChoice,
    },
    task: {
      text: 'Tell me about the task',
      next: null,
      actions: [offerTask(dialogueTask)],
    },
    later: {
      text: 'Thanks, I\'ll explore more',
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
  task: dialogueTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your dialogue task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(dialogueTask);
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
    'You completed the dialogue task successfully.',
    'Great job learning about dialogue systems!',
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
 * Demonstrates:
 * - Conditional entry based on state
 * - Multiple dialogue nodes
 * - Branching conversations
 * - Task-specific dialogue nodes (taskReady, taskComplete)
 */
export const teacherDialogueTree = createDialogueTree()
  .nodes(
    firstGreeting,
    stateBasedGreeting,
    branchingChoice,
    branchingOptionA,
    branchingOptionB,
    taskReady,
    taskComplete
  )
  .configureEntry()
    .when((ctx) => teacherState(ctx).hasMet === true).use(stateBasedGreeting)
    .default(firstGreeting)
  .build();
