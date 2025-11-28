/**
 * Uppgiftsvy-komponent
 * Visar uppgiftsinlämningsgränssnittet
 */

import { memo } from 'react';
import { TaskSubmission } from '../../task/TaskSubmission.js';
import { ContainerLayout } from '@ui/shared/components/layouts/index.js';
import type { Task } from '@types/module/moduleConfig.types.js';

export interface TaskViewProps {
  task: Task;
  moduleId: string;
  onComplete: (result: { solved: boolean }) => void;
}

/**
 * Uppgiftsvy-komponent
 */
export const TaskView = memo(function TaskView({ task, moduleId, onComplete }: TaskViewProps) {
  return (
    <ContainerLayout className="max-w-4xl">
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
    </ContainerLayout>
  );
});
