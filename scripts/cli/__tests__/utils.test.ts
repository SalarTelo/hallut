/**
 * CLI Utils Tests
 * Comprehensive tests for utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MODULES_DIR,
  toDisplayName,
  validateModuleId,
  validateTaskId,
  getExistingModules,
  fileExists,
  ensureDirectory,
} from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('CLI Utils', () => {
  describe('MODULES_DIR', () => {
    it('should be correctly defined', () => {
      expect(MODULES_DIR).toBeDefined();
      expect(typeof MODULES_DIR).toBe('string');
      expect(MODULES_DIR).toContain('modules');
    });

    it('should resolve to correct path', () => {
      // utils.ts is in scripts/cli/, so MODULES_DIR should be ../modules from project root
      const expectedPath = path.join(__dirname, '../../../modules');
      expect(MODULES_DIR).toBe(expectedPath);
    });
  });

  describe('toDisplayName', () => {
    it('should convert kebab-case to Title Case', () => {
      expect(toDisplayName('my-module')).toBe('My Module');
      expect(toDisplayName('hello-world')).toBe('Hello World');
      expect(toDisplayName('test-module-name')).toBe('Test Module Name');
    });

    it('should handle single word', () => {
      expect(toDisplayName('module')).toBe('Module');
      expect(toDisplayName('test')).toBe('Test');
    });

    it('should handle empty string', () => {
      expect(toDisplayName('')).toBe('');
    });

    it('should handle multiple hyphens', () => {
      expect(toDisplayName('my-super-long-module-name')).toBe('My Super Long Module Name');
      expect(toDisplayName('a-b-c-d-e')).toBe('A B C D E');
    });

    it('should handle numbers', () => {
      expect(toDisplayName('module-123')).toBe('Module 123');
      expect(toDisplayName('test-42-module')).toBe('Test 42 Module');
    });

    it('should handle uppercase input', () => {
      expect(toDisplayName('MY-MODULE')).toBe('My Module');
    });

    it('should handle mixed case', () => {
      expect(toDisplayName('My-Module')).toBe('My Module');
      expect(toDisplayName('test-Module-Name')).toBe('Test Module Name');
    });
  });

  describe('validateModuleId', () => {
    it('should accept valid module IDs', () => {
      expect(validateModuleId('my-module')).toBe(true);
      expect(validateModuleId('test-123')).toBe(true);
      expect(validateModuleId('a')).toBe(true);
      expect(validateModuleId('module-1-2-3')).toBe(true);
    });

    it('should reject empty string', () => {
      const result = validateModuleId('');
      expect(result).toBe('Module ID is required');
    });

    it('should reject uppercase letters', () => {
      const result = validateModuleId('My-Module');
      expect(typeof result).toBe('string');
      expect(result).toContain('lowercase');
    });

    it('should reject spaces', () => {
      const result = validateModuleId('my module');
      expect(typeof result).toBe('string');
    });

    it('should reject special characters', () => {
      const result1 = validateModuleId('my_module');
      expect(typeof result1).toBe('string');

      const result2 = validateModuleId('my.module');
      expect(typeof result2).toBe('string');

      const result3 = validateModuleId('my@module');
      expect(typeof result3).toBe('string');
    });

    it('should reject starting with hyphen', () => {
      const result = validateModuleId('-my-module');
      expect(typeof result).toBe('string');
    });

    it('should reject ending with hyphen', () => {
      const result = validateModuleId('my-module-');
      expect(typeof result).toBe('string');
    });

    it('should reject consecutive hyphens', () => {
      const result = validateModuleId('my--module');
      expect(typeof result).toBe('string');
    });

    it('should provide helpful error message', () => {
      const result = validateModuleId('Invalid');
      expect(result).toContain('lowercase');
      expect(result).toContain('alphanumeric');
      expect(result).toContain('hyphens');
    });
  });

  describe('validateTaskId', () => {
    it('should accept valid task IDs', () => {
      expect(validateTaskId('my-task')).toBe(true);
      expect(validateTaskId('task-123')).toBe(true);
      expect(validateTaskId('a')).toBe(true);
    });

    it('should reject empty string', () => {
      const result = validateTaskId('');
      expect(result).toBe('Task ID is required');
    });

    it('should reject uppercase letters', () => {
      const result = validateTaskId('My-Task');
      expect(typeof result).toBe('string');
    });

    it('should reject special characters', () => {
      const result = validateTaskId('my_task');
      expect(typeof result).toBe('string');
    });

    it('should provide helpful error message', () => {
      const result = validateTaskId('Invalid');
      expect(result).toContain('lowercase');
    });
  });

  describe('getExistingModules', () => {
    let originalReaddir: typeof fs.readdir;

    beforeEach(() => {
      originalReaddir = fs.readdir;
    });

    afterEach(() => {
      fs.readdir = originalReaddir;
    });

    it('should return array of module directories', async () => {
      const mockModules = [
        { name: 'module1', isDirectory: () => true },
        { name: 'module2', isDirectory: () => true },
        { name: 'file.txt', isDirectory: () => false },
        { name: 'module3', isDirectory: () => true },
      ];

      vi.spyOn(fs, 'readdir').mockResolvedValue(mockModules as any);

      const result = await getExistingModules();

      expect(result).toEqual(['module1', 'module2', 'module3']);
      expect(result.length).toBe(3);
    });

    it('should return sorted array', async () => {
      const mockModules = [
        { name: 'zebra', isDirectory: () => true },
        { name: 'alpha', isDirectory: () => true },
        { name: 'beta', isDirectory: () => true },
      ];

      vi.spyOn(fs, 'readdir').mockResolvedValue(mockModules as any);

      const result = await getExistingModules();

      expect(result).toEqual(['alpha', 'beta', 'zebra']);
    });

    it('should filter out files', async () => {
      const mockModules = [
        { name: 'module1', isDirectory: () => true },
        { name: 'index.ts', isDirectory: () => false },
        { name: 'package.json', isDirectory: () => false },
        { name: 'module2', isDirectory: () => true },
      ];

      vi.spyOn(fs, 'readdir').mockResolvedValue(mockModules as any);

      const result = await getExistingModules();

      expect(result).toEqual(['module1', 'module2']);
      expect(result).not.toContain('index.ts');
      expect(result).not.toContain('package.json');
    });

    it('should return empty array when no modules exist', async () => {
      vi.spyOn(fs, 'readdir').mockResolvedValue([]);

      const result = await getExistingModules();

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      vi.spyOn(fs, 'readdir').mockRejectedValue(new Error('File system error'));

      const result = await getExistingModules();

      expect(result).toEqual([]);
    });

    it('should handle readdir errors gracefully', async () => {
      vi.spyOn(fs, 'readdir').mockRejectedValue(new Error('ENOENT'));

      const result = await getExistingModules();

      expect(result).toEqual([]);
    });
  });

  describe('fileExists', () => {
    let originalAccess: typeof fs.access;

    beforeEach(() => {
      originalAccess = fs.access;
    });

    afterEach(() => {
      fs.access = originalAccess;
    });

    it('should return true when file exists', async () => {
      vi.spyOn(fs, 'access').mockResolvedValue(undefined);

      const result = await fileExists('/path/to/file.ts');

      expect(result).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      vi.spyOn(fs, 'access').mockRejectedValue(new Error('ENOENT'));

      const result = await fileExists('/path/to/nonexistent.ts');

      expect(result).toBe(false);
    });

    it('should return false on permission error', async () => {
      vi.spyOn(fs, 'access').mockRejectedValue(new Error('EACCES'));

      const result = await fileExists('/path/to/file.ts');

      expect(result).toBe(false);
    });

    it('should handle any error as false', async () => {
      vi.spyOn(fs, 'access').mockRejectedValue(new Error('Unknown error'));

      const result = await fileExists('/path/to/file.ts');

      expect(result).toBe(false);
    });

    it('should work with different file paths', async () => {
      vi.spyOn(fs, 'access').mockResolvedValue(undefined);

      await expect(fileExists('/absolute/path')).resolves.toBe(true);
      await expect(fileExists('./relative/path')).resolves.toBe(true);
      await expect(fileExists('../parent/path')).resolves.toBe(true);
    });
  });

  describe('ensureDirectory', () => {
    let originalMkdir: typeof fs.mkdir;

    beforeEach(() => {
      originalMkdir = fs.mkdir;
    });

    afterEach(() => {
      fs.mkdir = originalMkdir;
    });

    it('should create directory', async () => {
      const mkdirSpy = vi.spyOn(fs, 'mkdir').mockResolvedValue(undefined);

      await ensureDirectory('/path/to/dir');

      expect(mkdirSpy).toHaveBeenCalledWith('/path/to/dir', { recursive: true });
    });

    it('should use recursive option', async () => {
      const mkdirSpy = vi.spyOn(fs, 'mkdir').mockResolvedValue(undefined);

      await ensureDirectory('/path/to/nested/dir');

      expect(mkdirSpy).toHaveBeenCalledWith(
        '/path/to/nested/dir',
        { recursive: true }
      );
    });

    it('should handle existing directories', async () => {
      vi.spyOn(fs, 'mkdir').mockResolvedValue(undefined);

      await expect(ensureDirectory('/existing/dir')).resolves.not.toThrow();
    });

    it('should handle errors', async () => {
      vi.spyOn(fs, 'mkdir').mockRejectedValue(new Error('Permission denied'));

      await expect(ensureDirectory('/protected/dir')).rejects.toThrow();
    });

    it('should work with nested paths', async () => {
      const mkdirSpy = vi.spyOn(fs, 'mkdir').mockResolvedValue(undefined);

      await ensureDirectory('/a/b/c/d/e');

      expect(mkdirSpy).toHaveBeenCalled();
    });
  });
});

