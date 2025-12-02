/**
 * Content Viewer Component
 * Consolidated viewer for text and image content
 * Used internally by NoteViewer, SignViewer, and ImageViewer
 */

import { Modal } from './Modal.js';
import { ModalContent } from './ModalContent.js';
import { ModalHeader } from './ModalHeader.js';
import { useThemeBorderColor } from '../hooks/useThemeBorderColor.js';

export interface ContentViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
   */
  onClose: () => void;

  /**
   * Content type
   */
  contentType: 'text' | 'image';

  /**
   * Text content (for contentType='text')
   */
  textContent?: string;

  /**
   * Image URL (for contentType='image')
   */
  imageUrl?: string;

  /**
   * Title
   */
  title?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;

  /**
   * Modal size (default: 'md' for text, 'lg' for images)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Content Viewer component
 * Preserves exact styling from NoteViewer, SignViewer, ImageViewer
 */
export function ContentViewer({
  isOpen,
  onClose,
  contentType,
  textContent,
  imageUrl,
  title,
  borderColor,
  size,
}: ContentViewerProps) {
  const borderColorValue = useThemeBorderColor(borderColor);
  
  // Determine modal size: 'lg' for images, 'md' for text (unless overridden)
  const modalSize = size || (contentType === 'image' ? 'lg' : 'md');
  
  // Determine max height: 80vh for images, 70vh for text
  const maxHeight = contentType === 'image' ? 'max-h-[80vh]' : 'max-h-[70vh]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalSize}
      closeOnEscape
      closeOnOverlayClick
      showCloseButton={false}
    >
      <ModalContent borderColor={borderColorValue}>
        <ModalHeader
          title={title || ''}
          onClose={onClose}
          borderColor={borderColorValue}
        />
        <div className={`${maxHeight} overflow-auto`}>
          {contentType === 'text' ? (
            <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap pixelated">
              {textContent}
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title || 'Image'}
              className="max-w-full h-auto rounded"
            />
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

