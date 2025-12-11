/**
 * Guide NPC Dialogue Tree
 * 
 * Dialogue tree for the showcase guide NPC that explains the showcase system.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { guideState } from './state.js';
import { explorationTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 * 
 * Shown when the player first interacts with the guide.
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello! Welcome to the Module Creator Showcase!',
    'I\'m your guide to understanding module creation.',
    'This hub module is the starting point for exploring all module features.',
    'Complete the exploration task to unlock all showcase submodules.',
    'Each submodule focuses on specific aspects:',
    '1. Basics - Module structure and fundamentals',
    '2. Dialogues - Conversation systems',
    '3. Tasks - All task types and validators',
    '4. Objects - All object types and interactions',
    '5. Progression - Unlocking and chains',
    '6. Advanced - Password locks, handlers, custom components',
    'The Advanced module is password-protected. The password is "advanced123".',
    'This demonstrates password unlock requirements.',
  ],
  choices: {
    accept: {
      text: 'I\'ll explore!',
      next: null,
      actions: [
        callFunction((ctx) => {
          guideState(ctx).hasMet = true;
        }),
        offerTask(explorationTask),
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
    'Need help navigating the showcase?',
    'Remember: Complete the exploration task to unlock submodules.',
    'The Advanced module password is "advanced123".',
  ],
  choices: {
    check_task: {
      text: 'How is my task?',
      next: null,
      actions: [
        callFunction(async (context) => {
          // Open task submission if task is active
          if (context.openTaskSubmission && context.getCurrentTaskId() === explorationTask.id) {
            context.openTaskSubmission(explorationTask);
          }
        }),
      ],
    },
    info: {
      text: 'Tell me about the submodules',
      next: firstGreeting,
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
  task: explorationTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your exploration?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          // Open task submission - can accept task object or task ID string
          if (context.openTaskSubmission) {
            context.openTaskSubmission(explorationTask);
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
    'You completed the exploration task successfully.',
    'All showcase submodules are now unlocked on the worldmap!',
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
