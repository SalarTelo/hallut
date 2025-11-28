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
   * Modal title
   */
  title?: string;

  /**
   * Modal subtitle
   */
  subtitle?: string;

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

  /**
   * Footer content
   */
  footer?: ReactNode;
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
  title,
  subtitle,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
  footer,
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
      aria-labelledby={title ? 'modal-title' : undefined}
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
          {/* Header */}
          {(title || subtitle || showCloseButton) && (
            <div className="flex items-start justify-between p-4 border-b border-gray-700">
              <div className="flex-1">
                {title && (
                  <h3 id="modal-title" className="text-xl font-bold text-yellow-400 pixelated">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-300 pixelated">{subtitle}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  className="ml-4 text-gray-400 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-md p-1 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-4 py-3 border-t border-gray-700 bg-black bg-opacity-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

