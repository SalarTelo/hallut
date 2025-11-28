/**
 * Dialogue Store
 * Manages dialogue state and active dialogues
 */

import { create } from 'zustand';
import type { DialogueConfig } from '../types/dialogue.types.js';

/**
 * Active dialogue
 */
interface ActiveDialogue {
  id: string;
  moduleId: string;
  config: DialogueConfig;
  currentLineIndex: number;
  startedAt: number;
}

/**
 * Dialogue store state
 */
interface DialogueStoreState {
  // Active dialogues
  activeDialogues: Map<string, ActiveDialogue>; // key: dialogueId

  // Dialogue history (persisted)
  dialogueHistory: Array<{
    dialogueId: string;
    moduleId: string;
    completedAt: number;
  }>;

  // Actions
  startDialogue: (moduleId: string, dialogueId: string, config: DialogueConfig) => void;
  endDialogue: (dialogueId: string) => void;
  getActiveDialogue: (dialogueId: string) => ActiveDialogue | null;
  isDialogueActive: (dialogueId: string) => boolean;
  advanceDialogue: (dialogueId: string) => void;
  hasSeenDialogue: (moduleId: string, dialogueId: string) => boolean;
}

/**
 * Create the dialogue store with persistence
 */
export const useDialogueStore = create<DialogueStoreState>()(
  (set, get) => ({
    // Initial state
    activeDialogues: new Map(),
    dialogueHistory: [],

    // Start a dialogue
    startDialogue: (moduleId, dialogueId, config) => {
      const activeDialogue: ActiveDialogue = {
        id: dialogueId,
        moduleId,
        config,
        currentLineIndex: 0,
        startedAt: Date.now(),
      };

      const dialogues = new Map(get().activeDialogues);
      dialogues.set(dialogueId, activeDialogue);

      set({ activeDialogues: dialogues });
    },

    // End a dialogue
    endDialogue: (dialogueId) => {
      const dialogue = get().activeDialogues.get(dialogueId);
      if (!dialogue) return;

      // Add to history
      const history = [
        ...get().dialogueHistory,
        {
          dialogueId,
          moduleId: dialogue.moduleId,
          completedAt: Date.now(),
        },
      ];

      // Remove from active
      const dialogues = new Map(get().activeDialogues);
      dialogues.delete(dialogueId);

      set({ activeDialogues: dialogues, dialogueHistory: history });
    },

    // Get active dialogue
    getActiveDialogue: (dialogueId) => {
      return get().activeDialogues.get(dialogueId) || null;
    },

    // Check if dialogue is active
    isDialogueActive: (dialogueId) => {
      return get().activeDialogues.has(dialogueId);
    },

    // Advance dialogue to next line
    advanceDialogue: (dialogueId) => {
      const dialogue = get().activeDialogues.get(dialogueId);
      if (!dialogue) return;

      const nextIndex = dialogue.currentLineIndex + 1;
      const maxLines = dialogue.config.greeting?.length || 0;

      if (nextIndex >= maxLines) {
        // Dialogue complete
        get().endDialogue(dialogueId);
      } else {
        // Advance to next line
        const dialogues = new Map(get().activeDialogues);
        dialogues.set(dialogueId, {
          ...dialogue,
          currentLineIndex: nextIndex,
        });
        set({ activeDialogues: dialogues });
      }
    },

    // Check if dialogue has been seen
    hasSeenDialogue: (moduleId, dialogueId) => {
      return get().dialogueHistory.some((h) => h.moduleId === moduleId && h.dialogueId === dialogueId);
    },
  })
);

/**
 * Selector hooks
 */
export const useActiveDialogue = (dialogueId: string) =>
  useDialogueStore((state) => state.getActiveDialogue(dialogueId));

export const useDialogueActions = () => {
  const startDialogue = useDialogueStore((state) => state.startDialogue);
  const endDialogue = useDialogueStore((state) => state.endDialogue);
  const advanceDialogue = useDialogueStore((state) => state.advanceDialogue);

  return {
    startDialogue,
    endDialogue,
    advanceDialogue,
  };
};

