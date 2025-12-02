/**
 * Task Availability Service Tests
 * Tests for task availability checking based on unlockRequirement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isTaskAvailable,
  getAvailableTasks,
  getActiveTasks,
} from '../taskAvailability.js';
import { createTask, textSubmission, textLengthValidator, success } from '@utils/builders/tasks.js';
import { taskComplete, stateCheck } from '@utils/builders/interactables.js';
import { andRequirements } from '@utils/builders/modules.js';
import { createModuleContext } from '@core/module/context.js';
import type { ModuleData } from '@core/types/module.js';
import type { Task } from '@core/types/task.js';

describe('isTaskAvailable', () => {
  let moduleData: ModuleData;
  let context: ReturnType<typeof createModuleContext>;
  let baseTask: Task;

  beforeEach(() => {
    baseTask = createTask({
      id: 'base-task',
      name: 'Base Task',
      description: 'Base',
      submission: textSubmission(),
      validate: textLengthValidator(5, () => success('done', 'done')),
    });

    moduleData = {
      id: 'test-module',
      config: {
        manifest: { id: 'test', name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [],
      tasks: [baseTask],
    };

    context = createModuleContext('test-module', 'sv', moduleData);
  });

  it('should return false for completed task', () => {
    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(true);
    expect(isTaskAvailable(task, context, moduleData)).toBe(false);
  });

  it('should return true for task with no unlockRequirement', () => {
    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
      unlockRequirement: null,
    });

    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    expect(isTaskAvailable(task, context, moduleData)).toBe(true);
  });

  it('should check task-complete requirement', () => {
    const requiredTask = createTask({
      id: 'required',
      name: 'Required',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
      unlockRequirement: taskComplete(requiredTask),
    });

    moduleData.tasks = [requiredTask, task];

    // Required task completed
    vi.spyOn(context, 'isTaskCompleted')
      .mockReturnValueOnce(false) // task not completed
      .mockReturnValueOnce(true); // required task completed
    expect(isTaskAvailable(task, context, moduleData)).toBe(true);

    // Required task not completed
    vi.spyOn(context, 'isTaskCompleted')
      .mockReturnValueOnce(false) // task not completed
      .mockReturnValueOnce(false); // required task not completed
    expect(isTaskAvailable(task, context, moduleData)).toBe(false);
  });

  it('should check state-check requirement', () => {
    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
      unlockRequirement: stateCheck('flag', true),
    });

    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    vi.spyOn(context, 'getModuleStateField').mockReturnValue(true);
    expect(isTaskAvailable(task, context, moduleData)).toBe(true);

    vi.spyOn(context, 'getModuleStateField').mockReturnValue(false);
    expect(isTaskAvailable(task, context, moduleData)).toBe(false);
  });

  it('should check and-requirements', () => {
    const requiredTask = createTask({
      id: 'required',
      name: 'Required',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
      unlockRequirement: andRequirements(
        taskComplete(requiredTask),
        stateCheck('flag', true)
      ),
    });

    moduleData.tasks = [requiredTask, task];

    // Both requirements met
    vi.spyOn(context, 'isTaskCompleted')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    vi.spyOn(context, 'getModuleStateField').mockReturnValue(true);
    expect(isTaskAvailable(task, context, moduleData)).toBe(true);

    // One requirement not met
    vi.spyOn(context, 'isTaskCompleted')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    vi.spyOn(context, 'getModuleStateField').mockReturnValue(false);
    expect(isTaskAvailable(task, context, moduleData)).toBe(false);
  });
});

describe('getAvailableTasks', () => {
  let moduleData: ModuleData;
  let context: ReturnType<typeof createModuleContext>;

  beforeEach(() => {
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

  it('should return all available tasks', () => {
    const task1 = createTask({
      id: 'task1',
      name: 'Task 1',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task2 = createTask({
      id: 'task2',
      name: 'Task 2',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    moduleData.tasks = [task1, task2];

    vi.spyOn(context, 'isTaskCompleted').mockReturnValue(false);
    const available = getAvailableTasks([task1, task2], context, moduleData);
    expect(available).toHaveLength(2);
  });

  it('should filter out completed tasks', () => {
    const task1 = createTask({
      id: 'task1',
      name: 'Task 1',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task2 = createTask({
      id: 'task2',
      name: 'Task 2',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    vi.spyOn(context, 'isTaskCompleted')
      .mockImplementation((task) => {
        const taskId = typeof task === 'string' ? task : task.id;
        return taskId === 'task1';
      });

    const available = getAvailableTasks([task1, task2], context, moduleData);
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe('task2');
  });

  it('should filter out tasks with unmet requirements', () => {
    const requiredTask = createTask({
      id: 'required',
      name: 'Required',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
      unlockRequirement: taskComplete(requiredTask),
    });

    moduleData.tasks = [requiredTask, task];

    vi.spyOn(context, 'isTaskCompleted')
      .mockReturnValueOnce(false) // task not completed
      .mockReturnValueOnce(false); // required task not completed
    const available = getAvailableTasks([task], context, moduleData);
    expect(available).toHaveLength(0);
  });
});

describe('getActiveTasks', () => {
  let context: ReturnType<typeof createModuleContext>;

  beforeEach(() => {
    const moduleData: ModuleData = {
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

  it('should return empty array when no active task', () => {
    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue(null);
    const active = getActiveTasks([task], context);
    expect(active).toHaveLength(0);
  });

  it('should return active task', () => {
    const task = createTask({
      id: 'task',
      name: 'Task',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('task');
    const active = getActiveTasks([task], context);
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('task');
  });

  it('should return only the active task from multiple tasks', () => {
    const task1 = createTask({
      id: 'task1',
      name: 'Task 1',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const task2 = createTask({
      id: 'task2',
      name: 'Task 2',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    vi.spyOn(context, 'getCurrentTaskId').mockReturnValue('task2');
    const active = getActiveTasks([task1, task2], context);
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe('task2');
  });
});

