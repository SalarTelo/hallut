/**
 * Module Engine
 * Main orchestrator for module lifecycle
 */

import { useEffect, useState } from 'react';
import { loadModuleData } from '@core/module/loader.js';
import { actions } from '@core/state/actions.js';
import { getDialogue } from '@core/services/dialogue.js';
import { useDialogueActions, useInteractableActions } from '@ui/hooks/index.js';
import { LoadingState } from '@ui/shared/components/LoadingState.js';
import { ErrorDisplay } from '@ui/shared/components/ErrorDisplay.js';
import { Overlay } from '@ui/shared/components/Overlay.js';
import { ImageViewer } from '@ui/shared/components/ImageViewer.js';
import { NoteViewer } from '@ui/shared/components/NoteViewer.js';
import { SignViewer } from '@ui/shared/components/SignViewer.js';
import { ChatWindow } from '@ui/shared/components/ChatWindow.js';
import { InteractableView } from './views/InteractableView.js';
import { DialogueView } from './views/DialogueView.js';
import { TaskView } from './views/TaskView.js';
import { WelcomeView } from './views/WelcomeView.js';
import type { ModuleData } from '@core/types/module.js';
import type { NPC } from '@core/types/interactable.js';
import { ErrorCode, ModuleError } from '@core/types/errors.js';
import { getThemeValue } from '@utils/theme.js';

export interface ModuleEngineProps {
  moduleId: string;
  locale?: string;
  onExit?: () => void;
}

type View = 'welcome' | 'interactable' | 'dialogue' | 'task';

/**
 * Find NPC that gave a task by checking dialogues and tasks property
 */
function findTaskGiver(taskId: string, moduleData: ModuleData): NPC | null {
  for (const interactable of moduleData.interactables) {
    if (interactable.type !== 'npc') continue;
    
    const npc = interactable as NPC;
    
    // Check if NPC has this task in their tasks property
    if (npc.tasks && npc.tasks[taskId]) {
      return npc;
    }
    
    // Check if NPC has this task in their dialogues (accept-task actions)
    for (const dialogue of Object.values(npc.dialogues)) {
      for (const choice of dialogue.choices || []) {
        const actions = Array.isArray(choice.action) ? choice.action : [choice.action];
        for (const action of actions) {
          if (action && action.type === 'accept-task') {
            const actionTaskId = typeof action.task === 'string' ? action.task : action.task.id;
            if (actionTaskId === taskId) {
              return npc;
            }
          }
        }
      }
    }
  }
  
  return null;
}

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
  
  // Modal states
  const [imageModal, setImageModal] = useState<{ url: string; title?: string } | null>(null);
  const [noteModal, setNoteModal] = useState<{ content: string; title?: string } | null>(null);
  const [signModal, setSignModal] = useState<{ content: string; title?: string } | null>(null);
  const [chatModal, setChatModal] = useState<{ title?: string; placeholder?: string } | null>(null);

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
      if (component === 'ChatWindow') {
        setChatModal({
          title: (props?.title as string) || 'AI Companion',
          placeholder: (props?.placeholder as string) || 'Ask me anything...',
        });
      } else if (component === 'SignViewer') {
        setSignModal({
          content: (props?.content as string) || '',
          title: (props?.title as string),
        });
      } else if (component === 'NoteViewer') {
        setNoteModal({
          content: (props?.content as string) || '',
          title: (props?.title as string),
        });
      } else if (component === 'ImageViewer') {
        setImageModal({
          url: (props?.imageUrl as string) || '',
          title: (props?.title as string),
        });
      } else {
        // Custom/unknown component - log warning for developers
        console.warn(
          `[ModuleEngine] Unknown component "${component}" requested. ` +
          `Predefined components: ChatWindow, SignViewer, NoteViewer, ImageViewer. ` +
          `Custom components need to be handled by module-specific code.`,
          { component, props }
        );
        // For now, we don't render unknown components automatically.
        // Modules can extend ModuleEngine or use module-specific handlers to support custom components.
      }
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
              
              // Find the NPC that gave this task and show task-complete dialogue
              const taskGiver = findTaskGiver(task.id, moduleData);
              if (taskGiver) {
                // Try to find task-complete dialogue
                let completeDialogueId: string | null = null;
                if (taskGiver.dialogues['task-complete']) {
                  completeDialogueId = `${taskGiver.id}-task-complete`;
                } else if (taskGiver.dialogues['complete']) {
                  completeDialogueId = `${taskGiver.id}-complete`;
                } else {
                  // Use default task-complete dialogue (getDialogue will generate it)
                  completeDialogueId = `${taskGiver.id}-task-complete`;
                }
                
                if (completeDialogueId) {
                  setSelectedDialogueId(completeDialogueId);
                  setCurrentView('dialogue');
                } else {
                  setCurrentView('interactable');
                }
              } else {
                setCurrentView('interactable');
              }
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
    // Get dialogue with fallback to defaults
    const dialogue = getDialogue(selectedDialogueId, moduleData, moduleId);
    
    if (dialogue) {
      // Filter out "accept-task" choices if the task is already active or completed
      const currentTaskId = actions.getCurrentTaskId(moduleId);
      const filteredDialogue = {
        ...dialogue,
        choices: dialogue.choices?.filter(choice => {
          if (!choice.action) return true;
          
          const actionsArray = Array.isArray(choice.action) ? choice.action : [choice.action];
          // Filter out choices with accept-task actions for tasks that are already active or completed
          return !actionsArray.some(action => {
            if (action && action.type === 'accept-task') {
              const taskId = typeof action.task === 'string' ? action.task : action.task.id;
              // Check if this task is currently active
              if (currentTaskId === taskId) {
                return true;
              }
              // Check if this task is already completed
              if (actions.isTaskCompleted(moduleId, taskId)) {
                return true;
              }
            }
            return false;
          });
        }),
      };
      
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
            dialogue={filteredDialogue}
            moduleId={moduleId}
            onChoiceSelected={async (choice) => {
              if (choice.action) {
                const viewChanged = await handleDialogueActions(choice.action);
                // Only close dialogue if view didn't change (e.g., task view opened)
                if (!viewChanged) {
                  setSelectedDialogueId(null);
                  setCurrentView('interactable');
                } else {
                  // View changed (e.g., task view opened), just close dialogue
                  setSelectedDialogueId(null);
                }
              } else {
                setSelectedDialogueId(null);
                setCurrentView('interactable');
              }
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

  const borderColor = getThemeValue('border-color', '#FFD700');

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
      
      {/* Image Modal */}
      <ImageViewer
        isOpen={imageModal !== null}
        onClose={() => setImageModal(null)}
        imageUrl={imageModal?.url || ''}
        title={imageModal?.title}
        borderColor={borderColor}
      />
      
      {/* Note Modal */}
      <NoteViewer
        isOpen={noteModal !== null}
        onClose={() => setNoteModal(null)}
        content={noteModal?.content || ''}
        title={noteModal?.title}
        borderColor={borderColor}
      />
      
      {/* Sign Modal */}
      <SignViewer
        isOpen={signModal !== null}
        onClose={() => setSignModal(null)}
        content={signModal?.content || ''}
        title={signModal?.title}
        borderColor={borderColor}
      />
      
      {/* Chat Modal */}
      <ChatWindow
        isOpen={chatModal !== null}
        onClose={() => setChatModal(null)}
        title={chatModal?.title}
        borderColor={borderColor}
      />
    </>
  );
}

