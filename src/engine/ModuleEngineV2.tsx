/**
 * ModuleEngine V2 - Automatic flow generation
 * Handles welcome → task 1 → task 2 → ... → module complete
 */

import { useState, useEffect } from 'react';
import { getModule } from '../api/client.js';
import { getModuleDialogues } from '../api/moduleRegistry.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.js';
import { Button } from '../components/ui/Button.js';
import { useI18n } from '../i18n/context.js';
import type { ModuleConfig } from '../types/module.types.js';
import { useModuleStore, useModuleActions } from '../store/moduleStore.js';
import { StorageService } from '../services/storage.js';
import { Dialogue } from '../components/module/Dialogue.js';
import { TaskWork } from '../components/module/TaskWork.js';
import { EnvironmentView } from '../components/module/EnvironmentView.js';
import { useTaskCompletion } from '../hooks/useTaskCompletion.js';

export interface ModuleEngineProps {
  moduleId: string;
  onExit?: () => void;
}

type ModuleState = 'welcome' | 'environment' | 'task-work' | 'module-complete';

export function ModuleEngine({ moduleId, onExit }: ModuleEngineProps) {
  const { t, locale } = useI18n();
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<ModuleState>('welcome');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  
  const moduleState = useModuleStore((state) => state.moduleState);
  const { setModuleStateField } = useModuleActions();
  const { markTaskComplete } = useTaskCompletion();
  const completedTasks = moduleState.completedTasks || [];

  // Load module
  useEffect(() => {
    let cancelled = false;

    async function loadModule() {
      try {
        setLoading(true);
        setError(null);
        const config = await getModule(moduleId, locale);
        if (!cancelled) {
          setModuleConfig(config);
          
          // Load dialogues and store in moduleData for InteractableHandler
          const dialogues = getModuleDialogues(moduleId);
          useModuleStore.getState().setModuleData({
            ...config,
            dialogues: dialogues || {},
          });
          
          // Check if user has seen welcome before
          const progress = StorageService.getModuleProgress(moduleId);
          if (progress?.state?.hasSeenWelcome) {
            setHasSeenWelcome(true);
            // Find first incomplete task
            const firstIncomplete = config.tasks.findIndex(
              task => !completedTasks.includes(task.id)
            );
            if (firstIncomplete >= 0) {
              setCurrentTaskIndex(firstIncomplete);
              // Restore currentTaskId if it was set
              if (progress.state.currentTaskId) {
                setModuleStateField('currentTaskId', progress.state.currentTaskId);
              }
              // Go to environment state (not task-work)
              setCurrentState('environment');
            } else {
              setCurrentState('module-complete');
            }
          }
          
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load module');
          setLoading(false);
        }
      }
    }

    loadModule();

    return () => {
      cancelled = true;
    };
  }, [moduleId, locale, completedTasks]);

  // Get current task
  const currentTask = moduleConfig?.tasks[currentTaskIndex];
  
  // Watch for when user is ready to submit (set by GuardAgent)
  useEffect(() => {
    if (moduleState.readyToSubmit && currentTask && currentState === 'environment') {
      setCurrentState('task-work');
      // Clear the flag
      setModuleStateField('readyToSubmit', false);
    }
  }, [moduleState.readyToSubmit, currentTask, currentState, setModuleStateField]);
  

  // Handle welcome completion
  const handleWelcomeComplete = () => {
    setHasSeenWelcome(true);
    StorageService.saveModuleProgress(moduleId, {
      stepIndex: 0,
      state: { ...moduleState, hasSeenWelcome: true },
    });
    
    // After welcome, show environment where user can interact with NPCs
    setCurrentState('environment');
  };


  // Handle task solve
  const handleTaskSolve = (result: { solved: boolean; reason: string; details?: string }) => {
    if (result.solved && currentTask) {
      // Mark task as complete
      markTaskComplete(currentTask.id);
      
      // Unlock interactables that require this task
      // This is handled by the interactable system checking unlockRequirement
      
      // Move to next task
      const nextTaskIndex = currentTaskIndex + 1;
      if (nextTaskIndex < (moduleConfig?.tasks.length || 0)) {
        setCurrentTaskIndex(nextTaskIndex);
        setCurrentState('environment');
      } else {
        // All tasks complete
        setCurrentState('module-complete');
        StorageService.addCompletedModule(moduleId);
      }
    }
  };

  // Handle task work next (for retry or continue)
  const handleTaskWorkNext = () => {
    // This is called when user wants to retry or continue
    // The task solve handler already moved to next task if solved
    // If not solved, stay on current task
  };

  if (loading) {
    return (
      <div className="game-bg" style={{ padding: 'var(--spacing-12)', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="lg" color="var(--game-world-border)" />
        <div className="h3" style={{ marginTop: 'var(--spacing-4)', color: 'var(--game-world-border)' }}>
          {t.module.loading}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-bg" style={{ padding: 'var(--spacing-12)', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-4)', color: 'var(--game-accent-error)' }}>⚠️</div>
        <div className="h2" style={{ marginBottom: 'var(--spacing-4)', color: 'var(--game-accent-error)' }}>
          {t.module.error}
        </div>
        <div className="text-base" style={{ color: 'var(--game-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
          {error}
        </div>
        {onExit && (
          <Button variant="primary" onClick={onExit}>
            {t.common.back}
          </Button>
        )}
      </div>
    );
  }

  if (!moduleConfig) {
    return null;
  }

  // Get welcome speaker interactable
  const welcomeSpeaker = moduleConfig?.interactables.find(i => i.id === moduleConfig.welcome.speaker);

  // Render based on current state
  if (currentState === 'welcome' && !hasSeenWelcome) {
    return (
      <div className="game-bg" style={{ minHeight: '100vh', padding: 'var(--spacing-8)' }}>
        <Dialogue
          speaker={welcomeSpeaker?.name || moduleConfig.welcome.speaker}
          lines={moduleConfig.welcome.lines}
          avatar={welcomeSpeaker?.avatar}
          onNext={handleWelcomeComplete}
        />
      </div>
    );
  }

  // Environment state - user can interact with NPCs
  if (currentState === 'environment') {
    // Check if there's a current task to show in the environment
    const activeTask = currentTask && moduleState.currentTaskId === currentTask.id 
      ? currentTask 
      : null;
    
    return (
      <EnvironmentView
        backgroundColor={moduleConfig.background.color}
        backgroundImage={moduleConfig.background.image || undefined}
        interactables={moduleConfig.interactables}
        currentTask={activeTask ? {
          id: activeTask.id,
          description: activeTask.description,
          overview: activeTask.overview,
        } : undefined}
      />
    );
  }

  // Task work state - only shown when guard triggers submission
  if (currentState === 'task-work' && currentTask) {
    return (
      <EnvironmentView
        backgroundColor={moduleConfig.background.color}
        backgroundImage={moduleConfig.background.image || undefined}
        interactables={moduleConfig.interactables}
        currentTask={{
          id: currentTask.id,
          description: currentTask.description,
          overview: currentTask.overview,
        }}
      >
        <TaskWork
          task={currentTask}
          onSolve={handleTaskSolve}
          onNext={handleTaskWorkNext}
        />
      </EnvironmentView>
    );
  }

  if (currentState === 'module-complete') {
    return (
      <div className="game-bg" style={{ padding: 'var(--spacing-12)', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: 'var(--spacing-4)' }}>🎉</div>
        <div className="h1" style={{ marginBottom: 'var(--spacing-2)', color: 'var(--game-world-border)' }}>
          {t.module.complete}
        </div>
        <div className="text-lg" style={{ marginBottom: 'var(--spacing-8)', color: 'var(--game-text-secondary)' }}>
          {t.module.completeMessage}
        </div>
        {onExit && (
          <Button variant="primary" size="lg" onClick={onExit}>
            {t.module.returnToSelection}
          </Button>
        )}
      </div>
    );
  }

  return null;
}

