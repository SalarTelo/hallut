/**
 * Task Overlay Component
 * Overlay wrapper for TaskView
 */

import { Overlay } from '@ui/shared/components/overlays/index.js';
import { TaskView } from '@ui/views/TaskView.js';
import type { Task } from '@core/task/types.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import type { NPC } from '@core/module/types/index.js';

export interface TaskOverlayProps {
  isOpen: boolean;
  task: Task;
  moduleId: string;
  moduleData: ModuleData;
  onClose: () => void;
  onComplete: (task: Task) => void;
  onDialogueRequested?: (node: DialogueNode, npc: NPC) => void;
}

/**
 * Task Overlay component
 */
export function TaskOverlay({
  isOpen,
  task,
  moduleId,
  moduleData,
  onClose,
  onComplete,
  onDialogueRequested,
}: TaskOverlayProps) {
  if (!isOpen) return null;

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={true}
    >
      <TaskView
        task={task}
        moduleId={moduleId}
        onComplete={async () => {
          // Task is already marked as complete in TaskView
          // Find NPC that gave this task and show task-complete dialogue
          const npc = moduleData.interactables.find(
            (i): i is NPC => i.type === 'npc' && (i.tasks?.some(t => t.id === task.id) ?? false)
          );

          if (npc && npc.dialogueTree && task.dialogues?.complete) {
            const taskCompleteNode: DialogueNode = {
              id: `${npc.id}_task_complete`,
              lines: task.dialogues.complete,
              choices: {
                thanks: { text: 'Thank you!' },
              },
            };
            onDialogueRequested?.(taskCompleteNode, npc);
          }

          onComplete(task);
        }}
        onClose={onClose}
      />
    </Overlay>
  );
}

