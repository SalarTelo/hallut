/**
 * Modulnod-komponent
 * Individuell modulnod i världskartan
 */

import type { WorldmapNode } from '../../../../core/types/worldmap.js';
import type { ModuleProgressionState } from '../../../../core/state/types.js';
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

  const getIconType = (): 'lock' | 'star' | 'pin' | 'shield' | 'box' | 'check' => {
    // If completed, always show star
    if (isCompleted) return 'star';
    
    // If locked, always show lock icon (tooltip shows specific requirements)
    if (isLocked) return 'lock';
    
    // Unlocked: show icon based on requirement type, or default to pin
    return node.icon?.iconType || 'pin';
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
      {/* Modulikon */}
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
        {/* Slutförandemarkering */}
        {isCompleted && !isLocked && (
          <span
            className="absolute -top-1 -right-1"
            style={{ color: borderColor }}
          >
            <PixelIcon type="check" size={12} color={borderColor} />
          </span>
        )}

        <PixelIcon
          type={getIconType() as 'lock' | 'star' | 'pin' | 'shield' | 'box' | 'check'}
          size={Math.floor(iconSize * 0.6)}
          color="white"
        />
      </div>

      {/* Verktygstips */}
      {isHovered && (
        <ModuleTooltip
          moduleName={formatModuleName(node.moduleId)}
          summary={node.summary}
          progression={progression}
          iconType={node.icon?.iconType}
          unlockRequirementTypes={node.unlockRequirementTypes}
          unlockRequirementDetails={node.unlockRequirementDetails}
          borderColor={borderColor}
        />
      )}
    </div>
  );
}
