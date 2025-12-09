/**
 * Root Dialogue
 * Auto-generates root dialogue for NPCs
 */

import { dialogueNode } from '@builders/dialogues.js';
import { getActiveTasks } from '../task/availability.js';
import { evaluateCondition } from './execution.js';
import type { NPC } from '../module/types.js';
import type { ModuleData } from '../module/types.js';
import type { ModuleContext } from '../module/types.js';
import type { DialogueNode, DialogueTree, DialogueEdge } from './types.js';
import type { Task } from '../task/types.js';

/**
 * Check if NPC has dialogue tree with actual dialogue content
 */
function hasDialogueContent(npc: NPC): boolean {
  if (!npc.dialogueTree) {
    return false;
  }

  // Check if there are any nodes with actual dialogue lines
  // A dialogue tree with nodes but no lines doesn't count as "having dialogue"
  return npc.dialogueTree.nodes.length > 0 && npc.dialogueTree.nodes.some(
    node => node.lines && node.lines.length > 0 && node.lines.some(line => line.trim().length > 0)
  );
}

/**
 * Generate root dialogue for an NPC
 * Returns null if no root is needed (no active tasks)
 * Note: Only active tasks show in root dialogue, but badges show for both active and available tasks
 */
export function generateRootDialogue(
  npc: NPC,
  _moduleData: ModuleData,
  context: ModuleContext
): DialogueNode | null {
  if (!npc.tasks || npc.tasks.length === 0) {
    return null; // No tasks, skip root
  }

  // Get active tasks only
  const activeTasks = getActiveTasks(npc.tasks, context);
  
  if (activeTasks.length === 0) {
    return null; // No active tasks, skip root
  }

  // Build choices
  const choices: Record<string, { text: string }> = {};

  // Only add "Talk to [NPC]..." if NPC has actual dialogue content
  if (hasDialogueContent(npc)) {
    choices.talk = { text: `Talk to ${npc.name}...` };
  }

  // Add active task choices
  for (const task of activeTasks) {
    const choiceKey = `task_${task.id}`;
    choices[choiceKey] = { text: formatTaskChoice(task, 'In Progress') };
  }

  // Add goodbye
  choices.goodbye = { text: 'Goodbye' };

  return dialogueNode({
    id: `${npc.id}_root`,
    lines: [`Hello! What would you like to do?`],
    choices,
  });
}

/**
 * Format task choice text
 */
export function formatTaskChoice(
  task: Task,
  status: string
): string {
  const maxLength = 50; // Increased to accommodate [Task] prefix
  let text = `[Task] - ${task.name} (${status})`;
  
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }
  
  return text;
}

/**
 * Get task status
 */
export function getTaskStatus(
  task: Task,
  context: ModuleContext
): 'available' | 'active' | 'completed' | 'locked' {
  if (context.isTaskCompleted(task)) {
    return 'completed';
  }

  const currentTaskId = context.getCurrentTaskId();
  if (currentTaskId === task.id) {
    return 'active';
  }

  // Check if task is available (would need unlock requirement check)
  // For now, assume available if not completed/active
  return 'available';
}

/**
 * Generate edges for root dialogue that connect to the dialogue tree
 * This makes the root dialogue part of the dialogue system without special handling
 */
export function generateRootDialogueEdges(
  rootNode: DialogueNode,
  tree: DialogueTree,
  context: ModuleContext,
  moduleData: ModuleData
): DialogueEdge[] {
  const edges: DialogueEdge[] = [];

  if (!rootNode.choices) {
    return edges;
  }

  for (const choiceKey of Object.keys(rootNode.choices)) {
    // Handle "talk" choice - navigate to entry, skipping task-active conditions
    if (choiceKey === 'talk') {
      let targetNode: DialogueNode | null = null;

      if (tree.entry) {
        if ('id' in tree.entry) {
          targetNode = tree.entry;
        } else {
          // Evaluate entry conditions, but skip task-active conditions
          // When manually choosing to talk, we want normal dialogue, not task submission
          for (const { condition, node } of tree.entry.conditions) {
            if (condition.type === 'task-active') {
              continue; // Skip task-active when manually navigating to talk
            }
            if (evaluateCondition(condition, context, moduleData)) {
              targetNode = node;
              break;
            }
          }
          // If no condition matched (other than task-active), use default
          if (!targetNode) {
            targetNode = tree.entry.default;
          }
        }
      } else if (tree.nodes.length > 0) {
        targetNode = tree.nodes[0];
      }

      if (targetNode) {
        edges.push({
          from: rootNode,
          next: targetNode, // Changed from 'to' to 'next'
          choiceKey,
        });
      }
      continue;
    }

    // Handle task choices - navigate to task-ready node (only active tasks show in root)
    if (choiceKey.startsWith('task_')) {
      const taskId = choiceKey.replace('task_', '');
      let targetNode: DialogueNode | null = null;

      // Find node with matching task property (task-ready node)
      for (const node of tree.nodes) {
        if (node.task && node.task.id === taskId) {
          targetNode = node;
          break;
        }
      }

      if (targetNode) {
        edges.push({
          from: rootNode,
          next: targetNode, // Changed from 'to' to 'next'
          choiceKey,
        });
      }
      continue;
    }

    // Handle "goodbye" choice - close dialogue
    if (choiceKey === 'goodbye') {
      edges.push({
        from: rootNode,
        next: null, // null means close dialogue (changed from 'to' to 'next')
        choiceKey,
      });
      continue;
    }
  }

  return edges;
}
