/**
 * InteractableIcon Component
 * Configurable shape icon for interactables in module environments
 * Position-based (absolute positioning)
 */

import type { ReactNode } from 'react';
import { PixelIcon } from './PixelIcon.js';

export type IconShape = 'circle' | 'square' | string;

export interface InteractableIconProps {
  /**
   * Icon content (emoji, image, component)
   */
  icon: ReactNode;

  /**
   * Icon shape (circular default)
   */
  shape?: IconShape;

  /**
   * Position in the environment (percentage coordinates)
   */
  position: {
    x: number; // 0-100
    y: number; // 0-100
  };

  /**
   * Label text (shown below icon)
   */
  label?: string;

  /**
   * Whether interactable is locked
   */
  locked?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Size of the icon (in pixels)
   */
  size?: number;
}

/**
 * InteractableIcon component
 */
export function InteractableIcon({
  icon,
  shape = 'circle',
  position,
  label,
  locked = false,
  onClick,
  size = 64,
}: InteractableIconProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded' : '';

  const handleClick = () => {
    if (!locked && onClick) {
      onClick();
    }
  };

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: locked ? 0.6 : 1,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={label || 'Interactable'}
      aria-disabled={locked}
    >
      {/* Icon container */}
      <div
        className={`${shapeClass} bg-orange-400 border-2 border-yellow-400 flex items-center justify-center glow-border-hover`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {locked ? (
          <PixelIcon type="lock" size={Math.floor(size * 0.5)} color="white" />
        ) : (
          <div className="text-2xl">{icon}</div>
        )}
      </div>

      {/* Label button */}
      {label && (
        <div
          className="mt-2 px-2 py-1 bg-blue-900 border border-yellow-400 rounded pixelated text-white text-xs text-center whitespace-nowrap"
        >
          {label}
        </div>
      )}
    </div>
  );
}

