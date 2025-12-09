/**
 * Module Engine
 * Main orchestrator for module lifecycle
 */

import { useEffect, useState } from 'react';
import { loadModuleData } from '@core/module/loader.js';
import { actions } from '@core/state/actions.js';
import { createModuleContext } from '@core/module/context.js';
import { useInteractableActions } from '@app/hooks/index.js';
import { getNextDialogueNode, getAvailableChoices, executeActions } from '@core/dialogue/execution.js';
import { LoadingState } from '@ui/shared/components/LoadingState.js';
import { ErrorDisplay } from '@ui/shared/components/ErrorDisplay.js';
import { Overlay } from '@ui/shared/components/Overlay.js';
import { ImageViewer } from '@ui/shared/components/ImageViewer.js';
import { NoteViewer } from '@ui/shared/components/NoteViewer.js';
import { SignViewer } from '@ui/shared/components/SignViewer.js';
import { ChatWindow } from '@ui/shared/components/ChatWindow.js';
import { InteractableView } from '@ui/views/InteractableView.js';
import { DialogueView } from '@ui/views/DialogueView.js';
import { TaskView } from '@ui/views/TaskView.js';
import { WelcomeView } from '@ui/views/WelcomeView.js';
import type { ModuleData } from '@core/module/types.js';
import { ErrorCode, ModuleError } from '@core/errors.js';
import { getThemeValue } from '@utils/theme.js';
import type { NPC } from '@core/module/types.js';
import type { DialogueNode } from '@core/dialogue/types.js';

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
  const [selectedDialogueNode, setSelectedDialogueNode] = useState<DialogueNode | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
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

  // Interactable actions
  const { handleInteractableAction } = useInteractableActions({
    moduleId,
    moduleData: moduleData!,
    locale,
    onDialogueSelected: (node, npc) => {
      setSelectedDialogueNode(node);
      setSelectedNPC(npc);
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

  // Welcome view
  if (currentView === 'welcome') {
    return (
      <WelcomeView
        moduleId={moduleId}
        moduleData={moduleData}
        onComplete={() => setCurrentView('interactable')}
      />
    );
  }

  // Create context for dialogue execution with task submission handler
  const baseContext = moduleData ? createModuleContext(moduleId, locale, moduleData) : null;
  const context = baseContext ? {
    ...baseContext,
    openTaskSubmission: (task: import('@core/task/types.js').Task | string) => {
      const taskId = typeof task === 'string' ? task : task.id;
      setSelectedTaskId(taskId);
      setCurrentView('task');
    },
  } : null;

  // Task overlay
  let taskOverlay = null;
  if (currentView === 'task' && selectedTaskId && moduleData) {
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
            onComplete={async () => {
              // Task is already marked as complete in TaskView, but ensure it's persisted
              // Find NPC that gave this task and show task-complete dialogue
              if (moduleData && context) {
                const npc = moduleData.interactables.find(
                  (i): i is NPC => i.type === 'npc' && (i.tasks?.some(t => t.id === task.id) ?? false)
                );
                
                if (npc && npc.dialogueTree) {
                  // Generate task-complete dialogue node from task dialogues
                  if (task.dialogues?.complete) {
                    const taskCompleteNode: DialogueNode = {
                      id: `${npc.id}_task_complete`,
                      lines: task.dialogues.complete,
                      choices: {
                        thanks: { text: 'Thank you!' },
                      },
                    };
                    setSelectedDialogueNode(taskCompleteNode);
                    setSelectedNPC(npc);
                    setCurrentView('dialogue');
                  }
                }
              }
              
              setSelectedTaskId(null);
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
  if (currentView === 'dialogue' && selectedDialogueNode && selectedNPC && moduleData && context) {
    const tree = selectedNPC.dialogueTree;
    if (tree) {
      const availableChoices = getAvailableChoices(selectedDialogueNode, tree, context, moduleData);
      
      dialogueOverlay = (
        <Overlay
          isOpen={true}
          onClose={() => {
            setSelectedDialogueNode(null);
            setSelectedNPC(null);
            setCurrentView('interactable');
          }}
          closeOnEscape={true}
          closeOnOverlayClick={true}
        >
          <DialogueView
            node={selectedDialogueNode}
            npc={selectedNPC}
            moduleId={moduleId}
            availableChoices={availableChoices}
            onChoiceSelected={async (choiceKey, choiceActions) => {
              // Track if task view was opened
              let taskOpened = false;
              
              // Check if any action explicitly closes the dialogue (for backward compatibility)
              const shouldCloseDialogue = choiceActions.some(
                action => action.type === 'close-dialogue' || (action.type === 'go-to' && action.node === null)
              );
              
              // Create a wrapper context that tracks task opening
              const trackingContext = {
                ...context,
                openTaskSubmission: (task: import('@core/task/types.js').Task | string) => {
                  taskOpened = true;
                  context.openTaskSubmission?.(task);
                },
              };
              
              // Execute actions (this may open task view via context.openTaskSubmission)
              if (choiceActions.length > 0) {
                await executeActions(choiceActions, trackingContext);
              }
              
              // If task view was opened, close dialogue and let task view handle it
              if (taskOpened) {
                setSelectedDialogueNode(null);
                setSelectedNPC(null);
                return;
              }
              
              // If action explicitly closes dialogue (backward compatibility), do so
              if (shouldCloseDialogue) {
                setSelectedDialogueNode(null);
                setSelectedNPC(null);
                setCurrentView('interactable');
                return;
              }
              
              // Navigate to next node (can be null to close dialogue)
              const nextNode = getNextDialogueNode(selectedDialogueNode, choiceKey, tree, context, moduleData);
              
              if (nextNode) {
                setSelectedDialogueNode(nextNode);
              } else {
                // No next node or to: null, close dialogue
                setSelectedDialogueNode(null);
                setSelectedNPC(null);
                setCurrentView('interactable');
              }
            }}
            onClose={() => {
              setSelectedDialogueNode(null);
              setSelectedNPC(null);
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
          if (result.type === 'dialogue' && result.dialogueNode && result.npc) {
            setSelectedDialogueNode(result.dialogueNode);
            setSelectedNPC(result.npc);
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
