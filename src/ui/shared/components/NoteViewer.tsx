/**
 * Note Viewer Component
 * Modal for displaying note content
 */

import { Modal } from './Modal.js';
import { getThemeValue } from '@utils/theme.js';
import { addOpacityToColor } from '@utils/color.js';

export interface NoteViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
   */
  onClose: () => void;

  /**
   * Note content to display
   */
  content: string;

  /**
   * Note title
   */
  title?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Note Viewer component
 */
export function NoteViewer({
  isOpen,
  onClose,
  content,
  title = 'Note',
  borderColor,
}: NoteViewerProps) {
  const borderColorValue = borderColor || getThemeValue('border-color', '#FFD700');
  const borderColorWithOpacity = addOpacityToColor(borderColorValue, 0.25);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnEscape
      closeOnOverlayClick
      showCloseButton={false}
    >
      <div
        className="bg-black border-2 rounded-lg p-4"
        style={{
          borderColor: borderColorValue,
        }}
      >
        <div 
          className="mb-4 pb-3 flex items-center justify-between"
          style={{ 
            borderBottom: `1px solid ${borderColorWithOpacity}`,
          }}
        >
          <h3 className="pixelated text-yellow-400 text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-orange-400 pixelated text-xl font-bold transition-colors p-1 rounded hover:bg-gray-800/50 flex items-center justify-center w-7 h-7"
            aria-label="Close"
            style={{ lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap pixelated">
            {content}
          </div>
        </div>
      </div>
    </Modal>
  );
}

