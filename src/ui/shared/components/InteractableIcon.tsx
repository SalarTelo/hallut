/**
 * InteractableIcon Component
 * Configurable shape icon for interactables in module environments
 * Position-based (absolute positioning)
 */

import { useState, type ReactNode } from 'react';
import { PixelIcon } from './PixelIcon.js';

export type IconShape = 'circle' | 'square' | string;

export interface InteractableIconProps {
  /**
   * Icon content (emoji, image, component, or pixel icon type)
   */
  icon: ReactNode | 'shield' | 'avatar' | 'box' | 'star' | 'check' | 'lock' | 'chat';

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
  const [isHovered, setIsHovered] = useState(false);
  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : '';

  const handleClick = () => {
    if (!locked && onClick) {
      onClick();
    }
  };

  const borderColor = locked ? '#666' : '#FFD700';
  const bgColor = locked ? 'rgba(100, 100, 100, 0.3)' : 'rgba(255, 215, 0, 0.2)';

  // Base shadow (subtle, always on)
  const baseShadow = locked 
    ? `0 2px 8px rgba(0, 0, 0, 0.3)`
    : `0 2px 8px rgba(0, 0, 0, 0.4)`;
  
  // Glow shadow (only on hover)
  const glowShadow = isHovered && !locked
    ? `${baseShadow}, 0 4px 20px ${borderColor}60, 0 0 16px ${borderColor}40, inset 0 0 20px ${borderColor}15`
    : baseShadow;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200 flex flex-col items-center"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: isHovered && !locked ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
        opacity: locked ? 0.5 : 1,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={label || 'Interactable'}
      aria-disabled={locked}
      onMouseEnter={() => {
        if (!locked) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* Icon container */}
      <div
        className={`${shapeClass} flex items-center justify-center relative flex-shrink-0 transition-all duration-200`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          border: `3px solid ${borderColor}`,
          boxShadow: glowShadow,
        }}
      >
        {locked ? (
          <PixelIcon type="lock" size={Math.floor(size * 0.5)} color="#999" />
        ) : typeof icon === 'string' && ['shield', 'avatar', 'box', 'star', 'check', 'lock', 'chat'].includes(icon) ? (
          <PixelIcon 
            type={icon as 'shield' | 'avatar' | 'box' | 'star' | 'check' | 'lock' | 'chat'} 
            size={Math.floor(size * 0.6)} 
            color="white" 
          />
        ) : (
          <div className="text-2xl drop-shadow-lg">{icon}</div>
        )}
        {/* Pulse effect for unlocked items - only on hover */}
        {!locked && isHovered && (
          <div
            className={`absolute inset-0 ${shapeClass} animate-pulse`}
            style={{
              border: `2px solid ${borderColor}`,
              opacity: 0.4,
            }}
          />
        )}
      </div>

      {/* Label */}
      {label && (
        <div
          className="mt-3 px-3 py-1.5 rounded-lg text-white text-xs text-center whitespace-nowrap font-medium transition-all duration-200"
          style={{
            backgroundColor: locked ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.85)',
            border: `2px solid ${borderColor}`,
            boxShadow: isHovered && !locked
              ? `0 2px 8px rgba(0, 0, 0, 0.5), 0 0 8px ${borderColor}50`
              : `0 2px 8px rgba(0, 0, 0, 0.5), 0 0 4px ${borderColor}30`,
            backdropFilter: 'blur(4px)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

