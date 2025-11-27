/**
 * InteractableDialogue - Renders dialogue for interactables
 * Extracted from InteractableHandler to reduce duplication
 */

import type { DialogueData } from '../../dialogue/DialogueSystem.js';
import { Dialogue } from './Dialogue.js';

export interface InteractableDialogueProps {
  dialogueData: DialogueData;
}

export function InteractableDialogue({ dialogueData }: InteractableDialogueProps) {
  return (
    <Dialogue
      speaker={dialogueData.speaker}
      lines={dialogueData.lines}
      choices={dialogueData.choices?.map(c => c.text)}
      inputType={dialogueData.choices ? 'choices' : undefined}
      onResponse={(response) => {
        // Find and call the handler for the selected choice
        const choice = dialogueData.choices?.find(c => c.text === response);
        if (choice) {
          choice.handler();
        }
      }}
      onNext={dialogueData.onComplete}
    />
  );
}

