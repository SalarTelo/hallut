/**
 * TaskTracker Component
 * Floating task tracker showing active task details
 */

import { useState } from 'react';
import type { Task } from '@core/task/types.js';
import { PixelIcon } from './PixelIcon.js';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';

export interface TaskTrackerProps {
  activeTask: Task | null;
  borderColor?: string;
}

export function TaskTracker({ activeTask, borderColor }: TaskTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const borderColorValue = useThemeBorderColor(borderColor);

  if (!activeTask) {
    return null;
  }

  const headerHeight = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--module-header-height').trim() || '48px'
    : '48px';
  
  const topPosition = `calc(${headerHeight} + 8px)`;

  return (
    <div 
      className="fixed right-3 z-40"
      style={{
        top: topPosition,
        maxHeight: `calc(100vh - ${headerHeight} - 16px)`,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className="bg-black border-2 rounded-lg overflow-hidden"
        style={{
          width: isExpanded ? '380px' : '320px',
          borderColor: borderColorValue,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)',
          boxShadow: `0 4px 16px rgba(0, 0, 0, 0.8), 0 0 12px ${borderColorValue}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          backdropFilter: 'blur(8px)',
          transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          className="px-2.5 py-2 border-b-2"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}20 0%, ${borderColorValue}08 100%)`,
            boxShadow: `inset 0 1px 0 ${borderColorValue}50`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <PixelIcon type="check" size={14} color={borderColorValue} />
              <h3 className="text-xs font-bold text-yellow-300 pixelated">
                Active Task
              </h3>
            </div>
            <div
              className="px-2 py-0.5 rounded border text-[10px] font-bold pixelated"
              style={{
                borderColor: borderColorValue,
                backgroundColor: `${borderColorValue}20`,
                color: borderColorValue,
                boxShadow: `0 0 6px ${borderColorValue}30`,
              }}
            >
              Active
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-2.5 py-2.5">
          {/* Task name */}
          <h4 className="text-sm font-bold text-white mb-2 leading-tight pixelated">
            {activeTask.name}
          </h4>

          {/* Description */}
          {activeTask.description && (
            <div 
              className="overflow-hidden mb-2"
              style={{
                maxHeight: isExpanded ? '150px' : '2.5rem',
                transition: 'max-height 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeTask.description}
              </p>
            </div>
          )}

          {/* Expanded content */}
          <div
            className="overflow-hidden"
            style={{
              maxHeight: isExpanded ? '800px' : '0px',
              opacity: isExpanded ? 1 : 0,
              transition: 'max-height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="space-y-2.5 pt-1.5">
              {/* Requirements */}
              {activeTask.overview?.requirements && (
                <div className="pt-2 border-t" style={{ borderColor: `${borderColorValue}40` }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div
                      className="w-0.5 h-4 rounded"
                      style={{ backgroundColor: borderColorValue }}
                    />
                    <h5 className="text-[10px] font-bold uppercase tracking-wider pixelated" style={{ color: borderColorValue }}>
                      Requirements
                    </h5>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed pl-2.5">
                    {activeTask.overview.requirements}
                  </p>
                </div>
              )}

              {/* Goals */}
              {activeTask.overview?.goals && activeTask.overview.goals.length > 0 && (
                <div className="pt-2 border-t" style={{ borderColor: `${borderColorValue}40` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div
                      className="w-0.5 h-4 rounded"
                      style={{ backgroundColor: borderColorValue }}
                    />
                    <h5 className="text-[10px] font-bold uppercase tracking-wider pixelated" style={{ color: borderColorValue }}>
                      Goals
                    </h5>
                  </div>
                  <ul className="space-y-1.5 pl-2.5">
                    {activeTask.overview.goals.map((goal, index) => (
                      <li key={index} className="text-xs text-gray-200 flex items-start leading-relaxed">
                        <span
                          className="mr-1.5 flex-shrink-0 font-bold leading-none"
                          style={{ color: borderColorValue }}
                        >
                          •
                        </span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
