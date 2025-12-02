/**
 * useTypewriter Hook Tests
 * Unit tests for typewriter animation hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../useTypewriter.js';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with empty displayed text', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'Hello',
        autoStart: false,
      })
    );

    expect(result.current.displayedText).toBe('');
    expect(result.current.isTyping).toBe(false);
  });

  it('should type out text character by character', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'Hi',
        speed: 10,
      })
    );

    expect(result.current.isTyping).toBe(true);
    expect(result.current.displayedText).toBe('');

    // Advance time for first character
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedText).toBe('H');

    // Advance time for second character
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(result.current.displayedText).toBe('Hi');
    expect(result.current.isTyping).toBe(false);
  });

  it('should allow skipping to end', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'Long text here',
        speed: 100,
      })
    );

    // Start typing
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Skip to end
    act(() => {
      result.current.skip();
    });

    expect(result.current.displayedText).toBe('Long text here');
    expect(result.current.isTyping).toBe(false);
  });

  it('should reset and restart typing when autoStart is true', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'First',
        speed: 10,
        autoStart: true,
      })
    );

    // Complete first text by advancing time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayedText).toBe('First');
    expect(result.current.isTyping).toBe(false);

    // Reset - with autoStart: true, it will restart typing
    act(() => {
      result.current.reset();
    });

    // Should clear and restart typing (since autoStart is true)
    expect(result.current.displayedText).toBe('');
    // After reset with autoStart, typing should restart
    // We need to wait a tick for the effect to run
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isTyping).toBe(true);
  });

  it('should reset without restarting when autoStart is false', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'First',
        speed: 10,
        autoStart: false,
      })
    );

    // Manually start typing
    act(() => {
      result.current.reset(); // Reset increments resetKey but won't auto-start
    });

    // Should clear and NOT start typing (since autoStart is false)
    expect(result.current.displayedText).toBe('');
    expect(result.current.isTyping).toBe(false);
  });

  it('should not auto-start when autoStart is false', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: 'Hello',
        autoStart: false,
      })
    );

    expect(result.current.isTyping).toBe(false);
    expect(result.current.displayedText).toBe('');
  });

  it('should handle empty text', () => {
    const { result } = renderHook(() =>
      useTypewriter({
        text: '',
        autoStart: true,
      })
    );

    expect(result.current.displayedText).toBe('');
    expect(result.current.isTyping).toBe(false);
  });

  it('should handle text changes', () => {
    const { result, rerender } = renderHook(
      ({ text }) =>
        useTypewriter({
          text,
          speed: 10,
        }),
      {
        initialProps: { text: 'First' },
      }
    );

    // Start typing first text
    act(() => {
      vi.advanceTimersByTime(20);
    });

    // Change text
    act(() => {
      rerender({ text: 'Second' });
    });

    // Should reset and start typing new text
    expect(result.current.isTyping).toBe(true);
    expect(result.current.displayedText).toBe('');
  });
});

