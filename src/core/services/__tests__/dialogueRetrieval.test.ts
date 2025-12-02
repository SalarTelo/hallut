/**
 * Dialogue Retrieval Service Tests
 * Unit tests for dialogue retrieval with default dialogue generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDialogue } from '../dialogueRetrieval.js';
import { actions } from '../../state/actions.js';
import type { ModuleData, NPC, Task } from '../../types/module.js';
import type { DialogueConfig } from '../../types/dialogue.js';

// Mock actions
vi.mock('../../state/actions.js', () => ({
  actions: {
    getCurrentTaskId: vi.fn(),
    isTaskCompleted: vi.fn(),
  },
}));

describe('Dialogue Retrieval Service', () => {
  let mockModuleData: ModuleData;
  let mockNPC: NPC;
  let mockTask: Task;
  const moduleId = 'test-module';

  beforeEach(() => {
    vi.clearAllMocks();

    mockTask = {
      id: 'test-task',
      name: 'Test Task',
      description: 'Complete this test task',
      submission: { type: 'text' },
      validate: vi.fn(() => ({ solved: true, reason: 'test', details: 'test' })),
    };

    mockNPC = {
      id: 'guard',
      type: 'npc',
      name: 'Guard',
      position: { x: 50, y: 50 },
      dialogues: {
        'greeting': {
          id: 'guard-greeting',
          speaker: 'Guard',
          lines: ['Hello there!'],
        },
      },
    };

    mockModuleData = {
      id: moduleId,
      config: {
        manifest: {
          id: moduleId,
          name: 'Test Module',
          version: '1.0.0',
        },
        background: {},
        welcome: {
          speaker: 'Narrator',
          lines: ['Welcome'],
        },
        taskOrder: [mockTask],
      },
      interactables: [mockNPC],
      tasks: [mockTask],
      dialogues: {
        'guard-greeting': {
          id: 'guard-greeting',
          speaker: 'Guard',
          lines: ['Hello there!'],
        },
      },
    };
  });

  describe('getDialogue', () => {
    describe('existing dialogues', () => {
      it('should return existing dialogue if found', () => {
        const result = getDialogue('guard-greeting', mockModuleData, moduleId);

        expect(result).toEqual({
          id: 'guard-greeting',
          speaker: 'Guard',
          lines: ['Hello there!'],
        });
      });

      it('should return existing dialogue even if it matches default pattern', () => {
        // Add a custom task-ready dialogue
        mockModuleData.dialogues['guard-task-ready'] = {
          id: 'guard-task-ready',
          speaker: 'Guard',
          lines: ['Custom ready dialogue'],
        };

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).toEqual({
          id: 'guard-task-ready',
          speaker: 'Guard',
          lines: ['Custom ready dialogue'],
        });
        // Should not call getCurrentTaskId since we're using existing dialogue
        expect(actions.getCurrentTaskId).not.toHaveBeenCalled();
      });
    });

    describe('default TASK_READY dialogue', () => {
      it('should generate default task-ready dialogue when not found', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.id).toBe('guard-task-ready');
        expect(result?.speaker).toBe('Guard');
        expect(result?.lines).toContain('Are you ready to submit your task?');
        expect(result?.lines).toContain('Remember: Complete this test task');
        expect(result?.choices).toHaveLength(2);
        expect(result?.choices?.[0]?.text).toBe('Yes, I\'m ready to submit');
        expect(result?.choices?.[1]?.text).toBe('Not yet');
        expect(actions.getCurrentTaskId).toHaveBeenCalledWith(moduleId);
      });

      it('should generate default task-ready dialogue with fallback message when task has no description', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');
        mockTask.description = '';

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.lines).toContain('Take your time if you need to review it.');
      });

      it('should return null if no active task for task-ready dialogue', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue(null);

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).toBeNull();
        expect(actions.getCurrentTaskId).toHaveBeenCalledWith(moduleId);
      });

      it('should return null if active task not found in module tasks', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('non-existent-task');

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).toBeNull();
      });

      it('should handle NPC IDs with hyphens', () => {
        const npcWithHyphen: NPC = {
          id: 'guard-chief',
          type: 'npc',
          name: 'Guard Chief',
          position: { x: 50, y: 50 },
          dialogues: {},
        };
        mockModuleData.interactables.push(npcWithHyphen);
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');

        const result = getDialogue('guard-chief-task-ready', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.speaker).toBe('Guard Chief');
      });
    });

    describe('default TASK_COMPLETE dialogue', () => {
      it('should generate default task-complete dialogue when not found', () => {
        const result = getDialogue('guard-task-complete', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.id).toBe('guard-task-complete');
        expect(result?.speaker).toBe('Guard');
        expect(result?.lines).toEqual([
          'Excellent work!',
          'You have completed all tasks here.',
          'Good luck on your journey!',
        ]);
        expect(result?.choices).toHaveLength(1);
        expect(result?.choices?.[0]?.text).toBe('Thank you!');
        expect(result?.choices?.[0]?.action?.type).toBe('none');
      });

      it('should handle complete alias for task-complete', () => {
        const result = getDialogue('guard-complete', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.id).toBe('guard-complete');
        expect(result?.speaker).toBe('Guard');
        expect(result?.lines).toContain('Excellent work!');
      });

      it('should handle NPC IDs with hyphens for complete dialogue', () => {
        const npcWithHyphen: NPC = {
          id: 'guard-chief',
          type: 'npc',
          name: 'Guard Chief',
          position: { x: 50, y: 50 },
          dialogues: {},
        };
        mockModuleData.interactables.push(npcWithHyphen);

        const result = getDialogue('guard-chief-complete', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.speaker).toBe('Guard Chief');
      });
    });

    describe('edge cases', () => {
      it('should return null for invalid dialogue ID format', () => {
        const result = getDialogue('invalid', mockModuleData, moduleId);

        expect(result).toBeNull();
      });

      it('should return null for dialogue ID with only one part', () => {
        const result = getDialogue('single', mockModuleData, moduleId);

        expect(result).toBeNull();
      });

      it('should return null if NPC not found', () => {
        const result = getDialogue('nonexistent-npc-task-ready', mockModuleData, moduleId);

        expect(result).toBeNull();
      });

      it('should return null for non-task-related dialogue patterns', () => {
        const result = getDialogue('guard-other-dialogue', mockModuleData, moduleId);

        expect(result).toBeNull();
      });

      it('should handle ready alias for task-ready', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');

        const result = getDialogue('guard-ready', mockModuleData, moduleId);

        expect(result).not.toBeNull();
        expect(result?.id).toBe('guard-ready');
        expect(result?.speaker).toBe('Guard');
        expect(result?.lines).toContain('Are you ready to submit your task?');
      });
    });

    describe('call-function action handler', () => {
      it('should create call-function action that opens task submission', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);
        const choice = result?.choices?.[0];

        expect(choice?.action?.type).toBe('call-function');
        if (choice?.action?.type === 'call-function') {
          const mockContext = {
            moduleId: 'test-module',
            locale: 'en',
            setModuleStateField: vi.fn(),
            getModuleStateField: vi.fn(),
            acceptTask: vi.fn(),
            completeTask: vi.fn(),
            isTaskCompleted: vi.fn(),
            getCurrentTask: vi.fn(),
            getCurrentTaskId: vi.fn(),
            openTaskSubmission: vi.fn(),
          };

          choice.action.handler(mockContext);

          expect(mockContext.openTaskSubmission).toHaveBeenCalledWith('test-task');
        }
      });

      it('should handle missing openTaskSubmission gracefully', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue('test-task');

        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);
        const choice = result?.choices?.[0];

        expect(choice?.action?.type).toBe('call-function');
        if (choice?.action?.type === 'call-function') {
          const mockContext = {
            moduleId: 'test-module',
            locale: 'en',
            setModuleStateField: vi.fn(),
            getModuleStateField: vi.fn(),
            acceptTask: vi.fn(),
            completeTask: vi.fn(),
            isTaskCompleted: vi.fn(),
            getCurrentTask: vi.fn(),
            getCurrentTaskId: vi.fn(),
            // openTaskSubmission is undefined
          };

          // Should not throw
          expect(() => choice.action.handler(mockContext)).not.toThrow();
        }
      });

      it('should handle null currentTaskId in handler', () => {
        vi.mocked(actions.getCurrentTaskId).mockReturnValue(null);

        // This should return null before creating the dialogue
        const result = getDialogue('guard-task-ready', mockModuleData, moduleId);

        expect(result).toBeNull();
      });
    });
  });
});

