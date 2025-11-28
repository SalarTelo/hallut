/**
 * Bildvisarkomponent
 * Modal för att visa bilder (som kylskåpet)
 */

import { Modal } from './Modal.js';
import { getThemeValue } from '@utils/theme.js';

export interface ImageViewerProps {
  /**
   * Om visaren är öppen
   */
  isOpen: boolean;

  /**
   * Callback för att stänga visaren
   */
  onClose: () => void;

  /**
   * Bild-URL att visa
   */
  imageUrl: string;

  /**
   * Titel/alt-text för bilden
   */
  title?: string;

  /**
   * Kantfärg (standard från tema)
   */
  borderColor?: string;
}

/**
 * Bildvisarkomponent
 */
export function ImageViewer({
  isOpen,
  onClose,
  imageUrl,
  title = 'Bild',
  borderColor,
}: ImageViewerProps) {
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnEscape
      closeOnOverlayClick
    >
      <div
        className="bg-black border-2 rounded-lg p-4"
        style={{
          borderColor: borderColorValue,
        }}
      >
        <div className="mb-4 pb-3 border-b flex items-center justify-between" style={{ borderColor: borderColorValue, opacity: 0.3 }}>
          <h3 className="pixelated text-yellow-400 text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-orange-400 hover:text-orange-300 pixelated text-sm"
            aria-label="Stäng"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full h-auto rounded"
          />
        </div>
      </div>
    </Modal>
  );
}
