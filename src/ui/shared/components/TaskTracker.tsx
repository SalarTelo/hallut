/**
 * Uppgiftsspårare-komponent
 * Flytande uppdragslogg/uppgiftsspårare som visar aktuell aktiv uppgiftsdetaljer
 * Liknande RPG-uppdragsloggar
 * Hopfällbar - krymper när muspekaren inte är över den
 */

import { useState } from 'react';
import type { Task } from '@types/module/moduleConfig.types.js';
import { Card } from './Card.js';
import { Badge } from './Badge.js';
import { getThemeValue } from '@utils/theme.js';

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
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  if (!activeTask) {
    return null;
  }

  return (
    <div 
      className="fixed top-16 right-4 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: isExpanded ? '340px' : '300px',
        maxHeight: 'calc(100vh - 80px)',
        overflowY: 'auto',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Card
        padding={isExpanded ? "md" : "sm"}
        dark
        pixelated
        className="bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300"
        borderColor={borderColorValue}
      >
        {/* Rubrik - Alltid synlig */}
        <div className={`${isExpanded ? 'mb-3 border-b border-gray-700 pb-2' : 'mb-2'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-yellow-400 pixelated">
              Aktiv uppgift
            </h3>
            <Badge variant="primary" size="sm">
              Aktiv
            </Badge>
          </div>
        </div>

        {/* Uppgiftsnamn - Alltid synligt */}
        <h4 className="text-base font-bold text-white mb-2 pixelated">
          {activeTask.name}
        </h4>

        {/* Hopfällt tillstånd - Visa kort beskrivning */}
        {!isExpanded && activeTask.description && (
          <p className="text-xs text-gray-200 pixelated line-clamp-3 leading-relaxed">
            {activeTask.description}
          </p>
        )}

        {/* Expanderat innehåll */}
        {isExpanded && (
          <div className="animate-fade-in">
            {/* Uppgiftsbeskrivning */}
            {activeTask.description && (
              <p className="text-sm text-gray-100 mb-3 pixelated leading-relaxed">
                {activeTask.description}
              </p>
            )}

            {/* Krav */}
            {activeTask.overview?.requirements && (
              <div className="mb-3 pt-2 border-t border-gray-700">
                <div className="text-sm font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wide">Krav</div>
                <p className="text-sm text-gray-100 pixelated leading-relaxed">{activeTask.overview.requirements}</p>
              </div>
            )}

            {/* Mål/Delmål */}
            {activeTask.overview?.goals && activeTask.overview.goals.length > 0 && (
              <div className="pt-2 border-t border-gray-700">
                <div className="text-sm font-bold text-yellow-400 mb-2 pixelated uppercase tracking-wide">Delmål</div>
                <ul className="space-y-1.5">
                  {activeTask.overview.goals.map((goal, index) => (
                    <li key={index} className="text-sm text-gray-100 pixelated flex items-start leading-relaxed">
                      <span className="text-yellow-400 mr-2 flex-shrink-0">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
