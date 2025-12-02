/**
 * Dialogtext-komponent
 * Renderar textområdet i dialogen med skrivmaskineffekt
 */

import { useEffect, useState } from 'react';

export interface DialogueTextProps {
  /**
   * Talarens namn
   */
  speaker: string;

  /**
   * Visad text (från skrivmaskineffekt)
   */
  displayedText: string;

  /**
   * Om skrivanimering pågår
   */
  isTyping: boolean;

  /**
   * Aktuellt radindex
   */
  currentLine: number;

  /**
   * Totalt antal rader
   */
  totalLines: number;

  /**
   * Om detta är sista raden
   */
  isLastLine: boolean;

  /**
   * Kantfärg för styling
   */
  borderColor: string;

  /**
   * Barn (för valrendering)
   */
  children?: React.ReactNode;
}

/**
 * Dialogtext-komponent
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
      {/* Talarens namn */}
      <div
        className="mb-2 pb-1.5 sm:mb-1.5 sm:pb-1 border-b flex-shrink-0 transition-opacity duration-200"
        style={{ borderColor, opacity: 0.4 }}
      >
        <span className="pixelated text-yellow-400 text-base sm:text-sm font-bold">
          {speaker}
        </span>
      </div>

      {/* Dialogtext med skrivmaskineffekt */}
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

      {/* Förloppsindikator (visa endast medan man skriver eller före sista raden) */}
      {!isLastLine || isTyping ? (
        <div
          className="flex items-center justify-between mt-2 pt-1.5 sm:mt-1.5 sm:pt-1 border-t flex-shrink-0"
          style={{ borderColor, opacity: 0.3 }}
        >
          <span className="pixelated text-gray-300 text-xs sm:text-[10px] font-medium">
            {currentLine + 1} / {totalLines}
          </span>
          <span className="pixelated text-gray-300 text-xs sm:text-[10px] sm:hidden">
            {isTyping ? 'Tryck för att hoppa över...' : 'Tryck för att fortsätta'}
          </span>
          <span className="pixelated text-gray-300 text-[10px] hidden sm:inline">
            {isTyping ? 'Hoppa över...' : 'Fortsätt'}
          </span>
        </div>
      ) : null}

      {/* Val (renderas via children) */}
      {children}
    </div>
  );
}
