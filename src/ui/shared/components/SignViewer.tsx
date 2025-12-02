/**
 * Sign Viewer Component
 * Modal for displaying sign content
 */

import { ContentViewer } from './ContentViewer.js';

export interface SignViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
   */
  onClose: () => void;

  /**
   * Sign content to display
   */
  content: string;

  /**
   * Sign title
   */
  title?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Sign Viewer component
 * Maintains exact same props interface and default values
 */
export function SignViewer({
  isOpen,
  onClose,
  content,
  title = 'Sign',
  borderColor,
}: SignViewerProps) {
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

