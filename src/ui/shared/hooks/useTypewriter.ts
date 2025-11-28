/**
 * useTypewriter Hook
 * Handles typewriter animation effect for text display
 * Provides skip functionality and typing state
 */

import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  /**
   * Text to type out
   */
  text: string;

  /**
   * Typing speed in milliseconds per character
   * @default 30
   */
  speed?: number;

  /**
   * Whether to start typing immediately
   * @default true
   */
  autoStart?: boolean;
}

export interface UseTypewriterReturn {
  /**
   * Currently displayed text (partial as typing progresses)
   */
  displayedText: string;

  /**
   * Whether typing is currently in progress
   */
  isTyping: boolean;

  /**
   * Skip to end of text (completes typing immediately)
   */
  skip: () => void;

  /**
   * Reset and restart typing
   */
  reset: () => void;
}

/**
 * Hook for typewriter animation effect
 * 
 * @param options - Typewriter options
 * @returns Typewriter state and controls
 */
export function useTypewriter({
  text,
  speed = 30,
  autoStart = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textRef = useRef(text);

  // Update text ref when text changes
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Skip to end
  const skip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(textRef.current);
    setIsTyping(false);
  };

  // Reset and restart
  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText('');
    setIsTyping(false);
    
    // Trigger effect by incrementing resetKey
    if (autoStart && textRef.current) {
      setResetKey(prev => prev + 1);
    }
  };

  // Start typing when text changes or reset is triggered (if autoStart is true)
  useEffect(() => {
    if (!autoStart) {
      return;
    }

    // Clean up any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!textRef.current) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Start typing animation
    setIsTyping(true);
    setDisplayedText('');
    let charIndex = 0;

    intervalRef.current = setInterval(() => {
      charIndex += 1;
      const textToShow = textRef.current.substring(0, charIndex);
      setDisplayedText(textToShow);

      if (charIndex >= textRef.current.length) {
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    // Cleanup on unmount or text/reset change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTyping(false);
    };
  }, [text, autoStart, speed, resetKey]);

  return {
    displayedText,
    isTyping,
    skip,
    reset,
  };
}

