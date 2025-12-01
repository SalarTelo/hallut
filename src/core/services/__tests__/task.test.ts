/**
 * Task Service Tests
 * Unit tests for task validation logic
 */

import { describe, it, expect, vi } from 'vitest';
import { validateTask } from '../task.js';
import type { Task, TaskSubmission } from '../../types/task.js';

describe('Task Service', () => {
  describe('validateTask', () => {
    it('should call task.validate with submission', () => {
      const mockSubmission: TaskSubmission = { type: 'text', text: 'test' };
      const mockResult = { solved: true, reason: 'test', details: 'test' };

      const mockTask: Task = {
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: { type: 'text' },
        validate: vi.fn(() => mockResult) as any,
      };

      const result = validateTask(mockTask, mockSubmission);

      expect(mockTask.validate).toHaveBeenCalledWith(mockSubmission);
      expect(result).toEqual(mockResult);
    });

    it('should handle text submission', () => {
      const submission: TaskSubmission = { type: 'text', text: 'Hello world' };
      const task: Task = {
        id: 'text-task',
        name: 'Text Task',
        description: 'Write text',
        submission: { type: 'text' },
        validate: (input) => {
          if (input.type === 'text' && input.text.length >= 10) {
            return { solved: true, reason: 'valid', details: 'Text is long enough' };
          }
          return { solved: false, reason: 'too_short', details: 'Text too short' };
        },
      };

      const result = validateTask(task, submission);

      expect(result.solved).toBe(true);
      expect(result.reason).toBe('valid');
    });

    it('should handle image submission', () => {
      const submission: TaskSubmission = { type: 'image', image: 'test.jpg' };
      const task: Task = {
        id: 'image-task',
        name: 'Image Task',
        description: 'Upload image',
        submission: { type: 'image' },
        validate: (input) => {
          if (input.type === 'image') {
            return { solved: true, reason: 'valid', details: 'Image provided' };
          }
          return { solved: false, reason: 'invalid', details: 'No image' };
        },
      };

      const result = validateTask(task, submission);

      expect(result.solved).toBe(true);
    });

    it('should handle code submission', () => {
      const submission: TaskSubmission = { type: 'code', code: 'function test() {}' };
      const task: Task = {
        id: 'code-task',
        name: 'Code Task',
        description: 'Write code',
        submission: { type: 'code' },
        validate: (input) => {
          if (input.type === 'code' && input.code.length > 0) {
            return { solved: true, reason: 'valid', details: 'Code provided' };
          }
          return { solved: false, reason: 'invalid', details: 'No code' };
        },
      };

      const result = validateTask(task, submission);

      expect(result.solved).toBe(true);
    });

    it('should handle multiple choice submission', () => {
      const submission: TaskSubmission = { type: 'multiple_choice', choice: 'option1' };
      const task: Task = {
        id: 'choice-task',
        name: 'Choice Task',
        description: 'Select option',
        submission: { type: 'multiple_choice' },
        validate: (input) => {
          if (input.type === 'multiple_choice' && input.choice === 'option1') {
            return { solved: true, reason: 'correct', details: 'Correct choice' };
          }
          return { solved: false, reason: 'incorrect', details: 'Wrong choice' };
        },
      };

      const result = validateTask(task, submission);

      expect(result.solved).toBe(true);
    });
  });
});

