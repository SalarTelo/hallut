/**
 * useModuleCallbacks Hook
 * Provides callbacks for module interactions
 */

import { useCallback } from 'react';
import { moduleActions } from '@services/actions/index.js';
import { useInteractableActions } from '@ui/shared/hooks/index.js';
import { ModuleError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';
import type { ModuleData, Interactable } from '@types/module/moduleData.types.js';

export interface UseModuleCallbacksOptions {
  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Locale
   */
  locale?: string;

  /**
   * Current module data
   */
  currentModule: ModuleData | null;

  /**
   * Currently selected task ID
   */
  selectedTaskId: string | null;

  /**
   * Navigate to task view
   */
  onNavigateToTask: (taskId: string) => void;

  /**
   * Navigate to dialogue view
   */
  onNavigateToDialogue: (dialogueId: string) => void;

  /**
   * Navigate to interactable view
   */
  onNavigateToInteractable: () => void;

  /**
   * Open chat
   */
  onChatOpen: () => void;

  /**
   * Open image viewer
   */
  onImageOpen: (url: string, title: string) => void;
}

export interface UseModuleCallbacksReturn {
  /**
   * Handle task completion
   */
  handleTaskComplete: (result: { solved: boolean }) => Promise<void>;

  /**
   * Handle interactable click
   */
  handleInteractableClick: (interactableId: string) => Promise<void>;
}

/**
 * Hook for module interaction callbacks
 */
export function useModuleCallbacks({
  moduleId,
  locale,
  currentModule,
  selectedTaskId,
  onNavigateToTask,
  onNavigateToDialogue,
  onNavigateToInteractable,
  onChatOpen,
  onImageOpen,
}: UseModuleCallbacksOptions): UseModuleCallbacksReturn {
  // Handle interactable actions
  const { handleInteractableAction } = useInteractableActions({
    moduleId,
    locale,
    onTaskSelected: onNavigateToTask,
    onDialogueSelected: onNavigateToDialogue,
    onChatOpen,
    onImageOpen,
    onError: (err: unknown) => {
      handleError(err);
    },
  });

  // Handle task completion
  const handleTaskComplete = useCallback(
    async (result: { solved: boolean }) => {
      if (result.solved && selectedTaskId) {
        await moduleActions.completeTask(moduleId, selectedTaskId);
      }
      onNavigateToInteractable();
    },
    [moduleId, selectedTaskId, onNavigateToInteractable]
  );

  // Handle interactable click
  const handleInteractableClick = useCallback(
    async (interactableId: string) => {
      if (!currentModule) {
        const error = new ModuleError(
          ErrorCode.MODULE_INVALID,
          moduleId,
          'No current module available'
        );
        handleError(error);
        return;
      }

      const interactable = currentModule.config.interactables.find(
        (i: Interactable) => i.id === interactableId
      );
      if (!interactable) {
        return;
      }

      await handleInteractableAction(interactable);
    },
    [currentModule, moduleId, handleInteractableAction]
  );

  return {
    handleTaskComplete,
    handleInteractableClick,
  };
}

