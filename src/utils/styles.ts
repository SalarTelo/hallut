/**
 * Style utility system for type-safe style builders and common patterns
 */

import type { CSSProperties } from 'react';

/**
 * Common game-themed style values
 */
export const gameStyles = {
  colors: {
    worldBorder: 'var(--game-world-border)',
    worldBg: 'var(--game-world-bg)',
    textPrimary: 'var(--game-text-primary)',
    textSecondary: 'var(--game-text-secondary)',
    textMuted: 'var(--game-text-muted)',
    accentSuccess: 'var(--game-accent-success)',
    accentWarning: 'var(--game-accent-warning)',
    accentError: 'var(--game-accent-error)',
    surface: 'var(--game-surface)',
    surfaceElevated: 'var(--game-surface-elevated)',
  },
  fonts: {
    pixel: 'var(--font-family-pixel)',
    base: 'var(--font-family-base)',
    mono: 'var(--font-family-mono)',
  },
  spacing: {
    xs: 'var(--spacing-1)',
    sm: 'var(--spacing-2)',
    md: 'var(--spacing-3)',
    lg: 'var(--spacing-4)',
    xl: 'var(--spacing-6)',
    '2xl': 'var(--spacing-8)',
    '3xl': 'var(--spacing-12)',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.6)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.8)',
    glow: '0 0 30px rgba(255, 235, 59, 0.3)',
    glowStrong: '0 0 40px rgba(255, 235, 59, 0.6)',
  },
} as const;

/**
 * Combine multiple style objects into one
 */
export function combineStyles(...styles: Array<CSSProperties | undefined | null | false>): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean)) as CSSProperties;
}

/**
 * Create game-themed surface style
 */
export function createGameSurface(elevated = false): CSSProperties {
  return {
    backgroundColor: elevated ? gameStyles.colors.surfaceElevated : gameStyles.colors.surface,
    border: `3px solid ${gameStyles.colors.worldBorder}`,
    borderRadius: 'var(--radius-xl)',
    padding: gameStyles.spacing.lg,
    color: gameStyles.colors.textPrimary,
  };
}

/**
 * Create game-themed text style
 */
export function createGameText(size: 'xs' | 'sm' | 'base' | 'lg' = 'base', pixel = false): CSSProperties {
  return {
    fontFamily: pixel ? gameStyles.fonts.pixel : gameStyles.fonts.base,
    fontSize: `var(--font-size-${size})`,
    color: gameStyles.colors.textPrimary,
    lineHeight: 'var(--line-height-normal)',
  };
}

/**
 * Create game-themed button style
 */
export function createGameButton(variant: 'primary' | 'outline' | 'ghost' = 'primary'): CSSProperties {
  const base: CSSProperties = {
    fontFamily: gameStyles.fonts.pixel,
    fontSize: 'var(--font-size-sm)',
    padding: `${gameStyles.spacing.sm} ${gameStyles.spacing.md}`,
    borderRadius: 'var(--radius-md)',
    border: `2px solid ${gameStyles.colors.worldBorder}`,
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        backgroundColor: gameStyles.colors.worldBorder,
        color: gameStyles.colors.worldBg,
      };
    case 'outline':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: gameStyles.colors.worldBorder,
      };
    case 'ghost':
      return {
        ...base,
        backgroundColor: 'transparent',
        border: 'none',
        color: gameStyles.colors.textPrimary,
      };
  }
}

/**
 * Create game-themed card style
 */
export function createGameCard(elevated = false): CSSProperties {
  return combineStyles(
    createGameSurface(elevated),
    {
      boxShadow: elevated ? gameStyles.shadows.lg : gameStyles.shadows.md,
    }
  );
}

/**
 * Create centered container style
 */
export function createCenteredContainer(maxWidth = '1000px'): CSSProperties {
  return {
    maxWidth,
    margin: '0 auto',
    width: '100%',
    padding: `0 ${gameStyles.spacing.lg}`,
  };
}

/**
 * Create full-width container style
 */
export function createFullWidthContainer(): CSSProperties {
  return {
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };
}

/**
 * Create flex container style
 */
export function createFlexContainer(
  direction: 'row' | 'column' = 'row',
  align: 'start' | 'center' | 'end' | 'stretch' = 'start',
  justify: 'start' | 'center' | 'end' | 'space-between' = 'start',
  gap?: string
): CSSProperties {
  return {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    ...(gap && { gap }),
  };
}

