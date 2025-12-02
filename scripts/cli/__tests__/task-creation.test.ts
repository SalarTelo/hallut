/**
 * Task Creation Tests
 * Comprehensive tests for task creation wizard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import ora from 'ora';
import * as taskCreation from '../task-creation.js';
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

describe('Task Creation', () => {
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

  describe('createTask', () => {
    it('should add task to tasks.ts', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          taskId: 'greeting-task',
          taskName: 'Greeting Task',
          taskDescription: 'Say hello',
          minLength: 10,
          requirement: 'Write at least 10 characters',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const tasks: Array = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await taskCreation.createTask();

      expect(fs.writeFile).toHaveBeenCalled();
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('should handle missing tasks.ts file', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ moduleId: 'test-module' });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(false);

      await taskCreation.createTask();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));

      consoleLogSpy.mockRestore();
    });

    it('should append task to existing tasks array', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          taskId: 'second-task',
          taskName: 'Second Task',
          taskDescription: 'Another task',
          minLength: 20,
          requirement: 'Write at least 20 characters',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue(
        'export const greetingTask = createTask({});\nexport const tasks = [greetingTask];'
      );
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await taskCreation.createTask();

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = (fs.writeFile as any).mock.calls[0];
      expect(writeCall[1]).toContain('second-taskTask');
    });

    it('should handle empty tasks array', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          taskId: 'first-task',
          taskName: 'First Task',
          taskDescription: 'First task',
          minLength: 10,
          requirement: 'Write at least 10 characters',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const tasks = [];');
      vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await taskCreation.createTask();

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = (fs.writeFile as any).mock.calls[0];
      expect(writeCall[1]).toContain('export const tasks = [first-taskTask]');
    });

    it('should handle no modules found', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue([]);

      await taskCreation.createTask();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No modules found'));

      consoleLogSpy.mockRestore();
    });

    it('should handle cancellation', async () => {
      const prompts = await import('prompts');
      (prompts.default as any).mockResolvedValueOnce({ moduleId: undefined });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);

      await taskCreation.createTask();

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          taskId: 'test-task',
          taskName: 'Test Task',
          taskDescription: 'Test',
          minLength: 10,
          requirement: 'Test',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('File read error'));

      await expect(taskCreation.createTask()).rejects.toThrow();

      expect(mockSpinner.fail).toHaveBeenCalled();
    });

    it('should generate correct task code structure', async () => {
      const prompts = await import('prompts');
      (prompts.default as any)
        .mockResolvedValueOnce({ moduleId: 'test-module' })
        .mockResolvedValueOnce({
          taskId: 'test-task',
          taskName: 'Test Task',
          taskDescription: 'A test task',
          minLength: 15,
          requirement: 'Write 15 characters',
        });

      vi.spyOn(utilsModule, 'getExistingModules').mockResolvedValue(['test-module']);
      vi.spyOn(utilsModule, 'fileExists').mockResolvedValue(true);
      vi.spyOn(fs, 'readFile').mockResolvedValue('export const tasks: Array = [];');
      const writeFileSpy = vi.spyOn(fs, 'writeFile').mockResolvedValue();

      await taskCreation.createTask();

      expect(writeFileSpy).toHaveBeenCalled();
      const writtenContent = (writeFileSpy as any).mock.calls[0][1];
      expect(writtenContent).toContain('test-taskTask');
      expect(writtenContent).toContain('id: \'test-task\'');
      expect(writtenContent).toContain('textLengthValidator(15');
    });
  });
});

