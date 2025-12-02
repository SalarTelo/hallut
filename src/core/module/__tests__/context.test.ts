/**
 * Module Context Tests
 * Unit tests for module context creation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createModuleContext } from '../context.js';
import { actions } from '../../state/actions.js';
import { useAppStore } from '../../state/store.js';
import type { Task } from '@core/types/task.js';

// Mock the actions
vi.mock('../../state/actions.js', () => ({
  actions: {
    setModuleStateField: vi.fn(),
    getModuleStateField: vi.fn(),
    acceptTask: vi.fn(),
    completeTask: vi.fn(),
    isTaskCompleted: vi.fn(),
    getCurrentTaskId: vi.fn(),
  },
}));

// Mock the store
vi.mock('../../state/store.js', () => ({
  useAppStore: {
    getState: vi.fn(),
  },
}));

describe('Module Context', () => {
  const moduleId = 'test-module';
  const locale = 'en';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createModuleContext', () => {
    it('should create context with correct moduleId and locale', () => {
      const context = createModuleContext(moduleId, locale);

      expect(context.moduleId).toBe(moduleId);
      expect(context.locale).toBe(locale);
    });

    it('should create context with all required methods', () => {
      const context = createModuleContext(moduleId, locale);

      expect(typeof context.setModuleStateField).toBe('function');
      expect(typeof context.getModuleStateField).toBe('function');
      expect(typeof context.acceptTask).toBe('function');
      expect(typeof context.completeTask).toBe('function');
      expect(typeof context.isTaskCompleted).toBe('function');
      expect(typeof context.getCurrentTask).toBe('function');
      expect(typeof context.getCurrentTaskId).toBe('function');
    });

    it('should delegate setModuleStateField to actions', () => {
      const context = createModuleContext(moduleId, locale);
      
      context.setModuleStateField('key', 'value');

      expect(actions.setModuleStateField).toHaveBeenCalledWith(moduleId, 'key', 'value');
    });

    it('should delegate getModuleStateField to actions', () => {
      vi.mocked(actions.getModuleStateField).mockReturnValue('test-value');
      
      const context = createModuleContext(moduleId, locale);
      const result = context.getModuleStateField('key');

      expect(actions.getModuleStateField).toHaveBeenCalledWith(moduleId, 'key');
      expect(result).toBe('test-value');
    });

    it('should delegate acceptTask to actions with Task object', () => {
      const task: Task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: { type: 'text' },
        validate: () => ({ solved: true, reason: 'test', details: 'test' }),
      };

      const context = createModuleContext(moduleId, locale);
      context.acceptTask(task);

      expect(actions.acceptTask).toHaveBeenCalledWith(moduleId, task);
    });

    it('should delegate acceptTask to actions with task ID string', () => {
      const context = createModuleContext(moduleId, locale);
      context.acceptTask('test-task');

      expect(actions.acceptTask).toHaveBeenCalledWith(moduleId, 'test-task');
    });

    it('should delegate completeTask to actions with Task object', () => {
      const task: Task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: { type: 'text' },
        validate: () => ({ solved: true, reason: 'test', details: 'test' }),
      };

      const context = createModuleContext(moduleId, locale);
      context.completeTask(task);

      expect(actions.completeTask).toHaveBeenCalledWith(moduleId, task);
    });

    it('should delegate completeTask to actions with task ID string', () => {
      const context = createModuleContext(moduleId, locale);
      context.completeTask('test-task');

      expect(actions.completeTask).toHaveBeenCalledWith(moduleId, 'test-task');
    });

    it('should delegate isTaskCompleted to actions', () => {
      vi.mocked(actions.isTaskCompleted).mockReturnValue(true);

      const context = createModuleContext(moduleId, locale);
      const result = context.isTaskCompleted('test-task');

      expect(actions.isTaskCompleted).toHaveBeenCalledWith(moduleId, 'test-task');
      expect(result).toBe(true);
    });

    it('should delegate getCurrentTaskId to actions', () => {
      vi.mocked(actions.getCurrentTaskId).mockReturnValue('current-task');

      const context = createModuleContext(moduleId, locale);
      const result = context.getCurrentTaskId();

      expect(actions.getCurrentTaskId).toHaveBeenCalledWith(moduleId);
      expect(result).toBe('current-task');
    });

    it('should return null from getCurrentTask when task ID is null', () => {
      vi.mocked(actions.getCurrentTaskId).mockReturnValue(null);
      vi.mocked(useAppStore.getState).mockReturnValue({
        currentModule: null,
      } as any);

      const context = createModuleContext(moduleId, locale);
      const result = context.getCurrentTask();

      expect(result).toBeNull();
    });

    it('should return null from getCurrentTask when module is not current', () => {
      const task: Task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: { type: 'text' },
        validate: () => ({ solved: true, reason: 'test', details: 'test' }),
      };

      vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');
      vi.mocked(useAppStore.getState).mockReturnValue({
        currentModule: {
          id: 'other-module',
          tasks: [task],
        },
      } as any);

      const context = createModuleContext(moduleId, locale);
      const result = context.getCurrentTask();

      expect(result).toBeNull();
    });

    it('should return task from getCurrentTask when module is current', () => {
      const task: Task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: { type: 'text' },
        validate: () => ({ solved: true, reason: 'test', details: 'test' }),
      };

      vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');
      vi.mocked(useAppStore.getState).mockReturnValue({
        currentModule: {
          id: moduleId,
          tasks: [task],
        },
      } as any);

      const context = createModuleContext(moduleId, locale);
      const result = context.getCurrentTask();

      expect(result).toBe(task);
    });

    it('should return null from getCurrentTask when task not found', () => {
      vi.mocked(actions.getCurrentTaskId).mockReturnValue('non-existent-task');
      vi.mocked(useAppStore.getState).mockReturnValue({
        currentModule: {
          id: moduleId,
          tasks: [],
        },
      } as any);

      const context = createModuleContext(moduleId, locale);
      const result = context.getCurrentTask();

      expect(result).toBeNull();
    });
  });
});

