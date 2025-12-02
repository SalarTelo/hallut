/**
 * ModulePath Utilities Tests
 * Unit tests for ModulePath utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  hexToRgba,
  formatModuleName,
  isModuleUnlocked,
  getConnectionNodes,
  getConnectionState,
  getStrokeDasharray,
  getConnectionKey,
  getGradientId,
  getStrokeColor,
} from '../utils.js';
import type { WorldmapConnection, WorldmapNode } from '@core/types/worldmap.js';
import type { ModuleProgressionState } from '@core/state/types.js';

describe('ModulePath Utilities', () => {
  describe('hexToRgba', () => {
    it('should convert hex color to rgba', () => {
      expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
      expect(hexToRgba('#00ff00', 1)).toBe('rgba(0, 255, 0, 1)');
      expect(hexToRgba('#0000ff', 0)).toBe('rgba(0, 0, 255, 0)');
    });

    it('should handle hex color without hash', () => {
      expect(hexToRgba('ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
    });

    it('should handle uppercase hex', () => {
      expect(hexToRgba('#ABCDEF', 0.5)).toBe('rgba(171, 205, 239, 0.5)');
    });

    it('should handle different alpha values', () => {
      expect(hexToRgba('#000000', 0.25)).toBe('rgba(0, 0, 0, 0.25)');
      expect(hexToRgba('#000000', 0.75)).toBe('rgba(0, 0, 0, 0.75)');
    });
  });

  describe('formatModuleName', () => {
    it('should format module ID with dashes', () => {
      expect(formatModuleName('test-module')).toBe('Test Module');
      expect(formatModuleName('my-awesome-module')).toBe('My Awesome Module');
    });

    it('should capitalize single word', () => {
      expect(formatModuleName('test')).toBe('Test');
    });

    it('should handle multiple words', () => {
      expect(formatModuleName('a-b-c-d')).toBe('A B C D');
    });

    it('should handle empty string', () => {
      expect(formatModuleName('')).toBe('');
    });
  });

  describe('isModuleUnlocked', () => {
    it('should return true for unlocked state', () => {
      expect(isModuleUnlocked('unlocked')).toBe(true);
    });

    it('should return true for completed state', () => {
      expect(isModuleUnlocked('completed')).toBe(true);
    });

    it('should return false for locked state', () => {
      expect(isModuleUnlocked('locked')).toBe(false);
    });
  });

  describe('getConnectionNodes', () => {
    const nodes: WorldmapNode[] = [
      { moduleId: 'module1', position: { x: 0, y: 0 } },
      { moduleId: 'module2', position: { x: 50, y: 50 } },
      { moduleId: 'module3', position: { x: 100, y: 100 } },
    ];

    it('should find both connection nodes', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const result = getConnectionNodes(connection, nodes);

      expect(result).not.toBeNull();
      expect(result?.fromNode.moduleId).toBe('module1');
      expect(result?.toNode.moduleId).toBe('module2');
    });

    it('should return null when from node not found', () => {
      const connection: WorldmapConnection = {
        from: 'non-existent',
        to: 'module2',
      };

      const result = getConnectionNodes(connection, nodes);

      expect(result).toBeNull();
    });

    it('should return null when to node not found', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'non-existent',
      };

      const result = getConnectionNodes(connection, nodes);

      expect(result).toBeNull();
    });

    it('should return null when both nodes not found', () => {
      const connection: WorldmapConnection = {
        from: 'non-existent-1',
        to: 'non-existent-2',
      };

      const result = getConnectionNodes(connection, nodes);

      expect(result).toBeNull();
    });
  });

  describe('getConnectionState', () => {
    const getModuleProgression = (moduleId: string): ModuleProgressionState => {
      const progression: Record<string, ModuleProgressionState> = {
        module1: 'unlocked',
        module2: 'locked',
        module3: 'completed',
      };
      return progression[moduleId] || 'locked';
    };

    it('should return connection state for both modules', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const state = getConnectionState(connection, getModuleProgression);

      expect(state.fromState).toBe('unlocked');
      expect(state.toState).toBe('locked');
      expect(state.fromUnlocked).toBe(true);
      expect(state.toUnlocked).toBe(false);
      expect(state.isPartiallyUnlocked).toBe(true);
    });

    it('should detect fully unlocked connection', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module3',
      };

      const state = getConnectionState(connection, getModuleProgression);

      expect(state.fromUnlocked).toBe(true);
      expect(state.toUnlocked).toBe(true);
      expect(state.isPartiallyUnlocked).toBe(false);
    });

    it('should detect fully locked connection', () => {
      const connection: WorldmapConnection = {
        from: 'module2',
        to: 'module2',
      };

      const state = getConnectionState(connection, getModuleProgression);

      expect(state.fromUnlocked).toBe(false);
      expect(state.toUnlocked).toBe(false);
      expect(state.isPartiallyUnlocked).toBe(false);
    });

    it('should detect partially unlocked when only to is unlocked', () => {
      const getProgression = (id: string): ModuleProgressionState => {
        return id === 'module2' ? 'unlocked' : 'locked';
      };

      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const state = getConnectionState(connection, getProgression);

      expect(state.fromUnlocked).toBe(false);
      expect(state.toUnlocked).toBe(true);
      expect(state.isPartiallyUnlocked).toBe(true);
    });
  });

  describe('getStrokeDasharray', () => {
    it('should return dash array for dashed style', () => {
      expect(getStrokeDasharray('dashed')).toBe('5,5');
    });

    it('should return dash array for dotted style', () => {
      expect(getStrokeDasharray('dotted')).toBe('2,2');
    });

    it('should return no dash for solid style', () => {
      expect(getStrokeDasharray('solid')).toBe('0');
    });

    it('should return no dash for undefined style', () => {
      expect(getStrokeDasharray(undefined)).toBe('0');
    });
  });

  describe('getConnectionKey', () => {
    it('should generate connection key from from and to', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      expect(getConnectionKey(connection)).toBe('module1-module2');
    });
  });

  describe('getGradientId', () => {
    it('should generate gradient ID from connection', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      expect(getGradientId(connection)).toBe('gradient-module1-module2');
    });
  });

  describe('getStrokeColor', () => {
    it('should return gradient URL for partially unlocked connection', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const state = {
        fromState: 'unlocked' as ModuleProgressionState,
        toState: 'locked' as ModuleProgressionState,
        fromUnlocked: true,
        toUnlocked: false,
        isPartiallyUnlocked: true,
      };

      const result = getStrokeColor(connection, state, false, '#000000');

      expect(result).toBe(`url(#${getGradientId(connection)})`);
    });

    it('should return border color for unlocked connection', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const state = {
        fromState: 'unlocked' as ModuleProgressionState,
        toState: 'unlocked' as ModuleProgressionState,
        fromUnlocked: true,
        toUnlocked: true,
        isPartiallyUnlocked: false,
      };

      const result = getStrokeColor(connection, state, true, '#ff0000');

      expect(result).toBe('#ff0000');
    });

    it('should return gray for locked connection', () => {
      const connection: WorldmapConnection = {
        from: 'module1',
        to: 'module2',
      };

      const state = {
        fromState: 'locked' as ModuleProgressionState,
        toState: 'locked' as ModuleProgressionState,
        fromUnlocked: false,
        toUnlocked: false,
        isPartiallyUnlocked: false,
      };

      const result = getStrokeColor(connection, state, false, '#ff0000');

      expect(result).toBe('#666666');
    });
  });
});

