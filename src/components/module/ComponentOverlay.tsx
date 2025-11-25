import { ReactNode } from 'react';

export interface ComponentOverlayProps {
  children: ReactNode;
  onClose?: () => void;
}

/**
 * Overlay wrapper for custom components
 * Provides a simple dark backdrop without the dialogue-specific styling
 */
export function ComponentOverlay({ children, onClose }: ComponentOverlayProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        transition: 'opacity var(--transition-base)',
      }}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        style={{ 
          maxWidth: '900px',
          width: '100%',
          padding: 'var(--spacing-4)',
        }}
        onClick={(e) => {
          // Prevent closing when clicking inside the component
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

