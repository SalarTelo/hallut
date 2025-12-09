/**
 * useModuleViews Hook
 * Manages view state and navigation
 */

import { useState, useEffect } from 'react';
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
 */
export function useModuleViews(
  moduleId: string,
  moduleData: ModuleData | null
): UseModuleViewsReturn {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedDialogueNode, setSelectedDialogueNode] = useState<DialogueNode | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Check welcome dialogue
  useEffect(() => {
    if (moduleData && currentView === 'welcome') {
      const welcomeDialogueId = `${moduleId}_welcome`;
      if (!actions.hasSeenGreeting(moduleId, welcomeDialogueId)) {
        actions.markGreetingSeen(moduleId, welcomeDialogueId);
      }
    }
  }, [moduleData, currentView, moduleId]);

  const openDialogue = (node: DialogueNode, npc: NPC) => {
    setSelectedDialogueNode(node);
    setSelectedNPC(npc);
    setCurrentView('dialogue');
  };

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentView('task');
  };

  const closeDialogue = () => {
    setSelectedDialogueNode(null);
    setSelectedNPC(null);
    setCurrentView('interactable');
  };

  const closeTask = () => {
    setSelectedTaskId(null);
    setCurrentView('interactable');
  };

  const returnToInteractable = () => {
    setCurrentView('interactable');
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

