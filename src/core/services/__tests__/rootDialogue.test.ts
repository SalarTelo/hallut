/**
 * Root Dialogue Service Tests
 * Tests for auto-generated root dialogue functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateRootDialogue,
  getTaskStatus,
  formatTaskChoice,
} from '../rootDialogue.js';
import { createTask, textSubmission, textLengthValidator, success } from '@utils/builders/tasks.js';
import { dialogueNode, dialogueTree, taskActive } from '@utils/builders/dialogues.js';
import { createModuleContext } from '@core/module/context.js';
import type { NPC } from '@core/types/interactable.js';
import type { ModuleData } from '@core/types/module.js';
import type { Task } from '@core/types/task.js';

describe('generateRootDialogue', () => {
  let npc: NPC;
  let moduleData: ModuleData;
  let context: ReturnType<typeof createModuleContext>;
  let testTask: Task;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'A test task',
      submission: textSubmission(),
      validate: textLengthValidator(5, () => success('done', 'done')),
    });

    npc = {
      id: 'test-npc',
      type: 'npc',
      name: 'Test NPC',
      position: { x: 50, y: 50 },
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

  it('should return null if NPC has no tasks', () => {
    npc.tasks = [];
    const root = generateRootDialogue(npc, moduleData, context);
    expect(root).toBeNull();
  });

  it('should return null if NPC has no active or available tasks', () => {
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue(null);
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true); // Task is completed, so not available
    const root = generateRootDialogue(npc, moduleData, context);
    expect(root).toBeNull();
  });


  it('should generate root dialogue with active tasks', () => {
    // Add dialogue tree so "Talk to..." option appears
    const greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
    });
    npc.dialogueTree = dialogueTree()
      .node(greeting)
      .build();

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root).not.toBeNull();
    expect(root?.id).toBe('test-npc_root');
    expect(root?.lines[0]).toContain('What would you like to do?');
    expect(root?.choices).toBeDefined();
    expect(root?.choices?.talk).toBeDefined();
    expect(root?.choices?.goodbye).toBeDefined();
  });

  it('should not include "Talk to..." if NPC has no dialogue tree', () => {
    npc.dialogueTree = undefined;
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root).not.toBeNull();
    expect(root?.choices?.talk).toBeUndefined();
    expect(root?.choices?.goodbye).toBeDefined();
    // Should still have task choice
    const taskChoiceKey = Object.keys(root?.choices || {}).find(key => key.startsWith('task_'));
    expect(taskChoiceKey).toBeDefined();
  });

  it('should not include "Talk to..." if NPC has empty dialogue tree', () => {
    npc.dialogueTree = {
      nodes: [],
      edges: [],
    };
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root).not.toBeNull();
    expect(root?.choices?.talk).toBeUndefined();
    expect(root?.choices?.goodbye).toBeDefined();
  });

  it('should include "Talk to..." if NPC has dialogue tree with nodes', () => {
    const greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
    });
    npc.dialogueTree = dialogueTree()
      .node(greeting)
      .build();

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root?.choices?.talk).toBeDefined();
    expect(root?.choices?.talk?.text).toBe('Talk to Test NPC...');
  });

  it('should include active task in root dialogue', () => {
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root?.choices).toBeDefined();
    const taskChoiceKey = Object.keys(root?.choices || {}).find(key => key.startsWith('task_'));
    expect(taskChoiceKey).toBeDefined();
  });

  it('should format task choice correctly', () => {
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    const taskChoiceKey = Object.keys(root?.choices || {}).find(key => key.startsWith('task_'));
    if (taskChoiceKey && root?.choices) {
      expect(root.choices[taskChoiceKey].text).toContain('Test Task');
      expect(root.choices[taskChoiceKey].text).toContain('In Progress');
    }
  });

  it('should include multiple active tasks', () => {
    const task2 = createTask({
      id: 'task-2',
      name: 'Task 2',
      description: 'Second task',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    npc.tasks = [testTask, task2];
    moduleData.tasks = [testTask, task2];

    // Mock to return first task as active (in real scenario, only one can be active)
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    const taskChoices = Object.keys(root?.choices || {}).filter(key => key.startsWith('task_'));
    expect(taskChoices.length).toBeGreaterThanOrEqual(1);
  });

  it('should truncate long task names', () => {
    const longTask = createTask({
      id: 'long-task',
      name: 'This is a very long task name that should be truncated',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    npc.tasks = [longTask];
    moduleData.tasks = [longTask];

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('long-task');
    const root = generateRootDialogue(npc, moduleData, context);

    const taskChoiceKey = Object.keys(root?.choices || {}).find(key => key.startsWith('task_'));
    if (taskChoiceKey && root?.choices) {
      const text = root.choices[taskChoiceKey].text;
      expect(text.length).toBeLessThanOrEqual(43); // 40 chars + " - In Progress"
    }
  });

  it('should only show task choices and goodbye if NPC has no dialogue content', () => {
    npc.dialogueTree = undefined;
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root).not.toBeNull();
    expect(root?.choices?.talk).toBeUndefined();
    expect(root?.choices?.goodbye).toBeDefined();
    // Should have task choice
    const taskChoiceKey = Object.keys(root?.choices || {}).find(key => key.startsWith('task_'));
    expect(taskChoiceKey).toBeDefined();
    // Should only have task and goodbye (no talk option)
    expect(Object.keys(root?.choices || {})).toHaveLength(2);
  });

  it('should show "Talk to..." when NPC has dialogue tree with entry config', () => {
    const greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
    });
    const taskReady = dialogueNode({
      id: 'task-ready',
      lines: ['Ready?'],
    });
    npc.dialogueTree = dialogueTree()
      .node(greeting)
      .node(taskReady)
      .configureEntry()
        .when(taskActive(testTask)).use(taskReady)
        .default(greeting)
      .build();

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root?.choices?.talk).toBeDefined();
  });

  it('should not show "Talk to..." if dialogue tree has nodes but no lines', () => {
    // Edge case: nodes exist but have no dialogue content
    const emptyNode = dialogueNode({
      id: 'empty',
      lines: [], // No lines
    });
    npc.dialogueTree = dialogueTree()
      .node(emptyNode)
      .build();

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const root = generateRootDialogue(npc, moduleData, context);

    expect(root?.choices?.talk).toBeUndefined();
  });
});

describe('getTaskStatus', () => {
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

  it('should return completed for completed task', () => {
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    const status = getTaskStatus(testTask, context);
    expect(status).toBe('completed');
  });

  it('should return active for current task', () => {
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('test-task');
    const status = getTaskStatus(testTask, context);
    expect(status).toBe('active');
  });

  it('should return available for available task', () => {
    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue(null);
    const status = getTaskStatus(testTask, context);
    expect(status).toBe('available');
  });
});

describe('formatTaskChoice', () => {
  it('should format task choice with status', () => {
    const task = createTask({
      id: 'task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const formatted = formatTaskChoice(task, 'In Progress');
    expect(formatted).toBe('Test Task - In Progress');
  });

  it('should truncate long task names', () => {
    const longTask = createTask({
      id: 'task',
      name: 'This is a very long task name that exceeds the limit',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const formatted = formatTaskChoice(longTask, 'In Progress');
    expect(formatted.length).toBeLessThanOrEqual(43);
    expect(formatted).toContain('...');
  });
});

