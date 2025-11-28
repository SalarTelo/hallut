/**
 * DialogueText Component
 * Renders the text area of the dialogue with typewriter effect
 */

export interface DialogueTextProps {
  /**
   * Speaker name
   */
  speaker: string;

  /**
   * Displayed text (from typewriter effect)
   */
  displayedText: string;

  /**
   * Whether typing animation is in progress
   */
  isTyping: boolean;

  /**
   * Current line index
   */
  currentLine: number;

  /**
   * Total number of lines
   */
  totalLines: number;

  /**
   * Whether this is the last line
   */
  isLastLine: boolean;

  /**
   * Border color for styling
   */
  borderColor: string;

  /**
   * Children (for choices rendering)
   */
  children?: React.ReactNode;
}

/**
 * DialogueText component
 */
export function DialogueText({
  speaker,
  displayedText,
  isTyping,
  currentLine,
  totalLines,
  isLastLine,
  borderColor,
  children,
}: DialogueTextProps) {
  return (
    <div className="flex-1 flex flex-col px-6 py-5">
      {/* Speaker name */}
      <div
        className="mb-3 pb-2 border-b flex-shrink-0"
        style={{ borderColor, opacity: 0.3 }}
      >
        <span className="pixelated text-yellow-400 text-base font-bold">
          {speaker}
        </span>
      </div>

      {/* Dialogue text with typewriter effect */}
      <div className="flex-1 flex items-start py-2 min-h-[3rem]">
        <p className="pixelated text-white text-sm leading-relaxed">
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-2 h-4 bg-yellow-400 ml-1"
              style={{ animation: 'blink 1s infinite' }}
            >
              |
            </span>
          )}
        </p>
      </div>

      {/* Progress indicator (only show while typing or before last line) */}
      {!isLastLine || isTyping ? (
        <div
          className="flex items-center justify-between mt-3 pt-2 border-t flex-shrink-0"
          style={{ borderColor, opacity: 0.2 }}
        >
          <span className="pixelated text-gray-400 text-xs">
            {currentLine + 1} / {totalLines}
          </span>
          <span className="pixelated text-gray-400 text-xs">
            {isTyping ? 'Press any key to skip...' : 'Press any key to continue'}
          </span>
        </div>
      ) : null}

      {/* Choices (rendered via children) */}
      {children}
    </div>
  );
}

