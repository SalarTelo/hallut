/**
 * Modulverktygstips-komponent
 * Verktygstips som visas vid hovring över en modulnod
 */

import type { ModuleProgressionState } from '@types/core/moduleProgression.types.js';

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
  borderColor,
}: ModuleTooltipProps) {
  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';

  const getStatusText = () => {
    if (isLocked) return 'Låst';
    if (isCompleted) return 'Slutförd';
    return 'Tillgänglig';
  };

  const getStatusColor = () => {
    if (isLocked) return 'text-red-400';
    if (isCompleted) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusIcon = () => {
    if (isLocked) return '🔒';
    if (isCompleted) return '✓';
    return '▶';
  };

  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="px-2.5 py-2 bg-black border-2 rounded-lg pixelated text-white shadow-xl min-w-[160px] max-w-[200px] animate-scale-in"
        style={{
          borderColor,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.7), 0 0 8px ${borderColor}40`,
        }}
      >
        {/* Modulnamn */}
        <div className="font-bold text-yellow-300 text-xs mb-1.5 leading-tight">
          {moduleName}
        </div>

        {/* Sammanfattning */}
        {summary && (
          <div className="text-gray-200 text-[10px] leading-snug mb-2 line-clamp-3">
            {summary}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-1 pt-1.5 border-t border-gray-700/60">
          <span className={`text-[10px] ${getStatusColor()} font-semibold`}>
            {getStatusIcon()} {getStatusText()}
          </span>
        </div>
      </div>

      {/* Pil nedåt - pekar mot modulnoden */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `5px solid ${borderColor}`,
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))',
        }}
      />
    </div>
  );
}
