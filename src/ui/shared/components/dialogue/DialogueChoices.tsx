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
}

/**
 * Dialogval-komponent
 */
export function DialogueChoices({
  choices,
  borderColor,
}: DialogueChoicesProps) {
  return (
    <div className="mt-2 space-y-1.5">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => choice.action()}
          className="w-full text-left pixelated text-white text-xs px-3 py-1.5 bg-gray-800 border-2 rounded hover:bg-gray-700 transition-colors"
          style={{ borderColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 8px ${borderColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
