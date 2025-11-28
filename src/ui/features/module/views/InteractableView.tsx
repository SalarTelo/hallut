/**
 * Interaktiv vy-komponent
 * Huvudvy som visar interaktiva objekt och modulbakgrund
 */

import { memo, useMemo } from 'react';
import { ModuleBackground } from '@ui/shared/components/ModuleBackground.js';
import { Button } from '@ui/shared/components/Button.js';
import { PixelIcon } from '@ui/shared/components/PixelIcon.js';
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
        {/* Kompakt header */}
        <div
          className="fixed top-0 left-0 right-0 z-30 px-3 py-2 bg-black/90 backdrop-blur-sm border-b-2 pixelated"
          style={{
            borderColor,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.5)`,
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              <h1 className="text-sm font-bold text-yellow-300 pixelated">
                {moduleData.config.manifest.name}
              </h1>
              <span className="text-gray-500 text-[10px] font-mono">
                {moduleId}
              </span>
            </div>
            <Button
              variant="ghost"
              pixelated
              onClick={onExit}
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <PixelIcon type="arrow-left" size={16} color="currentColor" />
              <span>Avsluta</span>
            </Button>
          </div>
        </div>

        {/* Interaktiva objekt - Positionsbaserade */}
        <div className="relative w-full h-screen pt-12">
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
