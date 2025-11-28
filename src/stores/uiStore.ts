/**
 * UI Store
 * Manages UI state (modals, panels, etc.)
 */

import { create } from 'zustand';

/**
 * UI store state
 */
interface UIStoreState {
  // Modals
  openModals: Set<string>;

  // Panels
  openPanels: Set<string>;

  // Loading states
  loadingStates: Record<string, boolean>;

  // Actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
}

/**
 * Create the UI store
 */
export const useUIStore = create<UIStoreState>((set, get) => ({
  // Initial state
  openModals: new Set(),
  openPanels: new Set(),
  loadingStates: {},

  // Open modal
  openModal: (modalId) => {
    const modals = new Set(get().openModals);
    modals.add(modalId);
    set({ openModals: modals });
  },

  // Close modal
  closeModal: (modalId) => {
    const modals = new Set(get().openModals);
    modals.delete(modalId);
    set({ openModals: modals });
  },

  // Check if modal is open
  isModalOpen: (modalId) => {
    return get().openModals.has(modalId);
  },

  // Open panel
  openPanel: (panelId) => {
    const panels = new Set(get().openPanels);
    panels.add(panelId);
    set({ openPanels: panels });
  },

  // Close panel
  closePanel: (panelId) => {
    const panels = new Set(get().openPanels);
    panels.delete(panelId);
    set({ openPanels: panels });
  },

  // Check if panel is open
  isPanelOpen: (panelId) => {
    return get().openPanels.has(panelId);
  },

  // Set loading state
  setLoading: (key, loading) => {
    set({
      loadingStates: {
        ...get().loadingStates,
        [key]: loading,
      },
    });
  },

  // Check loading state
  isLoading: (key) => {
    return get().loadingStates[key] || false;
  },
}));

/**
 * Selector hooks
 */
export const useModal = (modalId: string) =>
  useUIStore((state) => ({
    isOpen: state.isModalOpen(modalId),
    open: () => state.openModal(modalId),
    close: () => state.closeModal(modalId),
  }));

export const usePanel = (panelId: string) =>
  useUIStore((state) => ({
    isOpen: state.isPanelOpen(panelId),
    open: () => state.openPanel(panelId),
    close: () => state.closePanel(panelId),
  }));

export const useLoading = (key: string) =>
  useUIStore((state) => ({
    isLoading: state.isLoading(key),
    setLoading: (loading: boolean) => state.setLoading(key, loading),
  }));

