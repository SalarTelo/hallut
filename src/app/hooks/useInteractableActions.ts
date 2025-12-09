/**
 * useInteractableActions Hook
 * Handles interactable click actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '@core/module/context.js';
import { getInitialDialogueNode } from '@core/dialogue/execution.js';
import type { Interactable, ObjectInteraction, NPC } from '@core/module/types/index.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import { ModuleError, ErrorCode } from '@core/errors.js';

export interface InteractableActionResult {
  type: 'dialogue' | 'component' | 'none';
  dialogueNode?: DialogueNode;
  npc?: NPC;
  component?: string;
  componentProps?: Record<string, unknown>;
}

export interface UseInteractableActionsOptions {
  moduleId: string;
  moduleData: ModuleData;
  locale?: string;
  onDialogueSelected?: (node: DialogueNode, npc: NPC) => void;
  onComponentOpen?: (component: string, props?: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling interactable actions
 */
export function useInteractableActions({
  moduleId,
  moduleData,
  locale = 'sv',
  onDialogueSelected,
  onComponentOpen,
  onError,
}: UseInteractableActionsOptions) {
  const handleInteractableAction = useCallback(
    async (interactable: Interactable): Promise<InteractableActionResult> => {
      try {
        // Check if interactable is locked
        if (interactable.locked && interactable.unlockRequirement) {
          const { checkUnlockRequirement } = await import('@core/unlock/requirements.js');
          const isUnlocked = await checkUnlockRequirement(
            interactable.unlockRequirement,
            { moduleId }
          );
          if (!isUnlocked) {
            return { type: 'none' };
          }
        }

        // Handle NPC
        if (interactable.type === 'npc') {
          const npc = interactable as NPC;
          
          // NPCs MUST have a dialogue tree to interact
          if (!npc.dialogueTree) {
            return { type: 'none' };
          }
          
          const context = createModuleContext(moduleId, locale, moduleData);
          const initialNode = getInitialDialogueNode(npc, moduleData, context);
          
          if (initialNode) {
            onDialogueSelected?.(initialNode, npc);
            return { type: 'dialogue', dialogueNode: initialNode, npc };
          }
          
          return { type: 'none' };
        }

        // Handle object/location
        if (interactable.type === 'object' || interactable.type === 'location') {
          let interaction: ObjectInteraction | undefined;

          if (interactable.getInteraction) {
            const context = createModuleContext(moduleId, locale, moduleData);
            interaction = interactable.getInteraction(context);
          } else {
            interaction = interactable.interaction;
          }

          if (!interaction || interaction.type === 'none') {
            return { type: 'none' };
          }

          switch (interaction.type) {
            case 'component':
              // Handle all components through the same callback
              // Props can be specific types or generic Record, normalize to Record for callback
              const componentProps = interaction.props as Record<string, unknown> | undefined;
              onComponentOpen?.(interaction.component, componentProps);
              return {
                type: 'component',
                component: interaction.component,
                componentProps,
              };
          }
        }

        return { type: 'none' };
      } catch (error) {
        const moduleError = error instanceof Error
          ? new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling interactable ${interactable.id}: ${error.message}`,
              { originalError: error }
            )
          : new ModuleError(
              ErrorCode.MODULE_INVALID,
              moduleId,
              `Error handling interactable ${interactable.id}`
            );
        onError?.(moduleError);
        return { type: 'none' };
      }
    },
    [moduleId, moduleData, locale, onDialogueSelected, onComponentOpen, onError]
  );

  return {
    handleInteractableAction,
  };
}
