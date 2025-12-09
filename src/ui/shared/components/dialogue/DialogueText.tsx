/**
 * Dialogue Text Component
 * Renders the text area in the dialogue with typewriter effect
 */

import { useEffect, useState } from 'react';

export interface DialogueTextProps {
  /**
   * Speaker's name
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
   * Children (for choice rendering)
   */
  children?: React.ReactNode;
}

/**
 * Dialogue Text component
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger transition animation when line changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentLine]);

  return (
    <div className="flex-1 flex flex-col px-4 py-3 sm:px-3 sm:py-2">
      {/* Speaker's name */}
      <div
        className="mb-2 pb-1.5 sm:mb-1.5 sm:pb-1 border-b flex-shrink-0 transition-opacity duration-200"
        style={{ borderColor, opacity: 0.4 }}
      >
        <span className="pixelated text-yellow-400 text-base sm:text-sm font-bold">
          {speaker}
        </span>
      </div>

      {/* Dialogue text with typewriter effect */}
      <div className="flex-1 flex items-start py-2 sm:py-1 min-h-[3rem] sm:min-h-[2.5rem]">
        <p 
          className={`pixelated text-white text-sm sm:text-xs leading-loose sm:leading-relaxed break-words transition-opacity duration-200 ${
            isTransitioning ? 'opacity-50' : 'opacity-100'
          }`}
          role="log"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-1.5 h-4 bg-yellow-400 ml-1.5 align-middle"
              style={{ animation: 'blink 1s infinite' }}
              aria-hidden="true"
            >
              |
            </span>
          )}
        </p>
      </div>

      {/* Progress indicator (show only while typing or before last line) */}
      {!isLastLine || isTyping ? (
        <div
          className="flex items-center justify-between mt-2 pt-1.5 sm:mt-1.5 sm:pt-1 border-t flex-shrink-0"
          style={{ borderColor, opacity: 0.3 }}
        >
          <span className="pixelated text-gray-300 text-xs sm:text-[10px] font-medium">
            {currentLine + 1} / {totalLines}
          </span>
          <span className="pixelated text-gray-300 text-xs sm:text-[10px] sm:hidden">
            {isTyping ? 'Press to skip...' : 'Press to continue'}
          </span>
          <span className="pixelated text-gray-300 text-[10px] hidden sm:inline">
            {isTyping ? 'Skip...' : 'Continue'}
          </span>
        </div>
      ) : null}

      {/* Choices (rendered via children) */}
      {children}
    </div>
  );
}
