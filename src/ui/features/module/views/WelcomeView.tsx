/**
 * Welcome View
 * Displays welcome dialogue when entering a module
 */

import type { ModuleData } from '../../../../core/types/module.js';
import { DialogueView } from './DialogueView.js';
import { CenteredLayout } from '../../../shared/components/layouts/index.js';

export interface WelcomeViewProps {
  moduleId: string;
  moduleData: ModuleData;
  onComplete: () => void;
}

/**
 * Welcome View component
 */
export function WelcomeView({ moduleId, moduleData, onComplete }: WelcomeViewProps) {
  const welcomeDialogueId = `${moduleId}_welcome`;
  const welcomeDialogue = moduleData.dialogues[welcomeDialogueId];

  if (!welcomeDialogue) {
    return null;
  }

  return (
    <CenteredLayout>
      <DialogueView
        dialogue={welcomeDialogue}
        moduleId={moduleId}
        onChoiceSelected={async () => {
          onComplete();
        }}
        onClose={onComplete}
      />
    </CenteredLayout>
  );
}

