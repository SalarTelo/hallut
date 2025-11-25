/**
 * New Module Engine
 * Uses new unified store, dialogue system, and task submission
 */

import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { moduleMachine } from '../machines/moduleMachine.js';
import { loadModule } from '../modules/loader.js';
import { useModuleStore, useModuleActions } from '../store/moduleStore.js';
import { LoadingSpinner } from './ui/LoadingSpinner.js';
import { EnvironmentView } from './module/EnvironmentView.js';
import { TaskSubmissionView } from './task/TaskSubmissionView.js';
import { Dialogue } from './module/Dialogue.js';
import { DialogueSystem } from '../dialogue/DialogueSystem.js';
import { moduleActions } from '../store/moduleActions.js';
import { evaluateTask } from '../services/taskEvaluation.js';
import type { TaskSubmission } from '../types/task.types.js';

export interface ModuleEngineProps {
  moduleId: string;
  locale?: string;
  onExit?: () => void;
}

export function ModuleEngine({ moduleId, locale = 'sv', onExit }: ModuleEngineProps) {
  const [state, send] = useMachine(moduleMachine);
  const { setModule, setModuleId } = useModuleActions();
  const currentModule = useModuleStore((state) => state.currentModule);
  const moduleProgress = useModuleStore((state) => state.getProgress(moduleId));
  const readyToSubmit = moduleProgress?.state?.readyToSubmit || false;

  // Load module on mount
  useEffect(() => {
    if (state.value === 'idle') {
      loadModule(moduleId, locale)
        .then((moduleData) => {
          setModule(moduleData);
          setModuleId(moduleId);
          send({ type: 'START_MODULE', module: moduleData, moduleId });
        })
        .catch((error) => {
          console.error('Failed to load module:', error);
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

  // Render based on state
  if (state.value === 'idle' || state.value === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.value === 'welcome') {
    // Show welcome dialogue
    const welcomeDialogue = currentModule?.dialogues[`${moduleId}_welcome`];
    if (welcomeDialogue) {
      return (
        <Dialogue
          speaker={welcomeDialogue.speaker}
          lines={welcomeDialogue.greeting}
          onNext={() => {
            moduleActions.markGreetingSeen(moduleId, `${moduleId}_welcome`);
            send({ type: 'COMPLETE_WELCOME' });
          }}
        />
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
      <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <div className="h1" style={{ marginBottom: 'var(--spacing-4)' }}>
          🎉 Grattis!
        </div>
        <div className="text-lg" style={{ marginBottom: 'var(--spacing-6)' }}>
          Du har klarat alla uppgifter i denna modul!
        </div>
        {onExit && (
          <button
            onClick={onExit}
            style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              fontSize: 'var(--font-size-base)',
              backgroundColor: 'var(--game-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Tillbaka
          </button>
        )}
      </div>
    );
  }

  return null;
}

