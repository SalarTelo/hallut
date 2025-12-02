/**
 * Object Creation Tests
 * Comprehensive tests for object creation wizard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import ora from 'ora';
import * as objectCreation from '../object-creation.js';
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

describe('Object Creation', () => {
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

  describe('createObject', () => {
    it('should create note viewer object', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'sign',
          objectName: 'Sign',
          x: 50,
          y: 50,
          interactionType: 'note',
        })
        .mockResolvedValueOnce({
          content: 'Welcome!',
          title: 'Welcome Sign',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const objects: Array = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await objectCreation.createObject();

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = (fs.writeFile as any).mock.calls[0][1];
      expect(writtenContent).toContain('showNoteViewer');
    });

    it('should create image viewer object', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'image',
          objectName: 'Image',
          x: 40,
          y: 60,
          interactionType: 'image',
        })
        .mockResolvedValueOnce({
          imageUrl: '/images/test.jpg',
          title: 'Test Image',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const objects: Array = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await objectCreation.createObject();

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = (fs.writeFile as any).mock.calls[0][1];
      expect(writtenContent).toContain('createImageObject');
    });

    it('should create custom component object', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'custom',
          objectName: 'Custom Object',
          x: 30,
          y: 70,
          interactionType: 'custom',
        })
        .mockResolvedValueOnce({
          componentName: 'MyComponent',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const objects: Array = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await objectCreation.createObject();

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = (fs.writeFile as any).mock.calls[0][1];
      expect(writtenContent).toContain("type: 'component'");
      expect(writtenContent).toContain("component: 'MyComponent'");
    });

    it('should handle missing objects.ts file', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ moduleId: 'test-module' });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(false);

      await objectCreation.createObject();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));

      consoleLogSpy.mockRestore();
    });

    it('should append object to existing objects array', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'second-sign',
          objectName: 'Second Sign',
          x: 60,
          y: 80,
          interactionType: 'note',
        })
        .mockResolvedValueOnce({
          content: 'Another sign',
          title: undefined,
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue(
        'export const signObject = createObject({});\nexport const objects = [signObject];'
      );
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await objectCreation.createObject();

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle empty objects array', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'first-object',
          objectName: 'First Object',
          x: 50,
          y: 50,
          interactionType: 'note',
        })
        .mockResolvedValueOnce({
          content: 'Content',
          title: undefined,
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const objects = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await objectCreation.createObject();

      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue([]);

      await objectCreation.createObject();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No modules found'));

      consoleLogSpy.mockRestore();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ moduleId: undefined });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await objectCreation.createObject();

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          objectId: 'test-object',
          objectName: 'Test Object',
          x: 50,
          y: 50,
          interactionType: 'note',
        })
        .mockResolvedValueOnce({
          content: 'Test',
          title: undefined,
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('File read error'));

      await expect(objectCreation.createObject()).rejects.toThrow();

      expect(mockSpinner.fail).toHaveBeenCalled();
    });
  });
});

