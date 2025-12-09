/**
 * Dialogue Choice Filtering
 * Functions for filtering and resolving available dialogue choices
 */

import { resolveNodeAtRuntime, resolveChoices, resolveCondition, resolveString, resolveActions, getNodeDefinitionFromTree } from './resolution.js';
import { evaluateCondition } from './conditions.js';
import type {
  DialogueNode,
  DialogueTree,
  ChoiceAction,
  DialogueChoiceDefinition,
} from './types.js';
import type { ModuleContext } from '../module/types/index.js';
import type { ModuleData } from '../module/types/index.js';

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
  const definition = getNodeDefinitionFromTree(node.id, tree);
  
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
    // Check condition if present
    if (choiceDef.condition) {
      const condition = resolveCondition(choiceDef.condition, context);
      if (!evaluateCondition(condition, context, moduleData)) continue;
    }

    // Resolve text
    const text = resolveString(choiceDef.text, context);

    // Resolve actions - prefer definition actions, fall back to edge actions
    const actions: ChoiceAction[] = choiceDef.actions
      ? (resolveActions(choiceDef.actions, context) as ChoiceAction[])
      : tree.edges.find(e => e.from.id === node.id && e.choiceKey === choiceKey)?.actions || [];

    available.push({
      key: choiceKey,
      text,
      actions,
    });
  }

  return available;
}

