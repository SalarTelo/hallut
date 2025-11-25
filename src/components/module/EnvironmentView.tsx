import { useState } from 'react';
import { InteractableSpot } from './InteractableSpot.js';
import { InteractableHandler } from './InteractableHandler.js';
import { TaskRequirementsPanel } from './TaskRequirementsPanel.js';
import type { TaskConfig } from '../../types/module.types.js';
import type { Interactable } from '../../types/interactable.types.js';
import type { ReactNode } from 'react';
import { useModuleStore } from '../../store/moduleStore.js';
import '../../styles/game-theme.css';

export interface EnvironmentViewProps {
  moduleId: string;
  onExit?: () => void;
  backgroundImage?: string;
  backgroundColor?: string;
  interactables?: Interactable[];
  onInteractableClick?: (id: string) => void;
  currentTask?: TaskConfig;
  onTaskComplete?: (taskId: string) => void;
  children?: ReactNode; // Allow rendering task work component inside
}

export function EnvironmentView({ 
  moduleId,
  onExit,
  backgroundImage: backgroundImageProp,
  backgroundColor: backgroundColorProp,
  interactables: interactablesProp,
  onInteractableClick,
  currentTask: currentTaskProp,
  onTaskComplete: _onTaskComplete,
  children,
}: EnvironmentViewProps) {
  const currentModule = useModuleStore((state) => state.currentModule);
  const moduleProgress = useModuleStore((state) => state.getProgress(moduleId));
  const moduleState = moduleProgress?.state || {};
  const [selectedInteractable, setSelectedInteractable] = useState<Interactable | null>(null);

  // Get interactables from module config or props
  const interactables = interactablesProp || currentModule?.config.interactables || [];
  const bgColor = backgroundColorProp || currentModule?.config.background.color || 'var(--game-world-bg)';
  const bgImage = backgroundImageProp || currentModule?.config.background.image || undefined;
  
  // Get current task from module if not provided
  const currentTaskId = moduleState.currentTaskId;
  const currentTask = currentTaskProp || (currentTaskId && currentModule?.tasks.find(t => t.id === currentTaskId));

  // Generic interactable click handler - uses InteractableHandler for actions
  const handleInteractableClick = (interactable: Interactable) => {
    // Check if interactable is locked
    if (interactable.locked) {
      const unlockRequirement = interactable.unlockRequirement;
      if (unlockRequirement) {
        let isLocked = false;
        
        // Check different requirement types
        switch (unlockRequirement.type) {
          case 'task': {
            const completedTasks = moduleState.completedTasks || [];
            isLocked = !completedTasks.includes(unlockRequirement.task);
            break;
          }
          case 'password': {
            const unlockPassword = moduleState.unlockPassword;
            isLocked = unlockPassword !== unlockRequirement.password;
            break;
          }
          case 'storyReady': {
            isLocked = !moduleState.hasStoryReady;
            break;
          }
          case 'custom': {
            const fieldValue = (moduleState as Record<string, unknown>)[unlockRequirement.field];
            // If value is undefined, check if field exists (is not undefined)
            if (unlockRequirement.value === undefined) {
              isLocked = fieldValue === undefined;
            } else {
              isLocked = fieldValue !== unlockRequirement.value;
            }
            break;
          }
        }
        
        if (isLocked) {
          // Interactable is locked, don't open
          return;
        }
      }
    }
    
    // Interactable is unlocked, handle action via InteractableHandler
    setSelectedInteractable(interactable);
    
    // Also call optional callback
    if (onInteractableClick) {
      onInteractableClick(interactable.id);
    }
  };

  const handleActionComplete = () => {
    setSelectedInteractable(null);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Static environment background */}
      {!bgImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8C8 50%, #6B8E23 100%)',
            opacity: 0.7,
          }}
        />
      )}

      {/* Render all interactable spots */}
      {interactables.map((interactable) => (
        <InteractableSpot
          key={interactable.id}
          interactable={interactable}
          onClick={() => handleInteractableClick(interactable)}
        />
      ))}

      {/* Handle interactable actions via InteractableHandler */}
      {selectedInteractable && (
        <InteractableHandler
          interactable={selectedInteractable}
          onActionComplete={handleActionComplete}
        />
      )}

      {/* Task Requirements Panel - Persistent quest tracker */}
      {/* Only show if there's a current task AND it matches the active task ID in moduleState AND it's not completed */}
      {currentTask && currentTask.id && (() => {
        const currentTaskId = moduleState.currentTaskId;
        const taskId = currentTask.id;
        const completedTasks = moduleState.completedTasks || [];
        const isTaskCompleted = completedTasks.includes(taskId);
        
        // Only show if:
        // 1. This task is the active one (matches currentTaskId in moduleState)
        // 2. The task is not yet completed
        // 3. Both IDs are defined
        return currentTaskId !== undefined && taskId !== undefined && currentTaskId === taskId && !isTaskCompleted;
      })() && (
        <TaskRequirementsPanel task={currentTask} />
      )}

      {/* Render children (e.g., TaskWork component) */}
      {children && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            pointerEvents: 'auto',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
