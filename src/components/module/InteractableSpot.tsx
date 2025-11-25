import { useState, useRef, useEffect } from 'react';
import type { Interactable } from '../../types/interactable.types.js';
import { InteractableType } from '../../types/interactable.types.js';
import { useModuleStore } from '../../store/moduleStore.js';
import type { Task } from '../../types/module.types.js';
import '../../styles/game-theme.css';

export interface InteractableSpotProps {
  interactable: Interactable;
  onClick: () => void;
}

export function InteractableSpot({ interactable, onClick }: InteractableSpotProps) {
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const currentModule = useModuleStore((state) => state.currentModule);
  const moduleProgress = useModuleStore((state) => 
    currentModuleId ? state.getProgress(currentModuleId) : null
  );
  const moduleState = moduleProgress?.state || {};
  const moduleData = currentModule;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ left?: string; right?: string; top?: string; bottom?: string; transform?: string }>({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if interactable is locked
  const isLocked = (() => {
    if (!interactable.locked) return false;
    
    const unlockRequirement = interactable.unlockRequirement;
    if (!unlockRequirement) return false;
    
    // Check different requirement types
    switch (unlockRequirement.type) {
      case 'task': {
        const completedTasks = moduleState.completedTasks || [];
        return !completedTasks.includes(unlockRequirement.task);
      }
      case 'password': {
        const unlockPassword = moduleState.unlockPassword;
        return unlockPassword !== unlockRequirement.password;
      }
      case 'storyReady': {
        return !moduleState.hasStoryReady;
      }
      case 'custom': {
        const fieldValue = (moduleState as Record<string, unknown>)[unlockRequirement.field];
        // If value is undefined, check if field exists (is not undefined)
        if (unlockRequirement.value === undefined) {
          return fieldValue === undefined;
        }
        return fieldValue !== unlockRequirement.value;
      }
      default:
        return false;
    }
  })();
  
  // Check if interactable should show exclamation mark (has next task to give)
  const shouldShowExclamation = (() => {
    // Only show for dialogue-type interactables with tasks assigned
    if (interactable.action.type !== 'dialogue' || !interactable.tasks || interactable.tasks.length === 0) {
      return false;
    }
    
    // Don't show if there's a current task (task already accepted)
    if (moduleState.currentTaskId) {
      return false;
    }
    
    // Find next incomplete task
    const completedTasks = moduleState.completedTasks || [];
    const allTasks = moduleData?.tasks || [];
    const nextTask = allTasks
      .sort((a, b) => a.order - b.order)
      .find(task => !completedTasks.includes(task.id));
    
    if (!nextTask) {
      return false; // All tasks completed
    }
    
    // Check if this interactable's tasks array includes the next task
    return interactable.tasks.includes(nextTask.id);
  })();
  
  // Get requirement text for tooltip
  const getRequirementText = () => {
    if (!isLocked) return null;
    
    const unlockRequirement = interactable.unlockRequirement;
    if (!unlockRequirement) return null;
    
    // Use custom message if provided, otherwise generate default
    if (unlockRequirement.message) {
      return unlockRequirement.message;
    }
    
    // Generate requirement text based on type
    switch (unlockRequirement.type) {
      case 'task': {
        // Try to get task name from module data
        let taskName = unlockRequirement.task;
        if (moduleData?.tasks) {
          const task = moduleData.tasks.find(t => t.id === unlockRequirement.task);
          if (task) {
            taskName = task.name;
          }
        }
        return `Requirement: Finish ${taskName}`;
      }
      case 'password': {
        return 'Requirement: Obtain the password';
      }
      case 'storyReady': {
        return 'Requirement: Generate your story first';
      }
      case 'custom': {
        // Try to make a readable requirement text from field name
        const fieldName = unlockRequirement.field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        return `Requirement: Complete ${fieldName}`;
      }
      default:
        return 'Requirement: Complete prerequisite';
    }
  };

  // Calculate tooltip position to avoid clipping
  useEffect(() => {
    if (!showTooltip || !tooltipRef.current || !containerRef.current) {
      setTooltipPosition({});
      return;
    }

    const tooltip = tooltipRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Force a reflow to get accurate tooltip dimensions
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.visibility = 'visible';
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16; // Minimum distance from viewport edge
    
    const newPosition: typeof tooltipPosition = {};
    
    // Calculate horizontal position
    const tooltipWidth = tooltipRect.width;
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const leftSpace = containerCenterX;
    const rightSpace = viewportWidth - containerCenterX;
    
    let tooltipLeft: number;
    
    if (leftSpace < tooltipWidth / 2 + padding) {
      // Too close to left edge, align to left with padding
      tooltipLeft = padding;
      newPosition.left = `${tooltipLeft}px`;
      newPosition.transform = 'none';
    } else if (rightSpace < tooltipWidth / 2 + padding) {
      // Too close to right edge, align to right with padding
      tooltipLeft = viewportWidth - tooltipWidth - padding;
      newPosition.left = `${tooltipLeft}px`;
      newPosition.transform = 'none';
    } else {
      // Center it above the container
      tooltipLeft = containerCenterX - tooltipWidth / 2;
      newPosition.left = `${tooltipLeft}px`;
      newPosition.transform = 'none';
    }
    
    // Calculate vertical position
    const tooltipHeight = tooltipRect.height;
    const spaceAbove = containerRect.top;
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spacing = 12; // Space between tooltip and interactable
    
    // Default: show above the interactable
    if (spaceAbove >= tooltipHeight + spacing + padding) {
      // Enough space above, show above
      newPosition.bottom = `${viewportHeight - containerRect.top + spacing}px`;
      newPosition.top = 'auto';
    } else if (spaceBelow >= tooltipHeight + spacing + padding) {
      // Not enough space above, show below instead
      newPosition.top = `${containerRect.bottom + spacing}px`;
      newPosition.bottom = 'auto';
    } else {
      // Not enough space either way, show in the direction with more space
      if (spaceAbove > spaceBelow) {
        newPosition.bottom = `${viewportHeight - containerRect.top + spacing}px`;
        newPosition.top = 'auto';
      } else {
        newPosition.top = `${containerRect.bottom + spacing}px`;
        newPosition.bottom = 'auto';
      }
    }
    
    setTooltipPosition(newPosition);
  }, [showTooltip]);
  
  const getLabel = () => {
    return interactable.name;
  };
  
  const getIcon = () => {
    return interactable.avatar || '📍';
  };

  const getSpotColor = () => {
    if (isLocked) {
      return 'var(--game-text-muted)';
    }
    
    switch (interactable.type) {
      case InteractableType.NPC:
        return 'var(--game-guard)';
      case InteractableType.Object:
        return 'var(--game-accent-info)';
      default:
        return 'var(--game-world-border)';
    }
  };

  return (
    <>
      {/* Hover Tooltip - Rendered outside parent to avoid opacity inheritance */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: tooltipPosition.left || (tooltipPosition.left === undefined ? `${interactable.position.x}%` : undefined),
            right: tooltipPosition.right,
            top: tooltipPosition.top,
            bottom: tooltipPosition.bottom,
            transform: tooltipPosition.transform || (tooltipPosition.left === undefined ? 'translate(-50%, calc(-100% - var(--spacing-3) - 80px))' : 'none'),
            padding: 'var(--spacing-3) var(--spacing-4)',
            backgroundColor: 'var(--game-surface-elevated)',
            border: '3px solid var(--game-world-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-pixel)',
            color: 'var(--game-text-primary)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 235, 59, 0.3)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 100,
            minWidth: '200px',
            textAlign: 'center',
            lineHeight: 'var(--line-height-relaxed)',
            opacity: 1, // Always full opacity
            ...(tooltipPosition.left === undefined && {
              // Fallback: use percentage positioning if no calculated position yet
              position: 'absolute',
              transform: 'translate(-50%, calc(-100% - var(--spacing-3) - 80px))',
            }),
          }}
        >
          <div
            style={{
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: getRequirementText() ? 'var(--spacing-2)' : 0,
              color: isLocked ? 'var(--game-text-muted)' : 'var(--game-world-border)',
            }}
          >
            {getLabel()}
            {isLocked && ' 🔒'}
          </div>
          {getRequirementText() && (
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--game-accent-warning)',
                borderTop: '1px solid var(--game-world-border-light)',
                paddingTop: 'var(--spacing-2)',
                marginTop: 'var(--spacing-2)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              {getRequirementText()}
            </div>
          )}
          {/* Tooltip arrow - show when positioned above (bottom is set) */}
          {tooltipPosition.bottom && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid var(--game-world-border)',
              }}
            />
          )}
          {/* Tooltip arrow - when positioned below (top is set) */}
          {tooltipPosition.top && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '8px solid var(--game-world-border)',
              }}
            />
          )}
        </div>
      )}
      
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          left: `${interactable.position.x}%`,
          top: `${interactable.position.y}%`,
          transform: 'translate(-50%, -50%)',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          opacity: isLocked ? 0.5 : 1,
        }}
        onClick={isLocked ? undefined : onClick}
        onMouseEnter={(e) => {
          if (!isLocked) {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
          }
          // Only show tooltip for locked items to show requirements
          if (isLocked) {
            setShowTooltip(true);
          }
        }}
        onMouseLeave={(e) => {
          if (!isLocked) {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }
          if (isLocked) {
            setShowTooltip(false);
          }
        }}
        role="button"
        aria-label={getLabel()}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
            e.preventDefault();
            onClick();
          }
        }}
      >
      {/* Exclamation mark indicator */}
      {shouldShowExclamation && !isLocked && (
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--game-accent-warning)',
            border: '3px solid var(--game-world-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))',
            animation: 'pulse 1.5s ease-in-out infinite',
            zIndex: 60,
            boxShadow: '0 0 20px rgba(255, 152, 0, 0.6)',
          }}
        >
          ⚠
        </div>
      )}
      
      {/* Main interactable spot */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: getSpotColor(),
          border: `4px solid ${isLocked ? 'var(--game-text-muted)' : 'var(--game-world-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          boxShadow: isLocked 
            ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
            : '0 4px 16px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 235, 59, 0.4)',
          transition: 'all var(--transition-base)',
          position: 'relative',
        }}
      >
        {getIcon()}
        {/* Lock overlay */}
        {isLocked && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '28px',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8))',
            }}
          >
            🔒
          </div>
        )}
      </div>

      {/* Label */}
      {getLabel() && (
        <div
          style={{
            padding: 'var(--spacing-2) var(--spacing-4)',
            backgroundColor: 'var(--game-surface-elevated)',
            border: '2px solid var(--game-world-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-pixel)',
            color: 'var(--game-world-border)',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
          }}
        >
          {getLabel()}
        </div>
      )}

      </div>
    </>
  );
}
