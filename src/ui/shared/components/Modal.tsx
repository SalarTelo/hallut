/**
 * Modal Component
 * Reusable modal component with overlay and close functionality
 * 
 * Features:
 * - Focus trap (keeps focus within modal)
 * - Keyboard navigation (Escape to close)
 * - Overlay click to close (optional)
 * - Accessible ARIA attributes
 * 
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalContent>Your content here</ModalContent>
 * </Modal>
 * ```
 */

import { useEffect, useRef } from 'react';
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
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close on overlay click
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * ARIA label for the modal
   * If not provided, defaults to "Dialog"
   */
  ariaLabel?: string;
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
  ariaLabel,
  className = '',
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Handle focus trap
    const handleFocusIn = (e: FocusEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        // If focus leaves modal, bring it back
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        } else {
          modalRef.current.focus();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeStyle = sizeStyles[size];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || 'Dialog'}
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
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-400 pixelated text-xl font-bold transition-colors p-1 rounded hover:bg-gray-800/50 flex items-center justify-center w-7 h-7 z-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent"
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
