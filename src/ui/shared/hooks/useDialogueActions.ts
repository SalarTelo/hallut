/**
 * useDialogueActions Hook
 * Handles dialogue completion actions and state management
 */

import { useCallback } from 'react';
import { createModuleContext } from '@engine/engineApi.js';
import { useModuleActions } from '@stores/moduleStore/index.js';
import type { ChoiceAction } from '@types/choiceTypes.js';
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
 * Hook for handling choice actions
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
      actions: ChoiceAction | ChoiceAction[]
    ): Promise<boolean> => {
      const context = createModuleContext(moduleId, locale);
      let viewChanged = false;

      // Add UI action callback for opening task submission
      context.openTaskSubmission = (task: import('@types/module/moduleConfig.types.js').Task | string) => {
        const taskId = typeof task === 'string' ? task : task.id;
        onTaskSubmissionOpen?.(taskId);
        viewChanged = true;
      };

      const actionArray = Array.isArray(actions) ? actions : [actions];

      for (const action of actionArray) {
        try {
          // Handle common actions in engine
          if (action.type === 'accept-task') {
            context.acceptTask(action.task);
          } else if (action.type === 'set-state') {
            context.setModuleStateField(action.key, action.value);
          } else if (action.type === 'call-function') {
            // Call the handler function directly
            await action.handler(context);
          } else if (action.type === 'go-to') {
            // go-to actions are handled by dialogue routing, not here
            // This is a no-op in the action handler
          }
        } catch (error) {
          const engineError = error instanceof Error
            ? new DialogueError(
                ErrorCode.DIALOGUE_INVALID,
                dialogueId,
                `Error handling choice action: ${error.message}`,
                moduleId,
                { action, originalError: error }
              )
            : new DialogueError(
                ErrorCode.DIALOGUE_INVALID,
                dialogueId,
                'Error handling choice action',
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
    [moduleId, dialogueId, locale, onTaskSubmissionOpen, onError, acceptTask, setModuleStateField]
  );

  return {
    handleDialogueActions,
  };
}

