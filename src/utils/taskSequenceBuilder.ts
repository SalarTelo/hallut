/**
 * Task Sequence Builder
 * Builders for defining task sequences across interactables
 */

import type {
  TaskSequence,
  TaskSequenceEntry,
  Interactable,
} from '../types/interactable.types.js';
import type { Task } from '../types/module/moduleConfig.types.js';

/**
 * Create a task sequence
 * 
 * @param entries - Array of task sequence entries
 * @returns Task sequence
 * 
 * @example
 * const sequence = createTaskSequence([
 *   { task: storyTask, offeredBy: guard1, after: [] },
 *   { task: recipeTask, offeredBy: guard1, after: [storyTask] },
 *   { task: cookingTask, offeredBy: chef, after: [recipeTask] },
 * ]);
 */
export function createTaskSequence(
  entries: TaskSequenceEntry[]
): TaskSequence {
  return {
    entries,
  };
}

/**
 * Task flow builder for declarative task sequence creation
 */
export class TaskFlowBuilder {
  private entries: TaskSequenceEntry[] = [];
  private currentTask: Task | null = null;
  private currentInteractable: Interactable | null = null;
  private currentAfter: Task[] = [];
  private currentUnlocks: Interactable[] = [];

  /**
   * Define a task
   */
  task(task: Task): TaskFlowBuilder {
    this.currentTask = task;
    return this;
  }

  /**
   * Define which interactable offers the current task
   */
  offeredBy(interactable: Interactable): TaskFlowBuilder {
    this.currentInteractable = interactable;
    return this;
  }

  /**
   * Define prerequisites for the current task
   */
  after(...tasks: Task[]): TaskFlowBuilder {
    this.currentAfter = tasks;
    return this;
  }

  /**
   * Define interactables to unlock when current task completes
   */
  unlocks(...interactables: Interactable[]): TaskFlowBuilder {
    this.currentUnlocks = interactables;
    return this;
  }

  /**
   * Chain to next task (completes current entry and starts new one)
   */
  then(task: Task): TaskFlowBuilder {
    // Complete current entry if we have task and interactable
    if (this.currentTask && this.currentInteractable) {
      this.entries.push({
        task: this.currentTask,
        offeredBy: this.currentInteractable,
        after: this.currentAfter.length > 0 ? this.currentAfter : undefined,
        unlocks: this.currentUnlocks.length > 0 ? this.currentUnlocks : undefined,
      });
    }

    // Start new entry
    this.currentTask = task;
    this.currentInteractable = null;
    this.currentAfter = [];
    this.currentUnlocks = [];

    return this;
  }

  /**
   * Complete current entry without chaining to next task
   * Useful for final task in sequence
   */
  private completeCurrentEntry(): void {
    if (this.currentTask && this.currentInteractable) {
      this.entries.push({
        task: this.currentTask,
        offeredBy: this.currentInteractable,
        after: this.currentAfter.length > 0 ? this.currentAfter : undefined,
        unlocks: this.currentUnlocks.length > 0 ? this.currentUnlocks : undefined,
      });
    }
  }

  /**
   * Build the final task sequence
   */
  build(): TaskSequence {
    // Add final entry if exists
    this.completeCurrentEntry();
    return createTaskSequence(this.entries);
  }
}

/**
 * Create a task flow builder
 * 
 * @example
 * const sequence = taskFlow()
 *   .task(storyTask).offeredBy(guard1)
 *   .then(recipeTask).offeredBy(guard1).after(storyTask)
 *   .then(cookingTask).offeredBy(chef).after(recipeTask)
 *   .build();
 */
export function taskFlow(): TaskFlowBuilder {
  return new TaskFlowBuilder();
}

