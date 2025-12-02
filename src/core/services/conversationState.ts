/**
 * Conversation State Service
 * Tracks conversation state for resuming
 */

import { actions } from '../state/actions.js';

/**
 * Get last dialogue branch for an NPC
 */
export function getLastDialogueBranch(
  moduleId: string,
  npcId: string
): 'tree' | string | null {
  const conversations = actions.getModuleStateField(moduleId, 'conversations') as Record<string, { branch: 'tree' | string; lastNode?: string }> | undefined;
  return conversations?.[npcId]?.branch || null;
}

/**
 * Set last dialogue branch for an NPC
 */
export function setLastDialogueBranch(
  moduleId: string,
  npcId: string,
  branch: 'tree' | string
): void {
  const conversations = (actions.getModuleStateField(moduleId, 'conversations') as Record<string, { branch: 'tree' | string; lastNode?: string }>) || {};
  actions.setModuleStateField(moduleId, 'conversations', {
    ...conversations,
    [npcId]: {
      ...conversations[npcId],
      branch,
    },
  });
}

/**
 * Get last dialogue node for an NPC
 */
export function getLastDialogueNode(
  moduleId: string,
  npcId: string
): string | null {
  const conversations = actions.getModuleStateField(moduleId, 'conversations') as Record<string, { branch: 'tree' | string; lastNode?: string }> | undefined;
  return conversations?.[npcId]?.lastNode || null;
}

/**
 * Set last dialogue node for an NPC
 */
export function setLastDialogueNode(
  moduleId: string,
  npcId: string,
  nodeId: string
): void {
  const conversations = (actions.getModuleStateField(moduleId, 'conversations') as Record<string, { branch: 'tree' | string; lastNode?: string }>) || {};
  actions.setModuleStateField(moduleId, 'conversations', {
    ...conversations,
    [npcId]: {
      ...conversations[npcId],
      lastNode: nodeId,
    },
  });
}

