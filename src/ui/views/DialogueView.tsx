/**
 * Dialogue View
 * Displays a dialogue with choices
 * 
 * Renders a dialogue interface showing:
 * - Dialogue lines with typewriter effect
 * - Speaker information
 * - Choice options at the end
 * - Keyboard and mouse interaction support
 * 
 * @example
 * ```tsx
 * <DialogueView
 *   node={dialogueNode}
 *   npc={npc}
 *   moduleId="example-1"
 *   availableChoices={choices}
 *   onChoiceSelected={handleChoiceSelected}
 *   onClose={handleClose}
 * />
 * ```
 */

import { useState, useEffect, useRef } from 'react';
import type { DialogueNode, ChoiceAction } from '@core/dialogue/types.js';
import type { NPC } from '@core/module/types/index.js';
import { DialogueBox, type DialogueChoice as UIDialogueChoice } from '@ui/shared/components/DialogueBox.js';

export interface DialogueViewProps {
  /**
   * Dialogue node to display
   */
  node: DialogueNode;

  /**
   * NPC speaking the dialogue
   */
  npc: NPC;

  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Available choices for the dialogue
   */
  availableChoices: Array<{ key: string; text: string; actions: ChoiceAction[] }>;

  /**
   * Callback when a choice is selected
   */
  onChoiceSelected: (choiceKey: string, actions: ChoiceAction[]) => void | Promise<void>;

  /**
   * Callback when dialogue is closed
   */
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
