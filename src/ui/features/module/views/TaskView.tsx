/**
 * Uppgiftsvy-komponent
 * Visar uppgiftsinlämningsgränssnittet med kompakt header
 */

import { memo } from 'react';
import { TaskSubmission } from '../../task/TaskSubmission.js';
import { Button } from '@ui/shared/components/Button.js';
import { PixelIcon } from '@ui/shared/components/PixelIcon.js';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';
import type { Task } from '@types/module/moduleConfig.types.js';

export interface TaskViewProps {
  task: Task;
  moduleId: string;
  onComplete: (result: { solved: boolean }) => void;
  onClose?: () => void;
}

/**
 * Uppgiftsvy-komponent
 */
export const TaskView = memo(function TaskView({
  task,
  moduleId,
  onComplete,
  onClose,
}: TaskViewProps) {
  const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Kompakt header */}
      <div
        className="sticky top-0 z-20 px-3 py-2 bg-black/90 backdrop-blur-sm border-b-2 pixelated"
        style={{
          borderColor,
          boxShadow: `0 2px 8px rgba(0, 0, 0, 0.5)`,
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <PixelIcon type="check" size={16} color={borderColor} />
            <h1 className="text-sm font-bold text-yellow-300 pixelated">
              {task.name}
            </h1>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              pixelated
              onClick={onClose}
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <PixelIcon type="close" size={16} color="currentColor" />
              <span>Stäng</span>
            </Button>
          )}
        </div>
      </div>

      {/* Uppgiftsinnehåll */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <TaskSubmission
            task={task}
            moduleId={moduleId}
            skipToWorking={true}
            onComplete={(result) => {
              if (result.solved) {
                onComplete(result);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
});
