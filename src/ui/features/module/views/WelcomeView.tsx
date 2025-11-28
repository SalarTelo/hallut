/**
 * Välkomstvy-komponent
 * Visar välkomstdialogen för en modul
 */

import { memo } from 'react';
import { DialogueView } from '../../dialogue/DialogueView.js';
import { getWelcomeDialogueId } from '@constants/module.constants.js';
import { ContainerLayout } from '@ui/shared/components/layouts/index.js';
import type { ModuleData } from '@types/module/moduleConfig.types.js';

export interface WelcomeViewProps {
  moduleId: string;
  moduleData: ModuleData;
  onComplete: () => void;
}

/**
 * Välkomstvy-komponent
 */
export const WelcomeView = memo(function WelcomeView({ moduleId, moduleData, onComplete }: WelcomeViewProps) {
  const welcomeDialogueId = getWelcomeDialogueId(moduleId);
  const welcomeDialogue = moduleData.dialogues[welcomeDialogueId];

  if (!welcomeDialogue) {
    return null;
  }

  return (
    <ContainerLayout>
      <DialogueView
        dialogueId={welcomeDialogueId}
        moduleId={moduleId}
        config={welcomeDialogue}
        onComplete={onComplete}
      />
    </ContainerLayout>
  );
});
