/**
 * useModuleViewState Hook
 * Manages view state and selection state for module navigation
 */

import { useState, useCallback } from 'react';

export type ModuleView = 'welcome' | 'task' | 'interactable' | 'dialogue';

export interface ImageViewerState {
  open: boolean;
  url: string;
  title: string;
}

export interface UseModuleViewStateReturn {
  /**
   * Current view
   */
  currentView: ModuleView;

  /**
   * Set current view
   */
  setCurrentView: (view: ModuleView) => void;

  /**
   * Currently selected task ID
   */
  selectedTaskId: string | null;

  /**
   * Set selected task ID
   */
  setSelectedTaskId: (taskId: string | null) => void;

  /**
   * Currently selected dialogue ID
   */
  selectedDialogueId: string | null;

  /**
   * Set selected dialogue ID
   */
  setSelectedDialogueId: (dialogueId: string | null) => void;

  /**
   * Whether chat is open
   */
  chatOpen: boolean;

  /**
   * Set chat open state
   */
  setChatOpen: (open: boolean) => void;

  /**
   * Image viewer state
   */
  imageViewer: ImageViewerState;

  /**
   * Set image viewer state
   */
  setImageViewer: (state: ImageViewerState) => void;

  /**
   * Navigate to task view
   */
  navigateToTask: (taskId: string) => void;

  /**
   * Navigate to dialogue view
   */
  navigateToDialogue: (dialogueId: string) => void;

  /**
   * Navigate to interactable view
   */
  navigateToInteractable: () => void;

  /**
   * Open image viewer
   */
  openImageViewer: (url: string, title: string) => void;

  /**
   * Close image viewer
   */
  closeImageViewer: () => void;

  /**
   * Open task submission from dialogue
   */
  openTaskSubmissionFromDialogue: (taskId: string) => void;
}

/**
 * Hook for managing module view state
 */
export function useModuleViewState(): UseModuleViewStateReturn {
  const [currentView, setCurrentView] = useState<ModuleView>('welcome');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedDialogueId, setSelectedDialogueId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [imageViewer, setImageViewer] = useState<ImageViewerState>({
    open: false,
    url: '',
    title: '',
  });

  // Navigation helpers
  const navigateToTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView('task');
  }, []);

  const navigateToDialogue = useCallback((dialogueId: string) => {
    setSelectedDialogueId(dialogueId);
    setCurrentView('dialogue');
  }, []);

  const navigateToInteractable = useCallback(() => {
    setCurrentView('interactable');
    setSelectedTaskId(null);
    setSelectedDialogueId(null);
  }, []);

  // Image viewer helpers
  const openImageViewer = useCallback((url: string, title: string) => {
    setImageViewer({ open: true, url, title });
  }, []);

  const closeImageViewer = useCallback(() => {
    setImageViewer({ open: false, url: '', title: '' });
  }, []);

  // Task submission from dialogue
  const openTaskSubmissionFromDialogue = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView('task');
    setSelectedDialogueId(null);
  }, []);

  return {
    currentView,
    setCurrentView,
    selectedTaskId,
    setSelectedTaskId,
    selectedDialogueId,
    setSelectedDialogueId,
    chatOpen,
    setChatOpen,
    imageViewer,
    setImageViewer,
    navigateToTask,
    navigateToDialogue,
    navigateToInteractable,
    openImageViewer,
    closeImageViewer,
    openTaskSubmissionFromDialogue,
  };
}

