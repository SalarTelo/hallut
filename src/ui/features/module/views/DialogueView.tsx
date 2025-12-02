/**
 * Dialogue View
 * Displays a dialogue with choices
 */

import { useState } from 'react';
import type { DialogueConfig, DialogueChoice } from '@core/types/dialogue.js';
import { DialogueBox, type DialogueChoice as UIDialogueChoice } from '@ui/shared/components/DialogueBox.js';

export interface DialogueViewProps {
  dialogue: DialogueConfig;
  moduleId: string;
  onChoiceSelected: (choice: DialogueChoice) => void | Promise<void>;
  onClose: () => void;
}

/**
 * Dialogue View component
 */
export function DialogueView({ dialogue, onChoiceSelected, onClose }: DialogueViewProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Convert our dialogue choices to UI format
  const uiChoices: UIDialogueChoice[] | undefined = dialogue.choices?.map((choice) => ({
    text: choice.text,
    action: async () => {
      await onChoiceSelected(choice);
    },
  }));

  const handleContinue = () => {
    if (currentLineIndex < dialogue.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else if (!uiChoices || uiChoices.length === 0) {
      // No choices, close dialogue
      onClose();
    }
  };

  return (
    <DialogueBox
      speaker={dialogue.speaker}
      lines={dialogue.lines}
      currentLineIndex={currentLineIndex}
      onContinue={handleContinue}
      choices={uiChoices}
    />
  );
}

