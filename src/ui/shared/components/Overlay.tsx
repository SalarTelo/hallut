/**
 * Overlay Component
 * Displays content on top of the current view with blurred background
 */

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
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   */
  closeOnEscape?: boolean;

  /**
   * Blur intensity
   */
  blurIntensity?: 'sm' | 'md' | 'lg';
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
  className = '',
  ...props
}: OverlayProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose?.();
    }
  };

  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  }[blurIntensity];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
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

