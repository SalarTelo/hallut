/**
 * Image Viewer Component
 * Modal for displaying images (like the refrigerator)
 */

import { ContentViewer } from './ContentViewer.js';

export interface ImageViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
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
 * Maintains exact same props interface and default values
 */
export function ImageViewer({
  isOpen,
  onClose,
  imageUrl,
  title = 'Bild',
  borderColor,
}: ImageViewerProps) {
  return (
    <ContentViewer
      isOpen={isOpen}
      onClose={onClose}
      contentType="image"
      imageUrl={imageUrl}
      title={title}
      borderColor={borderColor}
    />
  );
}
