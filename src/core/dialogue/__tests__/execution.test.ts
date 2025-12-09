/**
 * Dialogue Execution Service Tests
 * Tests for dialogue tree execution, navigation, and condition evaluation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getInitialDialogueNode,
  getNextDialogueNode,
  evaluateCondition,
  executeActions,
  getAvailableChoices,
} from '../execution.js';
import { dialogueNode, dialogueTree, taskActive, taskComplete, acceptTask, setState, setInteractableState } from '@builders/dialogue/index.js';
import { createTask, textSubmission, textLengthValidator, success } from '@builders/task/index.js';
import { createModuleContext } from '@core/module/context.js';
import type { NPC } from '@core/module/types/index.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { DialogueNode, DialogueTree, DialogueCondition } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';

describe('getInitialDialogueNode', () => {
  let npc: NPC;
  let moduleData: ModuleData;
  let context: ReturnType<typeof createModuleContext>;
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: textLengthValidator(5, () => success('done', 'done')),
    });

    const greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
    });

    const tree = dialogueTree()
      .node(greeting)
      .build();

    npc = {
      id: 'test-npc',
      type: 'npc',
      name: 'Test NPC',
      position: { x: 50, y: 50 },
      dialogueTree: tree,
      tasks: [testTask],
    };

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [npc],
      tasks: [testTask],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should return first node if no entry config', () => {
    // Remove tasks so root dialogue isn't generated
    npc.tasks = [];
    const node = getInitialDialogueNode(npc, moduleData, context);
    expect(node).toBeDefined();
    expect(node?.id).toBe('greeting');
  });

  it('should use entry node if specified', () => {
    const entryNode = dialogueNode({ id: 'entry', lines: ['Entry'] });
    const tree = dialogueTree()
      .node(entryNode)
      .node(dialogueNode({ id: 'other', lines: ['Other'] }))
      .build();
    tree.entry = entryNode;

    // Remove tasks so root dialogue isn't generated
    npc.tasks = [];
    npc.dialogueTree = tree;
    const node = getInitialDialogueNode(npc, moduleData, context);
    expect(node?.id).toBe('entry');
  });

  it('should evaluate entry conditions', () => {
    const taskReady = dialogueNode({ id: 'task-ready', lines: ['Ready?'] });
    const greeting = dialogueNode({ id: 'greeting', lines: ['Hello'] });

    const tree = dialogueTree()
      .node(greeting)
      .node(taskReady)
      .configureEntry()
        .when(taskActive(testTask)).use(taskReady)
        .default(greeting)
      .build();

    npc.dialogueTree = tree;

    // When task is active, root dialogue should be shown first (not entry conditions)
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const node1 = getInitialDialogueNode(npc, moduleData, context);
    expect(node1?.id).toBe('test-npc_root'); // Root dialogue is shown when task is active

    // When task is not active and not available (completed), should check entry conditions
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue(null);
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true); // Task is completed, so not available
    const node2 = getInitialDialogueNode(npc, moduleData, context);
    expect(node2?.id).toBe('greeting');
  });

  it('should return null if no dialogue tree', () => {
    npc.dialogueTree = undefined;
    const node = getInitialDialogueNode(npc, moduleData, context);
    expect(node).toBeNull();
  });

  it('should handle entry node with next: null edges', () => {
    const entryNode = dialogueNode({
      id: 'entry',
      lines: ['Entry'],
      choices: {
        close: {
          text: 'Close',
          next: null,
        },
      },
    });

    const tree = dialogueTree()
      .node(entryNode)
      .build();
    tree.entry = entryNode;

    // Remove tasks so root dialogue isn't generated
    npc.tasks = [];
    npc.dialogueTree = tree;
    const node = getInitialDialogueNode(npc, moduleData, context);
    expect(node?.id).toBe('entry');
  });
});

describe('getNextDialogueNode', () => {
  let currentNode: DialogueNode;
  let tree: DialogueTree;
  let context: ReturnType<typeof createModuleContext>;
  let moduleData: ModuleData;

  beforeEach(() => {
    const nextNode = dialogueNode({
      id: 'next',
      lines: ['Next'],
    });

    currentNode = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        next: {
          text: 'Next',
          next: nextNode,
        },
      },
    });

    tree = dialogueTree()
      .node(currentNode)
      .node(nextNode)
      .build();

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [],
      tasks: [],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should return next node for valid choice', () => {
    const next = getNextDialogueNode(currentNode, 'next', tree, context, moduleData);
    expect(next?.id).toBe('next');
  });

  it('should return null for invalid choice', () => {
    const next = getNextDialogueNode(currentNode, 'invalid', tree, context, moduleData);
    expect(next).toBeNull();
  });

  it('should return null when edge has next: null (close dialogue)', () => {
    const currentNode = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        close: {
          text: 'Close',
          next: null,
        },
      },
    });

    const tree = dialogueTree()
      .node(currentNode)
      .build();

    const next = getNextDialogueNode(currentNode, 'close', tree, context, moduleData);
    expect(next).toBeNull();
  });

  it('should return null when edge has to: null even with condition met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const currentNode = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        close: { text: 'Close' },
      },
    });

    const condition = taskComplete(testTask);
    const currentNodeWithCondition = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        close: {
          text: 'Close',
          next: null,
          condition,
        },
      },
    });

    const tree = dialogueTree()
      .node(currentNodeWithCondition)
      .build();

    // Condition met, but next is null, so should return null
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    const next = getNextDialogueNode(currentNodeWithCondition, 'close', tree, context, moduleData);
    expect(next).toBeNull();
  });

  it('should return null when edge has next: null and condition not met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const condition = taskComplete(testTask);
    const currentNode = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        close: {
          text: 'Close',
          next: null,
          condition,
        },
      },
    });

    const tree = dialogueTree()
      .node(currentNode)
      .build();

    // Condition not met, edge should not be found
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    const next = getNextDialogueNode(currentNode, 'close', tree, context, moduleData);
    expect(next).toBeNull();
  });

  it('should return null if condition not met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const nextNode = dialogueNode({ id: 'next', lines: ['Next'] });
    const condition = taskComplete(testTask);

    const currentNodeWithCondition = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        next: {
          text: 'Next',
          next: nextNode,
          condition,
        },
      },
    });

    tree = dialogueTree()
      .node(currentNodeWithCondition)
      .node(nextNode)
      .build();

    // Task not completed, condition fails
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    const next = getNextDialogueNode(currentNodeWithCondition, 'next', tree, context, moduleData);
    expect(next).toBeNull();
  });

  it('should return next node if condition met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const nextNode = dialogueNode({ id: 'next', lines: ['Next'] });
    const condition = taskComplete(testTask);

    const currentNodeWithCondition = dialogueNode({
      id: 'current',
      lines: ['Current'],
      choices: {
        next: {
          text: 'Next',
          next: nextNode,
          condition,
        },
      },
    });

    tree = dialogueTree()
      .node(currentNodeWithCondition)
      .node(nextNode)
      .build();

    // Task completed, condition passes
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    const next = getNextDialogueNode(currentNodeWithCondition, 'next', tree, context, moduleData);
    expect(next?.id).toBe('next');
  });
});

describe('evaluateCondition', () => {
  let context: ReturnType<typeof createModuleContext>;
  let moduleData: ModuleData;
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [],
      tasks: [testTask],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should evaluate task-complete condition', () => {
    const condition: DialogueCondition = { type: 'task-complete', task: testTask };
    
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate task-active condition', () => {
    const condition: DialogueCondition = { type: 'task-active', task: testTask };
    
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue(null);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate state-check condition', () => {
    const condition: DialogueCondition = { type: 'state-check', key: 'flag', value: true };
    
    vi.spyOn(context, 'getModuleStateField').mockReturnValue(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getModuleStateField').mockReturnValue(false);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate interactable-state condition', () => {
    const condition: DialogueCondition = {
      type: 'interactable-state',
      interactableId: 'npc-id',
      key: 'hasMet',
      value: true,
    };
    
    vi.spyOn(context, 'getInteractableState').mockReturnValue(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getInteractableState').mockReturnValue(false);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate module-state condition', () => {
    const condition: DialogueCondition = { type: 'module-state', key: 'flag', value: true };
    
    vi.spyOn(context, 'getModuleStateField').mockReturnValue(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);
  });

  it('should evaluate and-conditions', () => {
    const cond1: DialogueCondition = { type: 'state-check', key: 'a', value: true };
    const cond2: DialogueCondition = { type: 'state-check', key: 'b', value: true };
    const condition: DialogueCondition = { type: 'and', conditions: [cond1, cond2] };

    vi.spyOn(context, 'getModuleStateField')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getModuleStateField')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate or-conditions', () => {
    const cond1: DialogueCondition = { type: 'state-check', key: 'a', value: true };
    const cond2: DialogueCondition = { type: 'state-check', key: 'b', value: true };
    const condition: DialogueCondition = { type: 'or', conditions: [cond1, cond2] };

    vi.spyOn(context, 'getModuleStateField')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getModuleStateField')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });

  it('should evaluate custom condition', () => {
    const condition: DialogueCondition = {
      type: 'custom',
      check: (ctx) => ctx.getModuleStateField('custom') === 'value',
    };

    vi.spyOn(context, 'getModuleStateField').mockReturnValue('value');
    expect(evaluateCondition(condition, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getModuleStateField').mockReturnValue('other');
    expect(evaluateCondition(condition, context, moduleData)).toBe(false);
  });
});

describe('executeActions', () => {
  let context: ReturnType<typeof createModuleContext>;
  let moduleData: ModuleData;
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [],
      tasks: [testTask],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should execute accept-task action', async () => {
    const acceptSpy = vi.spyOn(context, 'acceptTask');
    const actions = [acceptTask(testTask)];

    await executeActions(actions, context);

    expect(acceptSpy).toHaveBeenCalledWith(testTask);
  });

  it('should execute set-state action', async () => {
    const setStateSpy = vi.spyOn(context, 'setModuleStateField');
    const actions = [setState('key', 'value')];

    await executeActions(actions, context);

    expect(setStateSpy).toHaveBeenCalledWith('key', 'value');
  });

  it('should execute set-interactable-state action', async () => {
    const setInteractableStateSpy = vi.spyOn(context, 'setInteractableState');
    const actions = [setInteractableState('npc-id', 'hasMet', true)];

    await executeActions(actions, context);

    expect(setInteractableStateSpy).toHaveBeenCalledWith('npc-id', 'hasMet', true);
  });

  it('should execute call-function action', async () => {
    const handler = vi.fn();
    const actions = [{ type: 'call-function' as const, handler }];

    await executeActions(actions, context);

    expect(handler).toHaveBeenCalledWith(context);
  });

  it('should execute multiple actions in order', async () => {
    const acceptSpy = vi.spyOn(context, 'acceptTask');
    const setStateSpy = vi.spyOn(context, 'setModuleStateField');
    const handler = vi.fn();

    const actions = [
      acceptTask(testTask),
      setState('key', 'value'),
      { type: 'call-function' as const, handler },
    ];

    await executeActions(actions, context);

    expect(acceptSpy).toHaveBeenCalled();
    expect(setStateSpy).toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
    // Check call order by verifying all were called
    expect(acceptSpy.mock.invocationCallOrder[0]).toBeLessThan(setStateSpy.mock.invocationCallOrder[0] || Infinity);
    expect(setStateSpy.mock.invocationCallOrder[0] || Infinity).toBeLessThan(handler.mock.invocationCallOrder[0] || Infinity);
  });

  it('should handle empty actions array', async () => {
    await expect(executeActions([], context)).resolves.not.toThrow();
  });
});

describe('getAvailableChoices', () => {
  let node: DialogueNode;
  let tree: DialogueTree;
  let context: ReturnType<typeof createModuleContext>;
  let moduleData: ModuleData;

  beforeEach(() => {
    node = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        choice1: { text: 'Choice 1' },
        choice2: { text: 'Choice 2' },
        choice3: { text: 'Choice 3' },
      },
    });

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [],
      tasks: [],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should return all choices when no conditions', () => {
    const target1 = dialogueNode({ id: 'target1', lines: ['Target 1'] });
    const target2 = dialogueNode({ id: 'target2', lines: ['Target 2'] });
    const target3 = dialogueNode({ id: 'target3', lines: ['Target 3'] });

    const nodeWithChoices = dialogueNode({
      id: 'node',
      lines: ['Node'],
      choices: {
        choice1: {
          text: 'Choice 1',
          next: target1,
        },
        choice2: {
          text: 'Choice 2',
          next: target2,
        },
        choice3: {
          text: 'Choice 3',
          next: target3,
        },
      },
    });

    tree = dialogueTree()
      .node(nodeWithChoices)
      .node(target1)
      .node(target2)
      .node(target3)
      .build();

    node = nodeWithChoices;

    const choices = getAvailableChoices(node, tree, context, moduleData);
    expect(choices).toHaveLength(3);
    expect(choices.map(c => c.key)).toEqual(['choice1', 'choice2', 'choice3']);
  });

  it('should filter choices based on conditions', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    // Create node with only the choices we're testing
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        choice1: { text: 'Choice 1' },
        choice2: { text: 'Choice 2' },
      },
    });

    const target1 = dialogueNode({ id: 'target1', lines: ['Target 1'] });
    const target2 = dialogueNode({ id: 'target2', lines: ['Target 2'] });
    const condition = taskComplete(testTask);

    const testNodeWithChoices = dialogueNode({
      id: 'test',
      lines: ['Test'],
      choices: {
        choice1: {
          text: 'Choice 1',
          next: target1, // No condition
        },
        choice2: {
          text: 'Choice 2',
          next: target2,
          condition, // Has condition
        },
      },
    });

    tree = dialogueTree()
      .node(testNodeWithChoices)
      .node(target1)
      .node(target2)
      .build();

    // Use testNodeWithChoices instead of reassigning const
    const testNodeForTest = testNodeWithChoices;

    // Condition fails, choice2 should be filtered out
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    const choices = getAvailableChoices(testNodeForTest, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].key).toBe('choice1');
  });

  it('should include actions in available choices', () => {
    const target = dialogueNode({ id: 'target', lines: ['Target'] });
    const actions = [acceptTask(createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    }))];

    const nodeWithActions = dialogueNode({
      id: 'node',
      lines: ['Node'],
      choices: {
        choice1: {
          text: 'Choice 1',
          next: target,
          actions,
        },
      },
    });

    tree = dialogueTree()
      .node(nodeWithActions)
      .node(target)
      .build();

    const choices = getAvailableChoices(nodeWithActions, tree, context, moduleData);
    expect(choices[0].actions).toEqual(actions);
  });

  it('should return empty array for node with no choices', () => {
    const nodeWithoutChoices = dialogueNode({
      id: 'no-choices',
      lines: ['No choices'],
    });

    tree = dialogueTree()
      .node(nodeWithoutChoices)
      .build();

    const choices = getAvailableChoices(nodeWithoutChoices, tree, context, moduleData);
    expect(choices).toHaveLength(0);
  });

  it('should include choice with next: null in available choices', () => {
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        close: {
          text: 'Close dialogue',
          next: null,
        },
      },
    });

    tree = dialogueTree()
      .node(testNode)
      .build();

    const choices = getAvailableChoices(testNode, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].key).toBe('close');
    expect(choices[0].text).toBe('Close dialogue');
  });

  it('should include choice with next: null and actions', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const actions = [acceptTask(testTask)];
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        accept_and_close: {
          text: 'Accept and close',
          next: null,
          actions,
        },
      },
    });

    tree = dialogueTree()
      .node(testNode)
      .build();

    const choices = getAvailableChoices(testNode, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].actions).toEqual(actions);
  });

  it('should filter out choice with next: null when condition not met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const condition = taskComplete(testTask);
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        always: {
          text: 'Always available',
          next: null, // No condition
        },
        conditional_close: {
          text: 'Conditional close',
          next: null,
          condition,
        },
      },
    });

    tree = dialogueTree()
      .node(testNode)
      .build();

    // Condition not met, conditional_close should be filtered out
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    const choices = getAvailableChoices(testNode, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].key).toBe('always');
  });

  it('should include choice with next: null when condition is met', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const condition = taskComplete(testTask);
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        conditional_close: {
          text: 'Conditional close',
          next: null,
          condition,
        },
      },
    });

    tree = dialogueTree()
      .node(testNode)
      .build();

    // Condition met, choice should be available
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    const choices = getAvailableChoices(testNode, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].key).toBe('conditional_close');
  });

  it('should handle choice with next: null and multiple actions', () => {
    const testTask = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const actions = [
      acceptTask(testTask),
      setState('flag', true),
    ];
    const testNode = dialogueNode({
      id: 'test-node',
      lines: ['Choose'],
      choices: {
        multi_action: {
          text: 'Multiple actions',
          next: null,
          actions,
        },
      },
    });

    tree = dialogueTree()
      .node(testNode)
      .build();

    const choices = getAvailableChoices(testNode, tree, context, moduleData);
    expect(choices).toHaveLength(1);
    expect(choices[0].actions).toEqual(actions);
  });
});

