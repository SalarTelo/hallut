/**
 * Deletion Tests
 * Comprehensive tests for deletion functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import ora from 'ora';
import * as deletionModule from '../deletion.js';
import * as utilsModule from '../utils.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

vi.mock('../utils.js');
vi.mock('ora');
vi.mock('chalk', () => ({
  default: {
    bold: { blue: vi.fn((s: string) => s) },
    green: vi.fn((s: string) => s),
    gray: vi.fn((s: string) => s),
    dim: vi.fn((s: string) => s),
    red: vi.fn((s: string) => s),
  },
}));

describe('Deletion', () => {
  let mockSpinner: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSpinner = {
      start: vi.fn().mockReturnThis(),
      succeed: vi.fn(),
      fail: vi.fn(),
    };
    (ora as any).mockReturnValue(mockSpinner);
  });

  describe('deleteModuleOrNPC', () => {
    it('should delete entire module when confirmed', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'module' })
        .mockResolvedValueOnce({ confirm: true });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(fs, 'rm').mockResolvedValue(undefined);

      await deletionModule.deleteModuleOrNPC();

      expect(fs.rm).toHaveBeenCalled();
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should not delete module when not confirmed', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'module' })
        .mockResolvedValueOnce({ confirm: false });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await deletionModule.deleteModuleOrNPC();

      expect(fs.rm).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'));

      consoleLogSpy.mockRestore();
    });

    it('should delete NPC when confirmed', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'npc' })
        .mockResolvedValueOnce({ npcId: 'guard' })
        .mockResolvedValueOnce({ confirm: true });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readdir').mockResolvedValue([
        { name: 'guard', isDirectory: () => true },
      ] as any);
      vi.spyOn(fs, 'rm').mockResolvedValue(undefined);
      vi.spyOn(fs, 'readFile').mockResolvedValue(
        "import { guardNPC } from './NPC/guard/index.js';\nexport const NPCs = [guardNPC];"
      );
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await deletionModule.deleteModuleOrNPC();

      expect(fs.rm).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should update NPCs.ts after deleting NPC', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'npc' })
        .mockResolvedValueOnce({ npcId: 'guard' })
        .mockResolvedValueOnce({ confirm: true });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readdir').mockResolvedValue([
        { name: 'guard', isDirectory: () => true },
      ] as any);
      vi.spyOn(fs, 'rm').mockResolvedValue(undefined);
      const readFileSpy = vi.spyOn(fs, 'readFile').mockResolvedValue(
        "import { guardNPC } from './NPC/guard/index.js';\nexport const NPCs = [guardNPC];"
      );
      const writeFileSpy = vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await deletionModule.deleteModuleOrNPC();

      expect(writeFileSpy).toHaveBeenCalled();
      const writtenContent = (writeFileSpy as any).mock.calls[0][1];
      expect(writtenContent).not.toContain('guardNPC');
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue([]);

      await deletionModule.deleteModuleOrNPC();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No modules found'));

      consoleLogSpy.mockRestore();
    });

    it('should handle no NPCs found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'npc' });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(false);

      await deletionModule.deleteModuleOrNPC();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No NPCs found'));

      consoleLogSpy.mockRestore();
    });

    it('should handle errors gracefully', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({ deleteType: 'module' })
        .mockResolvedValueOnce({ confirm: true });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(fs, 'rm').mockRejectedValue(new Error('Permission denied'));

      await deletionModule.deleteModuleOrNPC();

      expect(mockSpinner.fail).toHaveBeenCalled();
    });

    it('should handle cancellation at different stages', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: undefined });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await deletionModule.deleteModuleOrNPC();

      expect(fs.rm).not.toHaveBeenCalled();
    });
  });
});

