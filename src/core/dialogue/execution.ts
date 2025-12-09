/**
 * Dialogue Execution
 * Execute dialogue trees, handle navigation, apply conditions
 */

import { generateRootDialogue, generateRootDialogueEdges } from './root.js';
import type { NPC } from '../module/types.js';
import type { ModuleData } from '../module/types.js';
import type { ModuleContext } from '../module/types.js';
import type {
  DialogueNode,
  DialogueTree,
  DialogueCondition,
  ChoiceAction,
  DynamicString,
  DynamicStringArray,
  DynamicNode,
  DynamicChoices,
  DynamicActions,
  DynamicCondition,
  DialogueNodeDefinition,
  DialogueChoiceDefinition,
} from './types.js';

// ============================================================================
// Dynamic Field Resolution Helpers
// ============================================================================

/**
 * Resolve dynamic lines to static string array
 */
export function resolveLines(
  lines: DynamicStringArray,
  context: ModuleContext
): string[] {
  if (typeof lines === 'function') {
    return lines(context);
  }
  return lines;
}

/**
 * Resolve dynamic string to static string
 */
function resolveString(text: DynamicString, context: ModuleContext): string {
  if (typeof text === 'function') {
    return text(context);
  }
  return text;
}

/**
 * Resolve dynamic node to static node
 */
function resolveNode(
  next: DynamicNode,
  context: ModuleContext,
  tree: DialogueTree
): DialogueNode | null {
  if (typeof next === 'function') {
    const result = next(context);
    // Result might be a string ID, resolve it
    if (typeof result === 'string') {
      return tree.nodes.find(n => n.id === result) || null;
    }
    return result;
  }
  if (typeof next === 'string') {
    // String ID - look up node in tree
    return tree.nodes.find(n => n.id === next) || null;
  }
  return next;
}

/**
 * Resolve dynamic choices to static choices
 */
function resolveChoices(
  choices: DynamicChoices,
  context: ModuleContext
): Record<string, DialogueChoiceDefinition> {
  if (typeof choices === 'function') {
    return choices(context);
  }
  return choices;
}

/**
 * Resolve dynamic actions to static actions
 */
function resolveActions(
  actions: DynamicActions,
  context: ModuleContext
): ChoiceAction[] {
  if (typeof actions === 'function') {
    return actions(context);
  }
  return actions;
}

/**
 * Resolve dynamic condition to static condition
 */
function resolveCondition(
  condition: DynamicCondition,
  context: ModuleContext
): DialogueCondition {
  if (typeof condition === 'function') {
    return { type: 'custom', check: condition };
  }
  return condition;
}

/**
 * Get node definition from tree metadata
 */
function getNodeDefinition(
  nodeId: string,
  tree: DialogueTree
): DialogueNodeDefinition | undefined {
  return tree._definitions?.get(nodeId);
}

/**
 * Resolve a node's dynamic fields at runtime
 */
export function resolveNodeAtRuntime(
  node: DialogueNode,
  tree: DialogueTree,
  context: ModuleContext
): DialogueNode {
  const definition = getNodeDefinition(node.id, tree);
  if (!definition) {
    // No definition, return node as-is
    return node;
  }

  // Resolve lines
  const resolvedLines = resolveLines(definition.lines, context);

  // Resolve choices if present
  let resolvedChoices = node.choices;
  if (definition.choices) {
    const dynamicChoices = resolveChoices(definition.choices, context);
    resolvedChoices = Object.fromEntries(
      Object.entries(dynamicChoices).map(([key, choice]) => [
        key,
        {
          text: resolveString(choice.text, context),
        },
      ])
    );
  }

  return {
    ...node,
    lines: resolvedLines,
    choices: resolvedChoices,
  };
}

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
  // If choiceKey is null, check for node-level next (auto-advance)
  if (choiceKey === null) {
    const definition = getNodeDefinition(currentNode.id, tree);
    if (definition?.next !== undefined) {
      const nextNode = resolveNode(definition.next, context, tree);
      return nextNode;
    }
    return null; // No auto-advance
  }

  // Find edge matching this choice
  const edge = tree.edges.find(
    e => e.from.id === currentNode.id && e.choiceKey === choiceKey
  );

  if (!edge) {
    return null; // No edge found
  }

  // Resolve dynamic condition if needed
  const condition = edge.condition 
    ? resolveCondition(edge.condition as DynamicCondition, context)
    : undefined;

  // Check condition
  if (condition) {
    if (!evaluateCondition(condition, context, moduleData)) {
      return null; // Condition not met
    }
  }

  // Resolve dynamic next if needed
  // Note: edge.next is static, but we need to check if there's a dynamic definition
  const definition = getNodeDefinition(currentNode.id, tree);
  if (definition?.choices && typeof definition.choices !== 'function') {
    const choiceDef = definition.choices[choiceKey];
    if (choiceDef?.next !== undefined) {
      const resolvedNext = resolveNode(choiceDef.next, context, tree);
      return resolvedNext;
    }
  }

  return edge.next;
}

/**
 * Evaluate a dialogue condition
 * Accepts both DialogueCondition objects and functions for convenience
 */
export function evaluateCondition(
  condition: DialogueCondition | ((context: ModuleContext) => boolean),
  context: ModuleContext,
  moduleData: ModuleData
): boolean {
  // Handle function conditions directly
  if (typeof condition === 'function') {
    return condition(context);
  }

  switch (condition.type) {
    case 'task-complete':
      return context.isTaskCompleted(condition.task);
    case 'task-active':
      return context.getCurrentTaskId() === condition.task.id;
    case 'state-check':
      return context.getModuleStateField(condition.key) === condition.value;
    case 'interactable-state':
      return context.getInteractableState(condition.interactableId, condition.key) === condition.value;
    case 'module-state':
      return context.getModuleStateField(condition.key) === condition.value;
    case 'and':
      return condition.conditions.every(c => evaluateCondition(c, context, moduleData));
    case 'or':
      return condition.conditions.some(c => evaluateCondition(c, context, moduleData));
    case 'custom':
      return condition.check(context);
    default:
      return false;
  }
}

/**
 * Execute choice actions
 */
export async function executeActions(
  actions: ChoiceAction[],
  context: ModuleContext
): Promise<void> {
  for (const action of actions) {
    await executeAction(action, context);
  }
}

/**
 * Execute a single action
 */
async function executeAction(
  action: ChoiceAction,
  context: ModuleContext
): Promise<void> {
  switch (action.type) {
    case 'accept-task':
      context.acceptTask(action.task);
      break;
    case 'set-state':
      context.setModuleStateField(action.key, action.value);
      break;
    case 'set-interactable-state':
      context.setInteractableState(action.interactableId, action.key, action.value);
      break;
    case 'set-module-state':
      context.setModuleStateField(action.key, action.value);
      break;
    case 'call-function':
      await action.handler(context);
      break;
    case 'go-to':
      // Navigation is handled separately
      break;
    case 'close-dialogue':
      // Dialogue closing is handled separately in the UI layer
      break;
    case 'none':
      // No action
      break;
  }
}

/**
 * Get available choices for a node (filtered by conditions)
 * Resolves dynamic choices, text, conditions, and actions
 */
export function getAvailableChoices(
  node: DialogueNode,
  tree: DialogueTree,
  context: ModuleContext,
  moduleData: ModuleData
): Array<{ key: string; text: string; actions: ChoiceAction[] }> {
  // Resolve node at runtime to get dynamic fields
  const resolvedNode = resolveNodeAtRuntime(node, tree, context);

  // Get definition for dynamic choice resolution
  const definition = getNodeDefinition(node.id, tree);
  
  // Resolve choices if dynamic
  let choicesToProcess: Record<string, DialogueChoiceDefinition> = {};
  if (definition?.choices) {
    const resolvedChoices = resolveChoices(definition.choices, context);
    choicesToProcess = resolvedChoices;
  } else if (resolvedNode.choices) {
    // Static choices - convert to definition format
    choicesToProcess = Object.fromEntries(
      Object.entries(resolvedNode.choices).map(([key, choice]) => [
        key,
        { text: choice.text },
      ])
    );
  }

  if (Object.keys(choicesToProcess).length === 0) {
    return [];
  }

  const available: Array<{ key: string; text: string; actions: ChoiceAction[] }> = [];

  for (const [choiceKey, choiceDef] of Object.entries(choicesToProcess)) {
    // Resolve condition
    const condition = choiceDef.condition
      ? resolveCondition(choiceDef.condition, context)
      : undefined;

    // Check condition
    if (condition) {
      if (!evaluateCondition(condition, context, moduleData)) {
        continue; // Condition not met, skip this choice
      }
    }

    // Resolve text
    const text = resolveString(choiceDef.text, context);

    // Resolve actions
    let actions: ChoiceAction[] = [];
    if (choiceDef.actions) {
      actions = resolveActions(choiceDef.actions, context);
    } else {
      // Fall back to edge actions if no definition actions
      const edge = tree.edges.find(
        e => e.from.id === node.id && e.choiceKey === choiceKey
      );
      if (edge?.actions) {
        actions = edge.actions;
      }
    }

    available.push({
      key: choiceKey,
      text,
      actions,
    });
  }

  return available;
}
