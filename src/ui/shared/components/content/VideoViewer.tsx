/**
 * Video Viewer Component
 * Modal for displaying video content
 */

import { ContentViewer } from './ContentViewer.js';

export interface VideoViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
   */
  onClose: () => void;

  /**
   * Video URL to display
   */
  videoUrl: string;

  /**
   * Title for the video
   */
  title?: string;

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Video Viewer component
 * Wrapper around ContentViewer for video content
 */
export function VideoViewer({
  isOpen,
  onClose,
  videoUrl,
  title = 'Video',
  borderColor,
}: VideoViewerProps) {
  return (
    <ContentViewer
      isOpen={isOpen}
      onClose={onClose}
      contentType="video"
      videoUrl={videoUrl}
      title={title}
      borderColor={borderColor}
    />
  );
}
