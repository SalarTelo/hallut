/**
 * Dialogue Builder Tests
 * Unit tests for dialogue and choice builders
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createDialogue,
  choice,
  simpleChoice,
} from '../dialogues.js';
import type { Task } from '@core/types/task.js';

describe('Dialogue Builders', () => {
  const mockTask: Task = {
    id: 'test-task',
    name: 'Test Task',
    description: 'Test',
    submission: { type: 'text' },
    validate: vi.fn(),
  };

  describe('createDialogue', () => {
    it('should create a dialogue with required fields', () => {
      const dialogue = createDialogue({
        id: 'test-dialogue',
        speaker: 'Test Speaker',
        lines: ['Line 1', 'Line 2'],
      });

      expect(dialogue.id).toBe('test-dialogue');
      expect(dialogue.speaker).toBe('Test Speaker');
      expect(dialogue.lines).toEqual(['Line 1', 'Line 2']);
    });

    it('should include choices if provided', () => {
      const dialogue = createDialogue({
        id: 'test-dialogue',
        speaker: 'Test Speaker',
        lines: ['Line 1'],
        choices: [
          { text: 'Choice 1', action: null },
          { text: 'Choice 2', action: null },
        ],
      });

      expect(dialogue.choices).toHaveLength(2);
    });
  });

  describe('choice builder', () => {
    it('should create a choice with no action', () => {
      const choiceObj = choice('Test Choice').build();

      expect(choiceObj.text).toBe('Test Choice');
      expect(choiceObj.action).toBeNull();
    });

    it('should create a choice with accept-task action', () => {
      const choiceObj = choice('Accept Task')
        .acceptTask(mockTask)
        .build();

      expect(choiceObj.text).toBe('Accept Task');
      expect(choiceObj.action).toEqual({
        type: 'accept-task',
        task: mockTask,
      });
    });

    it('should create a choice with set-state action', () => {
      const choiceObj = choice('Set State')
        .setState('key', 'value')
        .build();

      expect(choiceObj.text).toBe('Set State');
      expect(choiceObj.action).toEqual({
        type: 'set-state',
        key: 'key',
        value: 'value',
      });
    });

    it('should create a choice with call-function action', () => {
      const handler = vi.fn();
      const choiceObj = choice('Call Function')
        .callFunction(handler)
        .build();

      expect(choiceObj.text).toBe('Call Function');
      expect(choiceObj.action).toEqual({
        type: 'call-function',
        handler,
      });
    });

    it('should create a choice with go-to action', () => {
      const targetDialogue = createDialogue({
        id: 'target',
        speaker: 'Speaker',
        lines: ['Line'],
      });

      const choiceObj = choice('Go To')
        .goTo(targetDialogue)
        .build();

      expect(choiceObj.text).toBe('Go To');
      expect(choiceObj.action).toEqual({
        type: 'go-to',
        dialogue: targetDialogue,
      });
    });

    it('should chain multiple actions', () => {
      const choiceObj = choice('Multiple Actions')
        .setState('key1', 'value1')
        .setState('key2', 'value2')
        .acceptTask(mockTask)
        .build();

      expect(choiceObj.text).toBe('Multiple Actions');
      expect(Array.isArray(choiceObj.action)).toBe(true);
      if (Array.isArray(choiceObj.action)) {
        expect(choiceObj.action).toHaveLength(3);
        expect(choiceObj.action[0]).toEqual({ type: 'set-state', key: 'key1', value: 'value1' });
        expect(choiceObj.action[1]).toEqual({ type: 'set-state', key: 'key2', value: 'value2' });
        expect(choiceObj.action[2]).toEqual({ type: 'accept-task', task: mockTask });
      }
    });
  });

  describe('simpleChoice', () => {
    it('should create a simple choice with no action', () => {
      const choiceObj = simpleChoice('Simple Choice');

      expect(choiceObj.text).toBe('Simple Choice');
      expect(choiceObj.action).toBeNull();
    });
  });
});

