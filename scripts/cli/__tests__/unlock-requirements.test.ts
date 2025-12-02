/**
 * Unlock Requirements Tests
 * Comprehensive tests for unlock requirement builder
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as unlockModule from '../unlock-requirements.js';

// Mock prompts
vi.mock('prompts', () => ({
  default: vi.fn(),
}));

// Mock chalk to avoid console output in tests
vi.mock('chalk', () => ({
  default: {
    yellow: vi.fn((str: string) => str),
  },
}));

describe('Unlock Requirements', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const prompts = await import('prompts');
    (prompts.default as any).mockReset();
  });

  describe('buildUnlockRequirement', () => {
    it('should return null when user declines requirements', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({
        hasRequirement: false,
      });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toBeNull();
    });

    it('should build moduleComplete requirement', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['other-module'],
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['other-module'],
        'test-module'
      );

      expect(result).toContain('moduleComplete');
      expect(result).toContain('other-module');
    });

    it('should build multiple moduleComplete with andRequirements', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module1', 'module2'],
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['module1', 'module2'],
        'test-module'
      );

      expect(result).toContain('andRequirements');
      expect(result).toContain('module1');
      expect(result).toContain('module2');
    });

    it('should build passwordUnlock requirement', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'password',
        })
        .mockResolvedValueOnce({
          password: 'secret123',
          hint: 'Think of a number',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('passwordUnlock');
      expect(result).toContain('secret123');
      expect(result).toContain('Think of a number');
    });

    it('should build passwordUnlock without hint', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'password',
        })
        .mockResolvedValueOnce({
          password: 'secret123',
          hint: undefined,
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('passwordUnlock');
      expect(result).toContain('secret123');
    });

    it('should build stateCheck requirement with string value', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'state-check',
        })
        .mockResolvedValueOnce({
          key: 'unlocked',
          value: 'true',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('stateCheck');
      expect(result).toContain("'unlocked'");
      expect(result).toContain("'true'");
    });

    it('should build stateCheck requirement with numeric value', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'state-check',
        })
        .mockResolvedValueOnce({
          key: 'level',
          value: '5',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('stateCheck');
      expect(result).toContain("'level'");
      expect(result).toContain('5');
      expect(result).not.toContain("'5'");
    });

    it('should build taskComplete requirement', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'task-complete',
        })
        .mockResolvedValueOnce({
          taskId: 'greeting-task',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('taskComplete');
      expect(result).toContain('greeting-task');
      expect(result).toContain('TODO');
    });

    it('should build custom requirement', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'custom',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toContain('TODO');
      expect(result).toContain('Custom unlock requirement');
    });

    it('should combine requirements with AND', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module1'],
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module2'],
        })
        .mockResolvedValueOnce({
          combine: 'and',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['module1', 'module2'],
        'test-module'
      );

      expect(result).toContain('andRequirements');
    });

    it('should combine requirements with OR', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module1'],
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module2'],
        })
        .mockResolvedValueOnce({
          combine: 'or',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['module1', 'module2'],
        'test-module'
      );

      expect(result).toContain('orRequirements');
    });

    it('should handle no available modules for dependency', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should filter out current module from available modules', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['other-module'],
        })
        .mockResolvedValueOnce({
          type: 'done',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['current-module', 'other-module'],
        'current-module'
      );

      expect(result).toContain('other-module');
      expect(result).not.toContain('current-module');
    });

    it('should handle multiple requirements', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        // First requirement: module-complete
        .mockResolvedValueOnce({
          type: 'module-complete',
        })
        .mockResolvedValueOnce({
          selectedModules: ['module1'],
        })
        // Second requirement: password (loop continues because requirements.length === 1, no combine prompt yet)
        .mockResolvedValueOnce({
          type: 'password',
        })
        .mockResolvedValueOnce({
          password: 'pass',
          hint: undefined,
        })
        // Now requirements.length > 1, so combine prompt appears
        .mockResolvedValueOnce({
          combine: 'and',
        });

      const result = await unlockModule.buildUnlockRequirement(
        ['module1'],
        'test-module'
      );

      // With multiple requirements and 'and', it should use andRequirements
      expect(result).toContain('andRequirements');
      expect(result).toContain('module1');
      expect(result).toContain('passwordUnlock');
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({
          hasRequirement: true,
        })
        .mockResolvedValueOnce({
          type: undefined,
        });

      const result = await unlockModule.buildUnlockRequirement([], 'test-module');

      expect(result).toBeNull();
    });
  });
});
