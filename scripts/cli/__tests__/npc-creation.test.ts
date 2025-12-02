/**
 * NPC Creation Tests
 * Comprehensive tests for NPC creation wizard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import ora from 'ora';
import * as npcCreation from '../npc-creation.js';
import * as utilsModule from '../utils.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

vi.mock('../utils.js');
vi.mock('../templates.js');
vi.mock('ora');
vi.mock('chalk', () => ({
  default: {
    bold: { blue: vi.fn((s: string) => s) },
    green: vi.fn((s: string) => s),
    gray: vi.fn((s: string) => s),
    dim: vi.fn((s: string) => s),
    red: vi.fn((s: string) => s),
    yellow: vi.fn((s: string) => s),
  },
}));

describe('NPC Creation', () => {
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

  describe('createNPC', () => {
    it('should create NPC in existing module', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'test-module' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module exists, but NPC folder doesn't
        return filePath.includes('test-module') && !filePath.includes('NPC/guard');
      });
      
      const ensureDirectoryMock = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock.mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue('// TODO: Import your NPCs here\nexport const NPCs: Array');

      await npcCreation.createNPC();

      expect(ensureDirectoryMock).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should reject standalone NPC creation', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'standalone' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await npcCreation.createNPC();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not implemented yet'));

      consoleLogSpy.mockRestore();
    });

    it('should handle missing module', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'missing-module' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(false);

      await npcCreation.createNPC();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));

      consoleLogSpy.mockRestore();
    });

    it('should update NPCs.ts with new NPC', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'test-module' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(utilsModule, 'ensureDirectory').mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue('// TODO: Import your NPCs here\nexport const NPCs: Array');

      await npcCreation.createNPC();

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle NPCs.ts with existing NPCs', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'test-module' })
        .mockResolvedValueOnce({
          npcId: 'merchant',
          npcName: 'Merchant',
          x: 50,
          y: 50,
          avatar: 'avatar',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(utilsModule, 'ensureDirectory').mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue(
        "import { guardNPC } from './NPC/guard/index.js';\nexport const NPCs = [guardNPC];"
      );

      await npcCreation.createNPC();

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should check for example task when linking', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'test-module' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(utilsModule, 'ensureDirectory').mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const exampleTask = createTask');

      await npcCreation.createNPC();

      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);

      await npcCreation.createNPC();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No modules found'));

      consoleLogSpy.mockRestore();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ createInModule: undefined });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await npcCreation.createNPC();

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ createInModule: 'module' })
        .mockResolvedValueOnce({ selectedModule: 'test-module' })
        .mockResolvedValueOnce({
          npcId: 'guard',
          npcName: 'Guard',
          x: 20,
          y: 30,
          avatar: 'shield',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(utilsModule, 'ensureDirectory').mockRejectedValue(new Error('Permission denied'));

      await expect(npcCreation.createNPC()).rejects.toThrow();

      expect(mockSpinner.fail).toHaveBeenCalled();
    });
  });
});

