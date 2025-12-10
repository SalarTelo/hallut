/**
 * Content Viewer Component
 * Consolidated viewer for text and image content
 * Used internally by NoteViewer, SignViewer, and ImageViewer
 */

import { Modal } from '../overlays/Modal.js';
import { ModalContent } from '../overlays/ModalContent.js';
import { ModalHeader } from '../overlays/ModalHeader.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';

/**
 * Check if URL is a YouTube URL
 */
function isYouTubeUrl(url: string): boolean {
  return /(youtube\.com|youtu\.be)/.test(url);
}

/**
 * Convert YouTube URL to embed format
 */
function convertToYouTubeEmbed(url: string): string {
  // Handle youtu.be short URLs
  const shortUrlMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortUrlMatch) {
    return `https://www.youtube.com/embed/${shortUrlMatch[1]}`;
  }
  
  // Handle youtube.com/watch?v= format
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Handle youtube.com/embed/ format (already embed)
  if (url.includes('/embed/')) {
    return url;
  }
  
  // Fallback: return original URL
  return url;
}

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
  contentType: 'text' | 'image' | 'video';

  /**
   * Text content (for contentType='text')
   */
  textContent?: string;

  /**
   * Image URL (for contentType='image')
   */
  imageUrl?: string;

  /**
   * Video URL (for contentType='video')
   */
  videoUrl?: string;

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

  /**
   * Variant for text content (note vs sign)
   */
  variant?: 'note' | 'sign';
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
  videoUrl,
  title,
  borderColor,
  size,
  variant,
}: ContentViewerProps) {
  const borderColorValue = useThemeBorderColor(borderColor);
  
  // Determine modal size: 'lg' for images/videos, 'md' for text (unless overridden)
  const modalSize = size || (contentType === 'image' || contentType === 'video' ? 'lg' : 'md');
  
  // Determine max height: 80vh for images/videos, 70vh for text
  const maxHeight = contentType === 'image' || contentType === 'video' ? 'max-h-[80vh]' : 'max-h-[70vh]';

  // Different styling for sign vs note
  const isSign = variant === 'sign';
  const isNote = variant === 'note';

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
            isSign ? (
              <div className="flex items-center justify-center p-6">
                <div 
                  className="text-yellow-300 text-sm leading-relaxed whitespace-pre-wrap font-bold px-6 py-5 my-4 mx-auto max-w-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                    border: `4px solid ${borderColorValue}`,
                    borderRadius: '8px',
                    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px ${borderColorValue}40`,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {textContent}
                </div>
              </div>
            ) : (
              isNote ? (
                <div className="flex items-center justify-center p-8 relative">
                  {/* Pin at the top */}
                  <div 
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10"
                    style={{
                      width: '20px',
                      height: '20px',
                      background: 'radial-gradient(circle, #c0c0c0 0%, #808080 100%)',
                      borderRadius: '50% 50% 50% 0',
                      transform: 'translateX(-50%) rotate(-45deg)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                  <div 
                    className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap px-5 py-4 max-w-lg relative pixelated"
                    style={{
                      background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 50%, #2a2a2a 100%)',
                      border: `1px solid ${borderColorValue}80`,
                      borderRadius: '4px',
                      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                      transform: 'rotate(-1deg)',
                      position: 'relative',
                    }}
                  >
                    <div className="relative z-10">
                      {textContent}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap px-4 py-3"
                >
                  {textContent}
                </div>
              )
            )
          ) : contentType === 'image' ? (
            <img
              src={imageUrl}
              alt={title || 'Image'}
              className="max-w-full h-auto rounded"
            />
          ) : contentType === 'video' && videoUrl ? (
            <div className="w-full">
              {(() => {
                const url = videoUrl;
                return isYouTubeUrl(url) ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={convertToYouTubeEmbed(url)}
                      className="absolute top-0 left-0 w-full h-full rounded"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={title || 'Video'}
                    />
                  </div>
                ) : (
                  <video
                    src={url}
                    controls
                    className="max-w-full h-auto rounded"
                    style={{ maxHeight: '70vh' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                );
              })()}
            </div>
          ) : null}
        </div>
      </ModalContent>
    </Modal>
  );
}

