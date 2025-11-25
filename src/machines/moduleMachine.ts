/**
 * Module state machine using XState
 * Handles all module flow logic
 */

import { setup, assign } from 'xstate';
import type { ModuleData, Task } from '../types/module.types.js';
import type { TaskSubmission } from '../types/task.types.js';
import { evaluateTask } from '../services/taskEvaluation.js';

/**
 * Module machine context
 */
interface ModuleContext {
  module: ModuleData | null;
  moduleId: string | null;
  currentTask: Task | null;
  submission: TaskSubmission | null;
  evaluationResult: import('../types/module.types.js').TaskSolveResult | null;
  error: string | null;
}

/**
 * Module machine events
 */
type ModuleEvent =
  | { type: 'START_MODULE'; module: ModuleData; moduleId: string }
  | { type: 'COMPLETE_WELCOME' }
  | { type: 'ACCEPT_TASK'; taskId: string }
  | { type: 'READY_TO_SUBMIT' }
  | { type: 'SUBMIT_TASK'; submission: TaskSubmission }
  | { type: 'TASK_COMPLETE' }
  | { type: 'EXIT' }
  | { type: 'RETRY' };

/**
 * Module machine state
 */
export const moduleMachine = setup({
  types: {
    context: {} as ModuleContext,
    events: {} as ModuleEvent,
  },
  guards: {
    hasModule: ({ context }) => context.module !== null,
    hasCurrentTask: ({ context }) => context.currentTask !== null,
    hasNextTask: ({ context }) => {
      if (!context.module || !context.moduleId) return false;
      // This will be checked in the component, not here
      return true;
    },
    allTasksComplete: ({ context }) => {
      if (!context.module || !context.moduleId) return true;
      // This will be checked in the component, not here
      return false;
    },
  },
  actions: {
    setModule: assign({
      module: ({ event }) => ('module' in event ? event.module : null),
      moduleId: ({ event }) => ('moduleId' in event ? event.moduleId : null),
    }),
    setCurrentTask: assign({
      currentTask: ({ context, event }) => {
        if (!context.module || event.type !== 'ACCEPT_TASK') return null;
        return context.module.tasks.find(t => t.id === event.taskId) || null;
      },
    }),
    setSubmission: assign({
      submission: ({ event }) => ('submission' in event ? event.submission : null),
    }),
    clearError: assign({
      error: null,
    }),
    setError: assign({
      error: ({ event }) => ('error' in event ? String(event.error) : null),
    }),
  },
  actors: {
    evaluateTaskActor: async ({ input }: { input: { task: Task; submission: TaskSubmission } }) => {
      return await evaluateTask(input.task, input.submission);
    },
  },
}).createMachine({
  id: 'module',
  initial: 'idle',
  context: {
    module: null,
    moduleId: null,
    currentTask: null,
    submission: null,
    evaluationResult: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        START_MODULE: {
          target: 'loading',
          actions: 'setModule',
        },
      },
    },
    loading: {
      always: {
        target: 'welcome',
        guard: 'hasModule',
      },
    },
    welcome: {
      on: {
        COMPLETE_WELCOME: {
          target: 'environment',
        },
      },
    },
    environment: {
      on: {
        ACCEPT_TASK: {
          target: 'taskAccepted',
          guard: 'hasModule',
          actions: 'setCurrentTask',
        },
        EXIT: {
          target: 'idle',
        },
      },
    },
    taskAccepted: {
      on: {
        READY_TO_SUBMIT: {
          target: 'taskWork',
        },
        EXIT: {
          target: 'environment',
        },
      },
    },
    taskWork: {
      on: {
        SUBMIT_TASK: {
          target: 'evaluating',
          actions: 'setSubmission',
        },
        EXIT: {
          target: 'environment',
        },
      },
    },
    evaluating: {
      invoke: {
        id: 'evaluateTask',
        src: 'evaluateTaskActor',
        input: ({ context }) => ({
          task: context.currentTask!,
          submission: context.submission!,
        }),
        onDone: {
          target: 'taskComplete',
          actions: assign({
            evaluationResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: 'taskWork',
          actions: assign({
            error: ({ event }) => String(event.error),
          }),
        },
      },
    },
    taskComplete: {
      on: {
        TASK_COMPLETE: [
          {
            target: 'moduleComplete',
            guard: 'allTasksComplete',
          },
          {
            target: 'environment',
          },
        ],
        RETRY: {
          target: 'taskWork',
          actions: 'clearError',
        },
      },
    },
    moduleComplete: {
      type: 'final',
      on: {
        EXIT: {
          target: 'idle',
        },
      },
    },
  },
});

// Import store
import { useModuleStore } from '../store/moduleStore.js';

