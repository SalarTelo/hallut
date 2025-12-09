/**
 * useThemeBorderColor Hook Tests
 * Unit tests for theme border color hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThemeBorderColor } from '../useThemeBorderColor.js';
import * as themeUtils from '@lib/theme.js';

describe('useThemeBorderColor', () => {
  beforeEach(() => {
    vi.spyOn(themeUtils, 'getThemeValue');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return provided borderColor when given', () => {
    const { result } = renderHook(() => useThemeBorderColor('#FF0000'));
    expect(result.current).toBe('#FF0000');
    expect(themeUtils.getThemeValue).not.toHaveBeenCalled();
  });

  it('should use theme value when borderColor is undefined', () => {
    vi.mocked(themeUtils.getThemeValue).mockReturnValue('#FFD700');
    const { result } = renderHook(() => useThemeBorderColor(undefined));
    expect(result.current).toBe('#FFD700');
    expect(themeUtils.getThemeValue).toHaveBeenCalledWith('border-color', '#FFD700');
  });

  it('should use theme value when borderColor is not provided', () => {
    vi.mocked(themeUtils.getThemeValue).mockReturnValue('#00FF00');
    const { result } = renderHook(() => useThemeBorderColor());
    expect(result.current).toBe('#00FF00');
    expect(themeUtils.getThemeValue).toHaveBeenCalledWith('border-color', '#FFD700');
  });

  it('should use custom default value when provided', () => {
    vi.mocked(themeUtils.getThemeValue).mockReturnValue('#0000FF');
    const { result } = renderHook(() => useThemeBorderColor(undefined, '#CUSTOM'));
    expect(result.current).toBe('#0000FF');
    expect(themeUtils.getThemeValue).toHaveBeenCalledWith('border-color', '#CUSTOM');
  });

  it('should prioritize provided borderColor over theme', () => {
    vi.mocked(themeUtils.getThemeValue).mockReturnValue('#THEME');
    const { result } = renderHook(() => useThemeBorderColor('#PROVIDED'));
    expect(result.current).toBe('#PROVIDED');
    expect(themeUtils.getThemeValue).not.toHaveBeenCalled();
  });
});

