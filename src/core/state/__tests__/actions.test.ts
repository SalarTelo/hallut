/**
 * State Actions Tests
 * Unit tests for state action creators
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { actions } from '../actions.js';
import { useAppStore } from '../store.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { Task } from '@core/task/types.js';

// Mock the store
vi.mock('../store.js', () => ({
  useAppStore: {
    getState: vi.fn(),
  },
}));

describe('State Actions', () => {
  const mockStore = {
    setCurrentModule: vi.fn(),
    setCurrentModuleId: vi.fn(),
    clearCurrentModule: vi.fn(),
    updateProgress: vi.fn(),
    getProgress: vi.fn(),
    acceptTask: vi.fn(),
    completeTask: vi.fn(),
    isTaskCompleted: vi.fn(),
    getCurrentTaskId: vi.fn(),
    hasSeenGreeting: vi.fn(),
    markGreetingSeen: vi.fn(),
    setModuleStateField: vi.fn(),
    getModuleStateField: vi.fn(),
    getModuleProgression: vi.fn(),
    setModuleProgression: vi.fn(),
    isModuleCompleted: vi.fn(),
    unlockModule: vi.fn(),
    completeModule: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppStore.getState).mockReturnValue(mockStore as any);
  });

  describe('Module Actions', () => {
    it('should set current module', () => {
      const moduleData: ModuleData = {
        id: 'test',
        config: {} as any,
        interactables: [],
        tasks: [],
      };

      actions.setCurrentModule(moduleData);

      expect(mockStore.setCurrentModule).toHaveBeenCalledWith(moduleData);
    });

    it('should set current module ID', () => {
      actions.setCurrentModuleId('test-module');

      expect(mockStore.setCurrentModuleId).toHaveBeenCalledWith('test-module');
    });

    it('should clear current module', () => {
      actions.clearCurrentModule();

      expect(mockStore.clearCurrentModule).toHaveBeenCalled();
    });
  });

  describe('Progress Actions', () => {
    it('should update progress', () => {
      actions.updateProgress('test-module', { state: { completedTasks: [], seenGreetings: {} } });

      expect(mockStore.updateProgress).toHaveBeenCalledWith('test-module', {
        state: { completedTasks: [] },
      });
    });

    it('should get progress', () => {
      const mockProgress = { state: { completedTasks: [], seenGreetings: {} } };
      mockStore.getProgress.mockReturnValue(mockProgress);

      const result = actions.getProgress('test-module');

      expect(mockStore.getProgress).toHaveBeenCalledWith('test-module');
      expect(result).toEqual(mockProgress);
    });
  });

  describe('Task Actions', () => {
    const mockTask: Task = {
      id: 'test-task',
      name: 'Test',
      description: 'Test',
      submission: { type: 'text' },
      validate: vi.fn(),
    };

    it('should accept task by object', () => {
      actions.acceptTask('test-module', mockTask);

      expect(mockStore.acceptTask).toHaveBeenCalledWith('test-module', mockTask);
    });

    it('should accept task by ID', () => {
      actions.acceptTask('test-module', 'test-task');

      expect(mockStore.acceptTask).toHaveBeenCalledWith('test-module', 'test-task');
    });

    it('should complete task', () => {
      actions.completeTask('test-module', mockTask);

      expect(mockStore.completeTask).toHaveBeenCalledWith('test-module', mockTask);
    });

    it('should check if task is completed', () => {
      mockStore.isTaskCompleted.mockReturnValue(true);

      const result = actions.isTaskCompleted('test-module', mockTask);

      expect(mockStore.isTaskCompleted).toHaveBeenCalledWith('test-module', mockTask);
      expect(result).toBe(true);
    });

    it('should get current task ID', () => {
      mockStore.getCurrentTaskId.mockReturnValue('test-task');

      const result = actions.getCurrentTaskId('test-module');

      expect(mockStore.getCurrentTaskId).toHaveBeenCalledWith('test-module');
      expect(result).toBe('test-task');
    });
  });

  describe('Greeting Actions', () => {
    it('should check if greeting seen', () => {
      mockStore.hasSeenGreeting.mockReturnValue(true);

      const result = actions.hasSeenGreeting('test-module', 'greeting-1');

      expect(mockStore.hasSeenGreeting).toHaveBeenCalledWith('test-module', 'greeting-1');
      expect(result).toBe(true);
    });

    it('should mark greeting as seen', () => {
      actions.markGreetingSeen('test-module', 'greeting-1');

      expect(mockStore.markGreetingSeen).toHaveBeenCalledWith('test-module', 'greeting-1');
    });
  });

  describe('State Field Actions', () => {
    it('should set module state field', () => {
      actions.setModuleStateField('test-module', 'key', 'value');

      expect(mockStore.setModuleStateField).toHaveBeenCalledWith('test-module', 'key', 'value');
    });

    it('should get module state field', () => {
      mockStore.getModuleStateField.mockReturnValue('value');

      const result = actions.getModuleStateField('test-module', 'key');

      expect(mockStore.getModuleStateField).toHaveBeenCalledWith('test-module', 'key');
      expect(result).toBe('value');
    });
  });

  describe('Progression Actions', () => {
    it('should get module progression', () => {
      mockStore.getModuleProgression.mockReturnValue('unlocked');

      const result = actions.getModuleProgression('test-module');

      expect(mockStore.getModuleProgression).toHaveBeenCalledWith('test-module');
      expect(result).toBe('unlocked');
    });

    it('should set module progression', () => {
      actions.setModuleProgression('test-module', 'completed');

      expect(mockStore.setModuleProgression).toHaveBeenCalledWith('test-module', 'completed');
    });

    it('should check if module is completed', () => {
      mockStore.isModuleCompleted.mockReturnValue(true);

      const result = actions.isModuleCompleted('test-module');

      expect(mockStore.isModuleCompleted).toHaveBeenCalledWith('test-module');
      expect(result).toBe(true);
    });

    it('should unlock module', () => {
      actions.unlockModule('test-module');

      expect(mockStore.unlockModule).toHaveBeenCalledWith('test-module');
    });

    it('should complete module', () => {
      actions.completeModule('test-module');

      expect(mockStore.completeModule).toHaveBeenCalledWith('test-module');
    });
  });
});

