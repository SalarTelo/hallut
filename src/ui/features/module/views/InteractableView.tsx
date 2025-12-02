/**
 * Interactable View
 * Main environment view with interactables
 */

import type { ModuleData } from '@core/types/module.js';
import type { Interactable } from '@core/types/interactable.js';
import type { Task } from '@core/types/task.js';
import { actions } from '@core/state/actions.js';
import { ModuleBackground } from '@ui/shared/components/ModuleBackground.js';
import { InteractableIcon } from '@ui/shared/components/InteractableIcon.js';
import { Button } from '@ui/shared/components/Button.js';
import { TaskTracker } from '@ui/shared/components/TaskTracker.js';

export interface InteractableViewProps {
  moduleData: ModuleData;
  moduleId: string;
  onInteractableClick: (interactable: Interactable) => void | Promise<void>;
  onExit?: () => void;
}

/**
 * Interactable View component
 */
export function InteractableView({
  moduleData,
  moduleId,
  onInteractableClick,
  onExit,
}: InteractableViewProps) {
  const currentTaskId = actions.getCurrentTaskId(moduleId);
  const currentTask = currentTaskId ? moduleData.tasks.find(t => t.id === currentTaskId) : null;

  // Filter interactables based on unlock requirements
  const visibleInteractables = moduleData.interactables.filter((interactable) => {
    if (!interactable.locked) return true;
    if (!interactable.unlockRequirement) return true;

    // Check unlock requirement
    if (interactable.unlockRequirement.type === 'task-complete') {
      return actions.isTaskCompleted(moduleId, interactable.unlockRequirement.task);
    }
    if (interactable.unlockRequirement.type === 'module-complete') {
      return actions.isModuleCompleted(interactable.unlockRequirement.moduleId);
    }
    // TODO: Handle state-check

    return false;
  });

  // Extract tasks from NPC dialogues (from accept-task actions in choices)
  const getTasksFromDialogues = (interactable: Interactable): Task[] => {
    if (interactable.type !== 'npc') return [];
    
    const tasks: Task[] = [];
    
    // Check all dialogues for accept-task actions
    Object.values(interactable.dialogues).forEach(dialogue => {
      dialogue.choices?.forEach(choice => {
        const actions = Array.isArray(choice.action) ? choice.action : [choice.action];
        actions.forEach(action => {
          if (action && action.type === 'accept-task') {
            // Find the task in module tasks
            const task = moduleData.tasks.find(t => t.id === action.task.id);
            if (task) {
              tasks.push(task);
            }
          }
        });
      });
    });
    
    return tasks;
  };

  // Determine badge type for an interactable
  const getBadgeType = (interactable: Interactable): 'task' | 'task-active' | 'completed' | 'new' | 'locked' | null => {
    // Show locked badge if interactable is locked
    if (interactable.locked) {
      return 'locked';
    }

    // Get all tasks for this NPC (from tasks property or from dialogues)
    let npcTasks: Task[] = [];
    
    if (interactable.type === 'npc') {
      // Get tasks from NPC's tasks property
      if (interactable.tasks) {
        npcTasks = Object.values(interactable.tasks);
      }
      
      // Also get tasks from dialogue choices
      const dialogueTasks = getTasksFromDialogues(interactable);
      // Merge and deduplicate by task id
      dialogueTasks.forEach(dialogueTask => {
        if (!npcTasks.find(t => t.id === dialogueTask.id)) {
          npcTasks.push(dialogueTask);
        }
      });
    }
    
    if (npcTasks.length === 0) {
      return null;
    }
    
    const npcTaskIds = npcTasks.map(t => t.id);
    
    // Find the next available task based on module task order
    // Tasks in taskOrder are in the order they should be given
    for (const task of moduleData.config.taskOrder) {
      // Check if this task belongs to this NPC
      if (npcTaskIds.includes(task.id)) {
        // Check if task is not completed
        const isCompleted = actions.isTaskCompleted(moduleId, task.id);
        const isActive = currentTaskId === task.id;
        
        // If task is completed, skip to next task
        if (isCompleted) {
          continue;
        }
        
        // If task is active, show gray badge
        if (isActive) {
          return 'task-active';
        }
        
        // If task is available (not completed, not active), show yellow badge
        if (!isCompleted && !isActive) {
          return 'task';
        }
      }
    }
    
    // Fallback: if no task found in order, check if any task is available
    // (for cases where NPC tasks aren't in taskOrder)
    for (const taskId of npcTaskIds) {
      const isCompleted = actions.isTaskCompleted(moduleId, taskId);
      const isActive = currentTaskId === taskId;
      
      if (isCompleted) {
        continue;
      }
      
      if (isActive) {
        return 'task-active';
      }
      
      if (!isCompleted && !isActive) {
        return 'task';
      }
    }

    // TODO: Add logic for 'completed' and 'new' badges in the future

    return null;
  };

  return (
    <div className="relative w-full h-full">
      <ModuleBackground
        imageUrl={moduleData.config.background.image}
        color={moduleData.config.background.color}
      >

      {/* Interactables */}
      {visibleInteractables.map((interactable) => (
        <InteractableIcon
          key={interactable.id}
          icon={interactable.avatar || (interactable.type === 'npc' ? 'avatar' : 'box')}
          shape={interactable.type === 'npc' ? 'circle' : 'square'}
          interactableType={interactable.type}
          position={interactable.position}
          label={interactable.name}
          locked={interactable.locked}
          badge={getBadgeType(interactable)}
          onClick={() => onInteractableClick(interactable)}
        />
      ))}

      {/* Task Tracker */}
      {currentTask && (
        <TaskTracker activeTask={currentTask} />
      )}

      {/* Exit Button */}
      {onExit && (
        <div className="absolute top-4 right-4">
          <Button variant="secondary" pixelated onClick={onExit}>
            Exit
          </Button>
        </div>
      )}
      </ModuleBackground>
    </div>
  );
}

