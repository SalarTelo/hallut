/**
 * Interactable Builder Tests
 * Unit tests for interactable builders
 */

import { describe, it, expect } from 'vitest';
import {
  pos,
  taskComplete,
  moduleComplete,
  stateCheck,
  showDialogue,
  showComponent,
  showImage,
  showNote,
  showNoteViewer,
  showSignViewer,
  showChatWindow,
  showImageViewer,
  createNPC,
  createObject,
  createLocation,
  createNoteObject,
  createImageObject,
} from '../interactables.js';
import { createDialogue } from '../dialogues.js';
import type { Task } from '@core/types/task.js';

describe('Interactable Builders', () => {
  const mockTask: Task = {
    id: 'test-task',
    name: 'Test Task',
    description: 'Test',
    submission: { type: 'text' },
    validate: () => ({ solved: true, reason: 'test', details: 'test' }),
  };

  describe('Position Helper', () => {
    it('should create a position', () => {
      const position = pos(10, 20);
      expect(position.x).toBe(10);
      expect(position.y).toBe(20);
    });
  });

  describe('Requirement Builders', () => {
    it('should create task-complete requirement', () => {
      const requirement = taskComplete(mockTask);
      expect(requirement.type).toBe('task-complete');
      expect(requirement.task).toBe(mockTask);
    });

    it('should create module-complete requirement', () => {
      const requirement = moduleComplete('test-module');
      expect(requirement.type).toBe('module-complete');
      expect(requirement.moduleId).toBe('test-module');
    });

    it('should create state-check requirement', () => {
      const requirement = stateCheck('key', 'value');
      expect(requirement.type).toBe('state-check');
      expect(requirement.key).toBe('key');
      expect(requirement.value).toBe('value');
    });
  });

  describe('Interaction Builders', () => {
    it('should create dialogue interaction', () => {
      const dialogue = createDialogue({
        id: 'test',
        speaker: 'Speaker',
        lines: ['Line'],
      });
      const interaction = showDialogue(dialogue);

      expect(interaction.type).toBe('dialogue');
      expect(interaction.dialogue).toBe(dialogue);
    });

    it('should create component interaction', () => {
      const interaction = showComponent('NoteViewer', { content: 'test', title: 'Test' });

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('NoteViewer');
      }
    });

    it('should create NoteViewer interaction', () => {
      const interaction = showNoteViewer({
        content: 'Note content',
        title: 'Note title',
      });

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('NoteViewer');
        expect(interaction.props).toEqual({
          content: 'Note content',
          title: 'Note title',
        });
      }
    });

    it('should create SignViewer interaction', () => {
      const interaction = showSignViewer({
        content: 'Sign content',
        title: 'Sign title',
      });

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('SignViewer');
        expect(interaction.props).toEqual({
          content: 'Sign content',
          title: 'Sign title',
        });
      }
    });

    it('should create ChatWindow interaction', () => {
      const interaction = showChatWindow({
        title: 'Chat Title',
        placeholder: 'Enter message...',
      });

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('ChatWindow');
        expect(interaction.props).toEqual({
          title: 'Chat Title',
          placeholder: 'Enter message...',
        });
      }
    });

    it('should create image interaction (uses component pattern)', () => {
      const interaction = showImage('image.jpg', 'Title');

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('ImageViewer');
        expect(interaction.props).toEqual({
          imageUrl: 'image.jpg',
          title: 'Title',
        });
      }
    });

    it('should create ImageViewer interaction', () => {
      const interaction = showImageViewer({
        imageUrl: 'image.jpg',
        title: 'Image Title',
      });

      expect(interaction.type).toBe('component');
      if (interaction.type === 'component') {
        expect(interaction.component).toBe('ImageViewer');
        expect(interaction.props).toEqual({
          imageUrl: 'image.jpg',
          title: 'Image Title',
        });
      }
    });

    it('should create note interaction', () => {
      const interaction = showNote('Note content', 'Note title');

      expect(interaction.type).toBe('component');
      expect(interaction.component).toBe('NoteViewer');
      expect(interaction.props).toEqual({
        content: 'Note content',
        title: 'Note title',
      });
    });
  });

  describe('NPC Builder', () => {
    it('should create an NPC', () => {
      const dialogue = createDialogue({
        id: 'greeting',
        speaker: 'NPC',
        lines: ['Hello'],
      });

      const npc = createNPC({
        id: 'test-npc',
        name: 'Test NPC',
        position: pos(10, 20),
        dialogues: { greeting: dialogue },
      });

      expect(npc.id).toBe('test-npc');
      expect(npc.type).toBe('npc');
      expect(npc.name).toBe('Test NPC');
      expect(npc.position).toEqual({ x: 10, y: 20 });
      expect(npc.dialogues.greeting).toBe(dialogue);
      expect(npc.locked).toBe(false);
    });

    it('should create a locked NPC with requirement', () => {
      const npc = createNPC({
        id: 'locked-npc',
        name: 'Locked NPC',
        position: pos(10, 20),
        dialogues: {},
        locked: true,
        unlockRequirement: taskComplete(mockTask),
      });

      expect(npc.locked).toBe(true);
      expect(npc.unlockRequirement?.type).toBe('task-complete');
    });
  });

  describe('Object Builder', () => {
    it('should create an object', () => {
      const obj = createObject({
        id: 'test-object',
        name: 'Test Object',
        position: pos(30, 40),
        interaction: showNote('Content', 'Title'),
      });

      expect(obj.id).toBe('test-object');
      expect(obj.type).toBe('object');
      expect(obj.name).toBe('Test Object');
      expect(obj.position).toEqual({ x: 30, y: 40 });
      expect(obj.interaction?.type).toBe('component');
    });
  });

  describe('Location Builder', () => {
    it('should create a location', () => {
      const location = createLocation({
        id: 'test-location',
        name: 'Test Location',
        position: pos(50, 60),
      });

      expect(location.id).toBe('test-location');
      expect(location.type).toBe('location');
      expect(location.name).toBe('Test Location');
    });
  });

  describe('Shorthand Helpers', () => {
    it('should create a note object', () => {
      const obj = createNoteObject({
        id: 'note',
        name: 'Note',
        position: pos(10, 20),
        content: 'Note content',
        title: 'Note title',
      });

      expect(obj.type).toBe('object');
      expect(obj.interaction?.type).toBe('component');
      if (obj.interaction && obj.interaction.type === 'component') {
        expect(obj.interaction.component).toBe('NoteViewer');
      }
    });

    it('should create an image object (uses component pattern)', () => {
      const obj = createImageObject({
        id: 'image',
        name: 'Image',
        position: pos(10, 20),
        imageUrl: 'image.jpg',
        title: 'Image Title',
      });

      expect(obj.type).toBe('object');
      expect(obj.interaction?.type).toBe('component');
      if (obj.interaction && obj.interaction.type === 'component') {
        expect(obj.interaction.component).toBe('ImageViewer');
        expect(obj.interaction.props).toEqual({
          imageUrl: 'image.jpg',
          title: 'Image Title',
        });
      }
    });
  });
});

