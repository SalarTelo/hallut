/**
 * DialogueChoices Component
 * Renders the choice buttons at the end of dialogue
 */

export interface DialogueChoice {
  text: string;
  action: () => void;
}

export interface DialogueChoicesProps {
  /**
   * Array of choices to display
   */
  choices: DialogueChoice[];

  /**
   * Border color for styling
   */
  borderColor: string;
}

/**
 * DialogueChoices component
 */
export function DialogueChoices({
  choices,
  borderColor,
}: DialogueChoicesProps) {
  return (
    <div className="mt-3 space-y-2.5">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => choice.action()}
          className="w-full text-left pixelated text-white text-sm px-4 py-2 bg-gray-800 border-2 rounded hover:bg-gray-700 transition-colors"
          style={{ borderColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 10px ${borderColor}`;
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

