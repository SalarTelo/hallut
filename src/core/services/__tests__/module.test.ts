/**
 * Module Service Tests
 * Unit tests for module progression logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  checkModuleDependencies, 
  checkModuleUnlockStatus, 
  isModuleFullyCompleted,
  checkModuleCompletionStatus,
} from '../module.js';
import { getModule } from '../../module/registry.js';
import { actions } from '../../state/actions.js';
import { defineModule } from '../../module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../../utils/builders/modules.js';
import type { Task } from '../../types/task.js';

// Mock the actions
vi.mock('../../state/actions.js', () => ({
  actions: {
    isModuleCompleted: vi.fn(),
    getModuleProgression: vi.fn(),
    getProgress: vi.fn(),
  },
}));

// Mock the registry
vi.mock('../../module/registry.js', async () => {
  const actual = await vi.importActual('../../module/registry.js');
  return {
    ...actual,
    getModule: vi.fn(),
  };
});

// Mock unlockRequirement service
vi.mock('../unlockRequirement.js', () => ({
  checkUnlockRequirement: vi.fn(),
  extractModuleDependencies: vi.fn(),
}));

// Mock moduleService's getModuleConfig
vi.mock('../../../services/moduleService.js', async () => {
  const actual = await vi.importActual('../../../services/moduleService.js');
  return {
    ...actual,
    getModuleConfig: vi.fn(),
  };
});

describe('Module Service', () => {
  const mockTask: Task = {
    id: 'test-task',
    name: 'Test Task',
    description: 'Test',
    submission: { type: 'text' },
    validate: vi.fn(() => ({ solved: true, reason: 'test', details: 'test' })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkModuleDependencies', () => {
    it('should return true if module has no dependencies', async () => {
      const module = defineModule({
        id: 'no-deps',
        config: createModuleConfig({
          manifest: createManifest('no-deps', 'No Deps', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);

      const result = await checkModuleDependencies('no-deps');

      expect(result).toBe(true);
    });

    it('should return true if all dependencies are completed', async () => {
      const { andRequirements, moduleComplete } = await import('../../../utils/builders/modules.js');
      
      const module = defineModule({
        id: 'with-deps',
        config: createModuleConfig({
          manifest: createManifest('with-deps', 'With Deps', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
          unlockRequirement: andRequirements(
            moduleComplete('dep1'),
            moduleComplete('dep2')
          ),
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      
      // Mock extractModuleDependencies to return dependencies
      const { extractModuleDependencies } = await import('../unlockRequirement.js');
      vi.mocked(extractModuleDependencies).mockReturnValue(['dep1', 'dep2']);
      
      vi.mocked(actions.isModuleCompleted).mockReturnValue(true);

      const result = await checkModuleDependencies('with-deps');

      expect(result).toBe(true);
    });

    it('should return false if any dependency is not completed', async () => {
      const { andRequirements, moduleComplete } = await import('../../../utils/builders/modules.js');
      
      const module = defineModule({
        id: 'with-deps',
        config: createModuleConfig({
          manifest: createManifest('with-deps', 'With Deps', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
          unlockRequirement: andRequirements(
            moduleComplete('dep1'),
            moduleComplete('dep2')
          ),
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      
      // Mock extractModuleDependencies to return dependencies
      const { extractModuleDependencies } = await import('../unlockRequirement.js');
      vi.mocked(extractModuleDependencies).mockReturnValue(['dep1', 'dep2']);
      
      // Mock that one dependency is not completed
      vi.mocked(actions.isModuleCompleted)
        .mockReturnValueOnce(true)  // dep1 is completed
        .mockReturnValueOnce(false); // dep2 is not completed

      const result = await checkModuleDependencies('with-deps');

      expect(result).toBe(false);
    });

    it('should return false if module not found', async () => {
      vi.mocked(getModule).mockReturnValue(null);

      const result = await checkModuleDependencies('not-found');

      expect(result).toBe(false);
    });
  });

  describe('checkModuleUnlockStatus', () => {
    it('should return shouldUnlock: false if already unlocked', async () => {
      vi.mocked(actions.getModuleProgression).mockReturnValue('unlocked');

      const result = await checkModuleUnlockStatus('test-module');

      expect(result.shouldUnlock).toBe(false);
      expect(result.currentState).toBe('unlocked');
    });

    it('should return shouldUnlock: false if already completed', async () => {
      vi.mocked(actions.getModuleProgression).mockReturnValue('completed');

      const result = await checkModuleUnlockStatus('test-module');

      expect(result.shouldUnlock).toBe(false);
      expect(result.currentState).toBe('completed');
    });

    it('should return shouldUnlock: true if dependencies met and locked', async () => {
      const module = defineModule({
        id: 'locked-module',
        config: createModuleConfig({
          manifest: createManifest('locked-module', 'Locked', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');
      vi.mocked(getModule).mockReturnValue(module);

      const result = await checkModuleUnlockStatus('locked-module');

      expect(result.shouldUnlock).toBe(true);
      expect(result.currentState).toBe('locked');
    });
  });

  describe('isModuleFullyCompleted', () => {
    it('should return true if all tasks are completed', async () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [mockTask],
        }),
        content: {
          interactables: [],
          tasks: [mockTask],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      vi.mocked(actions.getProgress).mockReturnValue({
        state: {
          completedTasks: ['test-task'],
          seenGreetings: {},
        },
      });

      const result = await isModuleFullyCompleted('test-module');

      expect(result).toBe(true);
    });

    it('should return false if not all tasks are completed', async () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [mockTask],
        }),
        content: {
          interactables: [],
          tasks: [mockTask],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      vi.mocked(actions.getProgress).mockReturnValue({
        state: {
          completedTasks: [],
          seenGreetings: {},
        },
      });

      const result = await isModuleFullyCompleted('test-module');

      expect(result).toBe(false);
    });

    it('should return false if module has no tasks', async () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      vi.mocked(actions.getProgress).mockReturnValue({
        state: {
          completedTasks: [],
          seenGreetings: {},
        },
      });

      const result = await isModuleFullyCompleted('test-module');

      expect(result).toBe(false);
    });

    it('should return false if module not found', async () => {
      vi.mocked(getModule).mockReturnValue(null);

      const result = await isModuleFullyCompleted('not-found');

      expect(result).toBe(false);
    });

    it('should return false if no progress', async () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      vi.mocked(actions.getProgress).mockReturnValue(null);

      const result = await isModuleFullyCompleted('test-module');

      expect(result).toBe(false);
    });
  });

  describe('checkModuleCompletionStatus', () => {
    it('should return isCompleted: false if module not completed', async () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      vi.mocked(getModule).mockReturnValue(module);
      vi.mocked(actions.getProgress).mockReturnValue({
        state: {
          completedTasks: [],
          seenGreetings: {},
        },
      });

      const result = await checkModuleCompletionStatus('test-module');

      expect(result.isCompleted).toBe(false);
      expect(result.modulesToUnlock).toEqual([]);
    });
  });
});

