/**
 * useDialogueActions Hook
 * Handles dialogue completion actions and state management
 */

import { useCallback } from 'react';
import { getModuleInstance } from '@engine/moduleRegistry.js';
import { createModuleContext } from '@engine/engineApi.js';
import { useModuleActions } from '@stores/moduleStore/index.js';
import type { DialogueCompletionAction } from '@types/dialogue.types.js';
import { DEFAULT_LOCALE } from '@constants/module.constants.js';
import { DialogueError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';

export interface UseDialogueActionsOptions {
  moduleId: string;
  dialogueId: string;
  locale?: string;
  onTaskSubmissionOpen?: (taskId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling dialogue completion actions
 */
export function useDialogueActions({
  moduleId,
  dialogueId,
  locale = DEFAULT_LOCALE,
  onTaskSubmissionOpen,
  onError,
}: UseDialogueActionsOptions) {
  const { acceptTask, setModuleStateField } = useModuleActions();

  const handleDialogueActions = useCallback(
    async (
      actions: DialogueCompletionAction | DialogueCompletionAction[]
    ): Promise<boolean> => {
      const context = createModuleContext(moduleId, locale);
      let viewChanged = false;

      // Add UI action callback for opening task submission
      context.openTaskSubmission = (taskId: string) => {
        onTaskSubmissionOpen?.(taskId);
        viewChanged = true;
      };

      const actionArray = Array.isArray(actions) ? actions : [actions];

      for (const action of actionArray) {
        try {
          // Handle common actions in engine
          if (action.type === 'accept-task') {
            context.acceptTask(action.taskId);
          } else if (action.type === 'set-state') {
            context.setModuleStateField(action.key, action.value);
          } else if (action.type === 'function') {
            // All function actions go to module handler
            const moduleInstance = getModuleInstance(moduleId);
            if (moduleInstance?.handleDialogueCompletion) {
              await moduleInstance.handleDialogueCompletion(dialogueId, action, context);
            }
          }
        } catch (error) {
          const engineError = error instanceof Error
            ? new DialogueError(
                ErrorCode.DIALOGUE_INVALID,
                dialogueId,
                `Error handling dialogue action: ${error.message}`,
                moduleId,
                { action, originalError: error }
              )
            : new DialogueError(
                ErrorCode.DIALOGUE_INVALID,
                dialogueId,
                'Error handling dialogue action',
                moduleId,
                { action }
              );
          handleError(engineError);
          onError?.(engineError);
          // Continue with other actions even if one fails
        }
      }

      return viewChanged;
    },
    [moduleId, dialogueId, locale, onTaskSubmissionOpen, onError]
  );

  return {
    handleDialogueActions,
  };
}

