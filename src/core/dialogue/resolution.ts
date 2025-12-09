/**
 * Dynamic Field Resolution
 * Functions for resolving dynamic dialogue fields at runtime
 */

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
import type { ModuleContext } from '../module/types/index.js';

/**
 * Generic helper to resolve dynamic values (functions or static values)
 */
function resolveDynamic<T>(value: T | ((context: ModuleContext) => T), context: ModuleContext): T {
  return typeof value === 'function' ? value(context) : value;
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
 * Resolve dynamic lines to static string array
 */
export function resolveLines(
  lines: DynamicStringArray,
  context: ModuleContext
): string[] {
  return resolveDynamic(lines, context);
}

/**
 * Resolve dynamic string to static string
 */
export function resolveString(text: DynamicString, context: ModuleContext): string {
  return resolveDynamic(text, context);
}

/**
 * Resolve dynamic node to static node
 */
export function resolveNode(
  next: DynamicNode,
  context: ModuleContext,
  tree: DialogueTree
): DialogueNode | null {
  const resolved = typeof next === 'function' ? next(context) : next;
  
  // If result is a string ID, look up node in tree
  if (typeof resolved === 'string') {
    return tree.nodes.find(n => n.id === resolved) || null;
  }
  
  return resolved;
}

/**
 * Resolve dynamic choices to static choices
 */
export function resolveChoices(
  choices: DynamicChoices,
  context: ModuleContext
): Record<string, DialogueChoiceDefinition> {
  return resolveDynamic(choices, context);
}

/**
 * Resolve dynamic actions to static actions
 */
export function resolveActions(
  actions: DynamicActions,
  context: ModuleContext
): ChoiceAction[] {
  return resolveDynamic(actions, context);
}

/**
 * Resolve dynamic condition to static condition
 */
export function resolveCondition(
  condition: DynamicCondition,
  context: ModuleContext
): DialogueCondition {
  if (typeof condition === 'function') {
    return { type: 'custom', check: condition };
  }
  return condition;
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
 * Get node definition from tree (exported for use in other modules)
 */
export function getNodeDefinitionFromTree(
  nodeId: string,
  tree: DialogueTree
): DialogueNodeDefinition | undefined {
  return getNodeDefinition(nodeId, tree);
}

