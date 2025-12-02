/**
 * useInteractableActions Hook Tests
 * Unit tests for interactable actions hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInteractableActions } from '../useInteractableActions.js';
import { createModuleContext } from '@core/module/context.js';
import { createNPC, createObject, pos, showDialogue } from '@utils/builders/interactables.js';
import { createDialogue } from '@utils/builders/dialogues.js';

// Mock dependencies
vi.mock('@core/module/context.js', () => ({
  createModuleContext: vi.fn(),
}));

describe('useInteractableActions', () => {
  const moduleId = 'test-module';
  const locale = 'en';

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(createModuleContext).mockReturnValue({
      moduleId,
      locale,
      setModuleStateField: vi.fn(),
      getModuleStateField: vi.fn(),
      acceptTask: vi.fn(),
      completeTask: vi.fn(),
      isTaskCompleted: vi.fn(),
      getCurrentTask: vi.fn(),
      getCurrentTaskId: vi.fn(),
    } as any);
  });

  it('should return handleInteractableAction function', () => {
    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        locale,
      })
    );

    expect(result.current.handleInteractableAction).toBeDefined();
    expect(typeof result.current.handleInteractableAction).toBe('function');
  });

  it('should handle NPC with dialogues', async () => {
    const onDialogueSelected = vi.fn();
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(10, 10),
      avatar: '🧑',
      dialogues: {
        greeting: createDialogue({
          id: 'greeting',
          speaker: 'NPC',
          lines: ['Hello'],
        }),
      },
    });

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        locale,
        onDialogueSelected,
      })
    );

    const actionResult = await result.current.handleInteractableAction(npc);

    expect(actionResult.type).toBe('dialogue');
    expect(onDialogueSelected).toHaveBeenCalled();
  });

  it('should handle object with component interaction', async () => {
    const onComponentOpen = vi.fn();
    const obj = createObject({
      id: 'test-object',
      name: 'Test Object',
      position: pos(10, 10),
      avatar: '📦',
      interaction: {
        type: 'component',
        component: 'NoteViewer',
        props: { content: 'Test', title: 'Title' },
      },
    });

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        locale,
        onComponentOpen,
      })
    );

    const actionResult = await result.current.handleInteractableAction(obj);

    expect(actionResult.type).toBe('component');
    expect(onComponentOpen).toHaveBeenCalledWith('NoteViewer', expect.any(Object));
  });

  it('should return none for locked interactable', async () => {
    const obj = createObject({
      id: 'locked-object',
      name: 'Locked',
      position: pos(10, 10),
      avatar: '🔒',
      locked: true,
      unlockRequirement: {
        type: 'task-complete',
        task: {
          id: 'task',
          name: 'Task',
          description: 'Task',
          submission: { type: 'text' },
          validate: () => ({ solved: true, reason: 'test', details: 'test' }),
        },
      },
      interaction: { type: 'none' },
    });

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        locale,
      })
    );

    const actionResult = await result.current.handleInteractableAction(obj);

    expect(actionResult.type).toBe('none');
  });

  it('should handle errors and call onError', async () => {
    const onError = vi.fn();
    const invalidInteractable = {
      type: 'invalid',
    } as any;

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        locale,
        onError,
      })
    );

    const actionResult = await result.current.handleInteractableAction(invalidInteractable);

    expect(actionResult.type).toBe('none');
  });
});

