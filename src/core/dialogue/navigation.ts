/**
 * Dialogue Navigation
 * Functions for navigating dialogue trees and finding nodes
 */

import { generateRootDialogue, generateRootDialogueEdges } from './root.js';
import { resolveNode, resolveCondition, getNodeDefinitionFromTree } from './resolution.js';
import { evaluateCondition } from './conditions.js';
import type { NPC } from '../module/types/index.js';
import type { ModuleData } from '../module/types/index.js';
import type { ModuleContext } from '../module/types/index.js';
import type {
  DialogueNode,
  DialogueTree,
  DynamicCondition,
} from './types.js';

/**
 * Get initial dialogue node for an NPC
 * Also integrates root dialogue into the tree if it exists
 */
export function getInitialDialogueNode(
  npc: NPC,
  moduleData: ModuleData,
  context: ModuleContext
): DialogueNode | null {
  if (!npc.dialogueTree) {
    return null;
  }

  // Check for root dialogue first
  const rootDialogue = generateRootDialogue(npc, moduleData, context);
  if (rootDialogue) {
    // Integrate root dialogue into the tree by adding it as a node and generating edges
    // This makes it work with the normal dialogue navigation system
    if (!npc.dialogueTree.nodes.some(n => n.id === rootDialogue.id)) {
      npc.dialogueTree.nodes.push(rootDialogue);
    }
    
    // Generate and add edges from root dialogue to appropriate nodes
    const rootEdges = generateRootDialogueEdges(rootDialogue, npc.dialogueTree, context, moduleData);
    for (const edge of rootEdges) {
      // Only add edge if it doesn't already exist
      if (!npc.dialogueTree.edges.some(
        e => e.from.id === edge.from.id && e.choiceKey === edge.choiceKey
      )) {
        npc.dialogueTree.edges.push(edge);
      }
    }
    
    return rootDialogue;
  }

  // Check entry configuration
  const entry = npc.dialogueTree.entry;
  if (!entry) {
    // No entry, use first node
    return npc.dialogueTree.nodes[0] || null;
  }

  // If entry is a node, use it
  if ('id' in entry) {
    return entry;
  }

  // Entry is a configuration - check conditions
  for (const { condition, node } of entry.conditions) {
    if (evaluateCondition(condition, context, moduleData)) {
      return node;
    }
  }

  // Use default
  return entry.default;
}

/**
 * Get next dialogue node after a choice
 * Also handles node-level next for auto-advance when no choices
 */
export function getNextDialogueNode(
  currentNode: DialogueNode,
  choiceKey: string | null,
  tree: DialogueTree,
  context: ModuleContext,
  moduleData: ModuleData
): DialogueNode | null {
  // Handle auto-advance (null choiceKey)
  if (choiceKey === null) {
    const definition = getNodeDefinitionFromTree(currentNode.id, tree);
    return definition?.next !== undefined ? resolveNode(definition.next, context, tree) : null;
  }

  // Find edge matching this choice
  const edge = tree.edges.find(e => e.from.id === currentNode.id && e.choiceKey === choiceKey);
  if (!edge) return null;

  // Check condition if present
  if (edge.condition) {
    const condition = resolveCondition(edge.condition as DynamicCondition, context);
    if (!evaluateCondition(condition, context, moduleData)) return null;
  }

  // Check for dynamic next in definition
  const definition = getNodeDefinitionFromTree(currentNode.id, tree);
  if (definition?.choices && typeof definition.choices !== 'function') {
    const choiceDef = definition.choices[choiceKey];
    if (choiceDef?.next !== undefined) {
      return resolveNode(choiceDef.next, context, tree);
    }
  }

  return edge.next;
}

