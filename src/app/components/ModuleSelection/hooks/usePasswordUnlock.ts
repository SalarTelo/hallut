/**
 * usePasswordUnlock Hook
 * Handles password unlock modal state and logic
 */

import { useState } from 'react';
import { getModule } from '@core/module/registry.js';
import { unlockModule } from '@core/unlock/service.js';

export interface PasswordModalState {
  moduleId: string;
  hint?: string;
  moduleName: string;
}

export interface UsePasswordUnlockReturn {
  passwordModal: PasswordModalState | null;
  openPasswordModal: (moduleId: string) => void;
  closePasswordModal: () => void;
  handlePasswordUnlock: (password: string) => Promise<boolean>;
}

/**
 * Hook for managing password unlock functionality
 */
export function usePasswordUnlock(
  onModuleUnlocked: (moduleId: string) => void
): UsePasswordUnlockReturn {
  const [passwordModal, setPasswordModal] = useState<PasswordModalState | null>(null);

  const openPasswordModal = (moduleId: string) => {
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

  const closePasswordModal = () => {
    setPasswordModal(null);
  };

  const handlePasswordUnlock = async (password: string): Promise<boolean> => {
    if (!passwordModal) return false;

    const { success } = await unlockModule(passwordModal.moduleId, password);

    if (success) {
      setPasswordModal(null);
      onModuleUnlocked(passwordModal.moduleId);
      return true;
    }

    return false;
  };

  return {
    passwordModal,
    openPasswordModal,
    closePasswordModal,
    handlePasswordUnlock,
  };
}

