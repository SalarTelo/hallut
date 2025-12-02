/**
 * Interactable View
 * Main environment view with interactables
 */

import type { ModuleData } from '@core/types/module.js';
import type { Interactable } from '@core/types/interactable.js';
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
          position={interactable.position}
          label={interactable.name}
          locked={interactable.locked}
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

