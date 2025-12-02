/**
 * useDialogueInteraction Hook Tests
 * Unit tests for dialogue interaction hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
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

  it('should not continue when on last line with choices', () => {
    const onContinue = vi.fn();
    const { result } = renderHook(() =>
      useDialogueInteraction({
        ...mockOptions,
        isLastLine: true,
        hasChoices: true,
        choiceCount: 2,
        onContinue,
      })
    );

    result.current.handleClick();

    expect(onContinue).not.toHaveBeenCalled();
  });

  describe('Escape key', () => {
    it('should call onClose when Escape is pressed', () => {
      const onClose = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          onClose,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      window.dispatchEvent(event);

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose even when typing', () => {
      const onClose = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isTyping: true,
          onClose,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      window.dispatchEvent(event);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose if not provided', () => {
      renderHook(() => useDialogueInteraction(mockOptions));

      // Should not throw
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      window.dispatchEvent(event);
    });
  });

  describe('Keyboard navigation for choices', () => {
    it('should auto-select first choice when choices appear', async () => {
      const { result, rerender } = renderHook(
        ({ hasChoices, choiceCount }) =>
          useDialogueInteraction({
            ...mockOptions,
            isLastLine: true,
            hasChoices,
            choiceCount,
          }),
        {
          initialProps: { hasChoices: false, choiceCount: 0 },
        }
      );

      expect(result.current.selectedChoiceIndex).toBeNull();

      rerender({ hasChoices: true, choiceCount: 3 });

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });
    });

    it('should navigate down with ArrowDown key', async () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(1);
      });
    });

    it('should navigate up with ArrowUp key', async () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Navigate down first
      act(() => {
        const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(downEvent);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(1);
      });

      // Then navigate up
      act(() => {
        const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
        window.dispatchEvent(upEvent);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });
    });

    it('should not go below last choice', async () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 2,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Navigate to last choice
      act(() => {
        const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(event1);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(1);
      });

      // Try to go further down
      act(() => {
        const event2 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(event2);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(1); // Should stay at last
      });
    });

    it('should not go above first choice', async () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 2,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Try to go up from first choice
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
        window.dispatchEvent(event);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0); // Should stay at first
      });
    });

    it('should select choice directly with number keys (1-9)', async () => {
      const onChoiceSelect = vi.fn();
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 5,
          onChoiceSelect,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Press '3' to select third choice (index 2)
      act(() => {
        const event = new KeyboardEvent('keydown', { key: '3', bubbles: true });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(2);
        expect(onChoiceSelect).toHaveBeenCalledWith(2);
      });
    });

    it('should not select choice with number key if number exceeds choice count', async () => {
      const onChoiceSelect = vi.fn();
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
          onChoiceSelect,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Press '5' when only 3 choices exist
      const event = new KeyboardEvent('keydown', { key: '5', bubbles: true });
      window.dispatchEvent(event);

      // Should not change selection or call onChoiceSelect
      expect(result.current.selectedChoiceIndex).toBe(0);
      expect(onChoiceSelect).not.toHaveBeenCalled();
    });

    it('should select current choice with Enter key', async () => {
      const onChoiceSelect = vi.fn();
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
          onChoiceSelect,
        })
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      // Navigate to second choice
      act(() => {
        const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(downEvent);
      });
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(1);
      });

      // Press Enter to select
      act(() => {
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        window.dispatchEvent(enterEvent);
      });

      expect(onChoiceSelect).toHaveBeenCalledWith(1);
    });

    it('should not handle arrow keys when typing', () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
          isTyping: true,
        })
      );

      const initialIndex = result.current.selectedChoiceIndex;

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        window.dispatchEvent(event);
      });

      // Should not change when typing
      expect(result.current.selectedChoiceIndex).toBe(initialIndex);
    });

    it('should not handle number keys when typing', () => {
      const onChoiceSelect = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
          isTyping: true,
          onChoiceSelect,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: '2', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(onChoiceSelect).not.toHaveBeenCalled();
    });
  });

  describe('Space and Enter for continuing', () => {
    it('should continue with Space when not on last line with choices', () => {
      const onContinue = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: false,
          hasChoices: false,
          onContinue,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(onContinue).toHaveBeenCalled();
    });

    it('should continue with Enter when not on last line with choices', () => {
      const onContinue = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: false,
          hasChoices: false,
          onContinue,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(onContinue).toHaveBeenCalled();
    });

    it('should not continue with Space when on last line with choices and not typing', () => {
      const onContinue = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 2,
          isTyping: false,
          onContinue,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(onContinue).not.toHaveBeenCalled();
    });

    it('should skip typewriter with Space on last line when typing', () => {
      const skipTypewriter = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 2,
          isTyping: true,
          skipTypewriter,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(skipTypewriter).toHaveBeenCalled();
    });

    it('should skip typewriter with Enter on last line when typing', () => {
      const skipTypewriter = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 2,
          isTyping: true,
          skipTypewriter,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(skipTypewriter).toHaveBeenCalled();
    });

    it('should skip typewriter with Space on last line without choices when typing', () => {
      const skipTypewriter = vi.fn();
      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: false,
          isTyping: true,
          skipTypewriter,
        })
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
        window.dispatchEvent(event);
      });

      expect(skipTypewriter).toHaveBeenCalled();
    });
  });

  describe('Input field handling', () => {
    it('should ignore keyboard events when typing in input field', () => {
      const onClose = vi.fn();
      const onContinue = vi.fn();
      
      // Create a mock input element
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          onClose,
          onContinue,
        })
      );

      // Simulate keydown on input
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      window.dispatchEvent(event);

      // Should not trigger dialogue actions
      expect(onClose).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('should ignore keyboard events when typing in textarea', () => {
      const onClose = vi.fn();
      
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();

      renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          onClose,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      Object.defineProperty(event, 'target', { value: textarea, enumerable: true });
      window.dispatchEvent(event);

      expect(onClose).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });
  });

  describe('selectedChoiceIndex state management', () => {
    it('should reset selectedChoiceIndex when choices disappear', async () => {
      const { result, rerender } = renderHook(
        ({ hasChoices, choiceCount }) =>
          useDialogueInteraction({
            ...mockOptions,
            isLastLine: true,
            hasChoices,
            choiceCount,
          }),
        {
          initialProps: { hasChoices: true, choiceCount: 3 },
        }
      );

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      rerender({ hasChoices: false, choiceCount: 0 });

      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBeNull();
      });
    });

    it('should allow manual setting of selectedChoiceIndex', async () => {
      const { result } = renderHook(() =>
        useDialogueInteraction({
          ...mockOptions,
          isLastLine: true,
          hasChoices: true,
          choiceCount: 3,
        })
      );

      // Wait for auto-selection to complete
      await waitFor(() => {
        expect(result.current.selectedChoiceIndex).toBe(0);
      });

      act(() => {
        result.current.setSelectedChoiceIndex(2);
      });

      expect(result.current.selectedChoiceIndex).toBe(2);
    });
  });
});

