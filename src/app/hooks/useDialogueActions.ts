/**
 * useDialogueActions Hook
 * Handles dialogue completion actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '@core/module/context.js';
import { processDialogueActions } from '@core/dialogue/processing.js';
import type { ChoiceAction } from '@core/dialogue/types.js';
import type { ModuleData } from '@core/module/types/index.js';
import { DialogueError, ErrorCode } from '@core/errors.js';
import { getTaskId } from '@core/task/utils.js';

export interface UseDialogueActionsOptions {
  moduleId: string;
  moduleData: ModuleData;
  dialogueId: string;
  locale?: string;
  onTaskSubmissionOpen?: (taskId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling dialogue actions
 */
export function useDialogueActions({
  moduleId,
  moduleData,
  dialogueId,
  locale = 'sv',
  onTaskSubmissionOpen,
  onError,
}: UseDialogueActionsOptions) {
  const handleDialogueActions = useCallback(
    async (actions: ChoiceAction | ChoiceAction[]): Promise<boolean> => {
      const context = createModuleContext(moduleId, locale, moduleData);
      let viewChanged = false;

      // Add UI callback for opening task submission
      context.openTaskSubmission = (task) => {
        const taskId = getTaskId(task);
        onTaskSubmissionOpen?.(taskId);
        viewChanged = true;
      };

      try {
        await processDialogueActions(actions, context);
      } catch (error) {
        const dialogueError = error instanceof Error
          ? new DialogueError(
              ErrorCode.DIALOGUE_INVALID,
              dialogueId,
              `Error handling choice action: ${error.message}`,
              moduleId,
              { actions, originalError: error }
            )
          : new DialogueError(
              ErrorCode.DIALOGUE_INVALID,
              dialogueId,
              'Error handling choice action',
              moduleId,
              { actions }
            );
        onError?.(dialogueError);
      }

      return viewChanged;
    },
    [moduleId, moduleData, dialogueId, locale, onTaskSubmissionOpen, onError]
  );

  return {
    handleDialogueActions,
  };
}
