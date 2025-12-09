/**
 * Dialogue Tree Builder
 * Builder pattern for constructing dialogue trees with nodes and edges
 */

import type {
  DialogueNode,
  DialogueTree,
  DialogueEdge,
  DialogueCondition,
  DialogueEntryConfig,
  DialogueNodeDefinition,
} from '@core/dialogue/types.js';
import type { ModuleContext } from '@core/module/types/index.js';
import { createDialogueNode, getNodeDefinition } from './nodes.js';

/**
 * Dialogue tree builder
 */
class DialogueTreeBuilder {
  private nodeList: DialogueNode[] = [];
  private edges: DialogueEdge[] = [];
  private entryConfig?: DialogueEntryConfig;
  private definitions: Map<string, DialogueNodeDefinition> = new Map();
  private pendingStringRefs: Array<{ edge: DialogueEdge; nodeId: string }> = [];

  /**
   * Add a single node to the tree
   * Extracts edges automatically from node definition
   */
  node(nodeOrDefinition: DialogueNode | DialogueNodeDefinition): DialogueTreeBuilder {
    // Handle both DialogueNode (from createDialogueNode()) and raw definitions
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
      definition = getNodeDefinition(node) || {
        lines: node.lines,
        choices: node.choices ? Object.fromEntries(
          Object.entries(node.choices).map(([key, choice]) => [key, { text: choice.text }])
        ) : undefined,
        task: node.task,
      };
    } else {
      // It's a DialogueNodeDefinition
      definition = nodeOrDefinition;
      node = createDialogueNode(definition);
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
          } else if (typeof choiceDef.next === 'string') {
            // String ID reference - will be resolved at build time
            // Try to find the node in the current node list
            const foundNode = this.nodeList.find(n => n.id === choiceDef.next as string);
            if (foundNode) {
              targetNode = foundNode;
            } else {
              // Node not yet added - will be resolved when all nodes are added
              // Store the string ID for later resolution
              targetNode = null; // Will be resolved when build() is called
            }
          } else {
            // Static node reference
            targetNode = choiceDef.next;
            // Ensure target node is in tree (recursively add it)
            if (targetNode && !this.nodeList.find(n => n.id === targetNode!.id)) {
              // It's already a DialogueNode (from createDialogueNode() call)
              // Add it to the tree so its definition is stored
              this.node(targetNode);
            }
          }

          // Create edge
          const edge: DialogueEdge = {
            from: node,
            next: targetNode, // Will be resolved at runtime if dynamic or string ID
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
          
          // If next was a string ID and not yet resolved, store it for later resolution
          if (typeof choiceDef.next === 'string' && targetNode === null) {
            this.pendingStringRefs.push({ edge, nodeId: choiceDef.next });
          }
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
    // Resolve pending string ID references
    for (const { edge, nodeId } of this.pendingStringRefs) {
      const foundNode = this.nodeList.find(n => n.id === nodeId);
      if (foundNode) {
        edge.next = foundNode;
      } else {
        throw new Error(`Dialogue tree build error: Node with id "${nodeId}" not found. Referenced from node "${edge.from.id}" choice "${edge.choiceKey}".`);
      }
    }
    this.pendingStringRefs = []; // Clear after resolution

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
export function createDialogueTree(): DialogueTreeBuilder {
  return new DialogueTreeBuilder();
}

