/**
 * Interactable View
 * Main environment view with interactables (NPCs, objects, etc.)
 * 
 * Displays the module's interactable elements on a background, showing:
 * - NPCs with task badges
 * - Objects and other interactables
 * - Task tracker for active tasks
 * - Exit button (optional)
 * 
 * @example
 * ```tsx
 * <InteractableView
 *   moduleData={moduleData}
 *   moduleId="example-1"
 *   onInteractableClick={handleInteractableClick}
 *   onExit={handleExit}
 * />
 * ```
 */

import type { ModuleData } from '@core/module/types/index.js';
import type { Interactable } from '@core/module/types/index.js';
import { actions } from '@core/state/actions.js';
import { getAvailableTasks, getActiveTasks } from '@core/task/availability.js';
import { createModuleContext } from '@core/module/context.js';
import { ModuleBackground } from '@ui/shared/components/game/index.js';
import { InteractableIcon } from '@ui/shared/components/game/index.js';
import { Button } from '@ui/shared/components/primitives/index.js';
import { TaskTracker } from '@ui/shared/components/game/index.js';

export interface InteractableViewProps {
  /**
   * Module data containing interactables, tasks, and configuration
   */
  moduleData: ModuleData;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Callback when an interactable is clicked
   */
  onInteractableClick: (interactable: Interactable) => void | Promise<void>;

  /**
   * Optional callback when exit button is clicked
   */
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
