/**
 * Modal Component
 * Reusable modal component with overlay and close functionality
 */

import type { HTMLAttributes, ReactNode } from 'react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal content
   */
  children: ReactNode;

  /**
   * Show close button
   */
  showCloseButton?: boolean;

  /**
   * Close on overlay click
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   */
  closeOnEscape?: boolean;

  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeStyles: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

/**
 * Modal component
 */
export function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
  className = '',
  ...props
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  };

  const sizeStyle = sizeStyles[size];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-transparent rounded-lg shadow-xl ${sizeStyle} w-full ${className}`}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Close button - positioned absolutely in top-right */}
          {showCloseButton && (
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 pixelated text-xl font-bold transition-colors p-1 rounded hover:bg-gray-800/50 flex items-center justify-center w-7 h-7 z-10"
              onClick={onClose}
              aria-label="Close modal"
              style={{ lineHeight: 1 }}
            >
              ✕
            </button>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
