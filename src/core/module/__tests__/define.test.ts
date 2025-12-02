/**
 * Module Define Tests
 * Unit tests for module definition helper
 */

import { describe, it, expect, vi } from 'vitest';
import { defineModule } from '../define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '@utils/builders/modules.js';
import type { ModuleDefinition } from '@core/types/module.js';

describe('Module Define', () => {
  describe('defineModule', () => {
    it('should create a module definition with required fields', () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test Module', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      expect(module.id).toBe('test-module');
      expect(module.config).toBeDefined();
      expect(module.content).toBeDefined();
    });

    it('should include optional handlers when provided', () => {
      const mockHandler = vi.fn();

      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test Module', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
        handlers: {
          onLoad: mockHandler,
        },
      });

      expect(module.handlers).toBeDefined();
      expect(module.handlers?.onLoad).toBe(mockHandler);
    });

    it('should not include handlers when not provided', () => {
      const module = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test Module', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      expect(module.handlers).toBeUndefined();
    });

    it('should preserve all config and content properties', () => {
      const config = createModuleConfig({
        manifest: createManifest('test-module', 'Test Module', '1.0.0', 'A test module'),
        background: colorBackground('#ff0000'),
        welcome: createWelcome('System', ['Welcome', 'To test']),
        taskOrder: [],
      });

      const content = {
        interactables: [],
        tasks: [],
      };

      const module = defineModule({
        id: 'test-module',
        config,
        content,
      });

      expect(module.config).toBe(config);
      expect(module.content).toBe(content);
      expect(module.config.manifest.summary).toBe('A test module');
      expect(module.config.manifest.name).toBe('Test Module');
    });

    it('should create a valid ModuleDefinition type', () => {
      const module: ModuleDefinition = defineModule({
        id: 'test-module',
        config: createModuleConfig({
          manifest: createManifest('test-module', 'Test Module', '1.0.0'),
          background: colorBackground('#000'),
          welcome: createWelcome('System', ['Welcome']),
          taskOrder: [],
        }),
        content: {
          interactables: [],
          tasks: [],
        },
      });

      // Type check: should compile without errors
      expect(module).toBeDefined();
      expect(typeof module.id).toBe('string');
    });
  });
});

