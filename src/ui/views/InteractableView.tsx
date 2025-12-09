/**
 * Interactable View
 * Main environment view with interactables
 */

import type { ModuleData } from '@core/module/types.js';
import type { Interactable } from '@core/module/types.js';
import { actions } from '@core/state/actions.js';
import { getAvailableTasks, getActiveTasks } from '@core/task/availability.js';
import { createModuleContext } from '@core/module/context.js';
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

  // Check if interactable is unlocked (but still show locked ones - they'll be grayed out)
  const isInteractableUnlocked = (interactable: Interactable): boolean => {
    if (!interactable.locked) return true;
    if (!interactable.unlockRequirement) return true;

    // Check unlock requirement
    if (interactable.unlockRequirement.type === 'task-complete') {
      return actions.isTaskCompleted(moduleId, interactable.unlockRequirement.task);
    }
    if (interactable.unlockRequirement.type === 'module-complete') {
      return actions.isModuleCompleted(interactable.unlockRequirement.moduleId);
    }
    if (interactable.unlockRequirement.type === 'state-check') {
      const stateValue = actions.getModuleStateField(
        moduleId,
        interactable.unlockRequirement.key
      );
      return stateValue === interactable.unlockRequirement.value;
    }

    return false;
  };

  // Show all interactables (locked ones will be grayed out)
  const visibleInteractables = moduleData.interactables;

  // Create context for task availability checking
  const context = createModuleContext(moduleId, 'sv', moduleData);

  // Determine badge type for an interactable
  const getBadgeType = (interactable: Interactable): 'task' | 'task-active' | 'completed' | 'new' | 'locked' | null => {
    // Check if interactable is actually unlocked
    const isUnlocked = isInteractableUnlocked(interactable);
    
    // Show locked badge only if interactable is locked AND not unlocked
    if (interactable.locked && !isUnlocked) {
      return 'locked';
    }

    // Only NPCs can have tasks
    if (interactable.type !== 'npc' || !interactable.tasks || interactable.tasks.length === 0) {
      return null;
    }

    // Check for active tasks first
    const activeTasks = getActiveTasks(interactable.tasks, context);
    if (activeTasks.length > 0) {
      return 'task-active';
    }

    // Check for available tasks
    const availableTasks = getAvailableTasks(interactable.tasks, context, moduleData);
    if (availableTasks.length > 0) {
      return 'task';
    }

    return null;
  };

  return (
    <div className="relative w-full h-full">
      <ModuleBackground
        imageUrl={moduleData.config.background.image}
        color={moduleData.config.background.color}
      >

      {/* Interactables */}
      {visibleInteractables.map((interactable) => {
        const isUnlocked = isInteractableUnlocked(interactable);
        return (
          <InteractableIcon
            key={interactable.id}
            icon={interactable.avatar || (interactable.type === 'npc' ? 'avatar' : 'box')}
            shape={interactable.type === 'npc' ? 'circle' : 'square'}
            interactableType={interactable.type}
            position={interactable.position}
            label={interactable.name}
            locked={interactable.locked && !isUnlocked}
            badge={getBadgeType(interactable)}
            onClick={() => onInteractableClick(interactable)}
          />
        );
      })}

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
