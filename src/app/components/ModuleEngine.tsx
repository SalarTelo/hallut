/**
 * Module Engine
 * Main orchestrator for module lifecycle
 * 
 * This component has been refactored to use extracted hooks and components
 * for better maintainability and separation of concerns.
 */

import { useInteractableActions } from '@app/hooks/index.js';
import { getThemeValue } from '../../shared/theme.js';
import { InteractableView } from '@ui/views/InteractableView.js';
import { WelcomeView } from '@ui/views/WelcomeView.js';
import { LoadingState } from '@ui/shared/components/feedback/index.js';
import { ErrorDisplay } from '@ui/shared/components/feedback/index.js';
import { useModuleLoader } from './ModuleEngine/hooks/useModuleLoader.js';
import { useModuleViews } from './ModuleEngine/hooks/useModuleViews.js';
import { useModuleModals } from './ModuleEngine/hooks/useModuleModals.js';
import { TaskOverlay } from './ModuleEngine/components/TaskOverlay.js';
import { DialogueOverlay } from './ModuleEngine/components/DialogueOverlay.js';
import { ContentModals } from './ModuleEngine/components/ContentModals.js';
import { createDialogueContext } from './ModuleEngine/utils/dialogueHelpers.js';
import type { ModuleEngineProps } from './ModuleEngine/types.js';

export type { ModuleEngineProps } from './ModuleEngine/types.js';

/**
 * Module Engine component
 */
export function ModuleEngine({ moduleId, locale = 'sv', onExit }: ModuleEngineProps) {
  // Load module data
  const { moduleData, loading, error } = useModuleLoader(moduleId);

  // Manage views and navigation
  const {
    currentView,
    selectedDialogueNode,
    selectedNPC,
    selectedTaskId,
    openDialogue,
    openTask,
    closeDialogue,
    closeTask,
    returnToInteractable,
    setSelectedDialogueNode,
  } = useModuleViews(moduleId, moduleData);

  // Manage modal states
  const {
    imageModal,
    noteModal,
    signModal,
    chatModal,
    handleComponentOpen,
    closeImageModal,
    closeNoteModal,
    closeSignModal,
    closeChatModal,
  } = useModuleModals();

  // Handle interactable actions
  const { handleInteractableAction } = useInteractableActions({
    moduleId,
    moduleData: moduleData!,
    locale,
    onDialogueSelected: (node, npc) => {
      openDialogue(node, npc);
    },
    onComponentOpen: handleComponentOpen,
    onError: (err) => {
      console.error('Interactable action error:', err);
    },
  });

  // Loading state
  if (loading) {
    return <LoadingState message="Loading module..." />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onAction={onExit} />;
  }

  // No module data
  if (!moduleData) {
    return null;
  }

  // Welcome view
  if (currentView === 'welcome') {
    return (
      <WelcomeView
        moduleId={moduleId}
        moduleData={moduleData}
        onComplete={returnToInteractable}
      />
    );
  }

  // Create dialogue context
  const dialogueContext = moduleData
    ? createDialogueContext(moduleId, locale, moduleData, openTask)
    : null;

  // Get current task if task view is open
  const currentTask =
    currentView === 'task' && selectedTaskId
      ? moduleData.tasks.find((t) => t.id === selectedTaskId)
      : null;

  const borderColor = getThemeValue('border-color', '#FFD700');

  return (
    <>
      {/* Main interactable view */}
      <InteractableView
        moduleData={moduleData}
        moduleId={moduleId}
        onInteractableClick={async (interactable) => {
          const result = await handleInteractableAction(interactable);
          if (result.type === 'dialogue' && result.dialogueNode && result.npc) {
            openDialogue(result.dialogueNode, result.npc);
          }
        }}
        onExit={onExit}
      />

      {/* Task overlay */}
      {currentTask && dialogueContext && (
        <TaskOverlay
          isOpen={currentView === 'task'}
          task={currentTask}
          moduleId={moduleId}
          moduleData={moduleData}
          onClose={closeTask}
          onComplete={closeTask}
          onDialogueRequested={(node, npc) => {
            closeTask();
            openDialogue(node, npc);
          }}
        />
      )}

      {/* Dialogue overlay */}
      {selectedDialogueNode && selectedNPC && dialogueContext && (
        <DialogueOverlay
          isOpen={currentView === 'dialogue'}
          node={selectedDialogueNode}
          npc={selectedNPC}
          moduleId={moduleId}
          moduleData={moduleData}
          context={dialogueContext}
          onClose={closeDialogue}
          onTaskRequested={openTask}
          onNodeChange={setSelectedDialogueNode}
        />
      )}

      {/* Content modals */}
      <ContentModals
        imageModal={imageModal}
        noteModal={noteModal}
        signModal={signModal}
        chatModal={chatModal}
        borderColor={borderColor}
        onCloseImage={closeImageModal}
        onCloseNote={closeNoteModal}
        onCloseSign={closeSignModal}
        onCloseChat={closeChatModal}
      />
    </>
  );
}
