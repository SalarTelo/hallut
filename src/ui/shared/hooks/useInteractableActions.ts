/**
 * useInteractableActions Hook
 * Handles interactable action logic
 */

import { useCallback } from 'react';
import { createModuleContext } from '@engine/engineApi.js';
import type { Interactable } from '@types/interactable.types.js';
import { DEFAULT_LOCALE } from '@constants/module.constants.js';
import { ModuleError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';

export interface InteractableActionResult {
  type: 'task' | 'dialogue' | 'chat' | 'image' | 'image-analysis' | 'none';
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
  onImageAnalysisOpen?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling interactable actions
 */
export function useInteractableActions({
  moduleId,
  locale = DEFAULT_LOCALE,
  onDialogueSelected,
  onError,
}: UseInteractableActionsOptions) {

  const handleInteractableAction = useCallback(
    async (interactable: Interactable): Promise<InteractableActionResult> => {
      try {
        // Interactable type uses getDialogue function to determine which dialogue to show
        if (interactable.getDialogue) {
          const context = createModuleContext(moduleId, locale);
          const dialogue = interactable.getDialogue(context);
          onDialogueSelected?.(dialogue.id);
          return { type: 'dialogue', dialogueId: dialogue.id };
        }

        // If no getDialogue, use first dialogue
        const dialogueIds = Object.keys(interactable.dialogues);
        if (dialogueIds.length > 0) {
          const dialogueId = `${interactable.id}-${dialogueIds[0]}`;
          onDialogueSelected?.(dialogueId);
          return { type: 'dialogue', dialogueId };
        }

        return { type: 'none' };
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
    [moduleId, locale, onDialogueSelected, onError]
  );

  return {
    handleInteractableAction,
  };
}

