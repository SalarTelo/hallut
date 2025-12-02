/**
 * Uppgiftsspårare-komponent
 * Flytande uppdragslogg/uppgiftsspårare som visar aktuell aktiv uppgiftsdetaljer
 * Liknande RPG-uppdragsloggar
 * Hopfällbar - krymper när muspekaren inte är över den
 */

import { useState } from 'react';
import type { Task } from '@core/types/task.js';
import { Card } from './Card.js';
import { Badge } from './Badge.js';
import { PixelIcon } from './PixelIcon.js';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';

export interface TaskTrackerProps {
  /**
   * Aktuell aktiv uppgift
   */
  activeTask: Task | null;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Uppgiftsspårare-komponent
 */
export function TaskTracker({ activeTask, borderColor }: TaskTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const borderColorValue = useThemeBorderColor(borderColor);

  if (!activeTask) {
    return null;
  }

  // Hämta header-höjd från CSS-variabel, fallback till 48px om inte satt
  const headerHeight = typeof window !== 'undefined' 
    ? getComputedStyle(document.documentElement).getPropertyValue('--module-header-height').trim() || '48px'
    : '48px';
  
  // Lägg till 8px spacing under headern
  const topPosition = `calc(${headerHeight} + 8px)`;

  return (
    <div 
      className="fixed right-3 z-40 transition-all duration-300 ease-out"
      style={{
        top: topPosition,
        width: isExpanded ? '320px' : '280px',
        maxHeight: `calc(100vh - ${headerHeight} - 16px)`,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Card
        padding="none"
        dark
        pixelated={false}
        className="bg-black bg-opacity-95 backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden"
        borderColor={borderColorValue}
      >
        {/* Kompakt header */}
        <div
          className="px-3 py-2.5 border-b-2"
          style={{
            borderColor: borderColorValue,
            background: `linear-gradient(135deg, ${borderColorValue}15 0%, transparent 100%)`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PixelIcon type="check" size={18} color={borderColorValue} />
              <h3 className="text-sm font-bold text-yellow-300">
                Aktiv uppgift
              </h3>
            </div>
            <Badge variant="primary" size="sm">
              Aktiv
            </Badge>
          </div>
        </div>

        {/* Innehåll med smooth height transition */}
        <div className="px-3 py-3">
          {/* Uppgiftsnamn - Alltid synligt */}
          <h4 className="text-base font-bold text-white mb-2.5 leading-tight">
            {activeTask.name}
          </h4>

          {/* Beskrivning - Alltid synlig */}
          {activeTask.description && (
            <p className={`text-sm text-gray-200 leading-relaxed mb-2 transition-all duration-300 ${
              isExpanded ? '' : 'line-clamp-2'
            }`}>
              {activeTask.description}
            </p>
          )}

          {/* Expanderat innehåll - Använder CSS Grid för smooth height transition */}
          <div
            className="grid transition-all duration-300 ease-out overflow-hidden"
            style={{
              gridTemplateRows: isExpanded ? '1fr' : '0fr',
            }}
          >
            <div className="min-h-0">
              <div className="space-y-3 pt-2">
                {/* Krav */}
                {activeTask.overview?.requirements && (
                  <div className="pt-2 border-t border-gray-700/60">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1 h-4 bg-yellow-400 rounded"></span>
                      <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Krav</h5>
                    </div>
                    <p className="text-sm text-gray-100 leading-relaxed">{activeTask.overview.requirements}</p>
                  </div>
                )}

                {/* Mål/Delmål */}
                {activeTask.overview?.goals && activeTask.overview.goals.length > 0 && (
                  <div className="pt-2 border-t border-gray-700/60">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1 h-4 bg-yellow-400 rounded"></span>
                      <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Delmål</h5>
                    </div>
                    <ul className="space-y-1.5">
                      {activeTask.overview.goals.map((goal, index) => (
                        <li key={index} className="text-sm text-gray-200 flex items-start leading-relaxed">
                          <span className="text-yellow-400 mr-2 flex-shrink-0 font-bold">•</span>
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
      </Card>
    </div>
  );
}
