/**
 * useModuleActions Hook Tests
 * Unit tests for module actions hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useModuleActions } from '../useModuleActions.js';
import { actions } from '@core/state/actions.js';

// Mock actions
vi.mock('@core/state/actions.js', () => ({
  actions: {
    setCurrentModule: vi.fn(),
    clearCurrentModule: vi.fn(),
  },
}));

describe('useModuleActions', () => {
  it('should return actions object', () => {
    const { result } = renderHook(() => useModuleActions());

    expect(result.current).toBe(actions);
  });

  it('should return same actions instance on re-render', () => {
    const { result, rerender } = renderHook(() => useModuleActions());

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    expect(firstRender).toBe(secondRender);
  });
});

