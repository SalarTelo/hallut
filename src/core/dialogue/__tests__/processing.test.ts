/**
 * Dialogue Service Tests
 * Unit tests for dialogue action processing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processDialogueAction, processDialogueActions } from '../processing.js';
import type { ChoiceAction } from '../types.js';
import type { ModuleContext, Task } from '../../module/types/index.js';

describe('Dialogue Service', () => {
  let mockContext: ModuleContext;
  let mockTask: Task;

  beforeEach(() => {
    mockTask = {
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: { type: 'text' },
      validate: vi.fn(() => ({ solved: true, reason: 'test', details: 'test' })),
    };

    mockContext = {
      moduleId: 'test-module',
      locale: 'en',
      setModuleStateField: vi.fn(),
      getModuleStateField: vi.fn(),
      acceptTask: vi.fn(),
      completeTask: vi.fn(),
      isTaskCompleted: vi.fn(() => false),
      getCurrentTask: vi.fn(() => null),
      getCurrentTaskId: vi.fn(() => null),
    };
  });

  describe('processDialogueAction', () => {
    it('should handle accept-task action', async () => {
      const action: ChoiceAction = {
        type: 'accept-task',
        task: mockTask,
      };

      await processDialogueAction(action, mockContext);

      expect(mockContext.acceptTask).toHaveBeenCalledWith(mockTask);
    });

    it('should handle set-state action', async () => {
      const action: ChoiceAction = {
        type: 'set-state',
        key: 'testKey',
        value: 'testValue',
      };

      await processDialogueAction(action, mockContext);

      expect(mockContext.setModuleStateField).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should handle call-function action', async () => {
      const mockHandler = vi.fn();
      const action: ChoiceAction = {
        type: 'call-function',
        handler: mockHandler,
      };

      await processDialogueAction(action, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(mockContext);
    });

    it('should handle async call-function action', async () => {
      const mockHandler = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const action: ChoiceAction = {
        type: 'call-function',
        handler: mockHandler,
      };

      await processDialogueAction(action, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(mockContext);
    });

    it('should handle go-to action (no-op)', async () => {
      const action: ChoiceAction = {
        type: 'go-to',
        dialogue: null,
      };

      // Should not throw
      await expect(processDialogueAction(action, mockContext)).resolves.toBeUndefined();
    });

    it('should handle none action (no-op)', async () => {
      const action: ChoiceAction = {
        type: 'none',
      };

      // Should not throw
      await expect(processDialogueAction(action, mockContext)).resolves.toBeUndefined();
    });
  });

  describe('processDialogueActions', () => {
    it('should process single action', async () => {
      const action: ChoiceAction = {
        type: 'set-state',
        key: 'test',
        value: 'value',
      };

      await processDialogueActions(action, mockContext);

      expect(mockContext.setModuleStateField).toHaveBeenCalledOnce();
    });

    it('should process array of actions in order', async () => {
      const actions: ChoiceAction[] = [
        { type: 'set-state', key: 'first', value: '1' },
        { type: 'set-state', key: 'second', value: '2' },
        { type: 'accept-task', task: mockTask },
      ];

      await processDialogueActions(actions, mockContext);

      expect(mockContext.setModuleStateField).toHaveBeenCalledTimes(2);
      expect(mockContext.setModuleStateField).toHaveBeenNthCalledWith(1, 'first', '1');
      expect(mockContext.setModuleStateField).toHaveBeenNthCalledWith(2, 'second', '2');
      expect(mockContext.acceptTask).toHaveBeenCalledWith(mockTask);
    });

    it('should handle async actions in sequence', async () => {
      const callOrder: string[] = [];
      const action1: ChoiceAction = {
        type: 'call-function',
        handler: async () => {
          callOrder.push('first');
          await new Promise(resolve => setTimeout(resolve, 10));
        },
      };
      const action2: ChoiceAction = {
        type: 'call-function',
        handler: async () => {
          callOrder.push('second');
        },
      };

      await processDialogueActions([action1, action2], mockContext);

      expect(callOrder).toEqual(['first', 'second']);
    });
  });
});

