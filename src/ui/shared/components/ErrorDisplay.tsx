/**
 * Error Display Component
 * Consistent error status display with message and actions
 */

import { Card } from './Card.js';
import { Button } from './Button.js';
import { Badge } from './Badge.js';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';
import { getBackgroundColorStyle } from '@lib/color.js';
import { DEFAULT_THEME } from '@config/constants.js';
import { getUserFriendlyMessage } from '@services/errorService.js';

export interface ErrorDisplayProps {
  /**
   * Error object or message
   */
  error: Error | string;

  /**
   * Error title (default: "Error")
   */
  title?: string;

  /**
   * Action button text
   */
  actionLabel?: string;

  /**
   * Action button handler
   */
  onAction?: () => void;

  /**
   * Show error details in dev mode
   */
  showDetails?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Error Display component
 */
export function ErrorDisplay({
  error,
  title = 'Error',
  actionLabel = 'Go Back',
  onAction,
  showDetails = import.meta.env.DEV,
  className = '',
}: ErrorDisplayProps) {
  const borderColor = useThemeBorderColor(undefined, DEFAULT_THEME.BORDER_COLOR);
  const errorMessage = typeof error === 'string' ? error : getUserFriendlyMessage(error);
  const errorObj = typeof error === 'string' ? null : error;

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 ${className}`}
      style={getBackgroundColorStyle()}
    >
      <Card padding="lg" dark pixelated className="max-w-md w-full" borderColor={borderColor}>
        <div className="text-center space-y-4">
          <Badge variant="danger" size="lg">
            {title}
          </Badge>
          <p className="text-gray-300">{errorMessage}</p>
          {showDetails && errorObj && errorObj.stack && (
            <details className="text-left">
              <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                Error Details
              </summary>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-48 text-gray-900">
                {errorObj.stack}
              </pre>
            </details>
          )}
          {onAction && (
            <div className="flex justify-center space-x-2 pt-4">
              <Button variant="primary" pixelated onClick={onAction} size="md">
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
