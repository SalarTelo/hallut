/**
 * Dialogue Builders
 * Type-safe builders for creating dialogues
 */

import type {
  DialogueConfig,
  DialogueChoice,
  ChoiceAction,
  DialogueNode,
  DialogueTree,
  DialogueEdge,
  DialogueCondition,
  DialogueEntryConfig,
  DialogueNodeDefinition,
  DialogueChoiceDefinition,
  DynamicStringArray,
  DynamicChoices,
  DynamicNode,
} from '@core/types/dialogue.js';
import type { Task } from '@core/types/task.js';
import type { ModuleContext } from '@core/types/module.js';

// ============================================================================
// StateRef Pattern
// ============================================================================

/**
 * State reference type - function that takes context and returns state proxy
 */
export type StateRef<T extends Record<string, unknown> = Record<string, unknown>> = (
  context: ModuleContext
) => T;

/**
 * Creates a state reference for an NPC/interactable
 * Returns a function that, when called with context, returns a Proxy
 * that syncs property access with the Zustand store
 * 
 * @param interactable - The NPC or interactable to create a state reference for
 * @returns A function that takes ModuleContext and returns a state proxy
 * 
 * @example
 * ```typescript
 * const guardState = stateRef<GuardState>(guardNPC);
 * // Later, in an action:
 * (ctx) => { guardState(ctx).hasMet = true; }
 * ```
 */
export function stateRef<T extends Record<string, unknown> = Record<string, unknown>>(
  interactable: { id: string }
): StateRef<T> {
  return (context: ModuleContext) => {
    return new Proxy({} as T, {
      get(target, prop: string | symbol) {
        if (typeof prop === 'symbol') {
          return undefined;
        }
        // Read from Zustand store via context
        return context.getInteractableState(interactable.id, prop);
      },
      set(target, prop: string | symbol, value: unknown) {
        if (typeof prop === 'symbol') {
          return false;
        }
        // Write to Zustand store via context
        context.setInteractableState(interactable.id, prop, value);
        return true; // Indicate success
      },
      has(target, prop: string | symbol) {
        if (typeof prop === 'symbol') {
          return false;
        }
        // Check if property exists in store
        const value = context.getInteractableState(interactable.id, prop);
        return value !== undefined;
      },
      ownKeys(target) {
        // This is tricky - we'd need to get all keys from the store
        // For now, return empty array (can be enhanced if needed)
        return [];
      },
    });
  };
}

/**
 * Dialogue options
 */
export interface DialogueOptions {
  id: string;
  lines: string[];
  choices?: DialogueChoice[];
}

/**
 * Create a dialogue
 */
export function createDialogue(options: DialogueOptions): DialogueConfig {
  const { id, lines, choices } = options;

  return {
    id,
    lines,
    choices,
  };
}

/**
 * Choice builder implementation
 */
class ChoiceBuilderImpl implements ChoiceBuilder {
  private text: string;
  private actions: ChoiceAction[] = [];

  constructor(text: string) {
    this.text = text;
  }

  acceptTask(task: Task): ChoiceBuilder {
    this.actions.push({ type: 'accept-task', task });
    return this;
  }

  setState(key: string, value: unknown): ChoiceBuilder {
    this.actions.push({ type: 'set-state', key, value });
    return this;
  }

  callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceBuilder {
    this.actions.push({ type: 'call-function', handler });
    return this;
  }

  goTo(dialogue: DialogueConfig | null): ChoiceBuilder {
    // For backward compatibility, convert DialogueConfig to DialogueNode
    if (dialogue) {
      const node: DialogueNode = {
        id: dialogue.id,
        lines: dialogue.lines,
        choices: dialogue.choices ? Object.fromEntries(
          dialogue.choices.map((choice, index) => [`choice_${index}`, { text: choice.text }])
        ) : undefined,
      };
      this.actions.push({ type: 'go-to', node });
    } else {
      this.actions.push({ type: 'go-to', node: null });
    }
    return this;
  }

  build(): DialogueChoice {
    if (this.actions.length === 0) {
      return {
        text: this.text,
        action: null,
      };
    }

    if (this.actions.length === 1) {
      return {
        text: this.text,
        action: this.actions[0],
      };
    }

    return {
      text: this.text,
      action: this.actions,
    };
  }
}

/**
 * Choice builder interface
 */
export interface ChoiceBuilder {
  acceptTask(task: Task): ChoiceBuilder;
  setState(key: string, value: unknown): ChoiceBuilder;
  callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceBuilder;
  goTo(dialogue: DialogueConfig | null): ChoiceBuilder;
  build(): DialogueChoice;
}

/**
 * Create a choice builder
 */
export function choice(text: string): ChoiceBuilder {
  return new ChoiceBuilderImpl(text);
}

/**
 * Create a simple choice with no action
 */
export function simpleChoice(text: string): DialogueChoice {
  return {
    text,
    action: null,
  };
}

// ============================================================================
// Dialogue Tree Builders
// ============================================================================

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
  const { id, task, lines, choices, next } = options;
  
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

/**
 * Dialogue tree builder
 */
class DialogueTreeBuilder {
  private nodeList: DialogueNode[] = [];
  private edges: DialogueEdge[] = [];
  private entryConfig?: DialogueEntryConfig;
  private definitions: Map<string, DialogueNodeDefinition> = new Map();

  /**
   * Add a single node to the tree
   * Extracts edges automatically from node definition
   */
  node(nodeOrDefinition: DialogueNode | DialogueNodeDefinition): DialogueTreeBuilder {
    // Handle both DialogueNode (from dialogueNode()) and raw definitions
    let node: DialogueNode;
    let definition: DialogueNodeDefinition;

    // Type guard: check if it's a DialogueNode
    const isDialogueNode = (obj: DialogueNode | DialogueNodeDefinition): obj is DialogueNode => {
      return 'id' in obj && typeof obj.id === 'string' && 
             'lines' in obj && Array.isArray(obj.lines) &&
             typeof obj.lines[0] === 'string';
    };

    if (isDialogueNode(nodeOrDefinition)) {
      // It's a DialogueNode (already created)
      node = nodeOrDefinition;
      // Try to retrieve the stored definition, or create a minimal one
      definition = nodeDefinitions.get(node) || {
        lines: node.lines,
        choices: node.choices ? Object.fromEntries(
          Object.entries(node.choices).map(([key, choice]) => [key, { text: choice.text }])
        ) : undefined,
        task: node.task,
      };
    } else {
      // It's a DialogueNodeDefinition
      definition = nodeOrDefinition;
      node = dialogueNode(definition);
    }

    // Store definition for runtime resolution
    this.definitions.set(node.id, definition);

    // Add node if not already present
    if (!this.nodeList.find(n => n.id === node.id)) {
      this.nodeList.push(node);
    }

    // Extract edges from definition
    this.extractEdges(node, definition);

    return this;
  }

  /**
   * Add multiple nodes to the tree
   */
  addNodes(...nodeOrDefinitions: Array<DialogueNode | DialogueNodeDefinition>): DialogueTreeBuilder {
    for (const nodeOrDef of nodeOrDefinitions) {
      this.node(nodeOrDef);
    }
    return this;
  }

  /**
   * Alias for addNodes (shorter name)
   */
  nodes(...nodeOrDefinitions: Array<DialogueNode | DialogueNodeDefinition>): DialogueTreeBuilder {
    return this.addNodes(...nodeOrDefinitions);
  }

  /**
   * Extract edges from node definition
   */
  private extractEdges(node: DialogueNode, definition: DialogueNodeDefinition): void {
    // Handle node-level next (for auto-advance)
    // Node-level next is resolved at runtime when there are no choices
    // We don't create an edge for it here

    // Extract edges from choices
    if (definition.choices) {
      // If choices is a function, we can't extract edges at build time
      // They'll be resolved at runtime
      if (typeof definition.choices === 'function') {
        // Can't extract edges from dynamic choices at build time
        return;
      }

      // Static choices - extract edges
      for (const [choiceKey, choiceDef] of Object.entries(definition.choices)) {
        if (choiceDef.next !== undefined) {
          // Resolve next to get target node (if static)
          let targetNode: DialogueNode | null = null;

          if (typeof choiceDef.next === 'function') {
            // Dynamic next - can't resolve at build time
            // We'll need to handle this at runtime
            // For now, create a placeholder edge that will be resolved
            targetNode = null; // Will be resolved at runtime
          } else if (choiceDef.next === null) {
            targetNode = null;
          } else {
            // Static node reference
            targetNode = choiceDef.next;
            // Ensure target node is in tree (recursively add it)
            if (targetNode && !this.nodeList.find(n => n.id === targetNode!.id)) {
              // It's already a DialogueNode (from dialogueNode() call)
              // Add it to the tree so its definition is stored
              this.node(targetNode);
            }
          }

          // Create edge
          const edge: DialogueEdge = {
            from: node,
            next: targetNode, // Will be resolved at runtime if dynamic
            choiceKey,
            // condition and actions are resolved at runtime
            condition: typeof choiceDef.condition === 'function' 
              ? undefined 
              : choiceDef.condition,
            actions: typeof choiceDef.actions === 'function'
              ? undefined
              : choiceDef.actions,
          };
          this.edges.push(edge);
        }
      }
    }
  }

  /**
   * Configure entry point
   */
  configureEntry(): DialogueEntryBuilder {
    return new DialogueEntryBuilder(this);
  }

  /**
   * Set entry configuration (internal)
   */
  setEntryConfig(config: DialogueEntryConfig): void {
    this.entryConfig = config;
  }

  /**
   * Build the dialogue tree
   */
  build(): DialogueTree {
    // Validate tree
    this.validateTree();

    // If no entry config, use first node as default
    const entry = this.entryConfig || this.nodeList[0];

    return {
      nodes: this.nodeList,
      edges: this.edges,
      entry,
      _definitions: this.definitions,
    };
  }

  /**
   * Validate the dialogue tree
   */
  private validateTree(): void {
    if (this.nodeList.length === 0) {
      throw new Error('Dialogue tree must have at least one node');
    }

    // Check that all referenced nodes exist
    for (const edge of this.edges) {
      if (edge.next !== null && !this.nodeList.find(n => n.id === edge.next!.id)) {
        throw new Error(`Edge references non-existent node: ${edge.next?.id}`);
      }
    }

    // Check entry configuration
    if (this.entryConfig) {
      if (!this.nodeList.find(n => n.id === this.entryConfig!.default.id)) {
        throw new Error(`Entry default node not found: ${this.entryConfig.default.id}`);
      }
      for (const { node } of this.entryConfig.conditions) {
        if (!this.nodeList.find(n => n.id === node.id)) {
          throw new Error(`Entry condition node not found: ${node.id}`);
        }
      }
    }

    // Check for circular references (basic check)
    // More sophisticated cycle detection could be added
    const visited = new Set<string>();
    const checkCycle = (nodeId: string, path: Set<string>): void => {
      if (path.has(nodeId)) {
        throw new Error(`Circular reference detected in dialogue tree: ${Array.from(path).join(' -> ')} -> ${nodeId}`);
      }
      if (visited.has(nodeId)) {
        return;
      }
      visited.add(nodeId);
      const newPath = new Set(path);
      newPath.add(nodeId);
      
      const nodeEdges = this.edges.filter(e => e.from.id === nodeId);
      for (const edge of nodeEdges) {
        if (edge.next) {
          checkCycle(edge.next.id, newPath);
        }
      }
    };

    for (const node of this.nodeList) {
      if (!visited.has(node.id)) {
        checkCycle(node.id, new Set());
      }
    }
  }

  /**
   * Get definitions map (internal, for runtime resolution)
   */
  getDefinitions(): Map<string, DialogueNodeDefinition> {
    return this.definitions;
  }
}

/**
 * Entry builder
 */
class DialogueEntryBuilder {
  private conditions: Array<{ condition: DialogueCondition; node: DialogueNode }> = [];
  private defaultNode?: DialogueNode;
  private treeBuilder: DialogueTreeBuilder;

  constructor(treeBuilder: DialogueTreeBuilder) {
    this.treeBuilder = treeBuilder;
  }

  /**
   * Add a conditional entry point
   * Accepts either a DialogueCondition or a function for convenience
   */
  when(condition: DialogueCondition | ((context: ModuleContext) => boolean)): DialogueEntryConditionBuilder {
    // Normalize function to customCondition if needed
    const normalizedCondition: DialogueCondition = 
      typeof condition === 'function' 
        ? { type: 'custom', check: condition }
        : condition;
    
    return new DialogueEntryConditionBuilder(this, normalizedCondition);
  }

  /**
   * Set default entry node
   */
  default(node: DialogueNode): DialogueTreeBuilder {
    this.defaultNode = node;
    
    // Ensure node is in tree
    if (!this.treeBuilder['nodeList'].find((n: DialogueNode) => n.id === node.id)) {
      this.treeBuilder['nodeList'].push(node);
    }

    // Build entry config
    if (this.defaultNode) {
      this.treeBuilder.setEntryConfig({
        conditions: this.conditions,
        default: this.defaultNode,
      });
    }

    return this.treeBuilder;
  }

  /**
   * Add condition (internal)
   */
  addCondition(condition: DialogueCondition, node: DialogueNode): void {
    this.conditions.push({ condition, node });
    
    // Ensure node is in tree
    if (!this.treeBuilder['nodeList'].find((n: DialogueNode) => n.id === node.id)) {
      this.treeBuilder['nodeList'].push(node);
    }
  }
}

/**
 * Entry condition builder
 */
class DialogueEntryConditionBuilder {
  private entryBuilder: DialogueEntryBuilder;
  private condition: DialogueCondition;

  constructor(entryBuilder: DialogueEntryBuilder, condition: DialogueCondition) {
    this.entryBuilder = entryBuilder;
    this.condition = condition;
  }

  /**
   * Use this node when condition is met
   */
  use(node: DialogueNode): DialogueEntryBuilder {
    this.entryBuilder.addCondition(this.condition, node);
    return this.entryBuilder;
  }
}

/**
 * Create a dialogue tree builder
 */
export function dialogueTree(): DialogueTreeBuilder {
  return new DialogueTreeBuilder();
}

// ============================================================================
// Condition Helpers
// ============================================================================

/**
 * Create a task completion condition
 */
export function taskComplete(task: Task): DialogueCondition {
  return { type: 'task-complete', task };
}

/**
 * Create a task active condition
 */
export function taskActive(task: Task): DialogueCondition {
  return { type: 'task-active', task };
}

/**
 * Create a state check condition
 */
export function stateCheck(key: string, value: unknown): DialogueCondition {
  return { type: 'state-check', key, value };
}

/**
 * Create an interactable state check condition
 */
export function interactableStateCheck(interactableId: string, key: string, value: unknown): DialogueCondition {
  return { type: 'interactable-state', interactableId, key, value };
}

/**
 * Create a module state check condition
 */
export function moduleStateCheck(key: string, value: unknown): DialogueCondition {
  return { type: 'module-state', key, value };
}

/**
 * Create an AND condition
 */
export function andConditions(...conditions: DialogueCondition[]): DialogueCondition {
  return { type: 'and', conditions };
}

/**
 * Create an OR condition
 */
export function orConditions(...conditions: DialogueCondition[]): DialogueCondition {
  return { type: 'or', conditions };
}

/**
 * Create a custom condition
 */
export function customCondition(check: (context: ModuleContext) => boolean): DialogueCondition {
  return { type: 'custom', check };
}

// ============================================================================
// Action Helpers
// ============================================================================

/**
 * Create an accept task action
 */
export function acceptTask(task: Task): ChoiceAction {
  return { type: 'accept-task', task };
}

/**
 * Create a set state action
 */
export function setState(key: string, value: unknown): ChoiceAction {
  return { type: 'set-state', key, value };
}

/**
 * Create a set interactable state action
 */
export function setInteractableState(interactableId: string, key: string, value: unknown): ChoiceAction {
  return { type: 'set-interactable-state', interactableId, key, value };
}

/**
 * Create a set module state action
 */
export function setModuleState(key: string, value: unknown): ChoiceAction {
  return { type: 'set-module-state', key, value };
}

/**
 * Create a call function action
 */
export function callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceAction {
  return { type: 'call-function', handler };
}

/**
 * Create a go-to node action
 */
export function goToNode(node: DialogueNode | null): ChoiceAction {
  return { type: 'go-to', node };
}

/**
 * Create a close dialogue action
 */
export function closeDialogue(): ChoiceAction {
  return { type: 'close-dialogue' };
}

