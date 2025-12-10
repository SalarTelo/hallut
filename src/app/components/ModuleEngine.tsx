/**
 * Module Engine
 * Main orchestrator for module lifecycle
 * 
 * This component has been refactored to use extracted hooks and components
 * for better maintainability and separation of concerns.
 */

import { useEffect, useState } from 'react';
import { useInteractableActions } from '@app/hooks/index.js';
import { getThemeValue } from '../../shared/index.js';
import { InteractableView } from '@ui/views/InteractableView.js';
import { WelcomeView } from '@ui/views/WelcomeView.js';
import { LoadingState } from '@ui/shared/components/feedback/index.js';
import { ErrorDisplay } from '@ui/shared/components/feedback/index.js';
import { useModuleLoader } from '@app/components/ModuleEngine/hooks/index.js';
import { useModuleViews } from '@app/components/ModuleEngine/hooks/index.js';
import { useModuleModals } from '@app/components/ModuleEngine/hooks/index.js';
import { TaskOverlay, DialogueOverlay, ContentModals } from '@app/components/ModuleEngine/components/index.js';
import { TaskOfferModal } from '@ui/shared/components/game/index.js';
import { createDialogueContext } from '@app/components/ModuleEngine/utils/index.js';
import { actions } from '@core/state/actions.js';
import { getTaskId } from '@core/task/utils.js';
import type { ModuleEngineProps } from '@app/components/ModuleEngine/types.js';
import type { Task } from '@core/task/types.js';

export type { ModuleEngineProps };

/**
 * Module Engine component
 */
export function ModuleEngine({ moduleId, locale = 'sv', onExit, customComponents, onViewChange }: ModuleEngineProps) {
  // Load module data
  const { moduleData, loading, error } = useModuleLoader(moduleId);
  
  // Merge module components with manually provided customComponents (manual takes precedence)
  const allCustomComponents = {
    ...moduleData?.components,
    ...customComponents,
  };

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

  // Notify parent of view changes
  useEffect(() => {
    onViewChange?.(currentView);
  }, [currentView, onViewChange]);

  // Manage modal states
  const {
    modal,
    handleComponentOpen,
    closeModal,
  } = useModuleModals();

  // Task offer modal state
  const [offeredTask, setOfferedTask] = useState<Task | null>(null);

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

  // Handle task offer
  const handleTaskOffer = (task: Task | string) => {
    const taskId = getTaskId(task);
    const taskObj = moduleData?.tasks.find((t) => t.id === taskId);
    if (taskObj) {
      setOfferedTask(taskObj);
    }
  };

  // Handle task offer acceptance
  const handleTaskOfferAccept = () => {
    if (offeredTask) {
      actions.acceptTask(moduleId, offeredTask);
      setOfferedTask(null);
      // Close dialogue if open
      closeDialogue();
    }
  };

  // Handle task offer decline
  const handleTaskOfferDecline = () => {
    setOfferedTask(null);
  };

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
    ? createDialogueContext(moduleId, locale, moduleData, openTask, handleTaskOffer)
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

      {/* Task Offer Modal */}
      {offeredTask && (
        <TaskOfferModal
          isOpen={!!offeredTask}
          task={offeredTask}
          onAccept={handleTaskOfferAccept}
          onDecline={handleTaskOfferDecline}
          borderColor={borderColor}
        />
      )}

      {/* Content modals */}
      <ContentModals
        modal={modal}
        onClose={closeModal}
        borderColor={borderColor}
        customComponents={Object.keys(allCustomComponents).length > 0 ? allCustomComponents : undefined}
      />
    </>
  );
}
