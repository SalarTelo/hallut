/**
 * Conversation State Service Tests
 * Tests for conversation state tracking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLastDialogueBranch,
  setLastDialogueBranch,
  getLastDialogueNode,
  setLastDialogueNode,
} from '../conversationState.js';
import { actions } from '@core/state/actions.js';

describe('Conversation State', () => {
  const moduleId = 'test-module';
  const npcId = 'test-npc';

  beforeEach(() => {
    // Clear state before each test
    actions.setModuleStateField(moduleId, 'conversations', {});
  });

  describe('getLastDialogueBranch', () => {
    it('should return null when no branch set', () => {
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBeNull();
    });

    it('should return stored branch', () => {
      setLastDialogueBranch(moduleId, npcId, 'tree');
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBe('tree');
    });

    it('should return task ID as branch', () => {
      setLastDialogueBranch(moduleId, npcId, 'task-123');
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBe('task-123');
    });
  });

  describe('setLastDialogueBranch', () => {
    it('should set branch to tree', () => {
      setLastDialogueBranch(moduleId, npcId, 'tree');
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBe('tree');
    });

    it('should set branch to task ID', () => {
      setLastDialogueBranch(moduleId, npcId, 'task-456');
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBe('task-456');
    });

    it('should preserve lastNode when setting branch', () => {
      setLastDialogueNode(moduleId, npcId, 'node-123');
      setLastDialogueBranch(moduleId, npcId, 'tree');
      const node = getLastDialogueNode(moduleId, npcId);
      expect(node).toBe('node-123');
    });
  });

  describe('getLastDialogueNode', () => {
    it('should return null when no node set', () => {
      const node = getLastDialogueNode(moduleId, npcId);
      expect(node).toBeNull();
    });

    it('should return stored node ID', () => {
      setLastDialogueNode(moduleId, npcId, 'node-123');
      const node = getLastDialogueNode(moduleId, npcId);
      expect(node).toBe('node-123');
    });
  });

  describe('setLastDialogueNode', () => {
    it('should set node ID', () => {
      setLastDialogueNode(moduleId, npcId, 'node-456');
      const node = getLastDialogueNode(moduleId, npcId);
      expect(node).toBe('node-456');
    });

    it('should preserve branch when setting node', () => {
      setLastDialogueBranch(moduleId, npcId, 'tree');
      setLastDialogueNode(moduleId, npcId, 'node-789');
      const branch = getLastDialogueBranch(moduleId, npcId);
      expect(branch).toBe('tree');
    });
  });

  describe('Multiple NPCs', () => {
    it('should track state separately for different NPCs', () => {
      const npc1 = 'npc-1';
      const npc2 = 'npc-2';

      setLastDialogueBranch(moduleId, npc1, 'tree');
      setLastDialogueBranch(moduleId, npc2, 'task-123');
      setLastDialogueNode(moduleId, npc1, 'node-1');
      setLastDialogueNode(moduleId, npc2, 'node-2');

      expect(getLastDialogueBranch(moduleId, npc1)).toBe('tree');
      expect(getLastDialogueBranch(moduleId, npc2)).toBe('task-123');
      expect(getLastDialogueNode(moduleId, npc1)).toBe('node-1');
      expect(getLastDialogueNode(moduleId, npc2)).toBe('node-2');
    });
  });

  describe('Multiple Modules', () => {
    it('should track state separately for different modules', () => {
      const module1 = 'module-1';
      const module2 = 'module-2';

      setLastDialogueBranch(module1, npcId, 'tree');
      setLastDialogueBranch(module2, npcId, 'task-123');

      expect(getLastDialogueBranch(module1, npcId)).toBe('tree');
      expect(getLastDialogueBranch(module2, npcId)).toBe('task-123');
    });
  });
});

