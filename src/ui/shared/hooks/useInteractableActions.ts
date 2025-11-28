/**
 * useInteractableActions Hook
 * Handles interactable action logic
 */

import { useCallback } from 'react';
import { getModuleInstance } from '@engine/moduleRegistry.js';
import { createModuleContext } from '@engine/engineApi.js';
import { useModuleActions } from '@stores/moduleStore/index.js';
import { InteractableActionType } from '@types/interactable.types.js';
import type { Interactable } from '@types/interactable.types.js';
import { DEFAULT_LOCALE } from '@constants/module.constants.js';
import { ModuleError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';

export interface InteractableActionResult {
  type: 'task' | 'dialogue' | 'chat' | 'image' | 'none';
  taskId?: string;
  dialogueId?: string;
  imageUrl?: string;
  imageTitle?: string;
}

export interface UseInteractableActionsOptions {
  moduleId: string;
  locale?: string;
  onTaskSelected?: (taskId: string) => void;
  onDialogueSelected?: (dialogueId: string) => void;
  onChatOpen?: () => void;
  onImageOpen?: (url: string, title: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling interactable actions
 */
export function useInteractableActions({
  moduleId,
  locale = DEFAULT_LOCALE,
  onTaskSelected,
  onDialogueSelected,
  onChatOpen,
  onImageOpen,
  onError,
}: UseInteractableActionsOptions) {
  const { acceptTask } = useModuleActions();

  const handleInteractableAction = useCallback(
    async (interactable: Interactable): Promise<InteractableActionResult> => {
      const { action } = interactable;

      try {
        switch (action.type) {
          case InteractableActionType.Task: {
            const taskId = action.task;
            acceptTask(moduleId, taskId);
            onTaskSelected?.(taskId);
            return { type: 'task', taskId };
          }

          case InteractableActionType.Dialogue: {
            const dialogueId = action.dialogue;
            onDialogueSelected?.(dialogueId);
            return { type: 'dialogue', dialogueId };
          }

          case InteractableActionType.Chat: {
            onChatOpen?.();
            return { type: 'chat' };
          }

          case InteractableActionType.Image: {
            onImageOpen?.(action.imageUrl, action.title || 'Image');
            return { type: 'image', imageUrl: action.imageUrl, imageTitle: action.title };
          }

          case InteractableActionType.Function: {
            // Handle function action - let module decide what to do
            const moduleInstance = getModuleInstance(moduleId);
            if (moduleInstance?.handleInteractableFunction) {
              const context = createModuleContext(moduleId, locale);
              const result = await moduleInstance.handleInteractableFunction(
                interactable.id,
                action.function,
                context
              );

              if (result.type === 'dialogue') {
                onDialogueSelected?.(result.dialogueId);
                return { type: 'dialogue', dialogueId: result.dialogueId };
              } else if (result.type === 'task') {
                acceptTask(moduleId, result.taskId);
                onTaskSelected?.(result.taskId);
                return { type: 'task', taskId: result.taskId };
              }
              return { type: 'none' };
            } else {
              const error = new ModuleError(
                ErrorCode.MODULE_INVALID,
                moduleId,
                `Interactable ${interactable.id} has Function action but module doesn't implement handleInteractableFunction`
              );
              handleError(error);
              onError?.(error);
              return { type: 'none' };
            }
          }

          default: {
            const error = new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Unknown interactable action type: ${JSON.stringify(action)}`
            );
            handleError(error);
            onError?.(error);
            return { type: 'none' };
          }
        }
      } catch (error) {
        const engineError = error instanceof Error
          ? new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling function action for interactable ${interactable.id}: ${error.message}`,
              { originalError: error }
            )
          : new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling function action for interactable ${interactable.id}`
            );
        handleError(engineError);
        onError?.(engineError);
        return { type: 'none' };
      }
    },
    [moduleId, locale, acceptTask, onTaskSelected, onDialogueSelected, onChatOpen, onImageOpen, onError]
  );

  return {
    handleInteractableAction,
  };
}

