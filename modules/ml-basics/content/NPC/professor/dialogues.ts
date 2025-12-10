/**
 * Professor Chen Dialogue Tree
 * 
 * A comprehensive dialogue system for Professor Chen, an enthusiastic
 * machine learning educator who guides students through their learning journey.
 */

import {
  createDialogueTree,
  createDialogueNode,
  offerTask,
  callFunction,
} from '@builders/index.js';
import { professorState } from './state.js';
import { supervisedLearningTask, neuralNetworksTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting
 * 
 * Initial greeting when the player first meets Professor Chen.
 */
const firstGreeting = createDialogueNode({
  lines: [
    'Hello there! I\'m Professor Chen.',
    'Welcome to the Machine Learning Basics module!',
    'I\'m excited to help you learn about this fascinating field.',
    'Machine learning is all around us - from recommendation systems to self-driving cars.',
    'I have some engaging tasks that will help you understand the fundamentals.',
    'Would you like to start with supervised learning?',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like to learn about supervised learning',
      next: null,
      actions: [
        callFunction((ctx) => {
          professorState(ctx).hasMet = true;
          professorState(ctx).lastTopicDiscussed = 'supervised-learning';
        }),
        offerTask(supervisedLearningTask),
      ],
    },
    explore: {
      text: 'Tell me more about machine learning first',
      next: null,
      actions: [
        callFunction((ctx) => {
          professorState(ctx).hasMet = true;
        }),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
      actions: [
        callFunction((ctx) => {
          professorState(ctx).hasMet = true;
        }),
      ],
    },
  },
});

/**
 * Dialogue node: General greeting
 * 
 * Shown when the player has met Professor Chen before.
 */
const generalGreeting = createDialogueNode({
  lines: [
    'Hello again!',
    'How are you progressing with your machine learning journey?',
    'What would you like to explore today?',
  ],
  choices: {
    supervised: {
      text: 'I want to work on supervised learning',
      next: null,
      actions: [
        callFunction((ctx) => {
          professorState(ctx).lastTopicDiscussed = 'supervised-learning';
        }),
        offerTask(supervisedLearningTask),
      ],
    },
    neural: {
      text: 'Tell me about neural networks',
      next: null,
      actions: [
        callFunction((ctx) => {
          professorState(ctx).lastTopicDiscussed = 'neural-networks';
        }),
        offerTask(neuralNetworksTask),
      ],
    },
    check_task: {
      text: 'How is my current task?',
      next: null,
    },
    talk: {
      text: 'Just chatting',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task ready for submission (Supervised Learning)
 */
const supervisedTaskReady = createDialogueNode({
  task: supervisedLearningTask,
  lines: [
    'Great! Are you ready to explain supervised learning?',
    'Remember to include: what it is, how labeled data works, and an example.',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready to submit!',
      next: null,
      actions: [
        callFunction((context) => {
          // Open task submission - can accept task object or task ID string
          if (context.openTaskSubmission) {
            context.openTaskSubmission(supervisedLearningTask);
          }
        }),
      ],
    },
    not_yet: {
      text: 'I need more time',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task ready for submission (Neural Networks)
 */
const neuralTaskReady = createDialogueNode({
  task: neuralNetworksTask,
  lines: [
    'Ready to explain neural networks?',
    'Think about how neurons connect in layers and try to use an analogy.',
  ],
  choices: {
    yes: {
      text: 'Yes, let\'s do it!',
      next: null,
      actions: [
        callFunction((context) => {
          // Open task submission - can accept task object or task ID string
          if (context.openTaskSubmission) {
            context.openTaskSubmission(neuralNetworksTask);
          }
        }),
      ],
    },
    not_yet: {
      text: 'I need to think more',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task complete (Supervised Learning)
 */
const supervisedTaskComplete = createDialogueNode({
  lines: [
    'Excellent work!',
    'You\'ve demonstrated a solid understanding of supervised learning.',
    'This is a fundamental concept that forms the basis of many ML applications.',
    'Would you like to explore neural networks next?',
  ],
  choices: {
    yes: {
      text: 'Yes, let\'s learn about neural networks',
      next: null,
      actions: [
        callFunction((ctx) => {
          const state = professorState(ctx);
          state.tasksCompleted = (state.tasksCompleted || 0) + 1;
          state.lastTopicDiscussed = 'neural-networks';
        }),
        offerTask(neuralNetworksTask),
      ],
    },
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Dialogue node: Task complete (Neural Networks)
 */
const neuralTaskComplete = createDialogueNode({
  lines: [
    'Fantastic!',
    'You\'ve grasped how neural networks work.',
    'These powerful models are behind many modern AI breakthroughs.',
    'Keep exploring - there\'s so much more to discover in machine learning!',
  ],
  choices: {
    thanks: {
      text: 'Thank you, Professor!',
      next: null,
    },
  },
});

/**
 * Professor Chen dialogue tree
 * 
 * Uses conditional entry based on state and task status.
 */
export const professorDialogueTree = createDialogueTree()
  .nodes(
    firstGreeting,
    generalGreeting,
    supervisedTaskReady,
    neuralTaskReady,
    supervisedTaskComplete,
    neuralTaskComplete
  )
  .configureEntry()
    .when((ctx) => professorState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();
