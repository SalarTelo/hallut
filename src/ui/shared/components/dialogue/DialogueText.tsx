/**
 * Dialogtext-komponent
 * Renderar textområdet i dialogen med skrivmaskineffekt
 */

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
  return (
    <div className="flex-1 flex flex-col px-4 py-3">
      {/* Talarens namn */}
      <div
        className="mb-2 pb-1.5 border-b flex-shrink-0"
        style={{ borderColor, opacity: 0.3 }}
      >
        <span className="pixelated text-yellow-400 text-sm font-bold">
          {speaker}
        </span>
      </div>

      {/* Dialogtext med skrivmaskineffekt */}
      <div className="flex-1 flex items-start py-1 min-h-[2rem]">
        <p className="pixelated text-white text-xs leading-relaxed">
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-1.5 h-3 bg-yellow-400 ml-1"
              style={{ animation: 'blink 1s infinite' }}
            >
              |
            </span>
          )}
        </p>
      </div>

      {/* Förloppsindikator (visa endast medan man skriver eller före sista raden) */}
      {!isLastLine || isTyping ? (
        <div
          className="flex items-center justify-between mt-2 pt-1.5 border-t flex-shrink-0"
          style={{ borderColor, opacity: 0.2 }}
        >
          <span className="pixelated text-gray-400 text-[10px]">
            {currentLine + 1} / {totalLines}
          </span>
          <span className="pixelated text-gray-400 text-[10px]">
            {isTyping ? 'Tryck för att hoppa över...' : 'Tryck för att fortsätta'}
          </span>
        </div>
      ) : null}

      {/* Val (renderas via children) */}
      {children}
    </div>
  );
}
