/**
 * Tomt tillståndskomponent
 * Konsekvent visning av tomt tillstånd
 */

import { Card } from './Card.js';
import { getBackgroundColorStyle } from '@utils/color.js';

export interface EmptyStateProps {
  /**
   * Meddelande för tomt tillstånd
   */
  message: string;

  /**
   * Valfri ikon eller illustration
   */
  icon?: React.ReactNode;

  /**
   * Valfri åtgärdsknapp
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Ytterligare className
   */
  className?: string;
}

/**
 * Tomt tillståndskomponent
 */
export function EmptyState({
  message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
      style={getBackgroundColorStyle()}
    >
      <Card padding="lg" dark pixelated>
        <div className="text-center space-y-4">
          {icon && <div className="flex justify-center">{icon}</div>}
          <p className="text-white">{message}</p>
          {action && (
            <div className="flex justify-center pt-4">
              <button
                onClick={action.onClick}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
