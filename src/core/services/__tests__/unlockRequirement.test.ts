/**
 * Unlock Requirement Tests
 * Unit tests for unlock requirement checking logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkUnlockRequirement, requiresUserInteraction, extractModuleDependencies } from '../unlockRequirement.js';
import { actions } from '../../state/actions.js';
import type { UnlockRequirement } from '../../types/unlock.js';
import type { Task } from '../../types/task.js';

// Mock actions
vi.mock('../../state/actions.js', () => ({
  actions: {
    isTaskCompleted: vi.fn(),
    isModuleCompleted: vi.fn(),
    getModuleStateField: vi.fn(),
  },
}));

describe('Unlock Requirement Checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkUnlockRequirement', () => {
    describe('task-complete', () => {
      it('should return true if task is completed', async () => {
        const mockTask: Task = {
          id: 'test-task',
          name: 'Test Task',
          description: 'Test',
          submission: { type: 'text' },
          validate: vi.fn(),
        };

        const requirement: UnlockRequirement = {
          type: 'task-complete',
          task: mockTask,
        };

        vi.mocked(actions.isTaskCompleted).mockReturnValue(true);

        const result = await checkUnlockRequirement(requirement, { moduleId: 'test-module' });

        expect(result).toBe(true);
        expect(actions.isTaskCompleted).toHaveBeenCalledWith('test-module', mockTask);
      });

      it('should return false if task is not completed', async () => {
        const mockTask: Task = {
          id: 'test-task',
          name: 'Test Task',
          description: 'Test',
          submission: { type: 'text' },
          validate: vi.fn(),
        };

        const requirement: UnlockRequirement = {
          type: 'task-complete',
          task: mockTask,
        };

        vi.mocked(actions.isTaskCompleted).mockReturnValue(false);

        const result = await checkUnlockRequirement(requirement, { moduleId: 'test-module' });

        expect(result).toBe(false);
      });

      it('should return false if moduleId is missing', async () => {
        const mockTask: Task = {
          id: 'test-task',
          name: 'Test Task',
          description: 'Test',
          submission: { type: 'text' },
          validate: vi.fn(),
        };

        const requirement: UnlockRequirement = {
          type: 'task-complete',
          task: mockTask,
        };

        const result = await checkUnlockRequirement(requirement, {});

        expect(result).toBe(false);
        expect(actions.isTaskCompleted).not.toHaveBeenCalled();
      });
    });

    describe('module-complete', () => {
      it('should return true if module is completed', async () => {
        const requirement: UnlockRequirement = {
          type: 'module-complete',
          moduleId: 'required-module',
        };

        vi.mocked(actions.isModuleCompleted).mockReturnValue(true);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(true);
        expect(actions.isModuleCompleted).toHaveBeenCalledWith('required-module');
      });

      it('should return false if module is not completed', async () => {
        const requirement: UnlockRequirement = {
          type: 'module-complete',
          moduleId: 'required-module',
        };

        vi.mocked(actions.isModuleCompleted).mockReturnValue(false);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(false);
      });
    });

    describe('state-check', () => {
      it('should return true if state matches', async () => {
        const requirement: UnlockRequirement = {
          type: 'state-check',
          key: 'hasKey',
          value: 'expectedValue',
        };

        vi.mocked(actions.getModuleStateField).mockReturnValue('expectedValue');

        const result = await checkUnlockRequirement(requirement, { moduleId: 'test-module' });

        expect(result).toBe(true);
        expect(actions.getModuleStateField).toHaveBeenCalledWith('test-module', 'hasKey');
      });

      it('should return false if state does not match', async () => {
        const requirement: UnlockRequirement = {
          type: 'state-check',
          key: 'hasKey',
          value: 'expectedValue',
        };

        vi.mocked(actions.getModuleStateField).mockReturnValue('differentValue');

        const result = await checkUnlockRequirement(requirement, { moduleId: 'test-module' });

        expect(result).toBe(false);
      });
    });

    describe('password', () => {
      it('should always return false (requires UI interaction)', async () => {
        const requirement: UnlockRequirement = {
          type: 'password',
          password: 'secret123',
        };

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(false);
      });
    });

    describe('and', () => {
      it('should return true if all requirements are met', async () => {
        const requirement: UnlockRequirement = {
          type: 'and',
          requirements: [
            { type: 'module-complete', moduleId: 'module1' },
            { type: 'module-complete', moduleId: 'module2' },
          ],
        };

        vi.mocked(actions.isModuleCompleted).mockReturnValue(true);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(true);
        expect(actions.isModuleCompleted).toHaveBeenCalledTimes(2);
      });

      it('should return false if any requirement is not met', async () => {
        const requirement: UnlockRequirement = {
          type: 'and',
          requirements: [
            { type: 'module-complete', moduleId: 'module1' },
            { type: 'module-complete', moduleId: 'module2' },
          ],
        };

        vi.mocked(actions.isModuleCompleted)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(false);
      });
    });

    describe('or', () => {
      it('should return true if any requirement is met', async () => {
        const requirement: UnlockRequirement = {
          type: 'or',
          requirements: [
            { type: 'module-complete', moduleId: 'module1' },
            { type: 'module-complete', moduleId: 'module2' },
          ],
        };

        vi.mocked(actions.isModuleCompleted)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(true);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(true);
      });

      it('should return false if no requirements are met', async () => {
        const requirement: UnlockRequirement = {
          type: 'or',
          requirements: [
            { type: 'module-complete', moduleId: 'module1' },
            { type: 'module-complete', moduleId: 'module2' },
          ],
        };

        vi.mocked(actions.isModuleCompleted).mockReturnValue(false);

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(false);
      });
    });

    describe('custom', () => {
      it('should execute custom check function', async () => {
        const customCheck = vi.fn().mockResolvedValue(true);

        const requirement: UnlockRequirement = {
          type: 'custom',
          check: customCheck,
        };

        const context = { moduleId: 'test-module' };
        const result = await checkUnlockRequirement(requirement, context);

        expect(result).toBe(true);
        expect(customCheck).toHaveBeenCalledWith(context);
      });

      it('should handle synchronous custom check', async () => {
        const customCheck = vi.fn().mockReturnValue(false);

        const requirement: UnlockRequirement = {
          type: 'custom',
          check: customCheck,
        };

        const result = await checkUnlockRequirement(requirement);

        expect(result).toBe(false);
      });
    });
  });

  describe('requiresUserInteraction', () => {
    it('should return true for password requirement', () => {
      const requirement: UnlockRequirement = {
        type: 'password',
        password: 'secret',
      };

      expect(requiresUserInteraction(requirement)).toBe(true);
    });

    it('should return false for non-password requirements', () => {
      const requirement: UnlockRequirement = {
        type: 'module-complete',
        moduleId: 'test',
      };

      expect(requiresUserInteraction(requirement)).toBe(false);
    });

    it('should return true for and requirement with password', () => {
      const requirement: UnlockRequirement = {
        type: 'and',
        requirements: [
          { type: 'module-complete', moduleId: 'test' },
          { type: 'password', password: 'secret' },
        ],
      };

      expect(requiresUserInteraction(requirement)).toBe(true);
    });

    it('should return true for or requirement with password', () => {
      const requirement: UnlockRequirement = {
        type: 'or',
        requirements: [
          { type: 'module-complete', moduleId: 'test' },
          { type: 'password', password: 'secret' },
        ],
      };

      expect(requiresUserInteraction(requirement)).toBe(true);
    });
  });

  describe('extractModuleDependencies', () => {
    it('should extract single module dependency', () => {
      const requirement: UnlockRequirement = {
        type: 'module-complete',
        moduleId: 'required-module',
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual(['required-module']);
    });

    it('should extract multiple module dependencies from and', () => {
      const requirement: UnlockRequirement = {
        type: 'and',
        requirements: [
          { type: 'module-complete', moduleId: 'module1' },
          { type: 'module-complete', moduleId: 'module2' },
          { type: 'task-complete', task: {} as Task },
        ],
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual(['module1', 'module2']);
    });

    it('should extract multiple module dependencies from or', () => {
      const requirement: UnlockRequirement = {
        type: 'or',
        requirements: [
          { type: 'module-complete', moduleId: 'module1' },
          { type: 'module-complete', moduleId: 'module2' },
        ],
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual(['module1', 'module2']);
    });

    it('should extract nested dependencies', () => {
      const requirement: UnlockRequirement = {
        type: 'and',
        requirements: [
          { type: 'module-complete', moduleId: 'module1' },
          {
            type: 'or',
            requirements: [
              { type: 'module-complete', moduleId: 'module2' },
              { type: 'module-complete', moduleId: 'module3' },
            ],
          },
        ],
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual(['module1', 'module2', 'module3']);
    });

    it('should return empty array for non-module requirements', () => {
      const requirement: UnlockRequirement = {
        type: 'task-complete',
        task: {} as Task,
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual([]);
    });

    it('should handle password requirement', () => {
      const requirement: UnlockRequirement = {
        type: 'password',
        password: 'secret',
      };

      const dependencies = extractModuleDependencies(requirement);

      expect(dependencies).toEqual([]);
    });
  });
});

