/**
 * Interactable Builders Tests
 * Tests for NPC, Object, and Location builders with new dialogue tree system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createNPC,
  createObject,
  createLocation,
  pos,
} from '../interactables.js';
import { dialogueTree, dialogueNode } from '../dialogues.js';
import { createTask, textSubmission, textLengthValidator, success } from '../tasks.js';
import type { NPC, Object, Location } from '@core/module/types.js';
import type { DialogueTree } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';

describe('createNPC', () => {
  let testTask: Task;
  let testDialogueTree: DialogueTree;

  beforeEach(() => {
    testTask = createTask({
      id: 'test-task',
      name: 'Test Task',
      description: 'Test',
      submission: textSubmission(),
      validate: textLengthValidator(5, () => success('done', 'done')),
    });

    testDialogueTree = dialogueTree()
      .node(dialogueNode({
        id: 'greeting',
        lines: ['Hello!'],
      }))
      .build();
  });

  it('should create NPC with basic properties', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
    });

    expect(npc.id).toBe('test-npc');
    expect(npc.name).toBe('Test NPC');
    expect(npc.type).toBe('npc');
    expect(npc.position).toEqual({ x: 50, y: 50 });
    expect(npc.locked).toBe(false);
  });

  it('should create NPC with dialogue tree', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
      dialogueTree: testDialogueTree,
    });

    expect(npc.dialogueTree).toBe(testDialogueTree);
  });

  it('should create NPC with tasks array', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
      tasks: [testTask],
    });

    expect(npc.tasks).toEqual([testTask]);
    expect(Array.isArray(npc.tasks)).toBe(true);
  });

  it('should create NPC with multiple tasks', () => {
    const task2 = createTask({
      id: 'task-2',
      name: 'Task 2',
      description: 'Test',
      submission: textSubmission(),
      validate: () => success('done', 'done'),
    });

    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
      tasks: [testTask, task2],
    });

    expect(npc.tasks).toHaveLength(2);
  });

  it('should not have dialogues property', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
      dialogueTree,
    });

    expect((npc as any).dialogues).toBeUndefined();
  });

  it('should not have getDialogue property', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
    });

    expect((npc as any).getDialogue).toBeUndefined();
  });

  it('should handle optional properties', () => {
    const npc = createNPC({
      id: 'test-npc',
      name: 'Test NPC',
      position: pos(50, 50),
      avatar: 'avatar',
      locked: true,
      unlockRequirement: null,
    });

    expect(npc.avatar).toBe('avatar');
    expect(npc.locked).toBe(true);
    expect(npc.unlockRequirement).toBeNull();
  });
});

describe('createObject', () => {
  it('should create object with basic properties', () => {
    const obj = createObject({
      id: 'test-object',
      name: 'Test Object',
      position: pos(30, 40),
    });

    expect(obj.id).toBe('test-object');
    expect(obj.name).toBe('Test Object');
    expect(obj.type).toBe('object');
    expect(obj.position).toEqual({ x: 30, y: 40 });
  });

  it('should create object with interaction', () => {
    const interaction = {
      type: 'component' as const,
      component: 'NoteViewer',
      props: { content: 'Test note' },
    };

    const obj = createObject({
      id: 'test-object',
      name: 'Test Object',
      position: pos(30, 40),
      interaction,
    });

    expect(obj.interaction).toBe(interaction);
  });
});

describe('createLocation', () => {
  it('should create location with basic properties', () => {
    const location = createLocation({
      id: 'test-location',
      name: 'Test Location',
      position: pos(60, 70),
    });

    expect(location.id).toBe('test-location');
    expect(location.name).toBe('Test Location');
    expect(location.type).toBe('location');
    expect(location.position).toEqual({ x: 60, y: 70 });
  });
});

describe('pos helper', () => {
  it('should create position object', () => {
    const position = pos(25, 75);
    expect(position).toEqual({ x: 25, y: 75 });
  });
});
