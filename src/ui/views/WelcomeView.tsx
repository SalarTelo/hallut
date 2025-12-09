/**
 * Welcome View
 * Displays welcome dialogue when entering a module
 * 
 * Shows the module's welcome message as a dialogue, allowing users
 * to read the introduction before proceeding to the main interactable view.
 * 
 * @example
 * ```tsx
 * <WelcomeView
 *   moduleId="example-1"
 *   moduleData={moduleData}
 *   onComplete={handleWelcomeComplete}
 * />
 * ```
 */

import type { ModuleData } from '@core/module/types/index.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import { DialogueView } from './DialogueView.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';

export interface WelcomeViewProps {
  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Module data containing welcome configuration
   */
  moduleData: ModuleData;

  /**
   * Callback when welcome dialogue is completed
   */
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
