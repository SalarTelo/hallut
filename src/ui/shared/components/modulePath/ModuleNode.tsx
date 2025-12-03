/**
 * Modulnod-komponent
 * Individuell modulnod i världskartan med ren, karthiknande stil
 */

import type { WorldmapNode } from '@core/types/worldmap.js';
import type { ModuleProgressionState } from '@core/state/types.js';
import { useRef, useMemo } from 'react';
import { ModuleTooltip } from './ModuleTooltip.js';
import { PixelIcon } from '../PixelIcon.js';
import { formatModuleName } from './utils.js';

export interface ModuleNodeProps {
  /**
   * Noddata
   */
  node: WorldmapNode;

  /**
   * Modulframstegsstatus
   */
  progression: ModuleProgressionState;

  /**
   * Om denna nod är hovrad
   */
  isHovered: boolean;

  /**
   * Kantfärg
   */
  borderColor: string;

  /**
   * Klickhanterare
   */
  onClick: () => void;

  /**
   * Musenter-hanterare
   */
  onMouseEnter: () => void;

  /**
   * Muslämna-hanterare
   */
  onMouseLeave: () => void;
}

// Constants
const MARKER_SIZE = 48;

// Theme colors matching the application theme
const COLORS = {
  completed: {
    bg: '#1a1510', // Dark brown matching map background
    border: '#10b981', // Green for completed
    icon: '#10b981', // Green icon
  },
  unlocked: {
    bg: '#2a1f1a', // Dark brown matching map background
    border: '#FFD700', // Gold - default theme color
    icon: '#FFD700', // Gold icon
  },
  locked: {
    bg: '#1a1510', // Dark background
    border: '#666666', // Muted gray
    icon: '#888888', // Light gray
  },
  label: {
    bg: '#2a1f1a', // Dark brown matching map
    text: '#D4AF37', // Gold text
    border: '#FFD700', // Gold border
  },
} as const;

/**
 * Modulnod-komponent
 */
export function ModuleNode({
  node,
  progression,
  isHovered,
  borderColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ModuleNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';
  const iconSize = node.icon?.size || 48;
  const moduleName = formatModuleName(node.moduleId);

  // Memoized computed values - theme colors
  const styles = useMemo(() => {
    const stateColors = isCompleted
      ? COLORS.completed
      : isLocked
        ? COLORS.locked
        : COLORS.unlocked;

    // Unlocked uses theme border color (gold), completed uses green, locked uses gray
    const finalBorderColor = isCompleted 
      ? COLORS.completed.border
      : isLocked
        ? COLORS.locked.border
        : borderColor; // Use theme gold for unlocked/default

    // Icons match border colors
    const iconColor = isCompleted
      ? COLORS.completed.icon
      : isLocked
        ? COLORS.locked.icon
        : borderColor; // Use theme gold for unlocked/default

    // Simple shadows for depth - map-like
    const boxShadow = isHovered
      ? `0 6px 20px rgba(0, 0, 0, 0.5), 0 0 0 2px ${finalBorderColor}80`
      : `0 3px 10px rgba(0, 0, 0, 0.4)`;

    return {
      backgroundColor: stateColors.bg,
      borderColor: finalBorderColor,
      iconColor: iconColor,
      boxShadow,
    };
  }, [isLocked, isCompleted, isHovered, borderColor]);

  // Icon type based on state
  const iconType = useMemo((): 'lock' | 'star' | 'pin' | 'shield' | 'box' | 'check' => {
    if (isCompleted) return 'star';
    if (isLocked) return 'lock';
    return node.icon?.iconType || 'pin';
  }, [isCompleted, isLocked, node.icon?.iconType]);


  return (
    <div
      ref={nodeRef}
      className="absolute cursor-pointer transition-all duration-300 flex flex-col items-center"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        zIndex: isHovered ? 10 : 2,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Map marker - circular badge */}
      <div className="relative flex flex-col items-center">
        {/* Main marker circle */}
        <div
          className="relative transition-all duration-300 rounded-full"
          style={{
            width: `${MARKER_SIZE}px`,
            height: `${MARKER_SIZE}px`,
            backgroundColor: styles.backgroundColor,
            border: `3px solid ${styles.borderColor}`,
            boxShadow: styles.boxShadow,
            filter: isLocked ? 'grayscale(100%) opacity(0.7)' : 'none',
          }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-10 pointer-events-none"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(255, 215, 0, 0.1) 2px,
                  rgba(255, 215, 0, 0.1) 4px
                )
              `,
            }}
          />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <PixelIcon
              type={iconType}
              size={Math.floor(iconSize * 0.45)}
              color={styles.iconColor}
              className="drop-shadow-md"
            />
          </div>

          {/* Completion checkmark */}
          {isCompleted && !isLocked && (
            <div
              className="absolute -top-1 -right-1 z-20 rounded-full flex items-center justify-center pointer-events-none"
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: COLORS.completed.bg,
                border: `1px solid ${styles.borderColor}`,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
              }}
            >
              <PixelIcon type="check" size={9} color={styles.iconColor} />
            </div>
          )}
        </div>
      </div>

      {/* Module name label - theme colors */}
      <div
        className="mt-2 px-2.5 py-1 rounded text-xs font-semibold text-center whitespace-nowrap transition-all duration-300 border"
        style={{
          backgroundColor: COLORS.label.bg,
          color: isLocked 
            ? '#666666' 
            : isCompleted 
              ? COLORS.completed.border // Green text for completed
              : COLORS.label.text, // Gold text for unlocked
          borderColor: isLocked 
            ? COLORS.locked.border 
            : isCompleted 
              ? COLORS.completed.border // Green border for completed
              : borderColor, // Gold border for unlocked
          borderWidth: '1px',
          boxShadow: isHovered
            ? `0 3px 8px rgba(0, 0, 0, 0.5)`
            : '0 2px 6px rgba(0, 0, 0, 0.4)',
          opacity: isLocked ? 0.6 : 1,
          transform: isHovered ? 'translateY(0)' : 'translateY(-1px)',
          letterSpacing: '0.3px',
        }}
      >
        {moduleName}
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <ModuleTooltip
          moduleName={moduleName}
          summary={node.summary}
          progression={progression}
          iconType={node.icon?.iconType}
          unlockRequirementDetails={node.unlockRequirementDetails}
          borderColor={borderColor}
          anchorElement={nodeRef.current}
        />
      )}
    </div>
  );
}
