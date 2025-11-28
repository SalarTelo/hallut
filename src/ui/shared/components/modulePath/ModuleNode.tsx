/**
 * ModuleNode Component
 * Individual module node in the worldmap
 */

import type { WorldmapNode } from '@types/worldmap.types.js';
import type { ModuleProgressionState } from '@types/core/moduleProgression.types.js';
import { ModuleTooltip } from './ModuleTooltip.js';
import { formatModuleName } from './utils.js';

export interface ModuleNodeProps {
  /**
   * Node data
   */
  node: WorldmapNode;

  /**
   * Module progression state
   */
  progression: ModuleProgressionState;

  /**
   * Whether this node is hovered
   */
  isHovered: boolean;

  /**
   * Border color
   */
  borderColor: string;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Mouse enter handler
   */
  onMouseEnter: () => void;

  /**
   * Mouse leave handler
   */
  onMouseLeave: () => void;
}

/**
 * ModuleNode component
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
  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';
  const iconShape = node.icon?.shape || 'circle';
  const iconSize = node.icon?.size || 48;

  const getBackgroundColor = () => {
    if (isCompleted) return '#10b981';
    if (isLocked) return '#1f2937';
    return '#FF8C00';
  };

  const getBoxShadow = () => {
    if (isHovered) {
      return `0 0 20px ${borderColor}, 0 0 10px ${borderColor}`;
    }
    if (isCompleted) {
      return `0 0 8px ${borderColor}`;
    }
    return 'none';
  };

  const getIconEmoji = () => {
    if (isLocked) return '🔒';
    if (isCompleted) return '⭐';
    return '📍';
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Module icon */}
      <div
        className={`${
          iconShape === 'circle'
            ? 'rounded-full'
            : iconShape === 'square'
              ? 'rounded-lg'
              : 'rounded-lg'
        } border-2 flex items-center justify-center transition-all duration-300 relative ${
          isLocked ? 'opacity-50 grayscale' : ''
        }`}
        style={{
          width: `${iconSize + 4}px`,
          height: `${iconSize + 4}px`,
          borderColor,
          backgroundColor: getBackgroundColor(),
          boxShadow: getBoxShadow(),
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        {/* Completion checkmark */}
        {isCompleted && !isLocked && (
          <span
            className="absolute -top-1 -right-1 text-xs"
            style={{ color: borderColor }}
          >
            ✓
          </span>
        )}

        <span className="text-2xl">{getIconEmoji()}</span>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <ModuleTooltip
          moduleName={formatModuleName(node.moduleId)}
          summary={node.summary}
          progression={progression}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}

