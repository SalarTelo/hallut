/**
 * Image Viewer Component
 * Modal for displaying images
 * 
 * @deprecated This is now consolidated into ContentViewer. Use ContentViewer directly with contentType="image"
 */

import { ContentViewer } from './ContentViewer.js';
import type { ContentViewerProps } from './ContentViewer.js';

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
   * Image URL to display
   */
  imageUrl: string;

  /**
   * Title/alt-text for the image
   */
  title?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Image Viewer component
 * Wrapper around ContentViewer for backward compatibility
 */
export function ImageViewer({
  isOpen,
  onClose,
  imageUrl,
  title = 'Image',
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
