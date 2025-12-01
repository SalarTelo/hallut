/**
 * useDialogueInteraction Hook
 * Handles keyboard and click interactions for dialogue boxes
 */

import { useRef, useCallback, useEffect } from 'react';

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
   * Function to skip typewriter animation
   */
  skipTypewriter: () => void;

  /**
   * Callback when continuing to next line
   */
  onContinue: () => void;
}

export interface UseDialogueInteractionReturn {
  /**
   * Ref to attach to dialogue container
   */
  dialogueRef: React.RefObject<HTMLDivElement>;

  /**
   * Click handler for dialogue container
   */
  handleClick: () => void;
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
  skipTypewriter,
  onContinue,
}: UseDialogueInteractionOptions): UseDialogueInteractionReturn {
  const dialogueRef = useRef<HTMLDivElement>(null);

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

      // Space or Enter to interact
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleClick();
      }

      // Escape to skip typewriter
      if (event.key === 'Escape' && isTyping) {
        event.preventDefault();
        skipTypewriter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClick, isTyping, skipTypewriter]);

  return {
    dialogueRef,
    handleClick,
  };
}

