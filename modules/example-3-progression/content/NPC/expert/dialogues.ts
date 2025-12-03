/**
 * Expert NPC Dialogue Tree
 * 
 * Complete dialogue tree for the expert NPC.
 * This NPC is locked until the first task is completed.
 * The root dialogue will automatically show available tasks.
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@utils/builders/dialogues.js';
import { expertState } from './state.js';
import { quizTask, reflectionTask, module3UnlockTask } from '../../tasks.js';

/**
 * Dialogue node: First meeting - offers quiz task
 */
const firstGreeting = dialogueNode({
  lines: [
    'Hello!',
    'I\'m the Expert.',
    'You unlocked me by completing the introduction task!',
    'I have a quiz for you.',
    'It will test your knowledge.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the quiz',
      next: null,
      actions: [
        callFunction((ctx) => {
          expertState(ctx).hasMet = true;
        }),
        acceptTask(quizTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
      actions: [
        callFunction((ctx) => {
          expertState(ctx).hasMet = true;
        }),
      ],
    },
  },
});

/**
 * Dialogue node: General greeting - offers next available task
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
 * Dialogue node: General greeting with reflection task offer
 */
const generalGreetingWithReflection = dialogueNode({
  lines: [
    'Hello again!',
    'I have a reflection task for you.',
    'Are you ready?',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the reflection task',
      next: null,
      actions: [
        acceptTask(reflectionTask),
      ],
    },
    check_task: {
      text: 'How is my task?',
      next: null,
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: General greeting with module unlock task offer
 */
const generalGreetingWithModuleUnlock = dialogueNode({
  lines: [
    'Hello again!',
    'I have a special task for you.',
    'It will unlock a new module on the worldmap!',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like that task',
      next: null,
      actions: [
        acceptTask(module3UnlockTask),
      ],
    },
    check_task: {
      text: 'How is my task?',
      next: null,
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: After quiz complete - offers reflection task
 */
const offerReflectionTask = dialogueNode({
  lines: [
    'Great job on the quiz!',
    'Now I have a reflection task for you.',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like the reflection task',
      next: null,
      actions: [
        acceptTask(reflectionTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: After reflection complete - offers module unlock task
 */
const offerModuleUnlockTask = dialogueNode({
  lines: [
    'Excellent reflection!',
    'I have one final special task for you.',
    'It will unlock a new module on the worldmap!',
  ],
  choices: {
    accept: {
      text: 'Yes, I\'d like that task',
      next: null,
      actions: [
        acceptTask(module3UnlockTask),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null,
    },
  },
});

/**
 * Dialogue node: Quiz task ready
 */
const quizTaskReady = dialogueNode({
  task: quizTask,
  lines: [
    'Are you ready to answer the quiz?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(quizTask);
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
 * Dialogue node: Reflection task ready
 */
const reflectionTaskReady = dialogueNode({
  task: reflectionTask,
  lines: [
    'Are you ready to submit your reflection?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
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
      next: null,
    },
  },
});

/**
 * Dialogue node: Module unlock task ready
 */
const moduleUnlockTaskReady = dialogueNode({
  task: module3UnlockTask,
  lines: [
    'Are you ready to unlock a new module?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\'m ready!',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(module3UnlockTask);
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
 * Dialogue node: Quiz task complete - offers next task
 */
const quizTaskComplete = dialogueNode({
  lines: [
    'Excellent! You answered the quiz correctly.',
  ],
  choices: {
    next_task: {
      text: 'What\'s next?',
      next: offerReflectionTask,
    },
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Dialogue node: Reflection task complete - offers next task
 */
const reflectionTaskComplete = dialogueNode({
  lines: [
    'Great reflection!',
    'You\'ve completed all the main tasks.',
  ],
  choices: {
    next_task: {
      text: 'What\'s next?',
      next: offerModuleUnlockTask,
    },
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Dialogue node: Module unlock task complete
 */
const moduleUnlockTaskComplete = dialogueNode({
  lines: [
    'Amazing!',
    'You\'ve unlocked a new module on the worldmap!',
    'Check the worldmap to see it.',
  ],
  choices: {
    thanks: {
      text: 'Thank you!',
      next: null,
    },
  },
});

/**
 * Expert dialogue tree
 * 
 * Offers tasks sequentially based on completion.
 */
export const expertDialogueTree = dialogueTree()
  .nodes(
    firstGreeting,
    generalGreeting,
    generalGreetingWithReflection,
    generalGreetingWithModuleUnlock,
    offerReflectionTask,
    offerModuleUnlockTask,
    quizTaskReady,
    reflectionTaskReady,
    moduleUnlockTaskReady,
    quizTaskComplete,
    reflectionTaskComplete,
    moduleUnlockTaskComplete
  )
  .configureEntry()
    .when((ctx) => {
      // If quiz is complete but reflection is not, offer reflection
      return ctx.isTaskCompleted(quizTask) && !ctx.isTaskCompleted(reflectionTask);
    }).use(offerReflectionTask)
    .when((ctx) => {
      // If reflection is complete but module unlock is not, offer module unlock
      return ctx.isTaskCompleted(reflectionTask) && !ctx.isTaskCompleted(module3UnlockTask);
    }).use(offerModuleUnlockTask)
    .when((ctx) => {
      // If has met and quiz is complete but reflection is not, show greeting with reflection offer
      return expertState(ctx).hasMet === true && 
             ctx.isTaskCompleted(quizTask) && 
             !ctx.isTaskCompleted(reflectionTask);
    }).use(generalGreetingWithReflection)
    .when((ctx) => {
      // If has met and reflection is complete but module unlock is not, show greeting with module unlock offer
      return expertState(ctx).hasMet === true && 
             ctx.isTaskCompleted(reflectionTask) && 
             !ctx.isTaskCompleted(module3UnlockTask);
    }).use(generalGreetingWithModuleUnlock)
    .when((ctx) => {
        return expertState(ctx).hasMet === true;
    }).use(generalGreeting)

    .default(firstGreeting)
  .build();
