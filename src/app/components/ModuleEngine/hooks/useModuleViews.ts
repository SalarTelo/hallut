/**
 * useModuleViews Hook
 * Manages view state and navigation
 * 
 * View state is derived from content state (selectedTaskId, selectedDialogueNode)
 * to ensure consistency and prevent race conditions.
 */

import { useState, useEffect, useMemo } from 'react';
import { actions } from '@core/state/actions.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import type { NPC } from '@core/module/types/index.js';
import type { ModuleData } from '@core/module/types/index.js';

export type View = 'welcome' | 'interactable' | 'dialogue' | 'task';

export interface UseModuleViewsReturn {
  currentView: View;
  selectedDialogueNode: DialogueNode | null;
  selectedNPC: NPC | null;
  selectedTaskId: string | null;
  setSelectedDialogueNode: (node: DialogueNode | null) => void;
  openDialogue: (node: DialogueNode, npc: NPC) => void;
  openTask: (taskId: string) => void;
  closeDialogue: () => void;
  closeTask: () => void;
  returnToInteractable: () => void;
}

/**
 * Hook for managing module view state
 * 
 * View is derived from content state to ensure consistency:
 * - If selectedTaskId is set → 'task' view
 * - Else if selectedDialogueNode is set → 'dialogue' view
 * - Else if welcome not seen → 'welcome' view
 * - Else → 'interactable' view
 */
export function useModuleViews(
  moduleId: string,
  moduleData: ModuleData | null
): UseModuleViewsReturn {
  const [explicitView, setExplicitView] = useState<View | null>(null);
  const [selectedDialogueNode, setSelectedDialogueNode] = useState<DialogueNode | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Check welcome dialogue
  useEffect(() => {
    if (moduleData) {
      const welcomeDialogueId = `${moduleId}_welcome`;
      const seen = actions.hasSeenGreeting(moduleId, welcomeDialogueId);
      setHasSeenWelcome(seen);
      if (!seen) {
        actions.markGreetingSeen(moduleId, welcomeDialogueId);
      }
    }
  }, [moduleData, moduleId]);

  // Derive view from content state (single source of truth)
  const currentView = useMemo<View>(() => {
    // If explicit view is set (e.g., during transitions), use it
    if (explicitView) {
      return explicitView;
    }

    // Task view takes priority
    if (selectedTaskId) {
      return 'task';
    }

    // Dialogue view is second priority
    if (selectedDialogueNode && selectedNPC) {
      return 'dialogue';
    }

    // Welcome view if not seen
    if (!hasSeenWelcome) {
      return 'welcome';
    }

    // Default to interactable
    return 'interactable';
  }, [explicitView, selectedTaskId, selectedDialogueNode, selectedNPC, hasSeenWelcome]);

  // Clear explicit view when it matches derived view
  useEffect(() => {
    if (explicitView) {
      const derivedView: View = selectedTaskId
        ? 'task'
        : selectedDialogueNode && selectedNPC
          ? 'dialogue'
          : !hasSeenWelcome
            ? 'welcome'
            : 'interactable';

      if (explicitView === derivedView) {
        setExplicitView(null);
      }
    }
  }, [explicitView, selectedTaskId, selectedDialogueNode, selectedNPC, hasSeenWelcome]);

  const openDialogue = (node: DialogueNode, npc: NPC) => {
    // Clear task when opening dialogue
    setSelectedTaskId(null);
    setSelectedDialogueNode(node);
    setSelectedNPC(npc);
    // Explicitly set view to ensure immediate transition
    setExplicitView('dialogue');
  };

  const openTask = (taskId: string) => {
    // Clear dialogue when opening task
    setSelectedDialogueNode(null);
    setSelectedNPC(null);
    setSelectedTaskId(taskId);
    // Explicitly set view to ensure immediate transition
    setExplicitView('task');
  };

  const closeDialogue = () => {
    setSelectedDialogueNode(null);
    setSelectedNPC(null);
    // Don't reset explicit view - let it be derived from remaining state
    // If task is open, view will remain 'task', otherwise 'interactable'
    setExplicitView(null);
  };

  const closeTask = () => {
    setSelectedTaskId(null);
    // Clear explicit view to allow derivation
    setExplicitView(null);
  };

  const returnToInteractable = () => {
    // Clear all content state
    setSelectedTaskId(null);
    setSelectedDialogueNode(null);
    setSelectedNPC(null);
    setExplicitView('interactable');
  };

  return {
    currentView,
    selectedDialogueNode,
    selectedNPC,
    selectedTaskId,
    setSelectedDialogueNode,
    openDialogue,
    openTask,
    closeDialogue,
    closeTask,
    returnToInteractable,
  };
}

