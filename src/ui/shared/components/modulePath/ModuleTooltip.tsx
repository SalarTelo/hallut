/**
 * Modulverktygstips-komponent
 * Verktygstips som visas vid hovring över en modulnod
 */

import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { ModuleProgressionState } from '@core/state/types.js';
import { PixelIcon } from '../PixelIcon.js';
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

  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';
  const statusKey = isLocked ? 'locked' : isCompleted ? 'completed' : 'unlocked';

  useEffect(() => {
    if (!anchorElement) return;

    const updatePosition = () => {
      const rect = anchorElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
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
      className="fixed"
      style={{ 
        pointerEvents: 'none',
        zIndex: 10,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, calc(-100% - 10px))',
      }}
    >
      <div
        className="bg-black border rounded pixelated text-white shadow-xl min-w-[240px] max-w-[400px] animate-scale-in overflow-hidden"
        style={{
          borderColor,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.9), 0 0 8px ${borderColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
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

      {/* Arrow */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
        style={{
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: `4px solid ${borderColor}`,
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))',
        }}
      />
    </div>
  );

  return createPortal(tooltipContent, document.body);
}
