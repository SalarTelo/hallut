/**
 * ModuleTooltip Component
 * Tooltip shown when hovering over a module node
 */

import type { ModuleProgressionState } from '@types/core/moduleProgression.types.js';

export interface ModuleTooltipProps {
  /**
   * Module name to display
   */
  moduleName: string;

  /**
   * Optional summary text
   */
  summary?: string;

  /**
   * Module progression state
   */
  progression: ModuleProgressionState;

  /**
   * Border color
   */
  borderColor: string;
}

/**
 * ModuleTooltip component
 */
export function ModuleTooltip({
  moduleName,
  summary,
  progression,
  borderColor,
}: ModuleTooltipProps) {
  const isLocked = progression === 'locked';
  const isCompleted = progression === 'completed';

  return (
    <div
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 border-2 rounded-lg pixelated text-white text-sm whitespace-nowrap animate-scale-in shadow-lg"
      style={{
        borderColor,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        boxShadow: `0 0 15px ${borderColor}`,
      }}
    >
      <div className="font-bold mb-1 text-yellow-300">{moduleName}</div>
      {summary && <div className="text-gray-200 text-xs">{summary}</div>}
      <div
        className={`mt-2 pt-2 border-t ${
          isLocked ? 'border-red-500/50' : 'border-yellow-500/30'
        }`}
      >
        <span
          className={`text-xs font-bold ${
            isLocked
              ? 'text-red-400'
              : isCompleted
                ? 'text-green-400'
                : 'text-yellow-400'
          }`}
        >
          {isLocked
            ? '🔒 Locked'
            : isCompleted
              ? '✓ Completed'
              : '▶ Available'}
        </span>
      </div>
    </div>
  );
}

