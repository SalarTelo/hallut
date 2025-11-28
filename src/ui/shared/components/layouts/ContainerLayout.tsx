/**
 * Container Layout Component
 * Standard container with padding
 */

import type { ReactNode } from 'react';

export interface ContainerLayoutProps {
  /**
   * Content
   */
  children: ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Container layout component
 */
export function ContainerLayout({ children, className = '' }: ContainerLayoutProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {children}
    </div>
  );
}

