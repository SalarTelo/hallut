/**
 * Dialogue Node Creation
 * Functions for creating dialogue nodes with dynamic field support
 */

import type {
  DialogueNode,
  DialogueNodeDefinition,
} from '@core/dialogue/types.js';

/**
 * WeakMap to store node definitions for later retrieval
 * This allows us to preserve full definitions (with next, actions, conditions)
 * even after nodes are created
 */
const nodeDefinitions = new WeakMap<DialogueNode, DialogueNodeDefinition>();

/**
 * Create a dialogue node with full definition
 * Accepts dynamic fields that are resolved at runtime
 * 
 * @param options - Full node definition including lines, choices, task, and next
 * @returns DialogueNode with static structure (dynamic fields resolved at runtime)
 * 
 * @example
 * ```typescript
 * const greeting = dialogueNode({
 *   lines: ['Hello!'],
 *   choices: {
 *     accept: {
 *       text: 'Accept',
 *       next: taskReady,
 *       actions: [acceptTask(greetingTask)],
 *     },
 *   },
 * });
 * ```
 */
export function dialogueNode(options: DialogueNodeDefinition): DialogueNode {
  const { id, task, lines, choices } = options;
  
  // Auto-generate ID if not provided
  const nodeId = id || `node_${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract static data where possible
  // For dynamic fields, we'll resolve them at runtime
  const staticLines = typeof lines === 'function' ? [] : lines;
  const staticChoices = typeof choices === 'function' 
    ? undefined 
    : choices 
      ? Object.fromEntries(
          Object.entries(choices).map(([key, choice]) => [
            key,
            {
              text: typeof choice.text === 'function' ? '' : choice.text,
            },
          ])
        )
      : undefined;
  
  const node: DialogueNode = {
    id: nodeId,
    lines: staticLines, // Will be resolved at runtime if dynamic
    choices: staticChoices, // Will be resolved at runtime if dynamic
    task, // Static, can be stored directly
    // Note: next is stored in definition metadata, not on node
  };

  // Store the full definition for later retrieval
  nodeDefinitions.set(node, options);

  return node;
}

/**
 * Get the definition for a node (if available)
 */
export function getNodeDefinition(node: DialogueNode): DialogueNodeDefinition | undefined {
  return nodeDefinitions.get(node);
}

