/**
 * ModuleBackground Component
 */

import type { ReactNode } from 'react';
import { addOpacityToColor } from '@utils/color.js';

export interface ModuleBackgroundProps {
  imageUrl?: string;
  color?: string;
  children: ReactNode;
}

function getCssVariableValue(variableName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value || fallback;
}

export function ModuleBackground({
  imageUrl,
  color,
  children,
}: ModuleBackgroundProps) {
  const baseColor = color || 'var(--theme-background-color, #1a1a2e)';
  let gridColor = '';

  if (!imageUrl) {
    try {
      const borderHex = getCssVariableValue('--theme-border-color', '#FFD700');
      gridColor = addOpacityToColor(borderHex, 0.12);
    } catch {
      // Fallback handled by baseColor
    }
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full"
      style={{
        backgroundColor: baseColor,
        ...(imageUrl && {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      }}
    >
      {!imageUrl && gridColor && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="32" stroke={gridColor} strokeWidth="1"/>
              <line x1="0" y1="0" x2="32" y2="0" stroke={gridColor} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
        </svg>
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
