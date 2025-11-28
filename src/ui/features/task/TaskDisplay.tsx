/**
 * Uppgiftsvisningskomponent
 * Visar uppgiftsinformation, krav och status
 */

import type { Task } from '@types/module/moduleConfig.types.js';
import { Card } from '@ui/shared/components/Card.js';
import { Badge } from '@ui/shared/components/Badge.js';

export interface TaskDisplayProps {
  /**
   * Uppgift att visa
   */
  task: Task;

  /**
   * Om uppgiften är slutförd
   */
  isCompleted?: boolean;

  /**
   * Om uppgiften är aktiv just nu
   */
  isActive?: boolean;

  /**
   * Visa översiktssektion
   */
  showOverview?: boolean;
}

/**
 * Uppgiftsvisningskomponent
 */
export function TaskDisplay({
  task,
  isCompleted = false,
  isActive = false,
  showOverview = true,
}: TaskDisplayProps) {
  return (
    <Card
      className={`task-card ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${isCompleted ? 'opacity-75' : ''}`}
      padding="lg"
    >
      <div className="space-y-4">
        {/* Rubrik */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            {isCompleted && <Badge variant="success">Slutförd</Badge>}
            {isActive && !isCompleted && <Badge variant="primary">Aktiv</Badge>}
          </div>
        </div>

        {/* Översikt */}
        {showOverview && task.overview && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            {task.overview.requirements && (
              <div>
                <h4 className="text-base font-bold text-yellow-400 mb-2 uppercase tracking-wide">Krav</h4>
                <p className="text-sm text-gray-600">{task.overview.requirements}</p>
              </div>
            )}
            {task.overview.goals && task.overview.goals.length > 0 && (
              <div>
                <h4 className="text-base font-bold text-yellow-400 mb-2 uppercase tracking-wide">Mål</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {task.overview.goals.map((goal: string, index: number) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Inlämningstypsindikator */}
        <div className="border-t border-gray-200 pt-4">
          <div className="text-xs text-gray-500">
            Inlämningstyp: <span className="font-medium">{task.submission.type}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
