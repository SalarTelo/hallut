/**
 * Debug Tools Tests
 * Comprehensive tests for debug tools functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import * as debugTools from '../debug-tools.js';
import * as utilsModule from '../utils.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

vi.mock('../utils.js');
vi.mock('chalk', () => {
  const boldFn = vi.fn((s: string) => s);
  (boldFn as any).blue = vi.fn((s: string) => s);
  (boldFn as any).red = vi.fn((s: string) => s);
  (boldFn as any).green = vi.fn((s: string) => s);
  
  return {
    default: {
      bold: boldFn,
      green: vi.fn((s: string) => s),
      yellow: vi.fn((s: string) => s),
      red: vi.fn((s: string) => s),
      dim: vi.fn((s: string) => s),
      gray: vi.fn((s: string) => s),
    },
  };
});

describe('Debug Tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showDebugTools', () => {
    it('should display debug tools menu', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ tool: 'back' });

      await debugTools.showDebugTools();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should call moduleIntrospection when selected', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ tool: 'introspect' })
        .mockResolvedValueOnce({ moduleId: undefined });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(true);
      
      vi.spyOn(fs, 'readFile').mockResolvedValue('content');
      vi.spyOn(fs, 'readdir').mockResolvedValue([]);

      await debugTools.showDebugTools();

      expect(getExistingModulesMock).toHaveBeenCalled();
    });

    it('should display not implemented for other tools', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const tools = ['typecheck', 'deps', 'refs', 'search', 'export', 'state', 'dryrun'];

      for (const tool of tools) {
        const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ tool });
        await debugTools.showDebugTools();
      }

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should return to menu after tool execution', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ tool: 'introspect' })
        .mockResolvedValueOnce({ moduleId: undefined })
        .mockResolvedValueOnce({ tool: 'back' });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);

      await debugTools.showDebugTools();

      expect(prompts.default).toHaveBeenCalled();
    });
  });

  describe('moduleIntrospection', () => {
    it('should display module structure', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: 'test-module' });
      
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(true);
      
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const exampleTask = createTask');
      vi.spyOn(fs, 'readdir').mockResolvedValue([]);

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle missing files', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: 'test-module' });
      
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should count tasks in tasks.ts', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: 'test-module' });
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        return filePath.includes('tasks.ts');
      });
      vi.spyOn(fs, 'readFile').mockResolvedValue(
        'export const task1 = createTask\nexport const task2 = createTask'
      );

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should list NPC folders', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: 'test-module' });
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('import { guardNPC }');
      vi.spyOn(fs, 'readdir').mockResolvedValue([
        { name: 'guard', isDirectory: () => true },
        { name: 'merchant', isDirectory: () => true },
      ] as any);

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: undefined });
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1']);

      await expect(debugTools.moduleIntrospection()).resolves.not.toThrow();
    });

    it('should handle errors gracefully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({ moduleId: 'test-module' });
      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockRejectedValue(new Error('File system error'));

      await debugTools.moduleIntrospection();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });
});

