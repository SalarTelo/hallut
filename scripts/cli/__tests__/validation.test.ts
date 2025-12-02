/**
 * Validation Tests
 * Comprehensive tests for module validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import * as validationModule from '../validation.js';
import * as utilsModule from '../utils.js';

vi.mock('prompts', () => ({
  default: vi.fn(),
}));

vi.mock('../utils.js', () => ({
  MODULES_DIR: '/test/modules',
  fileExists: vi.fn(),
  getExistingModules: vi.fn(),
}));

describe('Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateModule', () => {
    it('should return valid when module exists with all required files', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        const fileName = path.basename(filePath);
        // All required files and content files exist
        return fileName === 'index.ts' || fileName === 'config.ts' || filePath.includes('content/index.ts') || filePath.includes('content/tasks.ts');
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('should return error when module does not exist', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory doesn't exist
        if (filePath === path.join('/test/modules', 'nonexistent-module')) {
          return false;
        }
        return false;
      });

      const result = await validationModule.validateModule('nonexistent-module');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('not found');
    });

    it('should detect missing index.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        // index.ts doesn't exist, but config.ts and content/index.ts do
        const fileName = path.basename(filePath);
        if (fileName === 'index.ts') {
          return false; // index.ts is missing
        }
        return fileName === 'config.ts' || filePath.includes('content/index.ts');
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('index.ts'))).toBe(true);
    });

    it('should detect missing config.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        const fileName = path.basename(filePath);
        // index.ts and content/index.ts exist, but config.ts is missing
        return (fileName === 'index.ts' || filePath.includes('content/index.ts')) && fileName !== 'config.ts';
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('config.ts'))).toBe(true);
    });

    it('should detect missing content/index.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        const fileName = path.basename(filePath);
        // index.ts and config.ts exist, but content/index.ts is missing
        return (fileName === 'index.ts' || fileName === 'config.ts') && !filePath.includes('content/index.ts');
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('content/index.ts'))).toBe(true);
    });

    it('should warn when no content files exist', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        // Required files exist
        const fileName = path.basename(filePath);
        if (fileName === 'index.ts' || fileName === 'config.ts' || filePath.includes('content/index.ts')) {
          return true;
        }
        // Content files don't exist
        return false;
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('content files');
    });

    it('should not warn when content files exist', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/tasks.ts')
        );
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.warnings.length).toBe(0);
    });

    it('should check for tasks.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/tasks.ts')
        );
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.warnings.length).toBe(0);
    });

    it('should check for objects.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/objects.ts')
        );
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.warnings.length).toBe(0);
    });

    it('should check for NPCs.ts', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/NPCs.ts')
        );
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.warnings.length).toBe(0);
    });

    it('should accumulate multiple errors', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        // Module directory exists
        if (filePath === path.join('/test/modules', 'test-module')) {
          return true;
        }
        // All required files are missing
        return false;
      });

      const result = await validationModule.validateModule('test-module');

      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors.length).toBe(3); // index.ts, config.ts, content/index.ts
    });

    it('should handle module path correctly', async () => {
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(true);

      await validationModule.validateModule('test-module');

      expect(fileExistsMock).toHaveBeenCalled();
    });
  });

  describe('validateSingleModule', () => {
    it('should display success message for valid module', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/tasks.ts')
        );
      });

      await validationModule.validateSingleModule('test-module');

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should display errors for invalid module', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);

      await validationModule.validateSingleModule('test-module');

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should display warnings', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return fileName === 'index.ts' || fileName === 'config.ts' || filePath.includes('content/index.ts');
      });

      await validationModule.validateSingleModule('test-module');

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });

  describe('validateAllModules', () => {
    it('should validate all modules', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1', 'module2', 'module3']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/tasks.ts')
        );
      });

      await validationModule.validateAllModules();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle empty modules list', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);

      await validationModule.validateAllModules();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should display summary statistics', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1', 'module2']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(false);

      await validationModule.validateAllModules();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle mixed validation results', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1', 'module2']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        if (filePath.includes('module1')) {
          return fileName === 'index.ts' || fileName === 'config.ts' || filePath.includes('content/index.ts');
        }
        return false;
      });

      await validationModule.validateAllModules();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });

  describe('validateModulesFlow', () => {
    it('should prompt for module selection', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({
        moduleId: 'test-module',
      });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['test-module']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockImplementation(async (filePath: string) => {
        const fileName = path.basename(filePath);
        return (
          fileName === 'index.ts' ||
          fileName === 'config.ts' ||
          filePath.includes('content/index.ts') ||
          filePath.includes('content/tasks.ts')
        );
      });

      await validationModule.validateModulesFlow();

      expect(prompts.default).toHaveBeenCalled();
    });

    it('should validate all modules when selected', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({
        moduleId: '__all__',
      });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1']);
      
      const fileExistsMock = vi.mocked(utilsModule.fileExists);
      fileExistsMock.mockResolvedValue(true);

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await validationModule.validateModulesFlow();

      expect(consoleLogSpy).toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue([]);

      await validationModule.validateModulesFlow();

      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValue({
        moduleId: undefined,
      });

      const getExistingModulesMock = vi.mocked(utilsModule.getExistingModules);
      getExistingModulesMock.mockResolvedValue(['module1']);

      await expect(validationModule.validateModulesFlow()).resolves.not.toThrow();
    });
  });
});

