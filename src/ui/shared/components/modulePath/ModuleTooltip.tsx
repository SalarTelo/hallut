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
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="px-4 py-3 bg-black border-2 rounded-lg pixelated text-white shadow-xl min-w-[180px] max-w-[240px] animate-scale-in"
        style={{
          borderColor,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          boxShadow: `0 6px 20px rgba(0, 0, 0, 0.7), 0 0 12px ${borderColor}50`,
        }}
      >
        {/* Modulnamn */}
        <div className="font-bold text-yellow-300 text-sm mb-2 leading-tight">
          {moduleName}
        </div>

        {/* Sammanfattning */}
        {summary && (
          <div className="text-gray-200 text-xs leading-relaxed mb-2.5 line-clamp-3">
            {summary}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-700/60">
          <span className={`text-xs ${getStatusColor()} font-semibold`}>
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
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${borderColor}`,
          filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4))',
        }}
      />
    </div>
  );
}
