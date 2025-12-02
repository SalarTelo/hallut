/**
 * Welcome View
 * Displays welcome dialogue when entering a module
 */

import type { ModuleData } from '@core/types/module.js';
import type { DialogueNode } from '@core/types/dialogue.js';
import { DialogueView } from './DialogueView.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';

export interface WelcomeViewProps {
  moduleId: string;
  moduleData: ModuleData;
  onComplete: () => void;
}

/**
 * Welcome View component
 */
export function WelcomeView({ moduleId, moduleData, onComplete }: WelcomeViewProps) {
  // Create welcome dialogue node from config
  const welcomeNode: DialogueNode = {
    id: `${moduleId}_welcome`,
    lines: moduleData.config.welcome.lines,
    choices: {
      continue: { text: 'Continue' },
    },
  };

  // Create dummy NPC for welcome (uses speaker from config)
  const welcomeNPC = {
    id: 'system',
    name: moduleData.config.welcome.speaker,
    type: 'npc' as const,
    position: { x: 50, y: 50 },
  };

  return (
    <CenteredLayout>
      <DialogueView
        node={welcomeNode}
        npc={welcomeNPC}
        moduleId={moduleId}
        availableChoices={[
          { key: 'continue', text: 'Continue', actions: [] },
        ]}
        onChoiceSelected={async () => {
          onComplete();
        }}
        onClose={onComplete}
      />
    </CenteredLayout>
  );
}

