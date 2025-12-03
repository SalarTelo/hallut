/**
 * useInteractableActions Hook
 * Handles interactable click actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '@core/module/context.js';
import { getInitialDialogueNode } from '@core/services/dialogueExecution.js';
import type { Interactable, ObjectInteraction, NPC } from '@core/types/interactable.js';
import type { ModuleData } from '@core/types/module.js';
import type { DialogueNode } from '@core/types/dialogue.js';
import { ModuleError, ErrorCode } from '@core/types/errors.js';

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
          const { checkUnlockRequirement } = await import('@core/services/unlockRequirement.js');
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
            case 'dialogue':
              // For objects/locations with dialogue, convert DialogueConfig to DialogueNode
              // This is for backward compatibility
              const dialogueConfig = interaction.dialogue;
              const dialogueNode: DialogueNode = {
                id: dialogueConfig.id,
                lines: dialogueConfig.lines,
                choices: dialogueConfig.choices ? Object.fromEntries(
                  dialogueConfig.choices.map((choice, index) => [`choice_${index}`, { text: choice.text }])
                ) : undefined,
              };
              // For object dialogues, we don't have an NPC, so pass a dummy NPC-like object
              // This is a workaround - ideally objects shouldn't use dialogue type
              const dummyNPC = { id: interactable.id, name: interactable.name, type: 'npc' as const, position: interactable.position };
              onDialogueSelected?.(dialogueNode, dummyNPC as NPC);
              return { type: 'dialogue', dialogueNode, npc: dummyNPC as NPC };

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

