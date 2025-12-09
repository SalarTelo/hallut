/**
 * Note Viewer Component
 * Modal for displaying note content
 */

import { ContentViewer } from './ContentViewer.js';

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
 * Maintains exact same props interface and default values
 */
export function NoteViewer({
  isOpen,
  onClose,
  content,
  title = 'Note',
  borderColor,
}: NoteViewerProps) {
  return (
    <ContentViewer
      isOpen={isOpen}
      onClose={onClose}
      contentType="text"
      textContent={content}
      title={title}
      borderColor={borderColor}
    />
  );
}

