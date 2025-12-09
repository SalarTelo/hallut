/**
 * Laddningsstatuskomponent
 * Helskärmsladdningsstatus med spinner och meddelande
 */

import { LoadingSpinner } from './LoadingSpinner.js';
import { getBackgroundColorStyle } from '@utils/color.js';
import { DEFAULT_THEME } from '@config/constants.js';

export interface LoadingStateProps {
  /**
   * Laddningsmeddelande
   */
  message?: string;

  /**
   * Spinnerstorlek
   */
  spinnerSize?: number;

  /**
   * Kantfärg för spinner
   */
  borderColor?: string;

  /**
   * Ytterligare className
   */
  className?: string;
}

/**
 * Laddningsstatuskomponent
 */
export function LoadingState({
  message = 'Laddar...',
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
