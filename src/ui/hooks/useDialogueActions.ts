/**
 * useDialogueActions Hook
 * Handles dialogue completion actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '../../core/module/context.js';
import { processDialogueActions } from '../../core/services/dialogue.js';
import type { ChoiceAction } from '../../core/types/dialogue.js';
import { DialogueError, ErrorCode } from '../../core/types/errors.js';

export interface UseDialogueActionsOptions {
  moduleId: string;
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
  dialogueId,
  locale = 'sv',
  onTaskSubmissionOpen,
  onError,
}: UseDialogueActionsOptions) {
  const handleDialogueActions = useCallback(
    async (actions: ChoiceAction | ChoiceAction[]): Promise<boolean> => {
      const context = createModuleContext(moduleId, locale);
      let viewChanged = false;

      // Add UI callback for opening task submission
      context.openTaskSubmission = (task) => {
        const taskId = typeof task === 'string' ? task : task.id;
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
    [moduleId, dialogueId, locale, onTaskSubmissionOpen, onError]
  );

  return {
    handleDialogueActions,
  };
}

