/**
 * Close Button Component
 * Reusable close button with consistent styling
 */

export interface CloseButtonProps {
  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Aria label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Close Button component
 * Preserves exact styling from NoteViewer, SignViewer, ImageViewer
 */
export function CloseButton({ onClick, ariaLabel = 'Close' }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-orange-400 pixelated text-xl font-bold transition-colors p-1 rounded hover:bg-gray-800/50 flex items-center justify-center w-7 h-7"
      aria-label={ariaLabel}
      style={{ lineHeight: 1 }}
    >
      ✕
    </button>
  );
}

