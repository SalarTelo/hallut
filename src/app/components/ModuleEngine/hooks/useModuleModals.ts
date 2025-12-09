/**
 * useModuleModals Hook
 * Manages modal states for content viewers
 * 
 * Uses a generic modal state that works for all component types (predefined and custom)
 */

import { useState } from 'react';

/**
 * Generic modal state - stores component name and props
 */
export interface ModalState {
  component: string;
  props: Record<string, unknown>;
}

export interface UseModuleModalsReturn {
  /**
   * Current modal state (null if no modal open)
   */
  modal: ModalState | null;
  
  /**
   * Open a modal by component name with props
   */
  openModal: (component: string, props?: Record<string, unknown>) => void;
  
  /**
   * Close the current modal
   */
  closeModal: () => void;
  
  /**
   * Handle component open (used by interactable actions)
   * Converts component props to the right format for predefined components
   */
  handleComponentOpen: (component: string, props?: Record<string, unknown>) => void;
}

/**
 * Hook for managing module modal states
 * Uses a single generic modal state for all component types
 */
export function useModuleModals(): UseModuleModalsReturn {
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = (component: string, props?: Record<string, unknown>) => {
    setModal({ component, props: props || {} });
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleComponentOpen = (component: string, props?: Record<string, unknown>) => {
    // For predefined components, normalize props to match what the component expects
    const normalizedProps: Record<string, unknown> = { ...props };

    // Apply defaults for predefined components if props are missing
    switch (component) {
      case 'ChatWindow':
        if (!normalizedProps.title) {
          normalizedProps.title = 'AI Companion';
        }
        if (!normalizedProps.placeholder) {
          normalizedProps.placeholder = 'Ask me anything...';
        }
        break;
      // Other predefined components use props as-is
    }

    openModal(component, normalizedProps);
  };

  return {
    modal,
    openModal,
    closeModal,
    handleComponentOpen,
  };
}

