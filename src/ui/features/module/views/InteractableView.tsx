/**
 * Interaktiv vy-komponent
 * Huvudvy som visar interaktiva objekt och modulbakgrund
 */

import { memo, useMemo, useRef, useEffect } from 'react';
import { ModuleBackground } from '@ui/shared/components/ModuleBackground.js';
import { PixelIcon } from '@ui/shared/components/PixelIcon.js';
import { InteractableIcon } from '@ui/shared/components/InteractableIcon.js';
import { TaskTracker } from '@ui/shared/components/TaskTracker.js';
import { ChatWindow } from '@ui/shared/components/ChatWindow.js';
import { ImageViewer } from '@ui/shared/components/ImageViewer.js';
import { ModuleProgressIndicator } from '@ui/shared/components/ModuleProgressIndicator.js';
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
  const headerRef = useRef<HTMLDivElement>(null);

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

  // Uppdatera CSS-variabel med header-höjd
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--module-header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    // Observera för ändringar i header-storlek
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ModuleBackground imageUrl={backgroundImage} color={backgroundColor}>
      <div className="relative min-h-screen">
        {/* Kompakt header */}
        <div
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-30 px-5 py-3 border-b-2"
          style={{
            borderColor,
            background: `linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 35, 0.95) 100%)`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.6), 0 0 8px ${borderColor}30`,
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${borderColor}20`,
                  border: `2px solid ${borderColor}50`,
                }}
              >
                <PixelIcon type="star" size={18} color={borderColor} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-yellow-300 leading-tight">
                  {moduleData.config.manifest.name}
                </h1>
                <span className="text-gray-400 text-[10px] font-mono leading-tight">
                  {moduleId}
                </span>
              </div>
            </div>
            <button
              onClick={onExit}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all border-2"
              style={{
                borderColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.backgroundColor = `${borderColor}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <PixelIcon type="arrow-left" size={16} color="currentColor" />
              <span>Avsluta</span>
            </button>
          </div>
        </div>

        {/* Interaktiva objekt - Positionsbaserade */}
        <div className="relative w-full h-screen pt-16">
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

        {/* Modulförloppsindikator */}
        <ModuleProgressIndicator
          moduleData={moduleData}
          moduleId={moduleId}
          borderColor={borderColor}
        />

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
