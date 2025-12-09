/**
 * Task Builder Tests
 * Unit tests for task builder utilities
 */

import { describe, it, expect } from 'vitest';
import {
  createTask,
  textSubmission,
  imageSubmission,
  codeSubmission,
  multipleChoiceSubmission,
  customSubmission,
  success,
  failure,
  getTextFromSubmission,
  textLengthValidator,
  wordCountValidator,
  keywordsValidator,
  combineValidators,
} from '../tasks.js';
import type { TaskSubmission } from '@core/task/types.js';

describe('Task Builders', () => {
  describe('Submission Config Builders', () => {
    it('should create text submission config', () => {
      const config = textSubmission();
      expect(config.type).toBe('text');
    });

    it('should create image submission config', () => {
      const config = imageSubmission();
      expect(config.type).toBe('image');
    });

    it('should create code submission config', () => {
      const config = codeSubmission('javascript');
      expect(config.type).toBe('code');
      expect(config.config?.language).toBe('javascript');
    });

    it('should create multiple choice submission config', () => {
      const config = multipleChoiceSubmission(['option1', 'option2']);
      expect(config.type).toBe('multiple_choice');
      expect(config.config?.options).toEqual(['option1', 'option2']);
    });

    it('should create custom submission config', () => {
      const config = customSubmission('MyComponent');
      expect(config.type).toBe('custom');
      expect(config.component).toBe('MyComponent');
    });
  });

  describe('Solve Result Builders', () => {
    it('should create success result', () => {
      const result = success('test', 'details', 100);
      expect(result.solved).toBe(true);
      expect(result.reason).toBe('test');
      expect(result.details).toBe('details');
      expect(result.score).toBe(100);
    });

    it('should create failure result', () => {
      const result = failure('test', 'details');
      expect(result.solved).toBe(false);
      expect(result.reason).toBe('test');
      expect(result.details).toBe('details');
    });
  });

  describe('Validation Helpers', () => {
    it('should extract text from text submission', () => {
      const submission: TaskSubmission = { type: 'text', text: 'hello' };
      const text = getTextFromSubmission(submission);
      expect(text).toBe('hello');
    });

    it('should return null for non-text submission', () => {
      const submission: TaskSubmission = { type: 'image', image: 'test.jpg' };
      const text = getTextFromSubmission(submission);
      expect(text).toBeNull();
    });

    it('should trim text from submission', () => {
      const submission: TaskSubmission = { type: 'text', text: '  hello  ' };
      const text = getTextFromSubmission(submission);
      expect(text).toBe('hello');
    });
  });

  describe('Validators', () => {
    it('should validate text length', () => {
      const validator = textLengthValidator(10, (text) => success('valid', 'Good', 100));
      const submission: TaskSubmission = { type: 'text', text: 'hello world' };

      const result = validator(submission);
      expect(result.solved).toBe(true);
    });

    it('should fail if text too short', () => {
      const validator = textLengthValidator(10, (text) => success('valid', 'Good', 100));
      const submission: TaskSubmission = { type: 'text', text: 'hi' };

      const result = validator(submission);
      expect(result.solved).toBe(false);
      expect(result.reason).toBe('too_short');
    });

    it('should validate word count', () => {
      const validator = wordCountValidator(5, (text, count) => success('valid', `Words: ${count}`, 100));
      const submission: TaskSubmission = { type: 'text', text: 'one two three four five' };

      const result = validator(submission);
      expect(result.solved).toBe(true);
    });

    it('should fail if word count too low', () => {
      const validator = wordCountValidator(5, (text, count) => success('valid', 'Good', 100));
      const submission: TaskSubmission = { type: 'text', text: 'one two' };

      const result = validator(submission);
      expect(result.solved).toBe(false);
    });

    it('should validate keywords', () => {
      const validator = keywordsValidator(
        ['hello', 'world'],
        (text, found) => success('valid', 'Found keywords', 100)
      );
      const submission: TaskSubmission = { type: 'text', text: 'hello there world' };

      const result = validator(submission);
      expect(result.solved).toBe(true);
    });

    it('should fail if keywords missing', () => {
      const validator = keywordsValidator(
        ['hello', 'world'],
        (text, found) => success('valid', 'Found keywords', 100)
      );
      const submission: TaskSubmission = { type: 'text', text: 'hello there' };

      const result = validator(submission);
      expect(result.solved).toBe(false);
      expect(result.reason).toBe('missing_keywords');
    });

    it('should combine validators', () => {
      const validator1 = textLengthValidator(5, (text) => success('valid1', 'Good', 100));
      const validator2 = keywordsValidator(
        ['test'],
        (text, found) => success('valid2', 'Found keyword', 100)
      );
      const combined = combineValidators([validator1, validator2]);

      const submission: TaskSubmission = { type: 'text', text: 'this is a test' };
      const result = combined(submission);
      expect(result.solved).toBe(true);
    });

    it('should stop at first failing validator', () => {
      const validator1 = textLengthValidator(100, (text) => success('valid1', 'Good', 100));
      const validator2 = keywordsValidator(
        ['test'],
        (text, found) => success('valid2', 'Found keyword', 100)
      );
      const combined = combineValidators([validator1, validator2]);

      const submission: TaskSubmission = { type: 'text', text: 'short' };
      const result = combined(submission);
      expect(result.solved).toBe(false);
      expect(result.reason).toBe('too_short');
    });
  });

  describe('createTask', () => {
    it('should create a task with all required fields', () => {
      const task = createTask({
        id: 'test-task',
        name: 'Test Task',
        description: 'Test description',
        submission: textSubmission(),
        validate: (input) => success('valid', 'Good', 100),
      });

      expect(task.id).toBe('test-task');
      expect(task.name).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.submission.type).toBe('text');
    });

    it('should include overview if provided', () => {
      const task = createTask({
        id: 'test-task',
        name: 'Test Task',
        description: 'Test',
        submission: textSubmission(),
        validate: (input) => success('valid', 'Good', 100),
        overview: {
          requirements: 'Write 10 words',
          goals: ['Goal 1', 'Goal 2'],
        },
      });

      expect(task.overview?.requirements).toBe('Write 10 words');
      expect(task.overview?.goals).toEqual(['Goal 1', 'Goal 2']);
    });
  });
});

