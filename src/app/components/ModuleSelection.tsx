/**
 * Module Selection
 * Component for selecting a module to play
 * Shows a worldmap-style view of available modules
 * 
 * This component has been refactored to use extracted hooks and components
 * for better maintainability and separation of concerns.
 */

import { LoadingState } from '@ui/shared/components/feedback/index.js';
import { FullScreenLayout } from '@ui/shared/components/layouts/index.js';
import { PasswordUnlockModal } from '@ui/shared/components/game/index.js';
import { useWorldmapLoader } from './ModuleSelection/hooks/useWorldmapLoader.js';
import { usePasswordUnlock } from './ModuleSelection/hooks/usePasswordUnlock.js';
import { WorldmapHeader } from './ModuleSelection/components/WorldmapHeader.js';
import { WorldmapContent } from './ModuleSelection/components/WorldmapContent.js';

export interface ModuleSelectionProps {
  onSelectModule: (moduleId: string) => void;
}

/**
 * Module Selection component
 */
export function ModuleSelection({ onSelectModule }: ModuleSelectionProps) {
  // Load worldmap
  const { worldmap, loading, error } = useWorldmapLoader();

  // Handle password unlock
  const { passwordModal, openPasswordModal, closePasswordModal, handlePasswordUnlock } =
    usePasswordUnlock(onSelectModule);

  // Loading state
  if (loading) {
    return <LoadingState message="Loading worldmap..." />;
  }

  // Error state
  if (error) {
    return <LoadingState message="Failed to load worldmap" />;
  }

  // No worldmap
  if (!worldmap) {
    return <LoadingState message="No modules found" />;
  }

  return (
    <FullScreenLayout>
      <div className="w-full h-screen flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Header */}
        <WorldmapHeader />

        {/* Worldmap Content */}
        <WorldmapContent
          worldmap={worldmap}
          onSelectModule={onSelectModule}
          onPasswordRequired={openPasswordModal}
        />

        {/* Password Unlock Modal */}
        <PasswordUnlockModal
          isOpen={passwordModal !== null}
          onClose={closePasswordModal}
          onUnlock={handlePasswordUnlock}
          hint={passwordModal?.hint}
          moduleName={passwordModal?.moduleName}
        />
      </div>
    </FullScreenLayout>
  );
}
