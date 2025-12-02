/**
 * useInteractableActions Hook
 * Handles interactable click actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '@core/module/context.js';
import { actions } from '@core/state/actions.js';
import type { Interactable, ObjectInteraction, NPC } from '@core/types/interactable.js';
import type { Task } from '@core/types/task.js';
import { ModuleError, ErrorCode } from '@core/types/errors.js';

export interface InteractableActionResult {
  type: 'dialogue' | 'component' | 'none';
  dialogueId?: string;
  component?: string;
  componentProps?: Record<string, unknown>;
}

export interface UseInteractableActionsOptions {
  moduleId: string;
  locale?: string;
  onDialogueSelected?: (dialogueId: string) => void;
  onComponentOpen?: (component: string, props?: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
}

/**
 * Extract tasks from NPC dialogues (from accept-task actions in choices)
 */
function getTasksFromDialogues(npc: NPC, moduleData?: { tasks: Task[] }): Task[] {
  const tasks: Task[] = [];

  // Check all dialogues for accept-task actions
  Object.values(npc.dialogues || {}).forEach(dialogue => {
    dialogue.choices?.forEach(choice => {
      const actions = Array.isArray(choice.action) ? choice.action : [choice.action];
      actions.forEach(action => {
        if (action && action.type === 'accept-task') {
          // If we have module data, find the full task object
          if (moduleData) {
            const task = moduleData.tasks.find(t => t.id === action.task.id);
            if (task) {
              tasks.push(task);
            }
          } else {
            // Otherwise, use the task from the action
            tasks.push(action.task);
          }
        }
      });
    });
  });

  return tasks;
}

/**
 * Select appropriate dialogue for NPC based on task state
 */
function selectNPCDialogue(npc: NPC, moduleId: string): string | null {
  // Get tasks from NPC
  let npcTasks: Task[] = [];
  
  // Get tasks from NPC's tasks property
  if (npc.tasks) {
    npcTasks = Object.values(npc.tasks);
  }
  
  // Also get tasks from dialogue choices (we can't access moduleData here, so we'll use the task from the action)
  const dialogueTasks = getTasksFromDialogues(npc);
  dialogueTasks.forEach(dialogueTask => {
    if (!npcTasks.find(t => t.id === dialogueTask.id)) {
      npcTasks.push(dialogueTask);
    }
  });
  
  if (npcTasks.length === 0) {
    return null; // No tasks, use default dialogue
  }
  
  const currentTaskId = actions.getCurrentTaskId(moduleId);
  
  // Check if any task is active
  const activeTask = npcTasks.find(task => task.id === currentTaskId);
  if (activeTask) {
    // Task is active - try to find task-ready dialogue
    const taskReadyId = `${npc.id}-task-ready`;
    if (npc.dialogues['task-ready']) {
      return taskReadyId;
    }
    // If not found, will fall back to default (getDialogue will generate default)
    return taskReadyId;
  }
  
  // Check if all tasks are completed
  const allCompleted = npcTasks.every(task => actions.isTaskCompleted(moduleId, task.id));
  if (allCompleted) {
    // All tasks completed - try to find task-complete dialogue
    if (npc.dialogues['task-complete']) {
      return `${npc.id}-task-complete`;
    }
    if (npc.dialogues['complete']) {
      return `${npc.id}-complete`;
    }
    // If not found, will fall back to default (getDialogue will generate default)
    return `${npc.id}-task-complete`;
  }
  
  // No active task and not all completed - use default dialogue
  return null;
}

/**
 * Hook for handling interactable actions
 */
export function useInteractableActions({
  moduleId,
  locale = 'sv',
  onDialogueSelected,
  onComponentOpen,
  onError,
}: UseInteractableActionsOptions) {
  const handleInteractableAction = useCallback(
    async (interactable: Interactable): Promise<InteractableActionResult> => {
      try {
        // Check if interactable is locked
        if (interactable.locked && interactable.unlockRequirement) {
          // TODO: Check unlock requirement
          // For now, return none if locked
          return { type: 'none' };
        }

        // Handle NPC
        if (interactable.type === 'npc') {
          if (interactable.getDialogue) {
            const context = createModuleContext(moduleId, locale);
            const dialogue = interactable.getDialogue(context);
            onDialogueSelected?.(dialogue.id);
            return { type: 'dialogue', dialogueId: dialogue.id };
          }

          // Automatically select dialogue based on task state
          const selectedDialogueId = selectNPCDialogue(interactable, moduleId);
          if (selectedDialogueId) {
            onDialogueSelected?.(selectedDialogueId);
            return { type: 'dialogue', dialogueId: selectedDialogueId };
          }

          // Fallback: Use first dialogue
          const dialogueIds = Object.keys(interactable.dialogues);
          if (dialogueIds.length > 0) {
            const dialogueId = `${interactable.id}-${dialogueIds[0]}`;
            onDialogueSelected?.(dialogueId);
            return { type: 'dialogue', dialogueId };
          }
        }

        // Handle object/location
        if (interactable.type === 'object' || interactable.type === 'location') {
          let interaction: ObjectInteraction | undefined;

          if (interactable.getInteraction) {
            const context = createModuleContext(moduleId, locale);
            interaction = interactable.getInteraction(context);
          } else {
            interaction = interactable.interaction;
          }

          if (!interaction || interaction.type === 'none') {
            return { type: 'none' };
          }

          switch (interaction.type) {
            case 'dialogue':
              // Dialogue IDs are prefixed with interactable ID in the loader
              // For objects/locations: `${interactable.id}-dialogue`
              // The loader always creates IDs like this, so we match that pattern
              const dialogueId = `${interactable.id}-dialogue`;
              onDialogueSelected?.(dialogueId);
              return { type: 'dialogue', dialogueId };

            case 'component':
              // Handle all components through the same callback
              // Props can be specific types or generic Record, normalize to Record for callback
              const componentProps = interaction.props as Record<string, unknown> | undefined;
              onComponentOpen?.(interaction.component, componentProps);
              return {
                type: 'component',
                component: interaction.component,
                componentProps,
              };
          }
        }

        return { type: 'none' };
      } catch (error) {
        const moduleError = error instanceof Error
          ? new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling interactable ${interactable.id}: ${error.message}`,
              { originalError: error }
            )
          : new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling interactable ${interactable.id}`
            );
        onError?.(moduleError);
        return { type: 'none' };
      }
    },
    [moduleId, locale, onDialogueSelected, onComponentOpen, onError]
  );

  return {
    handleInteractableAction,
  };
}

