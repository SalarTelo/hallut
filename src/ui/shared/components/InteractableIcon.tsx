/**
 * InteractableIcon Component
 * Configurable shape icon for interactables in module environments
 * Position-based (absolute positioning)
 */

import { useState, type ReactNode } from 'react';
import { PixelIcon, type PixelIconType } from './PixelIcon.js';

export type IconShape = 'circle' | 'square' | string;

export interface InteractableIconProps {
  /**
   * Icon content (PixelIcon type, ReactNode, or string for fallback)
   */
  icon: PixelIconType | ReactNode | string;

  /**
   * Icon shape (circular default)
   */
  shape?: IconShape;

  /**
   * Interactable type for better icon mapping
   */
  interactableType?: 'npc' | 'object' | 'location';

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
  size = 56,
  interactableType,
}: InteractableIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-lg' : '';

  const handleClick = () => {
    if (!locked && onClick) {
      onClick();
    }
  };

  // Different colors for NPCs (circles) vs objects (squares)
  const borderColor = locked 
    ? '#666' 
    : shape === 'circle' 
      ? '#FFD700' // Gold for NPCs
      : '#87CEEB'; // Light blue for objects
  
  // Clean dark backgrounds that complement border colors
  const bgColor = locked 
    ? 'rgba(100, 100, 100, 0.3)' 
    : shape === 'circle'
      ? 'rgba(0, 0, 0, 0.4)' // Dark background for NPCs (gold border)
      : 'rgba(0, 0, 0, 0.4)'; // Dark background for objects (blue border)
  
  // Enhanced layered shadows for depth
  const baseShadow = locked 
    ? `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)`
    : shape === 'circle'
      ? `0 4px 16px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.2)`
      : `0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)`;
  
  // Enhanced glow shadow with inner glow on hover
  const glowShadow = isHovered && !locked
    ? shape === 'circle'
      ? `${baseShadow}, 0 8px 32px ${borderColor}90, 0 0 24px ${borderColor}70, inset 0 0 28px ${borderColor}25, inset 0 3px 6px rgba(255, 255, 255, 0.25)`
      : `${baseShadow}, 0 6px 24px ${borderColor}80, 0 0 20px ${borderColor}60, inset 0 0 24px ${borderColor}20, inset 0 2px 4px rgba(255, 255, 255, 0.2)`
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
          background: bgColor,
          border: `3px solid ${borderColor}`,
          boxShadow: glowShadow,
          position: 'relative',
        }}
      >
        {/* Inner ring for depth (circles only) */}
        {!locked && shape === 'circle' && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '4px',
              border: `1px solid rgba(255, 255, 255, 0.15)`,
              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
        
        {/* Rim lighting effect (circles only) */}
        {!locked && shape === 'circle' && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: '0',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)',
              opacity: isHovered ? 0.4 : 0.25,
            }}
          />
        )}
        
        {/* Inner highlight for depth */}
        {!locked && (
          <div
            className={`absolute ${shapeClass} pointer-events-none`}
            style={{
              inset: shape === 'circle' ? '6px' : '3px',
              background: shape === 'circle'
                ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              opacity: isHovered ? 0.35 : 0.2,
            }}
          />
        )}
        
        {/* Icon content with relative positioning for layering */}
        <div className="relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))' }}>
          {locked ? (
            <PixelIcon type="lock" size={Math.floor(size * 0.5)} color="#999" />
          ) : (() => {
            // Valid PixelIconType values
            const validPixelIconTypes: PixelIconType[] = [
              'shield', 'avatar', 'box', 'star', 'check', 'lock', 'chat',
              'human', 'clipboard', 'image', 'note', 'book', 'message',
              'article', 'pin', 'play', 'reload', 'arrow-right', 'arrow-left', 'close'
            ];
            
            // If icon is a valid PixelIconType, use PixelIcon
            if (typeof icon === 'string' && validPixelIconTypes.includes(icon as PixelIconType)) {
              return (
                <PixelIcon 
                  type={icon as PixelIconType} 
                  size={Math.floor(size * 0.6)} 
                  color="white" 
                />
              );
            }
            
            // If icon is a ReactNode, use it directly
            if (typeof icon !== 'string') {
              return icon;
            }
            
            // Fall back: use default based on interactable type
            const defaultIcon: PixelIconType = interactableType === 'npc' ? 'avatar' : 'box';
            return (
              <PixelIcon 
                type={defaultIcon} 
                size={Math.floor(size * 0.6)} 
                color="white" 
              />
            );
          })()}
        </div>
        
        {/* Pulse effect for unlocked items - only on hover */}
        {!locked && isHovered && (
          <div
            className={`absolute inset-0 ${shapeClass} animate-pulse pointer-events-none`}
            style={{
              border: `2px solid ${borderColor}`,
              opacity: 0.3,
            }}
          />
        )}
      </div>

      {/* Label - polished style */}
      {label && (
        <div
          className="mt-2.5 px-2.5 py-1 rounded-md text-white text-center whitespace-nowrap transition-all duration-200"
          style={{
            fontSize: '11px',
            lineHeight: '1.4',
            fontWeight: 500,
            background: locked 
              ? 'rgba(0, 0, 0, 0.75)' 
              : `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.9) 100%)`,
            border: `1.5px solid ${isHovered && !locked ? borderColor : `${borderColor}60`}`,
            boxShadow: isHovered && !locked
              ? `0 2px 8px rgba(0, 0, 0, 0.5), 0 0 8px ${borderColor}50, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 2px 6px rgba(0, 0, 0, 0.4), 0 0 4px ${borderColor}30, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
            backdropFilter: 'blur(8px)',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.03em',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

