/**
 * Modulverktygstips-komponent
 * Verktygstips som visas vid hovring över en modulnod
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ModuleProgressionState } from '@core/state/types.js';
import { PixelIcon } from '../../icons/PixelIcon.js';
import { getModule } from '@core/module/registry.js';
import { formatModuleName } from './utils.js';

type RequirementType = 'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom';

interface RequirementDetail {
  type: RequirementType;
  moduleId?: string;
  taskName?: string;
  hint?: string;
}

interface RequirementDisplay {
  prefix: string;
  subject?: string;
}

export interface ModuleTooltipProps {
  moduleName: string;
  summary?: string;
  progression: ModuleProgressionState;
  iconType?: 'lock' | 'shield' | 'box' | 'pin' | 'star';
  unlockRequirementDetails?: RequirementDetail[];
  borderColor: string;
  anchorElement: HTMLElement | null;
}

/**
 * Modulverktygstips-komponent
 */
const STATUS_COLORS = {
  locked: 'text-red-400',
  completed: 'text-green-400',
  unlocked: 'text-yellow-400',
} as const;

const STATUS_BG_COLORS = {
  locked: 'rgba(239, 68, 68, 0.15)',
  completed: 'rgba(34, 197, 94, 0.15)',
  unlocked: 'rgba(234, 179, 8, 0.15)',
} as const;

const STATUS_BORDER_COLORS = {
  locked: 'rgba(239, 68, 68, 0.3)',
  completed: 'rgba(34, 197, 94, 0.3)',
  unlocked: 'rgba(234, 179, 8, 0.3)',
} as const;

function getRequirementDisplay(detail: RequirementDetail): RequirementDisplay {
  switch (detail.type) {
    case 'password':
      return { prefix: 'Lösenord krävs' };
    case 'module-complete':
      if (detail.moduleId) {
        const module = getModule(detail.moduleId);
        const moduleDisplayName = module?.config.manifest.name || formatModuleName(detail.moduleId);
        return { prefix: 'Klarar', subject: moduleDisplayName };
      }
      return { prefix: 'Klarar modul' };
    case 'task-complete':
      if (detail.taskName) {
        return { prefix: 'Klarar', subject: detail.taskName };
      }
      return { prefix: 'Klarar uppgift' };
    case 'state-check':
      return { prefix: 'Tillståndskrav' };
    case 'custom':
      return { prefix: 'Anpassat krav' };
    default:
      return { prefix: '' };
  }
}

export function ModuleTooltip({
  moduleName,
  summary,
  progression,
  iconType,
  unlockRequirementDetails,
  borderColor,
  anchorElement,
}: ModuleTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [transform, setTransform] = useState('translate(-50%, calc(-100% - 10px))');
  const [arrowPosition, setArrowPosition] = useState({ side: 'bottom' as 'top' | 'bottom' | 'left' | 'right', offset: 0 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';
  const statusKey = isLocked ? 'locked' : isCompleted ? 'completed' : 'unlocked';

  useEffect(() => {
    if (!anchorElement) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      const tooltipElement = tooltipRef.current?.querySelector('div') as HTMLElement;
      
      // Get actual dimensions or use safe estimates
      const tooltipWidth = Math.min(tooltipElement?.offsetWidth || 320, window.innerWidth - 32);
      const tooltipHeight = Math.min(tooltipElement?.offsetHeight || 150, window.innerHeight - 32);
      
      const spacing = 10;
      const padding = 16;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const anchorX = rect.left + rect.width / 2;
      const anchorY = rect.top;
      const anchorBottom = rect.bottom;
      
      // Calculate available space
      const spaceAbove = anchorY - padding;
      const spaceBelow = viewportHeight - anchorBottom - padding;
      
      // Determine vertical position
      let tooltipTop: number;
      let verticalTransform: string;
      
      if (spaceAbove >= tooltipHeight + spacing) {
        // Show above
        tooltipTop = anchorY;
        verticalTransform = `calc(-100% - ${spacing}px)`;
      } else if (spaceBelow >= tooltipHeight + spacing) {
        // Show below
        tooltipTop = anchorBottom;
        verticalTransform = `${spacing}px`;
      } else {
        // Not enough space - use best fit and clamp to viewport
        if (spaceAbove > spaceBelow) {
          tooltipTop = Math.max(padding, anchorY - tooltipHeight - spacing);
          verticalTransform = `calc(-100% - ${spacing}px)`;
        } else {
          tooltipTop = Math.min(viewportHeight - padding - tooltipHeight, anchorBottom + spacing);
          verticalTransform = `${spacing}px`;
        }
      }
      
      // Start with centered horizontal position
      let tooltipLeft = anchorX;
      let horizontalTransform = '-50%';
      
      // Calculate where tooltip edges would be with current transform
      const halfWidth = tooltipWidth / 2;
      const leftEdge = tooltipLeft - halfWidth;
      const rightEdge = tooltipLeft + halfWidth;
      
      // Adjust only if it would go outside bounds - shift just enough to fit
      if (leftEdge < padding) {
        // Too close to left edge - shift right just enough
        const shift = padding - leftEdge;
        tooltipLeft = tooltipLeft + shift;
        horizontalTransform = `calc(-50% + ${shift}px)`;
      } else if (rightEdge > viewportWidth - padding) {
        // Too close to right edge - shift left just enough
        const shift = (viewportWidth - padding) - rightEdge;
        tooltipLeft = tooltipLeft + shift;
        horizontalTransform = `calc(-50% + ${shift}px)`;
      }
      
      setPosition({
        top: tooltipTop + window.scrollY,
        left: tooltipLeft + window.scrollX,
      });
      setTransform(`translate(${horizontalTransform}, ${verticalTransform})`);
      
      // Determine arrow position from vertical transform (will be refined after render)
      if (verticalTransform.includes('calc(-100%')) {
        // Tooltip is above anchor - arrow points down
        setArrowPosition({ side: 'bottom', offset: 0 });
      } else {
        // Tooltip is below anchor - arrow points up
        setArrowPosition({ side: 'top', offset: 0 });
      }
    };
    
    // Function to calculate arrow position based on actual tooltip and anchor positions
    const updateArrowPosition = () => {
      const tooltipContainer = tooltipRef.current;
      if (!tooltipContainer) return;
      
      const tooltipRect = tooltipContainer.getBoundingClientRect();
      const anchorRect = anchorElement.getBoundingClientRect();
      
      const anchorX = anchorRect.left + anchorRect.width / 2;
      const anchorY = anchorRect.top + anchorRect.height / 2;
      
      const tooltipCenterX = tooltipRect.left + tooltipRect.width / 2;
      const tooltipCenterY = tooltipRect.top + tooltipRect.height / 2;
      
      // Calculate direction from tooltip to anchor
      const dx = anchorX - tooltipCenterX;
      const dy = anchorY - tooltipCenterY;
      
      let side: 'top' | 'bottom' | 'left' | 'right';
      let offset: number;
      
      // Determine which side of tooltip is closest to anchor
      if (Math.abs(dy) > Math.abs(dx)) {
        // Vertical alignment - arrow on top or bottom
        if (dy < 0) {
          // Anchor is above tooltip - arrow on top pointing up
          side = 'top';
          offset = dx; // Horizontal offset from center
        } else {
          // Anchor is below tooltip - arrow on bottom pointing down
          side = 'bottom';
          offset = dx; // Horizontal offset from center
        }
      } else {
        // Horizontal alignment - arrow on left or right
        if (dx < 0) {
          // Anchor is to the left of tooltip - arrow on left pointing left
          side = 'left';
          offset = dy; // Vertical offset from center
        } else {
          // Anchor is to the right of tooltip - arrow on right pointing right
          side = 'right';
          offset = dy; // Vertical offset from center
        }
      }
      
      // Clamp offset to stay within tooltip bounds (with some margin)
      const maxOffset = side === 'top' || side === 'bottom' 
        ? tooltipRect.width / 2 - 20  // Leave 20px margin from edges
        : tooltipRect.height / 2 - 20;
      offset = Math.max(-maxOffset, Math.min(maxOffset, offset));
      
      setArrowPosition({ side, offset });
    };

    // Initial position with estimates
    updatePosition();
    
    // Verification function to check and fix position after render
    const verifyAndFixPosition = () => {
      const tooltipContainer = tooltipRef.current;
      if (!tooltipContainer) return;
      
      const tooltipRect = tooltipContainer.getBoundingClientRect();
      const padding = 16;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let needsFix = false;
      let currentLeft = position.left - window.scrollX;
      let currentTop = position.top - window.scrollY;
      let currentTransform = transform;
      
      // Check horizontal bounds and shift only if needed
      if (tooltipRect.left < padding) {
        // Shift right just enough to fit
        const shift = padding - tooltipRect.left;
        currentLeft = currentLeft + shift;
        const currentOffset = currentTransform.match(/calc\(-50% \+ ([\d.-]+)px\)/) ? parseFloat(currentTransform.match(/calc\(-50% \+ ([\d.-]+)px\)/)![1]) : 0;
        currentTransform = currentTransform.replace(/translate\([^,]+/, `translate(calc(-50% + ${currentOffset + shift}px)`);
        needsFix = true;
      } else if (tooltipRect.right > viewportWidth - padding) {
        // Shift left just enough to fit
        const shift = (viewportWidth - padding) - tooltipRect.right;
        currentLeft = currentLeft + shift;
        const currentOffset = currentTransform.match(/calc\(-50% \+ ([\d.-]+)px\)/) ? parseFloat(currentTransform.match(/calc\(-50% \+ ([\d.-]+)px\)/)![1]) : 0;
        currentTransform = currentTransform.replace(/translate\([^,]+/, `translate(calc(-50% + ${currentOffset + shift}px)`);
        needsFix = true;
      }
      
      // Check vertical bounds and shift only if needed
      if (tooltipRect.top < padding) {
        // Shift down just enough to fit
        const shift = padding - tooltipRect.top;
        currentTop = currentTop + shift;
        if (currentTransform.includes('calc(-100%')) {
          // Was showing above, adjust
          currentTransform = currentTransform.replace(/calc\(-100% - \d+px\)/, `calc(-100% - ${10 + shift}px)`);
        } else {
          // Was showing below, adjust
          currentTransform = currentTransform.replace(/\d+px\)/, `${10 + shift}px)`);
        }
        needsFix = true;
      } else if (tooltipRect.bottom > viewportHeight - padding) {
        // Shift up just enough to fit
        const shift = tooltipRect.bottom - (viewportHeight - padding);
        currentTop = currentTop - shift;
        if (currentTransform.includes('calc(-100%')) {
          // Was showing above, adjust
          currentTransform = currentTransform.replace(/calc\(-100% - \d+px\)/, `calc(-100% - ${Math.max(10, 10 - shift)}px)`);
        } else {
          // Was showing below, adjust
          currentTransform = currentTransform.replace(/\d+px\)/, `${Math.max(10, 10 - shift)}px)`);
        }
        needsFix = true;
      }
      
      if (needsFix) {
        setPosition({
          top: currentTop + window.scrollY,
          left: currentLeft + window.scrollX,
        });
        setTransform(currentTransform);
      }
      
      // Update arrow position after any fixes
      updateArrowPosition();
    };
    
    // Recalculate after render with actual dimensions
    let rafId1: number;
    let rafId2: number;
    let rafId3: number;
    
    rafId1 = requestAnimationFrame(() => {
      updatePosition();
      rafId2 = requestAnimationFrame(() => {
        updatePosition(); // Final position with accurate measurements
        rafId3 = requestAnimationFrame(() => {
          verifyAndFixPosition(); // Verify and fix if needed
          updateArrowPosition(); // Update arrow to point at anchor
        });
      });
    });
    
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (rafId3) cancelAnimationFrame(rafId3);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorElement]);

  const lockRequirements = useMemo((): RequirementDisplay[] => {
    if (!isLocked) return [];
    
    if (unlockRequirementDetails?.length) {
      return unlockRequirementDetails.map(getRequirementDisplay);
    }
    
    // Fallback to iconType
    switch (iconType) {
      case 'lock':
        return [{ prefix: 'Lösenord krävs' }];
      case 'shield':
        return [{ prefix: 'Modulberoende' }];
      case 'box':
        return [{ prefix: 'Komplext krav' }];
      default:
        return [];
    }
  }, [isLocked, unlockRequirementDetails, iconType]);

  const statusIconType = isLocked ? 'lock' : isCompleted ? 'check' : 'play';

  if (!anchorElement) return null;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="fixed"
      style={{ 
        pointerEvents: 'none',
        zIndex: 10,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: transform,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)',
      }}
    >
      <div
        className="bg-black border rounded pixelated text-white shadow-xl min-w-[240px] max-w-[400px] animate-scale-in overflow-hidden"
        style={{
          borderColor,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.9), 0 0 8px ${borderColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
          // Ensure tooltip content doesn't exceed viewport
          maxWidth: 'min(400px, calc(100vw - 32px))',
          maxHeight: 'min(80vh, calc(100vh - 32px))',
        }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 border-b flex items-center"
          style={{ 
            borderColor: `${borderColor}50`,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderBottomWidth: '2px',
          }}
        >
          <div className="font-bold text-yellow-300 text-sm leading-none tracking-wide uppercase">
            {moduleName}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {summary && (
            <div className="text-gray-400 text-[10px] leading-relaxed mb-3 line-clamp-2">
              {summary}
            </div>
          )}

          <div className="space-y-2.5">
            {/* Status badge */}
            <div 
              className="flex items-center gap-2 p-1 rounded"
              style={{
                backgroundColor: STATUS_BG_COLORS[statusKey],
                border: `1px solid ${STATUS_BORDER_COLORS[statusKey]}`,
              }}
            >
              <PixelIcon
                type={statusIconType}
                size={11}
                color="currentColor"
                className={STATUS_COLORS[statusKey]}
              />
              <span className={`text-[10px] ${STATUS_COLORS[statusKey]} font-bold leading-none`}>
                {isLocked ? 'Låst' : isCompleted ? 'Slutförd' : 'Tillgänglig'}
              </span>
            </div>
            
            {/* Lock requirements */}
            {isLocked && lockRequirements.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5">
                  Krav:
                </div>
                {lockRequirements.map((req, index) => (
                  <div key={index} className="flex items-baseline gap-2 pl-1">
                    <span className="text-red-400 text-[10px] flex-shrink-0 leading-none font-bold" style={{ marginTop: '2px' }}>
                      →
                    </span>
                    <div className="flex-1 text-[10px] leading-snug">
                      {req.subject ? (
                        <span className="text-gray-300">
                          {req.prefix}{' '}
                          <span className="text-yellow-300 font-bold">{req.subject}</span>
                        </span>
                      ) : (
                        <span className="text-gray-300">{req.prefix}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Arrow - dynamically positioned to point towards anchor */}
      <div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          ...(arrowPosition.side === 'top' && {
            top: '-4px',
            left: `calc(50% + ${arrowPosition.offset}px)`,
            transform: 'translateX(-50%)',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: `4px solid ${borderColor}`,
          }),
          ...(arrowPosition.side === 'bottom' && {
            bottom: '-4px',
            left: `calc(50% + ${arrowPosition.offset}px)`,
            transform: 'translateX(-50%)',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `4px solid ${borderColor}`,
          }),
          ...(arrowPosition.side === 'left' && {
            left: '-4px',
            top: `calc(50% + ${arrowPosition.offset}px)`,
            transform: 'translateY(-50%)',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderRight: `4px solid ${borderColor}`,
          }),
          ...(arrowPosition.side === 'right' && {
            right: '-4px',
            top: `calc(50% + ${arrowPosition.offset}px)`,
            transform: 'translateY(-50%)',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: `4px solid ${borderColor}`,
          }),
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))',
        }}
      />
    </div>
  );

  return createPortal(tooltipContent, document.body);
}
