/**
 * Module Creation Tests
 * Comprehensive tests for module creation wizard
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import * as moduleCreation from '../module-creation.js';
import * as utilsModule from '../utils.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

vi.mock('../utils.js');
vi.mock('../unlock-requirements.js', () => ({
  buildUnlockRequirement: vi.fn().mockResolvedValue(null),
}));
vi.mock('../templates.js');
vi.mock('ora');
vi.mock('chalk', () => ({
  default: {
    bold: { 
      blue: vi.fn((s: string) => s),
      green: vi.fn((s: string) => s),
      red: vi.fn((s: string) => s),
    },
    green: vi.fn((s: string) => s),
    gray: vi.fn((s: string) => s),
    dim: vi.fn((s: string) => s),
    red: vi.fn((s: string) => s),
  },
}));

describe('Module Creation', () => {
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

  describe('createModule', () => {
    it('should create module with quick mode', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'quick' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: false })
        .mockResolvedValueOnce({
          createTask: false,
          createNPC: false,
          createObject: false,
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);
      
      const ensureDirectoryMock2 = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock2.mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      const { getIndexTemplate, getConfigTemplate } = await import('../templates.js');
      (getIndexTemplate as any).mockReturnValue('index template');
      (getConfigTemplate as any).mockReturnValue('config template');

      await moduleCreation.createModule();

      expect(ensureDirectoryMock2).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should create module with detailed mode', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'detailed' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          description: 'A test module',
          version: '1.0.0',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: false })
        .mockResolvedValueOnce({
          createTask: true,
          createNPC: true,
          createObject: true,
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);
      
      const ensureDirectoryMock = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock.mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue('// TODO: Import your NPCs here\nexport const NPCs: Array');

      vi.mock('../unlock-requirements.js', () => ({
        buildUnlockRequirement: vi.fn().mockResolvedValue(null),
      }));

      await moduleCreation.createModule();

      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    it('should reject when module already exists', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'quick' })
        .mockResolvedValueOnce({
          moduleId: 'existing-module',
          displayName: 'Existing Module',
          bgColor: '#1a1a2e',
        });

      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);

      await moduleCreation.createModule();

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(fs.writeFile).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle worldmap configuration', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'quick' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: true })
        .mockResolvedValueOnce({
          x: 50,
          y: 50,
          shape: 'circle',
          size: 48,
        })
        .mockResolvedValueOnce({
          createTask: false,
          createNPC: false,
          createObject: false,
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);
      
      const ensureDirectoryMock = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock.mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      vi.mock('../unlock-requirements.js', () => ({
        buildUnlockRequirement: vi.fn().mockResolvedValue(null),
      }));

      await moduleCreation.createModule();

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should create example NPC when requested', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'detailed' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          description: 'Test',
          version: '1.0.0',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: false })
        .mockResolvedValueOnce({
          createTask: false,
          createNPC: true,
          createObject: false,
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);
      
      const ensureDirectoryMock = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock.mockResolvedValue();
      vi.spyOn(fs, 'writeFile').mockResolvedValue();
      vi.spyOn(fs, 'readFile').mockResolvedValue('// TODO: Import your NPCs here\nexport const NPCs: Array');

      vi.mock('../unlock-requirements.js', () => ({
        buildUnlockRequirement: vi.fn().mockResolvedValue(null),
      }));

      await moduleCreation.createModule();

      expect(ensureDirectoryMock).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'quick' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: false })
        .mockResolvedValueOnce({
          createTask: false,
          createNPC: false,
          createObject: false,
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue([]);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(false);
      vi.spyOn(utilsModule, 'ensureDirectory').mockRejectedValue(new Error('Permission denied'));

      await expect(moduleCreation.createModule()).rejects.toThrow();

      expect(mockSpinner.fail).toHaveBeenCalled();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ mode: undefined });

      await moduleCreation.createModule();

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should create all required files', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ mode: 'quick' })
        .mockResolvedValueOnce({
          moduleId: 'test-module',
          displayName: 'Test Module',
          bgColor: '#1a1a2e',
        })
        .mockResolvedValueOnce({ setWorldmap: false })
        .mockResolvedValueOnce({
          createTask: false,
          createNPC: false,
          createObject: false,
        });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);
      
      const ensureDirectoryMock = vi.mocked(utilsModule.ensureDirectory);
      ensureDirectoryMock.mockResolvedValue();
      const writeFileSpy = vi.spyOn(fs, 'writeFile').mockResolvedValue();

      vi.mock('../unlock-requirements.js', () => ({
        buildUnlockRequirement: vi.fn().mockResolvedValue(null),
      }));

      await moduleCreation.createModule();

      expect(writeFileSpy).toHaveBeenCalled();
    });
  });
});

