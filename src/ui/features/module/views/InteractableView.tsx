/**
 * Interaktiv vy-komponent
 * Huvudvy som visar interaktiva objekt och modulbakgrund
 */

import { memo, useMemo } from 'react';
import { ModuleBackground } from '@ui/shared/components/ModuleBackground.js';
import { Card } from '@ui/shared/components/Card.js';
import { Button } from '@ui/shared/components/Button.js';
import { InteractableIcon } from '@ui/shared/components/InteractableIcon.js';
import { TaskTracker } from '@ui/shared/components/TaskTracker.js';
import { ChatWindow } from '@ui/shared/components/ChatWindow.js';
import { ImageViewer } from '@ui/shared/components/ImageViewer.js';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';
import { getTaskIdFromRequirement, getModuleIdFromRequirement } from '@constants/module.constants.js';
import type { ModuleData } from '@types/module/moduleConfig.types.js';
import { useModuleActions } from '@stores/moduleStore/index.js';

export interface InteractableViewProps {
  moduleData: ModuleData;
  moduleId: string;
  locale?: string;
  onExit: () => void;
  onInteractableClick: (interactableId: string) => void;
  chatOpen: boolean;
  onChatClose: () => void;
  imageViewerOpen: boolean;
  imageViewerUrl: string;
  imageViewerTitle: string;
  onImageViewerClose: () => void;
}

/**
 * Interaktiv vy-komponent
 */
export const InteractableView = memo(function InteractableView({
  moduleData,
  moduleId,
  locale,
  onExit,
  onInteractableClick,
  chatOpen,
  onChatClose,
  imageViewerOpen,
  imageViewerUrl,
  imageViewerTitle,
  onImageViewerClose,
}: InteractableViewProps) {
  const { isTaskCompleted, isModuleCompleted, getCurrentTaskId } = useModuleActions();

  const moduleTheme = moduleData.config.theme;
  const borderColor = useMemo(
    () => moduleTheme?.borderColor || getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR),
    [moduleTheme]
  );
  const backgroundImage = moduleData.config.background.image;
  const backgroundColor = moduleData.config.background.color;

  const activeTask = useMemo(() => {
    const activeTaskId = getCurrentTaskId(moduleId);
    return activeTaskId
      ? moduleData.tasks.find((t) => t.id === activeTaskId) || null
      : null;
  }, [moduleId, moduleData.tasks, getCurrentTaskId]);

  return (
    <ModuleBackground imageUrl={backgroundImage} color={backgroundColor}>
      <div className="relative min-h-screen">
        {/* Rubrik - Kompakt */}
        <Card
          padding="sm"
          dark
          pixelated
          className="m-2 mb-4"
          style={{ borderColor: borderColor }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white pixelated">
                {moduleData.config.manifest.name}
              </h1>
            </div>
            <Button variant="ghost" pixelated onClick={onExit} size="sm">
              ← Avsluta
            </Button>
          </div>
        </Card>

        {/* Interaktiva objekt - Positionsbaserade */}
        <div className="relative w-full h-[calc(100vh-120px)]">
          {moduleData.config.interactables.map((interactable) => {
            // Kontrollera om interaktivt objekt är låst baserat på unlockRequirement
            let isLocked = interactable.locked;
            
            if (interactable.unlockRequirement) {
              // Kontrollera uppgiftsslutförandekrav
              const requiredTaskId = getTaskIdFromRequirement(interactable.unlockRequirement);
              if (requiredTaskId) {
                isLocked = !isTaskCompleted(moduleId, requiredTaskId);
              }
              
              // Kontrollera modulslutförandekrav
              const requiredModuleId = getModuleIdFromRequirement(interactable.unlockRequirement);
              if (requiredModuleId) {
                isLocked = !isModuleCompleted(requiredModuleId);
              }
            }
            
            const canInteract = !isLocked;

            return (
              <InteractableIcon
                key={interactable.id}
                icon={interactable.avatar || '📍'}
                position={interactable.position}
                label={interactable.name}
                locked={isLocked}
                onClick={() => canInteract && onInteractableClick(interactable.id)}
                size={64}
              />
            );
          })}
        </div>

        {/* Uppgiftsspårare - Flytande uppdragslogg */}
        <TaskTracker activeTask={activeTask} borderColor={borderColor} />

        {/* Chattfönster */}
        <ChatWindow
          isOpen={chatOpen}
          onClose={onChatClose}
          title="AI-kompanjon"
          borderColor={borderColor}
        />

        {/* Bildvisare */}
        <ImageViewer
          isOpen={imageViewerOpen}
          onClose={onImageViewerClose}
          imageUrl={imageViewerUrl}
          title={imageViewerTitle}
          borderColor={borderColor}
        />
      </div>
    </ModuleBackground>
  );
});
