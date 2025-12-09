/**
 * Content Modals Component
 * Renders all content viewer modals (Image, Note, Sign, Chat)
 */

import { ImageViewer } from '@ui/shared/components/content/index.js';
import { NoteViewer } from '@ui/shared/components/content/index.js';
import { SignViewer } from '@ui/shared/components/content/index.js';
import { ChatWindow } from '@ui/shared/components/game/index.js';
import type {
  ImageModalState,
  NoteModalState,
  SignModalState,
  ChatModalState,
} from '../hooks/useModuleModals.js';

export interface ContentModalsProps {
  imageModal: ImageModalState | null;
  noteModal: NoteModalState | null;
  signModal: SignModalState | null;
  chatModal: ChatModalState | null;
  borderColor: string;
  onCloseImage: () => void;
  onCloseNote: () => void;
  onCloseSign: () => void;
  onCloseChat: () => void;
}

/**
 * Content Modals component
 * Renders all content viewer modals
 */
export function ContentModals({
  imageModal,
  noteModal,
  signModal,
  chatModal,
  borderColor,
  onCloseImage,
  onCloseNote,
  onCloseSign,
  onCloseChat,
}: ContentModalsProps) {
  return (
    <>
      {/* Image Modal */}
      <ImageViewer
        isOpen={imageModal !== null}
        onClose={onCloseImage}
        imageUrl={imageModal?.url || ''}
        title={imageModal?.title}
        borderColor={borderColor}
      />

      {/* Note Modal */}
      <NoteViewer
        isOpen={noteModal !== null}
        onClose={onCloseNote}
        content={noteModal?.content || ''}
        title={noteModal?.title}
        borderColor={borderColor}
      />

      {/* Sign Modal */}
      <SignViewer
        isOpen={signModal !== null}
        onClose={onCloseSign}
        content={signModal?.content || ''}
        title={signModal?.title}
        borderColor={borderColor}
      />

      {/* Chat Modal */}
      <ChatWindow
        isOpen={chatModal !== null}
        onClose={onCloseChat}
        title={chatModal?.title}
        borderColor={borderColor}
      />
    </>
  );
}

