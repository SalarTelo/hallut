/**
 * Modulmotor-komponent
 * Huvudorchestrator för modulens livscykel
 * Använder moduleOrchestrator och alla stores
 */

import { useEffect } from 'react';
import { useModuleLoading } from '@ui/shared/hooks/index.js';
import { useModuleActions } from '@stores/moduleStore/index.js';
import { getWelcomeDialogueId } from '@constants/module.constants.js';
import { getThemeValue, applyTheme, resetTheme } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';
import { Button } from '@ui/shared/components/Button.js';
import { Card } from '@ui/shared/components/Card.js';
import { Badge } from '@ui/shared/components/Badge.js';
import { LoadingState } from '@ui/shared/components/LoadingState.js';
import { ErrorDisplay } from '@ui/shared/components/ErrorDisplay.js';
import { Overlay } from '@ui/shared/components/Overlay.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';
import {
  WelcomeView,
  TaskView,
  DialogueInteractableView,
  InteractableView,
} from './views/index.js';
import { TaskError, DialogueError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';
import { useModuleViewState, useModuleCallbacks } from './hooks/index.js';

export interface ModuleEngineProps {
  /**
   * Modul-ID att ladda
   */
  moduleId: string;

  /**
   * Lokalisering
   */
  locale?: string;

  /**
   * Callback när modulen ska avslutas
   */
  onExit?: () => void;
}

/**
 * Modulmotor-komponent
 */
export function ModuleEngine({
  moduleId,
  locale,
  onExit,
}: ModuleEngineProps) {
  // Vy- och valstatus
  const {
    currentView,
    selectedTaskId,
    selectedDialogueId,
    setSelectedDialogueId,
    chatOpen,
    setChatOpen,
    imageViewer,
    imageAnalysisOpen,
    setImageAnalysisOpen,
    navigateToTask,
    navigateToDialogue,
    navigateToInteractable,
    openImageViewer,
    closeImageViewer,
    openTaskSubmissionFromDialogue,
  } = useModuleViewState();

  const { hasSeenGreeting, markGreetingSeen } = useModuleActions();

  // Modulladdningshook
  const { state, send, currentModule, isLoading, isError, error } = useModuleLoading({
    moduleId,
    locale: locale,
    onError: (err) => {
      handleError(err, { context: 'modulladdning' });
    },
  });

  // Modulinteraktions-callbacks
  const { handleTaskComplete, handleInteractableClick } = useModuleCallbacks({
    moduleId,
    locale,
    currentModule,
    selectedTaskId,
    onNavigateToTask: navigateToTask,
    onNavigateToDialogue: navigateToDialogue,
    onNavigateToInteractable: navigateToInteractable,
    onChatOpen: () => setChatOpen(true),
    onImageOpen: openImageViewer,
    onImageAnalysisOpen: () => setImageAnalysisOpen(true),
  });

  // Visa välkomstdialog om inte sedd
  useEffect(() => {
    if (state.value === 'running' && currentModule && currentView === 'welcome') {
      const welcomeDialogueId = getWelcomeDialogueId(moduleId);
      if (!hasSeenGreeting(moduleId, welcomeDialogueId)) {
        markGreetingSeen(moduleId, welcomeDialogueId);
      }
    }
  }, [state.value, currentModule, currentView, moduleId, hasSeenGreeting, markGreetingSeen]);

  // Tillämpa modultema
  useEffect(() => {
    if (currentModule?.config.theme) {
      applyTheme(currentModule.config.theme);
    }
    return () => {
      resetTheme();
    };
  }, [currentModule]);

  // Rendera laddningsstatus
  if (isLoading) {
    return <LoadingState message="Laddar modul..." />;
  }

  // Rendera felstatus
  if (isError) {
    return (
      <ErrorDisplay
        error={error || new Error('Kunde inte ladda modul')}
        onAction={() => send({ type: 'EXIT_MODULE' })}
      />
    );
  }

  // Rendera modulinnehåll
  if (state.value === 'running' && currentModule) {
    const welcomeDialogueId = getWelcomeDialogueId(moduleId);
    const welcomeDialogue = currentModule.dialogues[welcomeDialogueId];

    // Visa välkomstdialog (helsida, inte överlägg)
    if (currentView === 'welcome' && welcomeDialogue) {
      return (
        <WelcomeView
          moduleId={moduleId}
          moduleData={currentModule}
          onComplete={navigateToInteractable}
        />
      );
    }

    // Förbered uppgiftsöverlägg
    let taskOverlay = null;
    if (currentView === 'task' && selectedTaskId) {
      const task = currentModule.tasks.find((t: { id: string }) => t.id === selectedTaskId);
      if (!task) {
        const taskError = new TaskError(
          ErrorCode.TASK_NOT_FOUND,
          selectedTaskId,
          `Uppgift hittades inte: ${selectedTaskId}`,
          moduleId
        );
        handleError(taskError);
        navigateToInteractable();
      } else {
        taskOverlay = (
          <Overlay
            isOpen={true}
            onClose={navigateToInteractable}
            closeOnEscape={true}
            closeOnOverlayClick={true}
            blurIntensity="md"
          >
            <TaskView
              task={task}
              moduleId={moduleId}
              onComplete={handleTaskComplete}
              onClose={navigateToInteractable}
            />
          </Overlay>
        );
      }
    }

    let dialogueOverlay = null;
    if (currentView === 'dialogue' && selectedDialogueId) {
      const dialogue = currentModule.dialogues[selectedDialogueId];
      if (!dialogue) {
        const dialogueError = new DialogueError(
          ErrorCode.DIALOGUE_NOT_FOUND,
          selectedDialogueId,
          `Dialog hittades inte: ${selectedDialogueId}. Tillgängliga dialoger: ${Object.keys(currentModule.dialogues).join(', ')}`,
          moduleId
        );
        handleError(dialogueError);
        setSelectedDialogueId(null);
        navigateToInteractable();
      } else {
        dialogueOverlay = (
          <Overlay
            isOpen={true}
            onClose={() => {
              setSelectedDialogueId(null);
              navigateToInteractable();
            }}
            closeOnEscape={true}
            closeOnOverlayClick={true}
            blurIntensity="md"
          >
            <DialogueInteractableView
              dialogueId={selectedDialogueId}
              moduleId={moduleId}
              dialogue={dialogue}
              locale={locale}
              onComplete={() => {
                setSelectedDialogueId(null);
                navigateToInteractable();
              }}
              onTaskSubmissionOpen={openTaskSubmissionFromDialogue}
              onError={handleError}
            />
          </Overlay>
        );
      }
    }

    // Rendera alltid interaktiv vy som bas med överlägg ovanpå
    return (
      <>
        <InteractableView
          moduleData={currentModule}
          moduleId={moduleId}
          locale={locale}
          onExit={onExit || (() => send({ type: 'EXIT_MODULE' }))}
          onInteractableClick={handleInteractableClick}
          chatOpen={chatOpen}
          onChatClose={() => setChatOpen(false)}
          imageViewerOpen={imageViewer.open}
          imageViewerUrl={imageViewer.url}
          imageViewerTitle={imageViewer.title}
          onImageViewerClose={closeImageViewer}
          imageAnalysisOpen={imageAnalysisOpen}
          onImageAnalysisClose={() => setImageAnalysisOpen(false)}
        />
        {taskOverlay}
        {dialogueOverlay}
      </>
    );
  }

  // Rendera slutförd status
  if (state.value === 'completed') {
    const borderColor = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
    return (
      <CenteredLayout>
        <Card padding="lg" dark pixelated className="max-w-md animate-scale-in" borderColor={borderColor}>
          <div className="text-center space-y-4">
            <Badge variant="success" size="lg">
              Modul slutförd!
            </Badge>
            <p className="text-gray-300">Grattis! Du har slutfört denna modul.</p>
            <div className="flex justify-center space-x-2">
              <Button
                variant="primary"
                pixelated
                onClick={onExit || (() => send({ type: 'EXIT_MODULE' }))}
                size="md"
              >
                Tillbaka till val
              </Button>
            </div>
          </div>
        </Card>
      </CenteredLayout>
    );
  }

  return null;
}
