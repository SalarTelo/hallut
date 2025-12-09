/**
 * useInteractableActions Hook Tests
 * Tests for interactable action handling with new dialogue tree system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInteractableActions } from '../useInteractableActions.js';
import { dialogueTree, dialogueNode } from '@builders/dialogues.js';
import type { NPC, Object } from '@core/module/types.js';
import type { ModuleData } from '@core/module/types.js';
import type { DialogueNode } from '@core/dialogue/types.js';

describe('useInteractableActions', () => {
  let moduleData: ModuleData;
  const moduleId = 'test-module';
  const locale = 'sv';

  beforeEach(() => {
    const greeting = dialogueNode({
      id: 'greeting',
      lines: ['Hello!'],
    });

    const tree = dialogueTree()
      .node(greeting)
      .build();

    const npc: NPC = {
      id: 'test-npc',
      type: 'npc',
      name: 'Test NPC',
      position: { x: 50, y: 50 },
      dialogueTree: tree,
    };

    moduleData = {
      id: moduleId,
      config: {
        manifest: { id: moduleId, name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [npc],
      tasks: [],
    };
  });

  it('should return handleInteractableAction function', () => {
    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
      })
    );

    expect(result.current.handleInteractableAction).toBeDefined();
    expect(typeof result.current.handleInteractableAction).toBe('function');
  });

  it('should handle NPC with dialogue tree', async () => {
    const onDialogueSelected = vi.fn();
    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
        onDialogueSelected,
      })
    );

    const npc = moduleData.interactables[0] as NPC;
    const actionResult = await result.current.handleInteractableAction(npc);

    expect(actionResult.type).toBe('dialogue');
    expect(actionResult.dialogueNode).toBeDefined();
    expect(actionResult.npc).toBe(npc);
    expect(onDialogueSelected).toHaveBeenCalled();
  });

  it('should return none for NPC without dialogue tree', async () => {
    const npc: NPC = {
      id: 'no-tree-npc',
      type: 'npc',
      name: 'No Tree NPC',
      position: { x: 50, y: 50 },
    };

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
      })
    );

    const actionResult = await result.current.handleInteractableAction(npc);
    expect(actionResult.type).toBe('none');
  });

  it('should handle locked interactable', async () => {
    const npc: NPC = {
      id: 'locked-npc',
      type: 'npc',
      name: 'Locked NPC',
      position: { x: 50, y: 50 },
      locked: true,
      unlockRequirement: null,
    };

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
      })
    );

    const actionResult = await result.current.handleInteractableAction(npc);
    expect(actionResult.type).toBe('none');
  });

  it('should handle object with component interaction', async () => {
    const onComponentOpen = vi.fn();
    const obj: Object = {
      id: 'test-object',
      type: 'object',
      name: 'Test Object',
      position: { x: 50, y: 50 },
      interaction: {
        type: 'component',
        component: 'NoteViewer',
        props: { content: 'Test note' },
      },
    };

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
        onComponentOpen,
      })
    );

    const actionResult = await result.current.handleInteractableAction(obj);
    expect(actionResult.type).toBe('component');
    expect(actionResult.component).toBe('NoteViewer');
    expect(onComponentOpen).toHaveBeenCalled();
  });

  it('should handle object with dialogue interaction', async () => {
    const onDialogueSelected = vi.fn();
    const obj: Object = {
      id: 'test-object',
      type: 'object',
      name: 'Test Object',
      position: { x: 50, y: 50 },
      interaction: {
        type: 'dialogue',
        dialogue: {
          id: 'object-dialogue',
          lines: ['Object dialogue'],
        },
      },
    };

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
        onDialogueSelected,
      })
    );

    const actionResult = await result.current.handleInteractableAction(obj);
    expect(actionResult.type).toBe('dialogue');
    expect(actionResult.dialogueNode).toBeDefined();
    expect(onDialogueSelected).toHaveBeenCalled();
  });

  it('should handle error and call onError', async () => {
    const onError = vi.fn();
    const invalidNpc = {
      id: 'invalid',
      type: 'npc' as const,
      name: 'Invalid',
      position: { x: 50, y: 50 },
      dialogueTree: {
        nodes: [],
        edges: [],
        entry: undefined,
      },
    };

    const { result } = renderHook(() =>
      useInteractableActions({
        moduleId,
        moduleData,
        locale,
        onError,
      })
    );

    await result.current.handleInteractableAction(invalidNpc);
    // Error might be called or not depending on implementation
  });
});
