/**
 * Dialogue Interactable View Component
 * Displays a dialogue from an interactable
 */

import { DialogueView } from '../../dialogue/DialogueView.js';
import type { DialogueConfig } from '@types/dialogue.types.js';
import { useDialogueActions } from '@ui/shared/hooks/index.js';
import { ContainerLayout } from '@ui/shared/components/layouts/index.js';
import { DEFAULT_LOCALE } from '@constants/module.constants.js';

export interface DialogueInteractableViewProps {
  dialogueId: string;
  moduleId: string;
  dialogue: DialogueConfig;
  locale?: string;
  onComplete: () => void;
  onTaskSubmissionOpen?: (taskId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Dialogue interactable view component
 */
export function DialogueInteractableView({
  dialogueId,
  moduleId,
  dialogue,
  locale,
  onComplete,
  onTaskSubmissionOpen,
  onError,
}: DialogueInteractableViewProps) {
  const { handleDialogueActions } = useDialogueActions({
    moduleId,
    dialogueId,
    locale: locale || DEFAULT_LOCALE,
    onTaskSubmissionOpen,
    onError,
  });

  const handleDialogueComplete = async () => {
    onComplete();
  };

  const handleChoiceAction = async (
    actions: import('../../../../types/choiceTypes.js').ChoiceAction | import('../../../../types/choiceTypes.js').ChoiceAction[]
  ) => {
    const viewChanged = await handleDialogueActions(actions);
    // If view was changed (e.g., task submission opened), don't close dialogue yet
    // The dialogue will be closed by the view change itself
    return viewChanged;
  };

  return (
    <ContainerLayout className="max-w-4xl">
      <DialogueView
        dialogueId={dialogueId}
        moduleId={moduleId}
        config={dialogue}
        onComplete={handleDialogueComplete}
        onChoiceAction={handleChoiceAction}
      />
    </ContainerLayout>
  );
}

