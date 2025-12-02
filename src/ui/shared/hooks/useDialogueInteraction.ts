/**
 * useDialogueInteraction Hook
 * Handles keyboard and click interactions for dialogue boxes
 */

import { useRef, useCallback, useEffect, useState } from 'react';

export interface UseDialogueInteractionOptions {
  /**
   * Whether typewriter is currently typing
   */
  isTyping: boolean;

  /**
   * Whether this is the last line of dialogue
   */
  isLastLine: boolean;

  /**
   * Whether dialogue has choices available
   */
  hasChoices: boolean;

  /**
   * Number of choices available
   */
  choiceCount?: number;

  /**
   * Function to skip typewriter animation
   */
  skipTypewriter: () => void;

  /**
   * Callback when continuing to next line
   */
  onContinue: () => void;

  /**
   * Callback when a choice is selected by keyboard
   */
  onChoiceSelect?: (index: number) => void;

  /**
   * Callback to close dialogue
   */
  onClose?: () => void;
}

export interface UseDialogueInteractionReturn {
  /**
   * Ref to attach to dialogue container
   */
  dialogueRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Click handler for dialogue container
   */
  handleClick: () => void;

  /**
   * Currently selected choice index (for keyboard navigation)
   */
  selectedChoiceIndex: number | null;

  /**
   * Set selected choice index
   */
  setSelectedChoiceIndex: (index: number | null) => void;
}

/**
 * Hook for dialogue interaction handling
 * 
 * @param options - Interaction options
 * @returns Dialogue ref and click handler
 */
export function useDialogueInteraction({
  isTyping,
  isLastLine,
  hasChoices,
  choiceCount = 0,
  skipTypewriter,
  onContinue,
  onChoiceSelect,
  onClose,
}: UseDialogueInteractionOptions): UseDialogueInteractionReturn {
  const dialogueRef = useRef<HTMLDivElement>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  // Reset selected choice when choices change
  useEffect(() => {
    if (!hasChoices || choiceCount === 0) {
      setSelectedChoiceIndex(null);
    } else if (selectedChoiceIndex === null && hasChoices && choiceCount > 0) {
      // Auto-select first choice when choices appear
      setSelectedChoiceIndex(0);
    }
  }, [hasChoices, choiceCount, selectedChoiceIndex]);

  /**
   * Handle click on dialogue box
   */
  const handleClick = useCallback(() => {
    // If typing, skip to end
    if (isTyping) {
      skipTypewriter();
      return;
    }

    // If last line and has choices, don't continue (let user choose)
    if (isLastLine && hasChoices) {
      return;
    }

    // Otherwise, continue to next line
    onContinue();
  }, [isTyping, isLastLine, hasChoices, skipTypewriter, onContinue]);

  /**
   * Handle keyboard events
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Escape key: close dialogue
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onClose) {
          onClose();
        }
        return;
      }

      // If we're on the last line with choices, handle choice navigation
      if (isLastLine && hasChoices && !isTyping && choiceCount > 0) {
        // Arrow keys for navigation
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedChoiceIndex((prev) => {
            const next = prev === null ? 0 : Math.min((prev ?? 0) + 1, choiceCount - 1);
            return next;
          });
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedChoiceIndex((prev) => {
            const next = prev === null ? 0 : Math.max((prev ?? 0) - 1, 0);
            return next;
          });
          return;
        }

        // Number keys (1-9) to select choice directly
        const numKey = parseInt(event.key, 10);
        if (numKey >= 1 && numKey <= 9 && numKey <= choiceCount) {
          event.preventDefault();
          const index = numKey - 1;
          setSelectedChoiceIndex(index);
          if (onChoiceSelect) {
            onChoiceSelect(index);
          }
          return;
        }

        // Enter to select current choice
        if (event.key === 'Enter' && selectedChoiceIndex !== null) {
          event.preventDefault();
          if (onChoiceSelect) {
            onChoiceSelect(selectedChoiceIndex);
          }
          return;
        }
      }

      // Space or Enter to interact
      // Always allow skipping typewriter, but prevent continuing on last line with choices
      if (event.key === ' ' || event.key === 'Enter') {
        // If typing, always allow skipping (even on last line with choices)
        if (isTyping) {
          event.preventDefault();
          handleClick(); // This will call skipTypewriter
          return;
        }
        
        // If not typing and on last line with choices, don't continue (let user choose)
        if (isLastLine && hasChoices) {
          return;
        }
        
        // Otherwise, continue to next line
        event.preventDefault();
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleClick,
    isTyping,
    isLastLine,
    hasChoices,
    choiceCount,
    selectedChoiceIndex,
    skipTypewriter,
    onChoiceSelect,
    onClose,
  ]);

  return {
    dialogueRef,
    handleClick,
    selectedChoiceIndex,
    setSelectedChoiceIndex,
  };
}

