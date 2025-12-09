/**
 * useModuleModals Hook
 * Manages modal states for content viewers
 */

import { useState } from 'react';

export interface ImageModalState {
  url: string;
  title?: string;
}

export interface NoteModalState {
  content: string;
  title?: string;
}

export interface SignModalState {
  content: string;
  title?: string;
}

export interface ChatModalState {
  title?: string;
  placeholder?: string;
}

export interface UseModuleModalsReturn {
  imageModal: ImageModalState | null;
  noteModal: NoteModalState | null;
  signModal: SignModalState | null;
  chatModal: ChatModalState | null;
  openImageModal: (url: string, title?: string) => void;
  openNoteModal: (content: string, title?: string) => void;
  openSignModal: (content: string, title?: string) => void;
  openChatModal: (title?: string, placeholder?: string) => void;
  closeImageModal: () => void;
  closeNoteModal: () => void;
  closeSignModal: () => void;
  closeChatModal: () => void;
  handleComponentOpen: (component: string, props?: Record<string, unknown>) => void;
}

/**
 * Hook for managing module modal states
 */
export function useModuleModals(): UseModuleModalsReturn {
  const [imageModal, setImageModal] = useState<ImageModalState | null>(null);
  const [noteModal, setNoteModal] = useState<NoteModalState | null>(null);
  const [signModal, setSignModal] = useState<SignModalState | null>(null);
  const [chatModal, setChatModal] = useState<ChatModalState | null>(null);

  const openImageModal = (url: string, title?: string) => {
    setImageModal({ url, title });
  };

  const openNoteModal = (content: string, title?: string) => {
    setNoteModal({ content, title });
  };

  const openSignModal = (content: string, title?: string) => {
    setSignModal({ content, title });
  };

  const openChatModal = (title?: string, placeholder?: string) => {
    setChatModal({ title, placeholder });
  };

  const closeImageModal = () => setImageModal(null);
  const closeNoteModal = () => setNoteModal(null);
  const closeSignModal = () => setSignModal(null);
  const closeChatModal = () => setChatModal(null);

  const handleComponentOpen = (component: string, props?: Record<string, unknown>) => {
    switch (component) {
      case 'ChatWindow':
        openChatModal(
          (props?.title as string) || 'AI Companion',
          (props?.placeholder as string) || 'Ask me anything...'
        );
        break;
      case 'SignViewer':
        openSignModal(
          (props?.content as string) || '',
          props?.title as string | undefined
        );
        break;
      case 'NoteViewer':
        openNoteModal(
          (props?.content as string) || '',
          props?.title as string | undefined
        );
        break;
      case 'ImageViewer':
        openImageModal(
          (props?.imageUrl as string) || '',
          props?.title as string | undefined
        );
        break;
      default:
        console.warn(
          `[ModuleEngine] Unknown component "${component}" requested. ` +
          `Predefined components: ChatWindow, SignViewer, NoteViewer, ImageViewer. ` +
          `Custom components need to be handled by module-specific code.`,
          { component, props }
        );
    }
  };

  return {
    imageModal,
    noteModal,
    signModal,
    chatModal,
    openImageModal,
    openNoteModal,
    openSignModal,
    openChatModal,
    closeImageModal,
    closeNoteModal,
    closeSignModal,
    closeChatModal,
    handleComponentOpen,
  };
}

