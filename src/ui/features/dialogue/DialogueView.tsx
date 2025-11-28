/**
 * Dialogue View Component
 * Renders dialogue with line-by-line progression
 * Uses dialogueStore for state management
 */

import { useEffect, useState } from 'react';
import { useDialogueStore, useDialogueActions } from '@stores/dialogueStore.js';
import { DialogueBox } from '@ui/shared/components/DialogueBox.js';
import { getThemeValue } from '@utils/theme.js';

export interface DialogueViewProps {
  /**
   * Dialogue ID
   */
  dialogueId: string;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Dialogue config
   */
  config: {
    id: string;
    speaker: string;
    greeting: string[];
    choices?: import('../../../types/dialogue.types.js').DialogueChoice[];
    onComplete?: import('../../../types/dialogue.types.js').DialogueCompletionAction | import('../../../types/dialogue.types.js').DialogueCompletionAction[];
  };

  /**
   * Callback when dialogue completes
   */
  onComplete?: () => void;

  /**
   * Callback to handle choice actions
   * Returns true if a view change occurred (e.g., task submission opened)
   */
  onChoiceAction?: (action: import('../../../types/dialogue.types.js').DialogueCompletionAction | import('../../../types/dialogue.types.js').DialogueCompletionAction[]) => boolean | Promise<boolean> | void | Promise<void>;

  /**
   * Auto-advance delay (ms). If 0, requires manual click
   */
  autoAdvanceDelay?: number;
}

/**
 * Dialogue View component
 */
export function DialogueView({
  dialogueId,
  moduleId,
  config,
  onComplete,
  onChoiceAction,
  autoAdvanceDelay = 0,
}: DialogueViewProps) {
  const [isActive, setIsActive] = useState(false);
  const { startDialogue, endDialogue, advanceDialogue } = useDialogueActions();
  const activeDialogue = useDialogueStore((store) => store.getActiveDialogue(dialogueId));

  // Start dialogue when component mounts
  useEffect(() => {
    if (!isActive && config) {
      startDialogue(moduleId, dialogueId, config);
      setIsActive(true);
    }
  }, [dialogueId, moduleId, config, isActive, startDialogue]);

  const handleNext = () => {
    if (isActive && activeDialogue) {
      advanceDialogue(dialogueId);
    }
  };

  // Auto-advance if enabled
  useEffect(() => {
    if (autoAdvanceDelay > 0 && isActive && activeDialogue) {
      const maxLines = config.greeting?.length || 0;
      const currentIndex = activeDialogue.currentLineIndex;

      if (currentIndex < maxLines - 1) {
        const timer = setTimeout(() => {
          handleNext();
        }, autoAdvanceDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [autoAdvanceDelay, isActive, activeDialogue, config.greeting, dialogueId]);

  // Handle dialogue completion
  useEffect(() => {
    if (isActive && activeDialogue) {
      const maxLines = config.greeting?.length || 0;
      const currentIndex = activeDialogue.currentLineIndex;
      
      if (currentIndex >= maxLines) {
        // Dialogue completed
        setIsActive(false);
        endDialogue(dialogueId);
        onComplete?.();
      }
    }
  }, [isActive, activeDialogue, config.greeting, dialogueId, endDialogue, onComplete]);

  const handleEnd = () => {
    setIsActive(false);
    endDialogue(dialogueId);
    onComplete?.();
  };

  if (!isActive || !activeDialogue) {
    return null;
  }

  const currentLineIndex = activeDialogue.currentLineIndex;
  const lines = config.greeting || [];
  const borderColor = getThemeValue('border-color', '#FFD700');

  // Convert dialogue choices to DialogueBox choices
  // If no choices provided, auto-generate a default "Continue" choice
  const dialogueChoices = config.choices && config.choices.length > 0
    ? config.choices
    : [{ text: 'Continue', action: null }];

  const choices = dialogueChoices.map((choice) => ({
    text: choice.text,
    action: async () => {
      let viewChanged = false;
      // Handle choice action if it's not null
      if (choice.action !== null) {
        if (onChoiceAction) {
          const result = await onChoiceAction(choice.action);
          // If onChoiceAction returns true, it means a view change occurred
          viewChanged = result === true;
        }
      }
      // Only close dialogue if view wasn't changed (e.g., task submission opened)
      // If view changed, the new view will handle closing the dialogue
      if (!viewChanged) {
        handleEnd();
      } else {
        // Still need to clean up dialogue state even if view changed
        setIsActive(false);
        endDialogue(dialogueId);
      }
    },
  }));

  // Get interactable for avatar (if available)
  // For now, use silhouette as default
  const avatarType: 'silhouette' | 'image' | 'icon' = 'silhouette';
  const avatarData = undefined; // Can be enhanced to get from interactable config

  return (
    <DialogueBox
      speaker={config.speaker}
      avatarType={avatarType}
      avatarData={avatarData}
      lines={lines}
      currentLineIndex={currentLineIndex}
      onContinue={currentLineIndex < lines.length - 1 ? handleNext : handleEnd}
      choices={choices}
      borderColor={borderColor}
    />
  );
}

