/**
 * Modal Content Component
 * Wrapper for modal content with consistent black container styling
 */

import type { ReactNode, CSSProperties } from 'react';

export interface ModalContentProps {
  /**
   * Content to wrap
   */
  children: ReactNode;

  /**
   * Border color
   */
  borderColor: string;

  /**
   * Padding variant (default: 'p-4')
   */
  padding?: string;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Additional inline styles
   */
  style?: CSSProperties;
}

/**
 * Modal Content component
 * Preserves exact styling: bg-black border-2 rounded-lg
 */
export function ModalContent({
  children,
  borderColor,
  padding = 'p-4',
  className = '',
  style,
}: ModalContentProps) {
  return (
    <div
      className={`bg-black border-2 rounded-lg ${padding} ${className}`}
      style={{
        borderColor,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

