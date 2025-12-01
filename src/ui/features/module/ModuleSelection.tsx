/**
 * Module Selection
 * Component for selecting a module to play
 * Shows a worldmap-style view of available modules
 */

import { useEffect, useState } from 'react';
import { discoverModules, getModule } from '../../../core/module/registry.js';
import { loadModuleInstance } from '../../../core/module/loader.js';
import { generateWorldmap } from '../../../core/services/worldmap.js';
import type { WorldmapConfig } from '../../../core/types/worldmap.js';
import { initializeModuleProgression, unlockModule } from '../../../core/services/unlockService.js';
import { ModulePath } from '../../shared/components/ModulePath.js';
import { LoadingState } from '../../shared/components/LoadingState.js';
import { FullScreenLayout } from '../../shared/components/layouts/index.js';
import { PasswordUnlockModal } from '../../shared/components/PasswordUnlockModal.js';

export interface ModuleSelectionProps {
  onSelectModule: (moduleId: string) => void;
}

/**
 * Module Selection component
 */
export function ModuleSelection({ onSelectModule }: ModuleSelectionProps) {
  const [worldmap, setWorldmap] = useState<WorldmapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordModal, setPasswordModal] = useState<{
    moduleId: string;
    hint?: string;
    moduleName: string;
  } | null>(null);

  useEffect(() => {
    const loadWorldmap = async () => {
      try {
        // Discover modules
        const moduleIds = await discoverModules();
        
        // Load all modules to register them (needed for worldmap generation)
        for (const moduleId of moduleIds) {
          await loadModuleInstance(moduleId);
        }
        
        // Initialize module progression using unlock service
        await initializeModuleProgression(moduleIds);
        
        // Generate worldmap configuration
        const config = await generateWorldmap(moduleIds);
        setWorldmap(config);
      } catch (error) {
        console.error('Error loading worldmap:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorldmap();
  }, []);

  const handlePasswordRequired = (moduleId: string) => {
    const module = getModule(moduleId);
    const unlockReq = module?.config.unlockRequirement;
    
    if (unlockReq?.type === 'password') {
      setPasswordModal({
        moduleId,
        hint: unlockReq.hint,
        moduleName: module?.config.manifest.name || moduleId,
      });
    }
  };

  const handlePasswordUnlock = async (password: string): Promise<boolean> => {
    if (!passwordModal) return false;
    
    const { success } = await unlockModule(passwordModal.moduleId, password);
    
    if (success) {
      setPasswordModal(null);
      onSelectModule(passwordModal.moduleId);
      return true;
    }
    
    return false;
  };

  if (loading) {
    return <LoadingState message="Loading worldmap..." />;
  }

  if (!worldmap) {
    return <LoadingState message="No modules found" />;
  }

  return (
    <FullScreenLayout>
      <div className="w-full h-screen flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Titlebar */}
        <div 
          className="w-full px-6 py-4 border-b-2 flex items-center justify-between flex-shrink-0"
          style={{
            borderColor: '#FFD700',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h1 
            className="text-2xl font-bold pixelated"
            style={{ 
              color: '#FFD700',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(255, 215, 0, 0.5)',
            }}
          >
            Världskarta
          </h1>
          <div className="text-sm text-gray-400 pixelated">
            Välj en modul att utforska
          </div>
        </div>

        {/* Worldmap - takes up remaining space */}
        <div className="flex-1 w-full p-4 overflow-hidden">
          <div className="w-full h-full" style={{ position: 'relative' }}>
            <ModulePath 
              worldmap={worldmap} 
              onSelectModule={onSelectModule}
              onPasswordRequired={handlePasswordRequired}
            />
          </div>
        </div>

        {/* Password Unlock Modal */}
        <PasswordUnlockModal
          isOpen={passwordModal !== null}
          onClose={() => setPasswordModal(null)}
          onUnlock={handlePasswordUnlock}
          hint={passwordModal?.hint}
          moduleName={passwordModal?.moduleName}
        />
      </div>
    </FullScreenLayout>
  );
}

