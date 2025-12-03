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

  /**
   * Index för val som ska spelas animation för (används för tangentbordsval)
   */
  selectingIndex?: number | null;

  /**
   * Callback när ett val klickas (för att trigga animation)
   */
  onChoiceClick?: (index: number) => void;
}

/**
 * Dialogval-komponent
 */
export function DialogueChoices({
  choices,
  borderColor,
  selectedIndex,
  onSelectedIndexChange,
  selectingIndex: externalSelectingIndex,
  onChoiceClick,
}: DialogueChoicesProps) {
  // Initialize focusedIndex with selectedIndex if provided, otherwise null
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    selectedIndex !== undefined ? selectedIndex : null
  );
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Use external selectingIndex if provided
  const selectingIndex = externalSelectingIndex ?? null;

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
      className="mt-3 sm:mt-2 p-1.5 space-y-2 sm:space-y-1.5 animate-fade-in"
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
            onClick={() => {
              // Use onChoiceClick if provided (for animation), otherwise call action directly
              if (onChoiceClick) {
                onChoiceClick(index);
              } else {
                choice.action();
              }
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onFocus={() => handleFocus(index)}
            className={`w-full text-left pixelated text-xs sm:text-[10px] px-5 py-2 sm:px-4 sm:py-2 rounded flex items-center touch-manipulation ${
              selectingIndex === index
                ? 'bg-gray-600 text-white scale-[0.97] shadow-xl'
                : isFocused
                ? 'bg-gray-700 text-white scale-[1.02] sm:scale-[1.01] shadow-lg'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-gray-200 hover:scale-[1.01] sm:hover:scale-[1.005] hover:shadow-md active:scale-[0.98]'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black animate-fade-in`}
            style={{
              borderWidth: selectingIndex === index ? '1px' : '0.5px',
              borderStyle: 'solid',
              borderColor: selectingIndex === index 
                ? borderColor 
                : isFocused 
                ? borderColor 
                : `${borderColor}30`,
              boxShadow: selectingIndex === index
                ? `0 0 20px ${borderColor}90, 0 0 40px ${borderColor}40, 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 20px ${borderColor}20`
                : isFocused
                ? `0 0 12px ${borderColor}, 0 4px 8px rgba(0, 0, 0, 0.3)`
                : undefined,
              outline: 'none',
              animationDelay: `${index * 50}ms`,
              opacity: selectingIndex === index 
                ? 1 
                : isFocused 
                ? 1 
                : 0.95,
              transition: selectingIndex === index
                ? 'opacity 0s, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                : focusedIndex !== null
                ? 'opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'opacity 0s, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-width 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            role="option"
            aria-selected={isFocused}
            aria-label={`Choice ${index + 1}: ${choice.text}`}
            tabIndex={selectedIndex === index ? 0 : -1}
          >
            <span className="flex items-center gap-2">
              <span className={`font-bold text-[10px] sm:text-[9px] w-4 flex-shrink-0 transition-colors duration-150 ${
                selectingIndex === index
                  ? 'text-yellow-300'
                  : isFocused 
                  ? 'text-yellow-400' 
                  : 'text-yellow-400/75'
              }`}>
                {index + 1}.
              </span>
              <span className={`leading-tight transition-colors duration-150 ${
                selectingIndex === index ? 'text-white' : ''
              }`}>
                {/* TODO: Remove this hacky string-based formatting and introduce a proper solution 
                    for custom formatting in dialogue choices (e.g., rich text, styled spans, etc.) */}
                {choice.text.startsWith('[Task]') ? (
                  <>
                    <span className="text-blue-400 font-semibold">[Task]</span>
                    <span>{choice.text.substring(6)}</span>
                  </>
                ) : (
                  choice.text
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
