/**
 * Full Screen Layout Component
 * Full screen layout with background color
 */

import type { ReactNode } from 'react';
import { getBackgroundColorStyle } from '@utils/color.js';

export interface FullScreenLayoutProps {
  /**
   * Content
   */
  children: ReactNode;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Custom background color
   */
  backgroundColor?: string;
}

/**
 * Full screen layout component
 */
export function FullScreenLayout({
  children,
  className = '',
  backgroundColor,
}: FullScreenLayoutProps) {
  const style = backgroundColor
    ? { backgroundColor }
    : getBackgroundColorStyle();

  return (
    <div className={`min-h-screen ${className}`} style={style}>
      {children}
    </div>
  );
}

