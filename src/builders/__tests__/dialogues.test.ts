/**
 * Dialogue Builders Tests
 * Tests for dialogue tree builder functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  dialogueNode,
  dialogueTree,
  taskComplete,
  taskActive,
  stateCheck,
  interactableStateCheck,
  moduleStateCheck,
  andConditions,
  orConditions,
  customCondition,
  acceptTask,
  setState,
  setInteractableState,
  setModuleState,
  callFunction,
  goToNode,
  closeDialogue,
} from '../dialogue/index.js';
import { createTask, textSubmission, textLengthValidator, success } from '../task/index.js';
import type { DialogueNode } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';

describe('dialogueNode', () => {
  it('should create a dialogue node with lines', () => {
    const node = dialogueNode({
      lines: ['Hello!', 'How are you?'],
    });

    expect(node.id).toBeDefined();
    expect(node.lines).toEqual(['Hello!', 'How are you?']);
    expect(node.choices).toBeUndefined();
  });

  it('should create a dialogue node with custom ID', () => {
    const node = dialogueNode({
      id: 'custom-id',
      lines: ['Test'],
    });

    expect(node.id).toBe('custom-id');
  });

  it('should create a dialogue node with choices', () => {
    const node = dialogueNode({
      lines: ['Choose an option'],
      choices: {
        option1: { text: 'Option 1' },
        option2: { text: 'Option 2' },
      },
    });

    expect(node.choices).toBeDefined();
    expect(node.choices?.option1.text).toBe('Option 1');
    expect(node.choices?.option2.text).toBe('Option 2');
  });

  it('should auto-generate ID if not provided', () => {
    const node1 = dialogueNode({ lines: ['Test'] });
    const node2 = dialogueNode({ lines: ['Test'] });

    expect(node1.id).toBeDefined();
    expect(node2.id).toBeDefined();
    expect(node1.id).not.toBe(node2.id);
  });
});

describe('dialogueTree', () => {
  let greeting: DialogueNode;
  let taskOffer: DialogueNode;
  let taskReady: DialogueNode;
  let testTask: Task;

  beforeEach(() => {
    greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        ask_task: { text: 'Do you have a task?' },
      },
    });

    taskOffer = dialogueNode({
      id: 'task-offer',
      lines: ['I have a task for you!'],
      choices: {
        accept: { text: 'I accept' },
      },
    });

    taskReady = dialogueNode({
      id: 'task-ready',
      lines: ['Are you ready?'],
    });

    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'A test task',
      submission: textSubmission(),
      validate: textLengthValidator(5, () => success('done', 'done')),
    });
  });

  it('should build a simple dialogue tree', () => {
    const tree = dialogueTree()
      .node(greeting)
      .node(taskOffer)
      .build();

    expect(tree.nodes).toHaveLength(2);
    expect(tree.nodes).toContain(greeting);
    expect(tree.nodes).toContain(taskOffer);
    expect(tree.edges).toHaveLength(0);
    expect(tree.entry).toBe(greeting); // Defaults to first node
  });

  it('should connect nodes with choices', () => {
    const greetingWithNext = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        ask_task: {
          text: 'Do you have a task?',
          next: taskOffer,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithNext)
      .node(taskOffer)
      .build();

    expect(tree.edges).toHaveLength(1);
    expect(tree.edges[0].from.id).toBe('greeting');
    expect(tree.edges[0].next).toBe(taskOffer);
    expect(tree.edges[0].choiceKey).toBe('ask_task');
  });

  it('should add actions to edges', () => {
    const greetingWithActions = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        ask_task: {
          text: 'Do you have a task?',
          next: taskOffer,
          actions: [acceptTask(testTask)],
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithActions)
      .node(taskOffer)
      .build();

    expect(tree.edges[0].actions).toBeDefined();
    expect(tree.edges[0].actions).toHaveLength(1);
    expect(tree.edges[0].actions?.[0].type).toBe('accept-task');
  });

  it('should add conditions to edges', () => {
    const condition = taskComplete(testTask);
    const greetingWithCondition = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        ask_task: {
          text: 'Do you have a task?',
          next: taskOffer,
          condition,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithCondition)
      .node(taskOffer)
      .build();

    expect(tree.edges[0].condition).toBe(condition);
  });

  it('should configure entry with conditions', () => {
    const tree = dialogueTree()
      .node(greeting)
      .node(taskReady)
      .configureEntry()
        .when(taskActive(testTask)).use(taskReady)
        .default(greeting)
      .build();

    expect(tree.entry).toBeDefined();
    if (tree.entry && 'conditions' in tree.entry) {
      expect(tree.entry.conditions).toHaveLength(1);
      expect(tree.entry.default).toBe(greeting);
    }
  });

  it('should handle multiple entry conditions', () => {
    const firstMeeting = dialogueNode({
      id: 'first-meeting',
      lines: ['First time?'],
    });

    const tree = dialogueTree()
      .node(greeting)
      .node(taskReady)
      .node(firstMeeting)
      .configureEntry()
        .when(taskActive(testTask)).use(taskReady)
        .when(customCondition(() => true)).use(firstMeeting)
        .default(greeting)
      .build();

    expect(tree.entry).toBeDefined();
    if (tree.entry && 'conditions' in tree.entry) {
      expect(tree.entry.conditions).toHaveLength(2);
    }
  });

  it('should prevent duplicate nodes', () => {
    const tree = dialogueTree()
      .node(greeting)
      .node(greeting) // Same node twice
      .build();

    expect(tree.nodes).toHaveLength(1);
  });

  it('should handle complex branching', () => {
    const branch1 = dialogueNode({ id: 'branch1', lines: ['Branch 1'] });
    const branch2 = dialogueNode({ id: 'branch2', lines: ['Branch 2'] });
    const greetingWithBranches = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        option1: {
          text: 'Option 1',
          next: branch1,
        },
        option2: {
          text: 'Option 2',
          next: branch2,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithBranches)
      .node(branch1)
      .node(branch2)
      .build();

    expect(tree.edges).toHaveLength(2);
    expect(tree.nodes).toHaveLength(3);
  });

  it('should create edge with next: null to close dialogue', () => {
    const greetingWithClose = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        close: {
          text: 'Close',
          next: null,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithClose)
      .build();

    expect(tree.edges).toHaveLength(1);
    expect(tree.edges[0].next).toBeNull();
    expect(tree.edges[0].from.id).toBe('greeting');
    expect(tree.edges[0].choiceKey).toBe('close');
  });

  it('should not create edge when next is undefined', () => {
    const greetingNoEdge = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        no_edge: {
          text: 'No edge',
          // No next property - no edge created
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingNoEdge)
      .build();

    expect(tree.edges).toHaveLength(0);
  });

  it('should handle next: null with actions', () => {
    const greetingWithClose = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        close: {
          text: 'Close',
          next: null,
          actions: [acceptTask(testTask)],
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithClose)
      .build();

    expect(tree.edges).toHaveLength(1);
    expect(tree.edges[0].next).toBeNull();
    expect(tree.edges[0].actions).toHaveLength(1);
    expect(tree.edges[0].actions?.[0].type).toBe('accept-task');
  });

  it('should handle next: null with condition', () => {
    const condition = taskComplete(testTask);
    const greetingWithClose = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        close: {
          text: 'Close',
          next: null,
          condition,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithClose)
      .build();

    expect(tree.edges).toHaveLength(1);
    expect(tree.edges[0].next).toBeNull();
    expect(tree.edges[0].condition).toBe(condition);
  });

  it('should handle mix of null and non-null edges', () => {
    const nextNode = dialogueNode({ id: 'next', lines: ['Next'] });
    const greetingWithChoices = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
      choices: {
        continue: {
          text: 'Continue',
          next: nextNode,
        },
        close: {
          text: 'Close',
          next: null,
        },
      },
    });

    const tree = dialogueTree()
      .node(greetingWithChoices)
      .node(nextNode)
      .build();

    expect(tree.edges).toHaveLength(2);
    const continueEdge = tree.edges.find(e => e.choiceKey === 'continue');
    const closeEdge = tree.edges.find(e => e.choiceKey === 'close');
    expect(continueEdge?.next).toBe(nextNode);
    expect(closeEdge?.next).toBeNull();
  });
});

describe('Condition Helpers', () => {
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });
  });

  it('should create task-complete condition', () => {
    const condition = taskComplete(testTask);
    expect(condition.type).toBe('task-complete');
    if (condition.type === 'task-complete') {
      expect(condition.task).toBe(testTask);
    }
  });

  it('should create task-active condition', () => {
    const condition = taskActive(testTask);
    expect(condition.type).toBe('task-active');
    if (condition.type === 'task-active') {
      expect(condition.task).toBe(testTask);
    }
  });

  it('should create state-check condition', () => {
    const condition = stateCheck('key', 'value');
    expect(condition.type).toBe('state-check');
    if (condition.type === 'state-check') {
      expect(condition.key).toBe('key');
      expect(condition.value).toBe('value');
    }
  });

  it('should create interactable-state-check condition', () => {
    const condition = interactableStateCheck('npc-id', 'hasMet', true);
    expect(condition.type).toBe('interactable-state');
    if (condition.type === 'interactable-state') {
      expect(condition.interactableId).toBe('npc-id');
      expect(condition.key).toBe('hasMet');
      expect(condition.value).toBe(true);
    }
  });

  it('should create module-state-check condition', () => {
    const condition = moduleStateCheck('flag', true);
    expect(condition.type).toBe('module-state');
    if (condition.type === 'module-state') {
      expect(condition.key).toBe('flag');
      expect(condition.value).toBe(true);
    }
  });

  it('should create and-conditions', () => {
    const cond1 = taskComplete(testTask);
    const cond2 = stateCheck('key', 'value');
    const condition = andConditions(cond1, cond2);

    expect(condition.type).toBe('and');
    if (condition.type === 'and') {
      expect(condition.conditions).toHaveLength(2);
      expect(condition.conditions).toContain(cond1);
      expect(condition.conditions).toContain(cond2);
    }
  });

  it('should create or-conditions', () => {
    const cond1 = taskComplete(testTask);
    const cond2 = stateCheck('key', 'value');
    const condition = orConditions(cond1, cond2);

    expect(condition.type).toBe('or');
    if (condition.type === 'or') {
      expect(condition.conditions).toHaveLength(2);
    }
  });

  it('should create custom condition', () => {
    const check = () => true;
    const condition = customCondition(check);

    expect(condition.type).toBe('custom');
    if (condition.type === 'custom') {
      expect(condition.check).toBe(check);
    }
  });
});

describe('Action Helpers', () => {
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });
  });

  it('should create accept-task action', () => {
    const action = acceptTask(testTask);
    expect(action.type).toBe('accept-task');
    if (action.type === 'accept-task') {
      expect(action.task).toBe(testTask);
    }
  });

  it('should create set-state action', () => {
    const action = setState('key', 'value');
    expect(action.type).toBe('set-state');
    if (action.type === 'set-state') {
      expect(action.key).toBe('key');
      expect(action.value).toBe('value');
    }
  });

  it('should create set-interactable-state action', () => {
    const action = setInteractableState('npc-id', 'hasMet', true);
    expect(action.type).toBe('set-interactable-state');
    if (action.type === 'set-interactable-state') {
      expect(action.interactableId).toBe('npc-id');
      expect(action.key).toBe('hasMet');
      expect(action.value).toBe(true);
    }
  });

  it('should create set-module-state action', () => {
    const action = setModuleState('flag', true);
    expect(action.type).toBe('set-module-state');
    if (action.type === 'set-module-state') {
      expect(action.key).toBe('flag');
      expect(action.value).toBe(true);
    }
  });

  it('should create call-function action', () => {
    const handler = async () => {};
    const action = callFunction(handler);
    expect(action.type).toBe('call-function');
    if (action.type === 'call-function') {
      expect(action.handler).toBe(handler);
    }
  });

  it('should create go-to-node action', () => {
    const node = dialogueNode({ lines: ['Test'] });
    const action = goToNode(node);
    expect(action.type).toBe('go-to');
    if (action.type === 'go-to') {
      expect(action.node).toBe(node);
    }
  });

  it('should create go-to-null action to close dialogue', () => {
    const action = goToNode(null);
    expect(action.type).toBe('go-to');
    if (action.type === 'go-to') {
      expect(action.node).toBeNull();
    }
  });

  it('should create close-dialogue action', () => {
    const action = closeDialogue();
    expect(action.type).toBe('close-dialogue');
  });
});
