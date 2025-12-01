/**
 * Module Engine
 * Main orchestrator for module lifecycle
 */

import { useEffect, useState } from 'react';
import { loadModuleData } from '../../../core/module/loader.js';
import { actions } from '../../../core/state/actions.js';
import { useDialogueActions, useInteractableActions } from '../../hooks/index.js';
import { LoadingState } from '../../shared/components/LoadingState.js';
import { ErrorDisplay } from '../../shared/components/ErrorDisplay.js';
import { Overlay } from '../../shared/components/Overlay.js';
import { InteractableView } from './views/InteractableView.js';
import { DialogueView } from './views/DialogueView.js';
import { TaskView } from './views/TaskView.js';
import { WelcomeView } from './views/WelcomeView.js';
import type { ModuleData } from '../../../core/types/module.js';
import { ErrorCode, ModuleError } from '../../../core/types/errors.js';

export interface ModuleEngineProps {
  moduleId: string;
  locale?: string;
  onExit?: () => void;
}

type View = 'welcome' | 'interactable' | 'dialogue' | 'task';

/**
 * Module Engine component
 */
export function ModuleEngine({ moduleId, locale = 'sv', onExit }: ModuleEngineProps) {
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load module
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        const data = await loadModuleData(moduleId);
        if (!data) {
          throw new ModuleError(ErrorCode.MODULE_NOT_FOUND, moduleId, `Module ${moduleId} not found`);
        }
        setModuleData(data);
        actions.setCurrentModule(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load module'));
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  // Check welcome dialogue
  useEffect(() => {
    if (moduleData && currentView === 'welcome') {
      const welcomeDialogueId = `${moduleId}_welcome`;
      if (!actions.hasSeenGreeting(moduleId, welcomeDialogueId)) {
        actions.markGreetingSeen(moduleId, welcomeDialogueId);
      }
    }
  }, [moduleData, currentView, moduleId]);

  // Dialogue actions
  const { handleDialogueActions } = useDialogueActions({
    moduleId,
    dialogueId: selectedDialogueId || '',
    locale,
    onTaskSubmissionOpen: (taskId) => {
      setSelectedTaskId(taskId);
      setCurrentView('task');
    },
    onError: setError,
  });

  // Interactable actions
  const { handleInteractableAction } = useInteractableActions({
    moduleId,
    locale,
    onDialogueSelected: (dialogueId) => {
      setSelectedDialogueId(dialogueId);
      setCurrentView('dialogue');
    },
    onComponentOpen: (component, props) => {
      // TODO: Handle component opening
      console.log('Open component:', component, props);
    },
    onImageOpen: (url, title) => {
      // TODO: Handle image opening
      console.log('Open image:', url, title);
    },
    onNoteOpen: (content, title) => {
      // TODO: Handle note opening
      console.log('Open note:', content, title);
    },
    onError: setError,
  });

  if (loading) {
    return <LoadingState message="Loading module..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onAction={onExit}
      />
    );
  }

  if (!moduleData) {
    return null;
  }

  const welcomeDialogueId = `${moduleId}_welcome`;
  const welcomeDialogue = moduleData.dialogues[welcomeDialogueId];

  // Welcome view
  if (currentView === 'welcome' && welcomeDialogue) {
    return (
      <WelcomeView
        moduleId={moduleId}
        moduleData={moduleData}
        onComplete={() => setCurrentView('interactable')}
      />
    );
  }

  // Task overlay
  let taskOverlay = null;
  if (currentView === 'task' && selectedTaskId) {
    const task = moduleData.tasks.find(t => t.id === selectedTaskId);
    if (task) {
      taskOverlay = (
        <Overlay
          isOpen={true}
          onClose={() => {
            setSelectedTaskId(null);
            setCurrentView('interactable');
          }}
          closeOnEscape={true}
          closeOnOverlayClick={true}
        >
          <TaskView
            task={task}
            moduleId={moduleId}
            onComplete={() => {
              actions.completeTask(moduleId, task);
              setSelectedTaskId(null);
              setCurrentView('interactable');
            }}
            onClose={() => {
              setSelectedTaskId(null);
              setCurrentView('interactable');
            }}
          />
        </Overlay>
      );
    }
  }

  // Dialogue overlay
  let dialogueOverlay = null;
  if (currentView === 'dialogue' && selectedDialogueId) {
    const dialogue = moduleData.dialogues[selectedDialogueId];
    if (dialogue) {
      dialogueOverlay = (
        <Overlay
          isOpen={true}
          onClose={() => {
            setSelectedDialogueId(null);
            setCurrentView('interactable');
          }}
          closeOnEscape={true}
          closeOnOverlayClick={true}
        >
          <DialogueView
            dialogue={dialogue}
            moduleId={moduleId}
            onChoiceSelected={async (choice) => {
              if (choice.action) {
                await handleDialogueActions(choice.action);
              }
              setSelectedDialogueId(null);
              setCurrentView('interactable');
            }}
            onClose={() => {
              setSelectedDialogueId(null);
              setCurrentView('interactable');
            }}
          />
        </Overlay>
      );
    }
  }

  return (
    <>
      <InteractableView
        moduleData={moduleData}
        moduleId={moduleId}
        onInteractableClick={async (interactable) => {
          const result = await handleInteractableAction(interactable);
          if (result.type === 'dialogue' && result.dialogueId) {
            setSelectedDialogueId(result.dialogueId);
            setCurrentView('dialogue');
          }
          // Note: task selection is handled through dialogue actions
        }}
        onExit={onExit}
      />
      {taskOverlay}
      {dialogueOverlay}
    </>
  );
}

