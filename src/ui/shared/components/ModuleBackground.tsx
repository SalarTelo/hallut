/**
 * ModuleBackground Component
 * Renders background image or color fallback
 * Priority: image > color
 */

import type { ReactNode } from 'react';

export interface ModuleBackgroundProps {
  /**
   * Background image URL
   */
  imageUrl?: string;

  /**
   * Background color (fallback if no image)
   */
  color?: string;

  /**
   * Children to render on top of background
   */
  children: ReactNode;
}

/**
 * ModuleBackground component
 */
export function ModuleBackground({
  imageUrl,
  color,
  children,
}: ModuleBackgroundProps) {
  const backgroundStyle: React.CSSProperties = {};

  if (imageUrl) {
    backgroundStyle.backgroundImage = `url(${imageUrl})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
  } else if (color) {
    backgroundStyle.backgroundColor = color;
  } else {
    // Fallback to theme background color
    backgroundStyle.backgroundColor = 'var(--theme-background-color, #1a1a2e)';
  }

  return (
    <div className="fixed inset-0 w-full h-full" style={backgroundStyle}>
      {children}
    </div>
  );
}

