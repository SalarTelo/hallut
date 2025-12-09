/**
 * Loading Spinner Component
 * Reusable loading spinner with configurable size and color
 */

import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';
import { DEFAULT_THEME } from '@config/constants.js';

export interface LoadingSpinnerProps {
  /**
   * Spinner size in pixels
   */
  size?: number;

  /**
   * Border color (defaults to theme)
   */
  borderColor?: string;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({
  size = 48,
  borderColor,
  className = '',
}: LoadingSpinnerProps) {
  const borderColorValue = useThemeBorderColor(borderColor, DEFAULT_THEME.BORDER_COLOR);

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: borderColorValue,
        borderTopColor: 'transparent',
      }}
      aria-label="Loading"
      role="status"
    />
  );
}

