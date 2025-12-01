/**
 * Modulverktygstips-komponent
 * Verktygstips som visas vid hovring över en modulnod
 */

import type { ModuleProgressionState } from '../../../../core/state/types.js';
import { PixelIcon } from '../PixelIcon.js';
import { getModule } from '../../../../core/module/registry.js';
import { formatModuleName } from './utils.js';

export interface ModuleTooltipProps {
  /**
   * Modulnamn att visa
   */
  moduleName: string;

  /**
   * Sammanfattningstext
   */
  summary?: string;

  /**
   * Modulframstegsstatus
   */
  progression: ModuleProgressionState;

  /**
   * Ikontyp baserat på unlock requirement (för att visa låstyp)
   */
  iconType?: 'lock' | 'shield' | 'box' | 'pin' | 'star';

  /**
   * Array av requirement types för komplexa krav (stackas)
   */
  unlockRequirementTypes?: Array<'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom'>;

  /**
   * Detaljerad information om unlock requirements
   */
  unlockRequirementDetails?: Array<{
    type: 'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom';
    moduleId?: string;
    taskName?: string;
    hint?: string;
  }>;

  /**
   * Kantfärg
   */
  borderColor: string;
}

/**
 * Modulverktygstips-komponent
 */
export function ModuleTooltip({
  moduleName,
  summary,
  progression,
  iconType,
  unlockRequirementDetails,
  borderColor,
}: ModuleTooltipProps) {
  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';

  interface RequirementDisplay {
    prefix: string;
    subject?: string;
  }

  const getRequirementDisplay = (detail: {
    type: 'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom';
    moduleId?: string;
    taskName?: string;
    hint?: string;
  }): RequirementDisplay => {
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
  };

  const getLockRequirements = (): RequirementDisplay[] => {
    if (!isLocked) return [];
    
    // If we have detailed requirement info, use that (shows individual requirements)
    if (unlockRequirementDetails && unlockRequirementDetails.length > 0) {
      return unlockRequirementDetails.map(getRequirementDisplay);
    }
    
    // Fallback to iconType for simple requirements
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
  };

  const lockRequirements = getLockRequirements();

  const getStatusColor = () => {
    if (isLocked) return 'text-red-400';
    if (isCompleted) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusIconType = (): 'lock' | 'check' | 'play' => {
    if (isLocked) return 'lock';
    if (isCompleted) return 'check';
    return 'play';
  };

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="bg-black border-2 rounded pixelated text-white shadow-xl min-w-[240px] max-w-[400px] animate-scale-in overflow-hidden"
        style={{
          borderColor,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.9), 0 0 8px ${borderColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        }}
      >
        {/* Header with module name - Prominent */}
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

        {/* Content area */}
        <div className="px-4 py-3">
          {/* Summary - Secondary information */}
          {summary && (
            <div className="text-gray-400 text-[10px] leading-relaxed mb-3 line-clamp-2">
              {summary}
            </div>
          )}

          {/* Status and requirements section */}
          <div className="space-y-2.5">
            {/* Status badge - Clear visual indicator */}
            <div 
              className="flex items-center gap-2 px-2 py-1.5 rounded"
              style={{
                backgroundColor: isLocked 
                  ? 'rgba(239, 68, 68, 0.15)' 
                  : isCompleted 
                    ? 'rgba(34, 197, 94, 0.15)' 
                    : 'rgba(234, 179, 8, 0.15)',
                border: `1px solid ${isLocked ? 'rgba(239, 68, 68, 0.3)' : isCompleted ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              }}
            >
              <PixelIcon
                type={getStatusIconType()}
                size={11}
                color="currentColor"
                className={getStatusColor()}
              />
              <span className={`text-[11px] ${getStatusColor()} font-bold leading-none`}>
                {isLocked ? 'Låst' : isCompleted ? 'Slutförd' : 'Tillgänglig'}
              </span>
            </div>
            
            {/* Lock requirements - Clear list */}
            {isLocked && lockRequirements.length > 0 && (
              <div className="space-y-1.5 pt-0.5">
                <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5">
                  Krav:
                </div>
                {lockRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className="flex items-baseline gap-2 pl-1"
                  >
                    <span 
                      className="text-red-400 text-[10px] flex-shrink-0 leading-none font-bold"
                      style={{ marginTop: '2px' }}
                    >
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

      {/* Arrow pointing down */}
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
}
