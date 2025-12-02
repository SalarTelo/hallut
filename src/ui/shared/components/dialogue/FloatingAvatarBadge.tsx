/**
 * Floating Avatar Badge Component
 * Circular avatar badge that floats to the left of the dialogue box
 */

import type { ReactNode } from 'react';

export type AvatarType = 'silhouette' | 'image' | 'icon';

export interface FloatingAvatarBadgeProps {
  /**
   * Avatar type
   */
  type: AvatarType;

  /**
   * Avatar data (image URL or icon component)
   */
  data?: string | ReactNode;

  /**
   * Speaker name for alt text
   */
  speaker: string;

  /**
   * Border color for styling
   */
  borderColor: string;
}

/**
 * Floating Avatar Badge component
 * Circular badge that floats to the left of dialogue box
 */
export function FloatingAvatarBadge({
  type,
  data,
  speaker,
  borderColor,
}: FloatingAvatarBadgeProps) {
  const renderContent = () => {
    switch (type) {
      case 'image':
        if (typeof data === 'string') {
          return (
            <img
              src={data}
              alt={speaker}
              className="w-full h-full object-cover rounded-full"
            />
          );
        }
        return null;

      case 'icon':
        return (
          <div className="flex items-center justify-center w-full h-full">
            {data}
          </div>
        );

      case 'silhouette':
      default:
        return (
          <div className="w-full h-full bg-blue-400 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex-shrink-0" />
          </div>
        );
    }
  };

  return (
    <div
      className="absolute left-2 sm:left-1 top-1/2 w-28 h-28 sm:w-20 sm:h-20 rounded-full border overflow-hidden animate-scale-in z-10"
      style={{
        borderColor: borderColor,
        boxShadow: `0 0 12px ${borderColor}40, 0 4px 8px rgba(0, 0, 0, 0.4)`,
        animationDelay: '0.1s',
        transform: 'translateY(-50%)',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {renderContent()}
    </div>
  );
}

