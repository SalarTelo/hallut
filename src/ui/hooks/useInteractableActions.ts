/**
 * useInteractableActions Hook
 * Handles interactable click actions
 */

import { useCallback } from 'react';
import { createModuleContext } from '../../core/module/context.js';
import type { Interactable, ObjectInteraction } from '../../core/types/interactable.js';
import { ModuleError, ErrorCode } from '../../core/types/errors.js';

export interface InteractableActionResult {
  type: 'dialogue' | 'component' | 'image' | 'note' | 'none';
  dialogueId?: string;
  component?: string;
  componentProps?: Record<string, unknown>;
  imageUrl?: string;
  imageTitle?: string;
  noteContent?: string;
  noteTitle?: string;
}

export interface UseInteractableActionsOptions {
  moduleId: string;
  locale?: string;
  onDialogueSelected?: (dialogueId: string) => void;
  onComponentOpen?: (component: string, props?: Record<string, unknown>) => void;
  onImageOpen?: (url: string, title?: string) => void;
  onNoteOpen?: (content: string, title?: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling interactable actions
 */
export function useInteractableActions({
  moduleId,
  locale = 'sv',
  onDialogueSelected,
  onComponentOpen,
  onImageOpen,
  onNoteOpen,
  onError,
}: UseInteractableActionsOptions) {
  const handleInteractableAction = useCallback(
    async (interactable: Interactable): Promise<InteractableActionResult> => {
      try {
        // Check if interactable is locked
        if (interactable.locked && interactable.unlockRequirement) {
          // TODO: Check unlock requirement
          // For now, return none if locked
          return { type: 'none' };
        }

        // Handle NPC
        if (interactable.type === 'npc') {
          if (interactable.getDialogue) {
            const context = createModuleContext(moduleId, locale);
            const dialogue = interactable.getDialogue(context);
            onDialogueSelected?.(dialogue.id);
            return { type: 'dialogue', dialogueId: dialogue.id };
          }

          // Use first dialogue
          const dialogueIds = Object.keys(interactable.dialogues);
          if (dialogueIds.length > 0) {
            const dialogueId = `${interactable.id}-${dialogueIds[0]}`;
            onDialogueSelected?.(dialogueId);
            return { type: 'dialogue', dialogueId };
          }
        }

        // Handle object/location
        if (interactable.type === 'object' || interactable.type === 'location') {
          let interaction: ObjectInteraction | undefined;

          if (interactable.getInteraction) {
            const context = createModuleContext(moduleId, locale);
            interaction = interactable.getInteraction(context);
          } else {
            interaction = interactable.interaction;
          }

          if (!interaction || interaction.type === 'none') {
            return { type: 'none' };
          }

          switch (interaction.type) {
            case 'dialogue':
              // Dialogue IDs are prefixed with interactable ID in the loader
              // For objects/locations: `${interactable.id}-dialogue`
              // The loader always creates IDs like this, so we match that pattern
              const dialogueId = `${interactable.id}-dialogue`;
              onDialogueSelected?.(dialogueId);
              return { type: 'dialogue', dialogueId };

            case 'component':
              // Check if it's a note component
              if (interaction.component === 'NoteViewer') {
                const props = interaction.props as { content?: string; title?: string } | undefined;
                onNoteOpen?.(props?.content || '', props?.title);
                return {
                  type: 'note',
                  noteContent: props?.content || '',
                  noteTitle: props?.title,
                };
              }
              // Handle other components (like ChatWindow)
              onComponentOpen?.(interaction.component, interaction.props);
              return {
                type: 'component',
                component: interaction.component,
                componentProps: interaction.props,
              };

            case 'image':
              onImageOpen?.(interaction.imageUrl, interaction.title);
              return {
                type: 'image',
                imageUrl: interaction.imageUrl,
                imageTitle: interaction.title,
              };

            case 'note':
              onNoteOpen?.(interaction.content, interaction.title);
              return {
                type: 'note',
                noteContent: interaction.content,
                noteTitle: interaction.title,
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
    [moduleId, locale, onDialogueSelected, onComponentOpen, onImageOpen, onNoteOpen, onError]
  );

  return {
    handleInteractableAction,
  };
}

