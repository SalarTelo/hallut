/**
 * Dialogue View
 * Displays a dialogue with choices
 */

import { useState, useEffect, useRef } from 'react';
import type { DialogueNode, ChoiceAction } from '@core/dialogue/types.js';
import type { NPC } from '@core/module/types/index.js';
import { DialogueBox, type DialogueChoice as UIDialogueChoice } from '@ui/shared/components/DialogueBox.js';

export interface DialogueViewProps {
  node: DialogueNode;
  npc: NPC;
  moduleId: string;
  availableChoices: Array<{ key: string; text: string; actions: ChoiceAction[] }>;
  onChoiceSelected: (choiceKey: string, actions: ChoiceAction[]) => void | Promise<void>;
  onClose: () => void;
}

/**
 * Dialogue View component
 */
export function DialogueView({ node, npc, availableChoices, onChoiceSelected, onClose }: DialogueViewProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const previousLineIndexRef = useRef(0);

  // Convert available choices to UI format
  const uiChoices: UIDialogueChoice[] | undefined = availableChoices.map((choice) => ({
    text: choice.text,
    action: async () => {
      await onChoiceSelected(choice.key, choice.actions);
    },
  }));

  const handleContinue = () => {
    if (currentLineIndex < node.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else if (!uiChoices || uiChoices.length === 0) {
      // No choices, close dialogue
      onClose();
    }
  };

  // Announce dialogue changes to screen readers
  useEffect(() => {
    if (currentLineIndex !== previousLineIndexRef.current && node.lines[currentLineIndex]) {
      // Screen reader will announce via aria-live region
      previousLineIndexRef.current = currentLineIndex;
    }
  }, [currentLineIndex, node.lines]);

  return (
    <DialogueBox
      speaker={npc.name}
      lines={node.lines}
      currentLineIndex={currentLineIndex}
      onContinue={handleContinue}
      choices={uiChoices}
      onClose={onClose}
    />
  );
}
