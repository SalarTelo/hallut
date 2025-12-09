/**
 * Loading State Component
 * Full-screen loading state with spinner and message
 */

import { LoadingSpinner } from './LoadingSpinner.js';
import { getBackgroundColorStyle } from '../../../../shared/color.js';

export interface LoadingStateProps {
  /**
   * Loading message
   */
  message?: string;

  /**
   * Spinner size
   */
  spinnerSize?: number;

  /**
   * Border color for spinner
   */
  borderColor?: string;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Loading State component
 */
export function LoadingState({
  message = 'Loading...',
  spinnerSize = 48,
  borderColor,
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
      style={getBackgroundColorStyle()}
    >
      <div className="text-center">
        <LoadingSpinner size={spinnerSize} borderColor={borderColor} className="mx-auto mb-4" />
        <p className="pixelated text-gray-300">{message}</p>
      </div>
    </div>
  );
}
