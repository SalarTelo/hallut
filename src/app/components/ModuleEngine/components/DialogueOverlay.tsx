/**
 * Dialogue Overlay Component
 * Overlay wrapper for DialogueView with dialogue execution logic
 */

import { Overlay } from '@ui/shared/components/overlays/index.js';
import { DialogueView } from '@ui/views/DialogueView.js';
import { getNextDialogueNode, getAvailableChoices, executeActions } from '@core/dialogue/execution.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import type { NPC } from '@core/module/types/index.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { ModuleContext } from '@core/module/types/index.js';

export interface DialogueOverlayProps {
  isOpen: boolean;
  node: DialogueNode;
  npc: NPC;
  moduleId: string;
  moduleData: ModuleData;
  context: ModuleContext;
  onClose: () => void;
  onTaskRequested: (taskId: string) => void;
  onNodeChange: (node: DialogueNode) => void;
}

/**
 * Dialogue Overlay component
 */
export function DialogueOverlay({
  isOpen,
  node,
  npc,
  moduleId,
  moduleData,
  context,
  onClose,
  onTaskRequested,
  onNodeChange,
}: DialogueOverlayProps) {
  if (!isOpen) return null;

  const tree = npc.dialogueTree;
  if (!tree) return null;

  const availableChoices = getAvailableChoices(node, tree, context, moduleData);

  // Create a wrapper context that tracks task opening
  const trackingContext = {
    ...context,
    openTaskSubmission: (task: import('@core/task/types.js').Task | string) => {
      const taskId = typeof task === 'string' ? task : task.id;
      onTaskRequested(taskId);
    },
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={true}
    >
      <DialogueView
        node={node}
        npc={npc}
        moduleId={moduleId}
        availableChoices={availableChoices}
        onChoiceSelected={async (choiceKey, choiceActions) => {
          // Track if task view was opened
          let taskOpened = false;

          // Check if any action explicitly closes the dialogue
          const shouldCloseDialogue = choiceActions.some(
            (action) => action.type === 'close-dialogue' || (action.type === 'go-to' && action.node === null)
          );

          // Create a wrapper context that tracks task opening
          const actionContext = {
            ...trackingContext,
            openTaskSubmission: (task: import('@core/task/types.js').Task | string) => {
              taskOpened = true;
              trackingContext.openTaskSubmission(task);
            },
          };

          // Execute actions (this may open task view via context.openTaskSubmission)
          if (choiceActions.length > 0) {
            await executeActions(choiceActions, actionContext);
          }

          // If task view was opened, close dialogue and let task view handle it
          if (taskOpened) {
            onClose();
            return;
          }

          // If action explicitly closes dialogue, do so
          if (shouldCloseDialogue) {
            onClose();
            return;
          }

          // Navigate to next node (can be null to close dialogue)
          const nextNode = getNextDialogueNode(node, choiceKey, tree, context, moduleData);

          if (nextNode) {
            onNodeChange(nextNode);
          } else {
            // No next node or to: null, close dialogue
            onClose();
          }
        }}
        onClose={onClose}
      />
    </Overlay>
  );
}

