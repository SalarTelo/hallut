/**
 * Interactable Builder
 * Builder for creating interactables with encapsulated tasks, dialogues, and logic
 */

import type {
  Interactable,
  Position,
  GetDialogueFunction,
  TaskSequence,
} from '../types/interactable.types.js';
import type { InteractableType, UnlockRequirement } from '../types/interactable.types.js';
import type { Task } from '../types/module/moduleConfig.types.js';
import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ModuleContext } from '../types/core/moduleClass.types.js';

/**
 * Options for creating an interactable
 */
export interface InteractableOptions {
  id: string;
  type: InteractableType;
  name: string;
  position: Position;
  avatar?: string;
  locked?: boolean;
  unlockRequirement?: UnlockRequirement | null;
  dialogues: Record<string, DialogueConfig>;
  getDialogue?: GetDialogueFunction;
  tasks?: Record<string, Task>;
  handlers?: Record<string, (context: ModuleContext) => void | Promise<void>>;
}

/**
 * Create an interactable
 * 
 * @param options - Interactable configuration
 * @returns Interactable
 * 
 * @example
 * const guard = createInteractable({
 *   id: 'guard',
 *   type: 'npc',
 *   name: 'Guard',
 *   position: pos(50, 50),
 *   dialogues: {
 *     greeting: greetingDialogue,
 *   },
 *   getDialogue: (context) => {
 *     if (context.isTaskCompleted(storyTask)) {
 *       return completeDialogue;
 *     }
 *     return greetingDialogue;
 *   },
 *   tasks: {
 *     story: storyTask,
 *   },
 * });
 */
export function createInteractable(
  options: InteractableOptions
): Interactable {
  const {
    id,
    type,
    name,
    position,
    avatar,
    locked = false,
    unlockRequirement = null,
    dialogues,
    getDialogue,
    tasks,
    handlers,
  } = options;

  return {
    id,
    type,
    name,
    position,
    avatar,
    locked,
    unlockRequirement,
    dialogues,
    getDialogue,
    tasks,
    handlers,
  };
}

/**
 * Position helper
 */
export function pos(x: number, y: number): Position {
  return { x, y };
}


/**
 * Extract tasks from interactables
 */
export function extractTasks(
  interactables: Interactable[],
  taskSequence?: TaskSequence
): Task[] {
  const taskMap = new Map<string, Task>();

  // Collect all tasks from interactables
  for (const interactable of interactables) {
    if (interactable.tasks) {
      for (const task of Object.values(interactable.tasks)) {
        taskMap.set(task.id, task);
      }
    }
  }

  // If task sequence exists, order tasks by sequence
  if (taskSequence) {
    const orderedTasks: Task[] = [];
    const addedTasks = new Set<string>();

    // Add tasks in sequence order
    for (const entry of taskSequence.entries) {
      if (!addedTasks.has(entry.task.id)) {
        orderedTasks.push(entry.task);
        addedTasks.add(entry.task.id);
      }
    }

    // Add any remaining tasks not in sequence
    for (const task of taskMap.values()) {
      if (!addedTasks.has(task.id)) {
        orderedTasks.push(task);
      }
    }

    return orderedTasks;
  }

  // Return all tasks in map order
  return Array.from(taskMap.values());
}

/**
 * Extract dialogues from interactables
 */
export function extractDialogues(
  interactables: Interactable[]
): Record<string, DialogueConfig> {
  const dialogues: Record<string, DialogueConfig> = {};

  for (const interactable of interactables) {
    for (const [dialogueId, dialogue] of Object.entries(interactable.dialogues)) {
      // Use full dialogue ID to avoid conflicts
      const fullDialogueId = `${interactable.id}-${dialogueId}`;
      dialogues[fullDialogueId] = {
        ...dialogue,
        id: fullDialogueId,
      };
    }
  }

  return dialogues;
}

