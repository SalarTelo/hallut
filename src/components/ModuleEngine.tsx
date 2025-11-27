/**
 * Module Engine
 * Uses XState for state management, unified store, dialogue system, and task submission
 */

import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { moduleMachine } from '../machines/moduleMachine.js';
import { loadModule } from '../modules/loader.js';
import { useModuleStore, useModuleActions } from '../store/moduleStore.js';
import { LoadingSpinner } from './ui/LoadingSpinner.js';
import { Button } from './ui/Button.js';
import { EnvironmentView } from './module/EnvironmentView.js';
import { TaskSubmissionView } from './task/TaskSubmissionView.js';
import { Dialogue } from './module/Dialogue.js';
import { moduleActions } from '../store/moduleActions.js';
import { evaluateTask } from '../services/taskEvaluation.js';
import { useI18n } from '../i18n/context.js';
import type { TaskSubmission } from '../types/task.types.js';

export interface ModuleEngineProps {
  moduleId: string;
  locale?: string;
  onExit?: () => void;
}

export function ModuleEngine({ moduleId, locale = 'sv', onExit }: ModuleEngineProps) {
  const { t } = useI18n();
  const [state, send] = useMachine(moduleMachine);
  const { setModule, setModuleId } = useModuleActions();
  const currentModule = useModuleStore((state) => state.currentModule);
  const moduleProgress = useModuleStore((state) => state.getProgress(moduleId));
  const readyToSubmit = moduleProgress?.state?.readyToSubmit || false;
  const [error, setError] = useState<string | null>(null);

  // Load module on mount
  useEffect(() => {
    if (state.value === 'idle') {
      loadModule(moduleId, locale)
        .then((moduleData) => {
          setModule(moduleData);
          setModuleId(moduleId);
          setError(null);
          send({ type: 'START_MODULE', module: moduleData, moduleId });
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load module';
          setError(errorMessage);
          console.error('Failed to load module:', err);
        });
    }
  }, [moduleId, locale, state.value, setModule, setModuleId, send]);

  // Handle welcome completion
  useEffect(() => {
    if (state.value === 'welcome' && moduleProgress?.state?.seenGreetings) {
      // Check if welcome greeting has been seen
      const welcomeId = `${moduleId}_welcome`;
      if (moduleProgress.state.seenGreetings[welcomeId]) {
        send({ type: 'COMPLETE_WELCOME' });
      }
    }
  }, [state.value, moduleProgress, moduleId, send]);

  // Handle ready to submit
  useEffect(() => {
    if (readyToSubmit && state.value === 'taskAccepted') {
      send({ type: 'READY_TO_SUBMIT' });
    }
  }, [readyToSubmit, state.value, send]);

  // Show error state
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

  // Render based on state
  if (state.value === 'idle' || state.value === 'loading') {
    return (
      <div className="game-bg" style={{ padding: 'var(--spacing-12)', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="lg" color="var(--game-world-border)" />
        <div className="h3" style={{ marginTop: 'var(--spacing-4)', color: 'var(--game-world-border)' }}>
          {t.module.loading}
        </div>
      </div>
    );
  }

  if (state.value === 'welcome') {
    // Show welcome dialogue
    const welcomeDialogue = currentModule?.dialogues[`${moduleId}_welcome`];
    if (welcomeDialogue) {
      // Get welcome speaker interactable for avatar
      const welcomeSpeaker = currentModule?.config.interactables.find(
        i => i.id === currentModule.config.welcome.speaker
      );
      
      return (
        <div className="game-bg" style={{ minHeight: '100vh', padding: 'var(--spacing-8)' }}>
          <Dialogue
            speaker={welcomeSpeaker?.name || welcomeDialogue.speaker}
            lines={welcomeDialogue.greeting}
            avatar={welcomeSpeaker?.avatar}
            onNext={() => {
              moduleActions.markGreetingSeen(moduleId, `${moduleId}_welcome`);
              send({ type: 'COMPLETE_WELCOME' });
            }}
          />
        </div>
      );
    }
    // No welcome dialogue, skip to environment
    send({ type: 'COMPLETE_WELCOME' });
    return null;
  }

  if (state.value === 'environment') {
    if (!currentModule) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    
    return (
      <EnvironmentView
        moduleId={moduleId}
        onExit={onExit}
      />
    );
  }

  if (state.value === 'taskWork') {
    const currentTaskId = moduleProgress?.state?.currentTaskId;
    const currentTask = currentModule?.tasks.find(t => t.id === currentTaskId);
    
    if (!currentTask) {
      send({ type: 'EXIT' });
      return null;
    }

    const handleSubmit = async (submission: TaskSubmission) => {
      send({ type: 'SUBMIT_TASK', submission });
      
      // Evaluate task
      const result = await evaluateTask(currentTask, submission);
      
      if (result.solved) {
        moduleActions.completeTask(moduleId, currentTaskId!);
        send({ type: 'TASK_COMPLETE' });
      } else {
        // Show error, allow retry
        console.error('Task evaluation failed:', result.reason);
        // Could show error modal here
      }
    };

    return (
      <TaskSubmissionView
        task={currentTask}
        onSubmit={handleSubmit}
      />
    );
  }

  if (state.value === 'moduleComplete') {
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

