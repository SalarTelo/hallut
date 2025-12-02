/**
 * Interactable State Tests
 * Tests for interactable state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { actions } from '../actions.js';

describe('Interactable State', () => {
  const moduleId = 'test-module';
  const interactableId = 'test-npc';

  beforeEach(() => {
    // Clear state before each test
    actions.setModuleStateField(moduleId, 'conversations', {});
  });

  describe('setInteractableStateField', () => {
    it('should set interactable state field', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'hasMet', true);
      const value = actions.getInteractableStateField(moduleId, interactableId, 'hasMet');
      expect(value).toBe(true);
    });

    it('should update existing interactable state', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'hasMet', true);
      actions.setInteractableStateField(moduleId, interactableId, 'hasMet', false);
      const value = actions.getInteractableStateField(moduleId, interactableId, 'hasMet');
      expect(value).toBe(false);
    });

    it('should set multiple fields independently', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'hasMet', true);
      actions.setInteractableStateField(moduleId, interactableId, 'hasDiscussedTasks', false);
      
      expect(actions.getInteractableStateField(moduleId, interactableId, 'hasMet')).toBe(true);
      expect(actions.getInteractableStateField(moduleId, interactableId, 'hasDiscussedTasks')).toBe(false);
    });
  });

  describe('getInteractableStateField', () => {
    it('should return undefined for non-existent field', () => {
      const value = actions.getInteractableStateField(moduleId, interactableId, 'nonexistent');
      expect(value).toBeUndefined();
    });

    it('should return set value', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'flag', 'value');
      const value = actions.getInteractableStateField(moduleId, interactableId, 'flag');
      expect(value).toBe('value');
    });

    it('should handle different value types', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'string', 'text');
      actions.setInteractableStateField(moduleId, interactableId, 'number', 42);
      actions.setInteractableStateField(moduleId, interactableId, 'boolean', true);
      actions.setInteractableStateField(moduleId, interactableId, 'object', { key: 'value' });

      expect(actions.getInteractableStateField(moduleId, interactableId, 'string')).toBe('text');
      expect(actions.getInteractableStateField(moduleId, interactableId, 'number')).toBe(42);
      expect(actions.getInteractableStateField(moduleId, interactableId, 'boolean')).toBe(true);
      expect(actions.getInteractableStateField(moduleId, interactableId, 'object')).toEqual({ key: 'value' });
    });
  });

  describe('initializeInteractableState', () => {
    it('should initialize interactable state if not exists', () => {
      actions.initializeInteractableState(moduleId, interactableId);
      const value = actions.getInteractableStateField(moduleId, interactableId, 'any');
      expect(value).toBeUndefined(); // State exists but field doesn't
    });

    it('should not overwrite existing state', () => {
      actions.setInteractableStateField(moduleId, interactableId, 'existing', 'value');
      actions.initializeInteractableState(moduleId, interactableId);
      const value = actions.getInteractableStateField(moduleId, interactableId, 'existing');
      expect(value).toBe('value');
    });
  });

  describe('Multiple Interactables', () => {
    it('should track state separately for different interactables', () => {
      const npc1 = 'npc-1';
      const npc2 = 'npc-2';

      actions.setInteractableStateField(moduleId, npc1, 'hasMet', true);
      actions.setInteractableStateField(moduleId, npc2, 'hasMet', false);

      expect(actions.getInteractableStateField(moduleId, npc1, 'hasMet')).toBe(true);
      expect(actions.getInteractableStateField(moduleId, npc2, 'hasMet')).toBe(false);
    });
  });

  describe('Module State Separation', () => {
    it('should track state separately for different modules', () => {
      const module1 = 'module-1';
      const module2 = 'module-2';

      actions.setInteractableStateField(module1, interactableId, 'flag', 'value1');
      actions.setInteractableStateField(module2, interactableId, 'flag', 'value2');

      expect(actions.getInteractableStateField(module1, interactableId, 'flag')).toBe('value1');
      expect(actions.getInteractableStateField(module2, interactableId, 'flag')).toBe('value2');
    });
  });
});

