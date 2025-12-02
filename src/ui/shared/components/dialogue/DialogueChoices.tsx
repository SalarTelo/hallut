import { useState, useEffect, useRef } from 'react';

/**
 * Dialogval-komponent
 * Renderar valknapparna i slutet av dialogen
 */

export interface DialogueChoice {
  text: string;
  action: () => void;
}

export interface DialogueChoicesProps {
  /**
   * Array med val att visa
   */
  choices: DialogueChoice[];

  /**
   * Kantfärg för styling
   */
  borderColor: string;

  /**
   * Index för valt val (för tangentbordsnavigering)
   */
  selectedIndex?: number;

  /**
   * Callback när valt index ändras
   */
  onSelectedIndexChange?: (index: number) => void;
}

/**
 * Dialogval-komponent
 */
export function DialogueChoices({
  choices,
  borderColor,
  selectedIndex,
  onSelectedIndexChange,
}: DialogueChoicesProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sync focusedIndex with selectedIndex when provided
  useEffect(() => {
    if (selectedIndex !== undefined) {
      setFocusedIndex(selectedIndex);
      // Focus the button when selectedIndex changes
      if (buttonRefs.current[selectedIndex]) {
        buttonRefs.current[selectedIndex]?.focus();
      }
    }
  }, [selectedIndex]);

  const handleMouseEnter = (index: number) => {
    setFocusedIndex(index);
    if (onSelectedIndexChange) {
      onSelectedIndexChange(index);
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    if (onSelectedIndexChange) {
      onSelectedIndexChange(index);
    }
  };

  return (
    <div 
      className="mt-3 sm:mt-2 space-y-2 sm:space-y-1.5 animate-fade-in"
      role="listbox"
      aria-label="Dialogue choices"
    >
      {choices.map((choice, index) => {
        const isFocused = focusedIndex === index;
        return (
          <button
            key={index}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => choice.action()}
            onMouseEnter={() => handleMouseEnter(index)}
            onFocus={() => handleFocus(index)}
            className={`w-full text-left pixelated text-sm sm:text-xs px-4 py-3 sm:px-3 sm:py-2.5 border rounded transition-all duration-200 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation ${
              isFocused
                ? 'bg-gray-700 text-white scale-[1.02] sm:scale-[1.01] shadow-lg opacity-100'
                : 'bg-gray-800/60 text-gray-300 opacity-60 hover:bg-gray-700/80 hover:text-gray-200 hover:opacity-80 hover:scale-[1.01] sm:hover:scale-[1.005] hover:shadow-md active:scale-[0.98]'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black animate-fade-in`}
            style={{
              borderColor: isFocused ? borderColor : `${borderColor}40`,
              boxShadow: isFocused
                ? `0 0 12px ${borderColor}, 0 4px 8px rgba(0, 0, 0, 0.3)`
                : undefined,
              outline: 'none',
              animationDelay: `${index * 50}ms`,
            }}
            role="option"
            aria-selected={isFocused}
            aria-label={`Choice ${index + 1}: ${choice.text}`}
            tabIndex={selectedIndex === index ? 0 : -1}
          >
            <span className="flex items-center gap-2">
              <span className={`font-bold text-xs w-5 flex-shrink-0 ${
                isFocused ? 'text-yellow-400' : 'text-yellow-400/50'
              }`}>
                {index + 1}.
              </span>
              <span>{choice.text}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
