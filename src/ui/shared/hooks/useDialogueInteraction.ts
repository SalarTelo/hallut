/**
 * useDialogueInteraction Hook
 * Handles keyboard and click interactions for dialogue progression
 */

import { useEffect, useRef, useCallback } from 'react';

export interface UseDialogueInteractionOptions {
  /**
   * Whether text is currently being typed
   */
  isTyping: boolean;

  /**
   * Whether we're on the last line
   */
  isLastLine: boolean;

  /**
   * Whether choices are currently visible
   */
  hasChoices: boolean;

  /**
   * Function to skip the typewriter effect
   */
  skipTypewriter: () => void;

  /**
   * Function to continue to the next line
   */
  onContinue: () => void;
}

export interface UseDialogueInteractionReturn {
  /**
   * Ref to attach to the dialogue container
   */
  dialogueRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Click handler for the dialogue box
   */
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Hook for managing dialogue keyboard and click interactions
 */
export function useDialogueInteraction({
  isTyping,
  isLastLine,
  hasChoices,
  skipTypewriter,
  onContinue,
}: UseDialogueInteractionOptions): UseDialogueInteractionReturn {
  const dialogueRef = useRef<HTMLDivElement>(null);

  // Auto-focus dialogue box
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.focus();
    }
  }, []);

  // Check if choices are showing
  const isShowingChoices = isLastLine && !isTyping && hasChoices;

  // Global keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip modifier keys to avoid accidental triggers
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      // Don't handle if choices are showing
      if (isShowingChoices) {
        return;
      }

      // If currently typing, skip the typewriter
      if (isTyping) {
        e.preventDefault();
        skipTypewriter();
        return;
      }

      // If not typing, advance to next line
      e.preventDefault();
      onContinue();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onContinue, isTyping, isShowingChoices, skipTypewriter]);

  // Click handler
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't handle clicks on choice buttons
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }

      // Don't allow clicking to advance when choices are shown
      if (isShowingChoices) {
        return;
      }

      // If currently typing, skip the typewriter
      if (isTyping) {
        skipTypewriter();
        return;
      }

      // If not typing, advance to next line
      onContinue();
    },
    [isTyping, isShowingChoices, skipTypewriter, onContinue]
  );

  return {
    dialogueRef,
    handleClick,
  };
}

