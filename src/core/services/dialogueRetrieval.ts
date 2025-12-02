/**
 * Dialogue Retrieval Service
 * Handles dialogue lookup with fallback to default dialogues
 */

import type { DialogueConfig } from '../types/dialogue.js';
import type { ModuleData, NPC } from '../types/module.js';
import { actions } from '../state/actions.js';

/**
 * Parsed dialogue ID components
 */
interface ParsedDialogueId {
  npcId: string;
  dialogueType: string;
}

/**
 * Parse dialogue ID to extract NPC ID and dialogue type
 * Dialogue IDs follow pattern: `${npcId}-${dialogueKey}`
 * Examples:
 * - `guard-task-ready` → npcId: `guard`, dialogueType: `task-ready`
 * - `guard-chief-task-ready` → npcId: `guard-chief`, dialogueType: `task-ready`
 * - `guard-complete` → npcId: `guard`, dialogueType: `complete` (alias for `task-complete`)
 */
function parseDialogueId(dialogueId: string): ParsedDialogueId | null {
  const parts = dialogueId.split('-');
  if (parts.length < 2) return null;

  // Check for task-related dialogue types (last 1-2 parts)
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : null;

  // Handle `task-ready` and `task-complete` patterns
  if (secondLastPart === 'task' && (lastPart === 'ready' || lastPart === 'complete')) {
    const dialogueType = `${secondLastPart}-${lastPart}`;
    const npcId = parts.slice(0, -2).join('-');
    return { npcId, dialogueType };
  }

  // Handle `complete` as alias for `task-complete`
  if (lastPart === 'complete') {
    const npcId = parts.slice(0, -1).join('-');
    return { npcId, dialogueType: 'task-complete' };
  }

  // Handle `ready` as alias for `task-ready` (if needed)
  if (lastPart === 'ready') {
    const npcId = parts.slice(0, -1).join('-');
    return { npcId, dialogueType: 'task-ready' };
  }

  return null;
}

/**
 * Generate default task-related dialogue
 */
function generateDefaultTaskDialogue(
  dialogueId: string,
  dialogueType: string,
  npc: NPC,
  moduleData: ModuleData,
  moduleId: string
): DialogueConfig | null {
  const currentTaskId = actions.getCurrentTaskId(moduleId);
  const task = currentTaskId ? moduleData.tasks.find(t => t.id === currentTaskId) : null;

  // Generate default TASK_READY dialogue
  if (dialogueType === 'task-ready') {
    if (!task) {
      // If no active task, can't generate task-ready dialogue
      return null;
    }

    return {
      id: dialogueId,
      speaker: npc.name,
      lines: [
        'Are you ready to submit your task?',
        task.description ? `Remember: ${task.description}` : 'Take your time if you need to review it.',
      ],
      choices: [
        {
          text: 'Yes, I\'m ready to submit',
          action: {
            type: 'call-function',
            handler: async (context) => {
              if (context.openTaskSubmission && currentTaskId) {
                context.openTaskSubmission(currentTaskId);
              }
            },
          },
        },
        {
          text: 'Not yet',
          action: { type: 'none' },
        },
      ],
    };
  }

  // Generate default TASK_COMPLETE dialogue
  if (dialogueType === 'task-complete') {
    return {
      id: dialogueId,
      speaker: npc.name,
      lines: [
        'Excellent work!',
        'You have completed all tasks here.',
        'Good luck on your journey!',
      ],
      choices: [
        {
          text: 'Thank you!',
          action: { type: 'none' },
        },
      ],
    };
  }

  return null;
}

/**
 * Get dialogue by ID, with fallback to default dialogues
 * 
 * @param dialogueId - The dialogue ID to retrieve
 * @param moduleData - The module data containing dialogues and interactables
 * @param moduleId - The module ID for context
 * @returns The dialogue config, or null if not found and no default available
 */
export function getDialogue(
  dialogueId: string,
  moduleData: ModuleData,
  moduleId: string
): DialogueConfig | null {
  // First, try to get the dialogue from module data
  const existingDialogue = moduleData.dialogues[dialogueId];
  if (existingDialogue) {
    return existingDialogue;
  }

  // If not found, try to generate a default dialogue
  const parsed = parseDialogueId(dialogueId);
  if (!parsed) {
    return null;
  }

  // Find the NPC
  const npc = moduleData.interactables.find(
    (i): i is NPC => i.type === 'npc' && i.id === parsed.npcId
  );

  if (!npc) {
    return null;
  }

  // Generate default dialogue
  return generateDefaultTaskDialogue(
    dialogueId,
    parsed.dialogueType,
    npc,
    moduleData,
    moduleId
  );
}

