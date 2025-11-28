/**
 * Centered Layout Component
 * Centers content both horizontally and vertically
 */

import type { ReactNode } from 'react';
import { getBackgroundColorStyle } from '@utils/color.js';

export interface CenteredLayoutProps {
  /**
   * Content to center
   */
  children: ReactNode;

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Centered layout component
 */
export function CenteredLayout({ children, className = '' }: CenteredLayoutProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
      style={getBackgroundColorStyle()}
    >
      {children}
    </div>
  );
}

