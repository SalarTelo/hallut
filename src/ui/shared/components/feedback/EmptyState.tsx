/**
 * Empty State Component
 * Consistent display of empty state
 */

import { Card } from '../primitives/Card.js';
import { getBackgroundColorStyle } from '@lib/color.js';

export interface EmptyStateProps {
  /**
   * Empty state message
   */
  message: string;

  /**
   * Optional icon or illustration
   */
  icon?: React.ReactNode;

  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Empty State component
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
