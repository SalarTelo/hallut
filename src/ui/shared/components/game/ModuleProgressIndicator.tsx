/**
 * Module Progress Indicator Component
 * Displays progress for current module with task counter and progress bar
 */

import { useMemo } from 'react';
import { PixelIcon } from '../icons/PixelIcon.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import type { ModuleData } from '@core/module/types/index.js';
import { useModuleActions } from '@app/hooks/useModuleActions.js';

export interface ModuleProgressIndicatorProps {
  /**
   * Module data
   */
  moduleData: ModuleData;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Border color (defaults to theme)
   */
  borderColor?: string;
}

/**
 * Module Progress Indicator component
 */
export function ModuleProgressIndicator({
  moduleData,
  moduleId,
  borderColor,
}: ModuleProgressIndicatorProps) {
  const { isTaskCompleted, isModuleCompleted } = useModuleActions();
  const borderColorValue = useThemeBorderColor(borderColor);

  // Calculate progress
  const progress = useMemo(() => {
    const totalTasks = moduleData.tasks.length;
    if (totalTasks === 0) {
      return {
        completed: 0,
        total: 0,
        percentage: 100,
        isCompleted: isModuleCompleted(moduleId),
      };
    }

    const completedTasks = moduleData.tasks.filter((task) =>
      isTaskCompleted(moduleId, task.id)
    ).length;

    const percentage = Math.round((completedTasks / totalTasks) * 100);
    const isCompleted = isModuleCompleted(moduleId);

    return {
      completed: completedTasks,
      total: totalTasks,
      percentage,
      isCompleted,
    };
  }, [moduleData.tasks, moduleId, isTaskCompleted, isModuleCompleted]);

  if (progress.total === 0) {
    return null;
  }

  // Get header height from CSS variable, fallback to 48px if not set
  const headerHeight = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--module-header-height').trim() || '48px'
    : '48px';
  
  // Add 16px spacing below header
  const topPosition = `calc(${headerHeight} + 16px)`;

  return (
    <div
      className="fixed left-3 z-30 rounded-lg border px-3.5 py-2.5 min-w-[180px] opacity-75 hover:opacity-100 transition-opacity duration-200"
      style={{
        top: topPosition,
        borderColor: `${borderColorValue}50`,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.4)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PixelIcon
            type={progress.isCompleted ? 'check' : 'star'}
            size={14}
            color={`${borderColorValue}85`}
          />
          <span className="text-xs font-medium text-gray-300">
            Tasks
          </span>
        </div>
        {progress.isCompleted && (
          <div
            className="px-2 py-0.5 rounded text-[10px] font-medium"
            style={{
              backgroundColor: `${borderColorValue}20`,
              color: `${borderColorValue}95`,
              border: `1px solid ${borderColorValue}40`,
            }}
          >
            Complete
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">
            {progress.completed} / {progress.total} tasks
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: `${borderColorValue}80` }}
          >
            {progress.percentage}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${borderColorValue}25`,
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress.percentage}%`,
              backgroundColor: progress.isCompleted
                ? `${borderColorValue}75`
                : `${borderColorValue}60`,
            }}
          />
        </div>
      </div>

      {/* Completion message */}
      {progress.isCompleted && (
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <PixelIcon type="check" size={11} color={`${borderColorValue}70`} />
          <span>Module complete</span>
        </div>
      )}
    </div>
  );
}

