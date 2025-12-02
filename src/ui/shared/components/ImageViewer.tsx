/**
 * Bildvisarkomponent
 * Modal för att visa bilder (som kylskåpet)
 */

import { ContentViewer } from './ContentViewer.js';

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
