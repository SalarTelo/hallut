/**
 * Unlock Service Tests
 * Unit tests for unlock service logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { canUnlockModule, unlockModule, evaluateModuleCompletion, initializeModuleProgression } from '../unlockService.js';
import { actions } from '../../state/actions.js';
import { getModule, getRegisteredModuleIds } from '../../module/registry.js';
import { isModuleFullyCompleted } from '../module.js';
import type { ModuleDefinition } from '../../types/module.js';

// Mock dependencies
vi.mock('../../state/actions.js', () => ({
  actions: {
    getModuleProgression: vi.fn(),
    setModuleProgression: vi.fn(),
    unlockModule: vi.fn(),
    completeModule: vi.fn(),
    isModuleCompleted: vi.fn(),
    isTaskCompleted: vi.fn(),
    getModuleStateField: vi.fn(),
  },
}));

vi.mock('../../module/registry.js', () => ({
  getModule: vi.fn(),
  getRegisteredModuleIds: vi.fn(),
}));

vi.mock('../module.js', () => ({
  isModuleFullyCompleted: vi.fn(),
}));

vi.mock('../unlockRequirement.js', async () => {
  const actual = await vi.importActual('../unlockRequirement.js');
  return {
    ...actual,
    checkUnlockRequirement: vi.fn(),
    requiresUserInteraction: vi.fn(),
  };
});

describe('Unlock Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('canUnlockModule', () => {
    it('should return false if module does not exist', async () => {
      vi.mocked(getModule).mockReturnValue(null);

      const result = await canUnlockModule('non-existent');

      expect(result).toEqual({ canUnlock: false, requiresInteraction: false });
    });

    it('should return false if module is already unlocked', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('unlocked');

      const result = await canUnlockModule('test-module');

      expect(result).toEqual({ canUnlock: false, requiresInteraction: false });
    });

    it('should return false if module is already completed', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('completed');

      const result = await canUnlockModule('test-module');

      expect(result).toEqual({ canUnlock: false, requiresInteraction: false });
    });

    it('should return true if module has no unlock requirement', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const result = await canUnlockModule('test-module');

      expect(result).toEqual({ canUnlock: true, requiresInteraction: false });
    });

    it('should handle password requirement correctly', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'password',
            password: 'secret123',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      // Without password
      const result1 = await canUnlockModule('test-module');
      expect(result1).toEqual({ canUnlock: false, requiresInteraction: true });

      // With correct password
      const result2 = await canUnlockModule('test-module', { password: 'secret123' });
      expect(result2).toEqual({ canUnlock: true, requiresInteraction: true });

      // With wrong password
      const result3 = await canUnlockModule('test-module', { password: 'wrong' });
      expect(result3).toEqual({ canUnlock: false, requiresInteraction: true });
    });

    it('should check other unlock requirements', async () => {
      const { checkUnlockRequirement, requiresUserInteraction } = await import('../unlockRequirement.js');

      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'module-complete',
            moduleId: 'required-module',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');
      vi.mocked(checkUnlockRequirement).mockResolvedValue(true);
      vi.mocked(requiresUserInteraction).mockReturnValue(false);

      const result = await canUnlockModule('test-module');

      expect(result).toEqual({ canUnlock: true, requiresInteraction: false });
      expect(checkUnlockRequirement).toHaveBeenCalled();
    });
  });

  describe('unlockModule', () => {
    it('should unlock module if requirements are met', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const result = await unlockModule('test-module');

      expect(result).toEqual({ success: true, requiresPassword: false });
      expect(actions.unlockModule).toHaveBeenCalledWith('test-module');
    });

    it('should return requiresPassword if password is needed', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'password',
            password: 'secret',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const result = await unlockModule('test-module');

      expect(result).toEqual({ success: false, requiresPassword: true });
      expect(actions.unlockModule).not.toHaveBeenCalled();
    });

    it('should unlock with correct password', async () => {
      const mockModule: ModuleDefinition = {
        id: 'test-module',
        config: {
          manifest: { id: 'test-module', name: 'Test', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'password',
            password: 'secret',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const result = await unlockModule('test-module', 'secret');

      expect(result).toEqual({ success: true, requiresPassword: false });
      expect(actions.unlockModule).toHaveBeenCalledWith('test-module');
    });
  });

  describe('evaluateModuleCompletion', () => {
    it('should do nothing if module is not completed', async () => {
      vi.mocked(isModuleFullyCompleted).mockResolvedValue(false);

      await evaluateModuleCompletion('test-module');

      expect(actions.completeModule).not.toHaveBeenCalled();
    });

    it('should mark module as completed and unlock dependents', async () => {
      const mockModule1: ModuleDefinition = {
        id: 'dependent-module',
        config: {
          manifest: { id: 'dependent-module', name: 'Dependent', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'module-complete',
            moduleId: 'test-module',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(isModuleFullyCompleted).mockResolvedValue(true);
      vi.mocked(getRegisteredModuleIds).mockReturnValue(['dependent-module']);
      vi.mocked(getModule).mockReturnValue(mockModule1);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      // Mock canUnlockModule to return true
      const { checkUnlockRequirement } = await import('../unlockRequirement.js');
      vi.mocked(checkUnlockRequirement).mockResolvedValue(true);

      await evaluateModuleCompletion('test-module');

      expect(actions.completeModule).toHaveBeenCalledWith('test-module');
      expect(actions.unlockModule).toHaveBeenCalledWith('dependent-module');
    });
  });

  describe('initializeModuleProgression', () => {
    it('should lock all modules except completed ones', async () => {
      vi.mocked(getRegisteredModuleIds).mockReturnValue(['module1', 'module2', 'module3']);
      vi.mocked(actions.getModuleProgression)
        .mockReturnValueOnce('locked')
        .mockReturnValueOnce('completed')
        .mockReturnValueOnce('unlocked');

      const mockModule: ModuleDefinition = {
        id: 'module1',
        config: {
          manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);

      await initializeModuleProgression();

      expect(actions.setModuleProgression).toHaveBeenCalledWith('module1', 'locked');
      expect(actions.setModuleProgression).not.toHaveBeenCalledWith('module2', expect.anything());
      expect(actions.setModuleProgression).toHaveBeenCalledWith('module3', 'locked');
    });

    it('should unlock modules with no requirements', async () => {
      vi.mocked(getRegisteredModuleIds).mockReturnValue(['module1']);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const mockModule: ModuleDefinition = {
        id: 'module1',
        config: {
          manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);

      await initializeModuleProgression();

      expect(actions.unlockModule).toHaveBeenCalledWith('module1');
    });

    it('should unlock modules with met requirements', async () => {
      vi.mocked(getRegisteredModuleIds).mockReturnValue(['module1']);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const mockModule: ModuleDefinition = {
        id: 'module1',
        config: {
          manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'module-complete',
            moduleId: 'required-module',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);
      vi.mocked(actions.isModuleCompleted).mockReturnValue(true);

      const { checkUnlockRequirement, requiresUserInteraction } = await import('../unlockRequirement.js');
      vi.mocked(checkUnlockRequirement).mockResolvedValue(true);
      vi.mocked(requiresUserInteraction).mockReturnValue(false);

      await initializeModuleProgression();

      expect(actions.unlockModule).toHaveBeenCalledWith('module1');
    });

    it('should not unlock modules requiring password during initialization', async () => {
      vi.mocked(getRegisteredModuleIds).mockReturnValue(['module1']);
      vi.mocked(actions.getModuleProgression).mockReturnValue('locked');

      const mockModule: ModuleDefinition = {
        id: 'module1',
        config: {
          manifest: { id: 'module1', name: 'Module 1', version: '1.0.0' },
          background: {},
          welcome: { speaker: 'Test', lines: [] },
          taskOrder: [],
          unlockRequirement: {
            type: 'password',
            password: 'secret',
          },
        },
        content: { interactables: [], tasks: [] },
      };

      vi.mocked(getModule).mockReturnValue(mockModule);

      await initializeModuleProgression();

      expect(actions.unlockModule).not.toHaveBeenCalled();
    });
  });
});

