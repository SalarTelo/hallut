import { useState } from 'react';
import type { WorldNode as WorldNodeType } from '../types/WorldMap.types';
import { useI18n } from '../i18n/context.js';
import '../styles/game-theme.css';

interface WorldNodeProps {
  node: WorldNodeType;
  isActive: boolean;
  isAdjacent: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onComplete?: () => void;
}

export const WorldNode = ({ node, isActive, isAdjacent, onClick, onDoubleClick, onComplete }: WorldNodeProps) => {
  const { t } = useI18n();
  const [isHovered, setIsHovered] = useState(false);
  
  const getNodeColor = () => {
    if (isActive) return 'var(--game-accent-error)';
    switch (node.state) {
      case 'completed':
        return 'var(--game-accent-success)';
      case 'unlocked':
        return 'var(--game-world-border)';
      case 'locked':
        return 'var(--game-world-surface)';
      default:
        return 'var(--game-world-border)';
    }
  };

  const getNodeBorder = () => {
    if (isActive) return '4px solid var(--game-text-primary)';
    if (isAdjacent && node.state !== 'locked') return '4px solid var(--game-world-border-light)';
    return '3px solid var(--game-world-border)';
  };

  const isClickable = isAdjacent && node.state !== 'locked';

  return (
    <div
      className="world-node"
      style={{
        position: 'absolute',
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 50 : isAdjacent ? 30 : 20,
      }}
    >
      <div
        className={`node-circle ${isClickable ? 'clickable' : ''} ${isAdjacent ? 'adjacent' : ''}`}
        onClick={isClickable ? onClick : undefined}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '60px',
          height: '60px',
          minWidth: '44px',
          minHeight: '44px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: getNodeColor(),
          border: getNodeBorder(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: node.state === 'locked' ? 'var(--game-text-muted)' : 'var(--game-world-bg)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 235, 59, 0.3)',
          transition: 'transform var(--transition-base), filter var(--transition-base), box-shadow var(--transition-base)',
          cursor: isClickable ? 'pointer' : 'default',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          transform: 'scale(1)',
        }}
        role="button"
        aria-label={node.title || `Node ${node.levelNumber}`}
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {node.state === 'locked' ? '🔒' : node.levelNumber}
      </div>

      {/* Popup on hover */}
      {isHovered && (node.title || node.description) && (
        <div
          className="node-popup"
          role="tooltip"
          aria-label={`${node.title || ''} ${node.description || ''}`}
        >
          {node.title && <div className="node-popup-title">{node.title}</div>}
          {node.description && <div className="node-popup-description">{node.description}</div>}
        </div>
      )}
      
      {/* Complete Level Button (only show on active node that's not completed) */}
      {isActive && node.state !== 'completed' && onComplete && (
        <button
          className="complete-level-btn btn btn-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--spacing-3))',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            backgroundColor: 'var(--game-world-border)',
            color: 'var(--game-world-bg)',
            borderColor: 'var(--game-world-border)',
            fontFamily: 'var(--font-family-pixel)',
            fontSize: 'var(--font-size-xs)',
            padding: 'var(--spacing-2) var(--spacing-4)',
            zIndex: 10,
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          aria-label="Begin task"
        >
          {t.taskDetails.beginTask}
        </button>
      )}

      {node.label && (
        <div
          className="node-label"
          style={{
            position: 'absolute',
            top: isActive && node.state !== 'completed' && onComplete ? 'calc(100% + 50px)' : 'calc(100% + var(--spacing-2))',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--game-text-primary)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255, 235, 59, 0.5)',
            fontFamily: 'var(--font-family-pixel)',
            zIndex: 5,
            maxWidth: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.label}
        </div>
      )}
    </div>
  );
};
