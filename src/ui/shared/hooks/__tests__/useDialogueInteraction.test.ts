/**
 * useDialogueInteraction Hook Tests
 * Unit tests for dialogue interaction hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDialogueInteraction } from '../useDialogueInteraction.js';

describe('useDialogueInteraction', () => {
  const mockOptions = {
    isTyping: false,
    isLastLine: false,
    hasChoices: false,
    skipTypewriter: vi.fn(),
    onContinue: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dialogueRef and handleClick', () => {
    const { result } = renderHook(() => useDialogueInteraction(mockOptions));

    expect(result.current.dialogueRef).toBeDefined();
    expect(result.current.handleClick).toBeDefined();
    expect(typeof result.current.handleClick).toBe('function');
  });

  it('should skip typewriter on click when typing', () => {
    const skipTypewriter = vi.fn();
    const { result } = renderHook(() =>
      useDialogueInteraction({
        ...mockOptions,
        isTyping: true,
        skipTypewriter,
      })
    );

    result.current.handleClick();

    expect(skipTypewriter).toHaveBeenCalled();
  });

  it('should continue on click when not typing and not last line', () => {
    const onContinue = vi.fn();
    const { result } = renderHook(() =>
      useDialogueInteraction({
        ...mockOptions,
        isTyping: false,
        isLastLine: false,
        onContinue,
      })
    );

    result.current.handleClick();

    expect(onContinue).toHaveBeenCalled();
  });

  it('should not continue when typing', () => {
    const onContinue = vi.fn();
    const { result } = renderHook(() =>
      useDialogueInteraction({
        ...mockOptions,
        isTyping: true,
        onContinue,
      })
    );

    result.current.handleClick();

    expect(onContinue).not.toHaveBeenCalled();
  });
});

