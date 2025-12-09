/**
 * Store Tests
 * Unit tests for Zustand store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store.js';
import type { ModuleData } from '@core/module/types.js';
import type { Task } from '@core/task/types.js';

describe('App Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      currentModule: null,
      currentModuleId: null,
      progress: {},
      moduleProgression: {},
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAppStore.getState();

      expect(state.currentModule).toBeNull();
      expect(state.currentModuleId).toBeNull();
      expect(state.progress).toEqual({});
      expect(state.moduleProgression).toEqual({});
    });
  });

  describe('Module Management', () => {
    it('should set current module', () => {
      const mockModule: ModuleData = {
        id: 'test-module',
        config: {} as any,
        interactables: [],
        tasks: [],
        dialogues: {},
      };

      useAppStore.getState().setCurrentModule(mockModule);

      const state = useAppStore.getState();
      expect(state.currentModule).toBe(mockModule);
      expect(state.currentModuleId).toBe('test-module');
    });

    it('should clear current module', () => {
      const mockModule: ModuleData = {
        id: 'test-module',
        config: {} as any,
        interactables: [],
        tasks: [],
        dialogues: {},
      };

      useAppStore.getState().setCurrentModule(mockModule);
      useAppStore.getState().clearCurrentModule();

      const state = useAppStore.getState();
      expect(state.currentModule).toBeNull();
      expect(state.currentModuleId).toBeNull();
    });

    it('should set current module ID', () => {
      useAppStore.getState().setCurrentModuleId('test-id');

      const state = useAppStore.getState();
      expect(state.currentModuleId).toBe('test-id');
    });
  });

  describe('Progress Management', () => {
    it('should update progress', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().updateProgress(moduleId, {
        state: {
          completedTasks: ['task1'],
          seenGreetings: {},
        },
      });

      const progress = useAppStore.getState().getProgress(moduleId);
      expect(progress).toBeDefined();
      expect(progress?.state.completedTasks).toContain('task1');
    });

    it('should get progress for module', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().updateProgress(moduleId, {
        state: {
          completedTasks: [],
          seenGreetings: {},
        },
      });

      const progress = useAppStore.getState().getProgress(moduleId);
      expect(progress).toBeDefined();
      expect(progress?.state.completedTasks).toEqual([]);
    });

    it('should return null for non-existent progress', () => {
      const progress = useAppStore.getState().getProgress('non-existent');
      expect(progress).toBeNull();
    });
  });

  describe('Task Management', () => {
    const mockTask: Task = {
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: { type: 'text' },
      validate: () => ({ solved: true, reason: 'test', details: 'test' }),
    };

    it('should accept task', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().acceptTask(moduleId, mockTask);

      const progress = useAppStore.getState().getProgress(moduleId);
      expect(progress?.state.currentTaskId).toBe('test-task');
    });

    it('should accept task by ID string', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().acceptTask(moduleId, 'task-id');

      const progress = useAppStore.getState().getProgress(moduleId);
      expect(progress?.state.currentTaskId).toBe('task-id');
    });

    it('should complete task', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().acceptTask(moduleId, mockTask);
      useAppStore.getState().completeTask(moduleId, mockTask);

      const progress = useAppStore.getState().getProgress(moduleId);
      expect(progress?.state.completedTasks).toContain('test-task');
      expect(progress?.state.currentTaskId).toBeUndefined();
    });

    it('should check if task is completed', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().acceptTask(moduleId, mockTask);
      useAppStore.getState().completeTask(moduleId, mockTask);

      const isCompleted = useAppStore.getState().isTaskCompleted(moduleId, mockTask);
      expect(isCompleted).toBe(true);
    });

    it('should get current task ID', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().acceptTask(moduleId, mockTask);

      const taskId = useAppStore.getState().getCurrentTaskId(moduleId);
      expect(taskId).toBe('test-task');
    });
  });

  describe('Module Progression', () => {
    it('should get module progression state', () => {
      const moduleId = 'test-module';
      
      const state = useAppStore.getState().getModuleProgression(moduleId);
      expect(state).toBe('locked');
    });

    it('should set module progression', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().setModuleProgression(moduleId, 'unlocked');

      const state = useAppStore.getState().getModuleProgression(moduleId);
      expect(state).toBe('unlocked');
    });

    it('should unlock module', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().unlockModule(moduleId);

      const state = useAppStore.getState().getModuleProgression(moduleId);
      expect(state).toBe('unlocked');
    });

    it('should complete module', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().completeModule(moduleId);

      const state = useAppStore.getState().getModuleProgression(moduleId);
      expect(state).toBe('completed');
    });

    it('should check if module is completed', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().completeModule(moduleId);

      const isCompleted = useAppStore.getState().isModuleCompleted(moduleId);
      expect(isCompleted).toBe(true);
    });
  });

  describe('Module State', () => {
    it('should set module state field', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().setModuleStateField(moduleId, 'customKey', 'customValue');

      const value = useAppStore.getState().getModuleStateField(moduleId, 'customKey');
      expect(value).toBe('customValue');
    });

    it('should get module state field', () => {
      const moduleId = 'test-module';
      
      useAppStore.getState().setModuleStateField(moduleId, 'testKey', 'testValue');

      const value = useAppStore.getState().getModuleStateField(moduleId, 'testKey');
      expect(value).toBe('testValue');
    });

    it('should return undefined for non-existent field', () => {
      const value = useAppStore.getState().getModuleStateField('test-module', 'non-existent');
      expect(value).toBeUndefined();
    });
  });

  describe('Greetings', () => {
    it('should check if greeting has been seen', () => {
      const moduleId = 'test-module';
      const dialogueId = 'greeting-1';
      
      const hasSeen = useAppStore.getState().hasSeenGreeting(moduleId, dialogueId);
      expect(hasSeen).toBe(false);
    });

    it('should mark greeting as seen', () => {
      const moduleId = 'test-module';
      const dialogueId = 'greeting-1';
      
      useAppStore.getState().markGreetingSeen(moduleId, dialogueId);

      const hasSeen = useAppStore.getState().hasSeenGreeting(moduleId, dialogueId);
      expect(hasSeen).toBe(true);
    });
  });
});

