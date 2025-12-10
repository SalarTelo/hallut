/**
 * Task Teacher Dialogue Tree
 * 
 * Dialogue tree for offering all task types.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import {
  textLengthTask,
  wordCountTask,
  keywordsTask,
  multipleChoiceTask,
  customTask,
} from '../../tasks.js';

/**
 * Dialogue node: First greeting
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! I\'m the Task Teacher.',
    'I can demonstrate different task types and validators.',
    '',
    'Which type of task would you like to try?',
  ],
  choices: {
    text_task: {
      text: 'Text Task',
      next: null, // Will be set to textTaskOptions after it's defined
    },
    multiple_choice: {
      text: 'Multiple Choice Task',
      next: null,
      actions: [offerTask(multipleChoiceTask)],
    },
    custom: {
      text: 'Custom Task',
      next: null,
      actions: [offerTask(customTask)],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: Text task options
 * 
 * Shows different text task validators as variations of text tasks.
 */
const textTaskOptions = createDialogueNode({
  lines: [
    'Text tasks can use different validators:',
    '',
    '• Length validator - checks minimum character count',
    '• Word count validator - checks minimum word count',
    '• Keywords validator - checks for specific words',
    '',
    'Which validator would you like to try?',
  ],
  choices: {
    length: {
      text: 'Length Validator (20+ characters)',
      next: null,
      actions: [offerTask(textLengthTask)],
    },
    word_count: {
      text: 'Word Count Validator (5+ words)',
      next: null,
      actions: [offerTask(wordCountTask)],
    },
    keywords: {
      text: 'Keywords Validator (include "task" or "activity")',
      next: null,
      actions: [offerTask(keywordsTask)],
    },
    back: {
      text: 'Back',
      next: firstGreeting,
    },
  },
});

// Update firstGreeting to point to textTaskOptions
firstGreeting.choices.text_task.next = textTaskOptions;

/**
 * Helper function to create task-ready nodes for each task
 */
function createTaskReadyNode(task: typeof textLengthTask) {
  return createDialogueNode({
    task,
    lines: [
      `Are you ready to submit your ${task.name}?`,
    ],
    choices: {
      yes: {
        text: 'Yes, I\'m ready!',
        next: null,
        actions: [
          callFunction(async (context) => {
            if (context.openTaskSubmission) {
              context.openTaskSubmission(task);
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
}

/**
 * Helper function to create task-complete nodes for each task
 */
function createTaskCompleteNode(task: typeof textLengthTask) {
  return createDialogueNode({
    lines: [
      'Excellent work!',
      `You completed the ${task.name} successfully.`,
    ],
    choices: {
      thanks: {
        text: 'Thank you!',
        next: null,
      },
    },
  });
}

/**
 * Task-ready nodes
 */
const textLengthTaskReady = createTaskReadyNode(textLengthTask);
const wordCountTaskReady = createTaskReadyNode(wordCountTask);
const keywordsTaskReady = createTaskReadyNode(keywordsTask);
const multipleChoiceTaskReady = createTaskReadyNode(multipleChoiceTask);
const customTaskReady = createTaskReadyNode(customTask);

/**
 * Task-complete nodes
 */
const textLengthTaskComplete = createTaskCompleteNode(textLengthTask);
const wordCountTaskComplete = createTaskCompleteNode(wordCountTask);
const keywordsTaskComplete = createTaskCompleteNode(keywordsTask);
const multipleChoiceTaskComplete = createTaskCompleteNode(multipleChoiceTask);
const customTaskComplete = createTaskCompleteNode(customTask);

/**
 * Task teacher dialogue tree
 */
export const taskTeacherDialogueTree = createDialogueTree()
  .nodes(
    firstGreeting,
    textTaskOptions,
    textLengthTaskReady,
    wordCountTaskReady,
    keywordsTaskReady,
    multipleChoiceTaskReady,
    customTaskReady,
    textLengthTaskComplete,
    wordCountTaskComplete,
    keywordsTaskComplete,
    multipleChoiceTaskComplete,
    customTaskComplete
  )
  .configureEntry()
    .default(firstGreeting)
  .build();
