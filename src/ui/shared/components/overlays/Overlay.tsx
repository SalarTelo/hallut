/**
 * Overlay Component
 * Displays content on top of the current view with blurred background
 * 
 * Features:
 * - Focus trap (keeps focus within overlay)
 * - Keyboard navigation (Escape to close)
 * - Backdrop click to close (optional)
 * - Accessible ARIA attributes
 * 
 * @example
 * ```tsx
 * <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <YourContent />
 * </Overlay>
 * ```
 */

import { useEffect, useRef } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether overlay is open
   */
  isOpen: boolean;

  /**
   * Callback when overlay should close
   */
  onClose?: () => void;

  /**
   * Overlay content
   */
  children: ReactNode;

  /**
   * Close on overlay click
   * @default false
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Blur intensity
   * @default 'md'
   */
  blurIntensity?: 'sm' | 'md' | 'lg';

  /**
   * ARIA label for the overlay
   * If not provided, defaults to "Dialog"
   */
  ariaLabel?: string;
}

/**
 * Overlay component
 * Displays content on top with blurred background
 */
export function Overlay({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = false,
  closeOnEscape = true,
  blurIntensity = 'md',
  ariaLabel,
  className = '',
  ...props
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap: keep focus within overlay
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the overlay container
    if (overlayRef.current) {
      overlayRef.current.focus();
    }

    // Handle focus trap
    const handleFocusIn = (e: FocusEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        // If focus leaves overlay, bring it back
        const focusableElements = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        } else {
          overlayRef.current.focus();
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
    if (!isOpen || !closeOnEscape || !onClose) return;

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick) {
      // Only close if clicking directly on the backdrop (not on content that might be behind it)
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    }
  };

  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  }[blurIntensity];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || 'Dialog'}
    >
      {/* Blurred background overlay - clickable backdrop */}
      <div
        className={`overlay-backdrop fixed inset-0 bg-black bg-opacity-60 ${blurClass} transition-opacity animate-fade-in`}
        onClick={closeOnOverlayClick ? handleBackdropClick : undefined}
        aria-hidden="true"
      />

      {/* Content container - positioned to not block backdrop clicks */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative pointer-events-auto ${className}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

