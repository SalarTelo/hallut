/**
 * Task Builder
 * Functions for creating task definitions
 */

import type { Task, TaskSubmissionConfig, TaskSolveFunction, TaskMeta } from '@core/task/types.js';
import type { UnlockRequirement } from '@core/unlock/types.js';

/**
 * Task creation options
 */
export interface TaskOptions {
  id: string;
  name: string;
  description: string;
  submission: TaskSubmissionConfig;
  validate: TaskSolveFunction;
  overview?: {
    requirements?: string;
    goals?: string[];
  };
  unlockRequirement?: UnlockRequirement | null;
  dialogues?: {
    offer?: string[];
    ready?: string[];
    complete?: string[];
  };
  meta?: TaskMeta;
}

/**
 * Create a task definition
 */
export function createTask(options: TaskOptions): Task {
  const { id, name, description, submission, validate, overview, unlockRequirement, dialogues, meta } = options;

  const task: Task = {
    id,
    name,
    description,
    submission,
    validate,
  };

  if (overview) {
    task.overview = overview;
  }

  if (unlockRequirement !== undefined) {
    task.unlockRequirement = unlockRequirement;
  }

  if (dialogues) {
    task.dialogues = dialogues;
  }

  if (meta) {
    task.meta = meta;
  }

  return task;
}

