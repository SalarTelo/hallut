/**
 * Modal Header Component
 * Reusable header pattern with title and close button
 */

import type { ReactNode } from 'react';
import { CloseButton } from './CloseButton.js';
import { addOpacityToColor } from '@utils/color.js';

export interface ModalHeaderProps {
  /**
   * Header title
   */
  title: string;

  /**
   * Close button click handler
   */
  onClose: () => void;

  /**
   * Border color for bottom border
   */
  borderColor: string;

  /**
   * Optional right content (for complex headers)
   */
  rightContent?: ReactNode;

  /**
   * Show bottom border (default: true)
   */
  showBorder?: boolean;

  /**
   * Custom aria label for close button
   */
  closeAriaLabel?: string;
}

/**
 * Modal Header component
 * Preserves exact structure from NoteViewer, SignViewer, ImageViewer
 */
export function ModalHeader({
  title,
  onClose,
  borderColor,
  rightContent,
  showBorder = true,
  closeAriaLabel,
}: ModalHeaderProps) {
  const borderColorWithOpacity = addOpacityToColor(borderColor, 0.25);

  return (
    <div
      className="mb-4 pb-3 flex items-center justify-between"
      style={showBorder ? { borderBottom: `1px solid ${borderColorWithOpacity}` } : undefined}
    >
      <h3 className="pixelated text-yellow-400 text-lg font-bold">{title}</h3>
      {rightContent || <CloseButton onClick={onClose} ariaLabel={closeAriaLabel} />}
    </div>
  );
}

