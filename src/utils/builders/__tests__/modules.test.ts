/**
 * Module Builders Tests
 * Unit tests for module builder functions
 */

import { describe, it, expect } from 'vitest';
import {
  createManifest,
  createBackground,
  colorBackground,
  imageBackground,
  createWelcome,
  createTheme,
  createModuleConfig,
  passwordUnlock,
  moduleComplete,
  andRequirements,
  orRequirements,
} from '../modules.js';
import type { ModuleManifest, ModuleBackground, ModuleWelcome, ModuleTheme, ModuleConfig } from '@core/types/module.js';
import type { UnlockRequirement } from '@core/types/unlock.js';

describe('Module Builders', () => {
  describe('createManifest', () => {
    it('should create a manifest with required fields', () => {
      const manifest = createManifest('test-module', 'Test Module', '1.0.0');

      expect(manifest.id).toBe('test-module');
      expect(manifest.name).toBe('Test Module');
      expect(manifest.version).toBe('1.0.0');
    });

    it('should use default version when not provided', () => {
      const manifest = createManifest('test-module', 'Test Module');

      expect(manifest.version).toBe('1.0.0');
    });

    it('should include optional summary', () => {
      const manifest = createManifest('test-module', 'Test Module', '1.0.0', 'A test module');

      expect(manifest.summary).toBe('A test module');
    });

    it('should allow undefined summary', () => {
      const manifest = createManifest('test-module', 'Test Module', '1.0.0');

      expect(manifest.summary).toBeUndefined();
    });
  });

  describe('createBackground', () => {
    it('should create background with color', () => {
      const background = createBackground({ color: '#ff0000' });

      expect(background.color).toBe('#ff0000');
      expect(background.image).toBeUndefined();
    });

    it('should create background with image', () => {
      const background = createBackground({ image: '/image.jpg' });

      expect(background.image).toBe('/image.jpg');
      expect(background.color).toBeUndefined();
    });

    it('should create background with both color and image', () => {
      const background = createBackground({ color: '#ff0000', image: '/image.jpg' });

      expect(background.color).toBe('#ff0000');
      expect(background.image).toBe('/image.jpg');
    });
  });

  describe('colorBackground', () => {
    it('should create background with only color', () => {
      const background = colorBackground('#ff0000');

      expect(background.color).toBe('#ff0000');
      expect(background.image).toBeUndefined();
    });
  });

  describe('imageBackground', () => {
    it('should create background with image', () => {
      const background = imageBackground('/image.jpg');

      expect(background.image).toBe('/image.jpg');
      expect(background.color).toBeUndefined();
    });

    it('should include fallback color when provided', () => {
      const background = imageBackground('/image.jpg', '#ff0000');

      expect(background.image).toBe('/image.jpg');
      expect(background.color).toBe('#ff0000');
    });
  });

  describe('createWelcome', () => {
    it('should create welcome with speaker and lines', () => {
      const welcome = createWelcome('System', ['Welcome', 'Hello']);

      expect(welcome.speaker).toBe('System');
      expect(welcome.lines).toEqual(['Welcome', 'Hello']);
    });

    it('should handle single line', () => {
      const welcome = createWelcome('NPC', ['Hello']);

      expect(welcome.speaker).toBe('NPC');
      expect(welcome.lines).toEqual(['Hello']);
    });

    it('should handle multiple lines', () => {
      const welcome = createWelcome('NPC', ['Line 1', 'Line 2', 'Line 3']);

      expect(welcome.lines).toHaveLength(3);
      expect(welcome.lines[0]).toBe('Line 1');
      expect(welcome.lines[2]).toBe('Line 3');
    });
  });

  describe('createTheme', () => {
    it('should create theme with border color', () => {
      const theme = createTheme('#ff0000');

      expect(theme.borderColor).toBe('#ff0000');
      expect(theme.accentColors).toBeUndefined();
    });

    it('should include accent colors when provided', () => {
      const theme = createTheme('#ff0000', {
        primary: '#00ff00',
        secondary: '#0000ff',
        highlight: '#ffff00',
      });

      expect(theme.borderColor).toBe('#ff0000');
      expect(theme.accentColors?.primary).toBe('#00ff00');
      expect(theme.accentColors?.secondary).toBe('#0000ff');
      expect(theme.accentColors?.highlight).toBe('#ffff00');
    });

    it('should allow partial accent colors', () => {
      const theme = createTheme('#ff0000', {
        primary: '#00ff00',
      });

      expect(theme.accentColors?.primary).toBe('#00ff00');
      expect(theme.accentColors?.secondary).toBeUndefined();
      expect(theme.accentColors?.highlight).toBeUndefined();
    });
  });

  describe('createModuleConfig', () => {
    it('should create module config with required fields', () => {
      const config = createModuleConfig({
        manifest: createManifest('test', 'Test', '1.0.0'),
        background: colorBackground('#000'),
        welcome: createWelcome('System', ['Welcome']),
        taskOrder: [],
      });

      expect(config.manifest).toBeDefined();
      expect(config.background).toBeDefined();
      expect(config.welcome).toBeDefined();
      expect(config.taskOrder).toEqual([]);
    });

    it('should include optional theme', () => {
      const config = createModuleConfig({
        manifest: createManifest('test', 'Test', '1.0.0'),
        background: colorBackground('#000'),
        welcome: createWelcome('System', ['Welcome']),
        taskOrder: [],
        theme: createTheme('#ff0000'),
      });

      expect(config.theme).toBeDefined();
      expect(config.theme?.borderColor).toBe('#ff0000');
    });

    it('should include optional unlockRequirement', () => {
      const requirement = passwordUnlock('secret');
      
      const config = createModuleConfig({
        manifest: createManifest('test', 'Test', '1.0.0'),
        background: colorBackground('#000'),
        welcome: createWelcome('System', ['Welcome']),
        taskOrder: [],
        unlockRequirement: requirement,
      });

      expect(config.unlockRequirement).toBe(requirement);
    });

    it('should include optional worldmap configuration', () => {
      const config = createModuleConfig({
        manifest: createManifest('test', 'Test', '1.0.0'),
        background: colorBackground('#000'),
        welcome: createWelcome('System', ['Welcome']),
        taskOrder: [],
        worldmap: {
          position: { x: 50, y: 50 },
          icon: {
            shape: 'circle',
            size: 48,
          },
        },
      });

      expect(config.worldmap).toBeDefined();
      expect(config.worldmap?.position.x).toBe(50);
      expect(config.worldmap?.position.y).toBe(50);
      expect(config.worldmap?.icon?.shape).toBe('circle');
      expect(config.worldmap?.icon?.size).toBe(48);
    });
  });

  describe('passwordUnlock', () => {
    it('should create password unlock requirement', () => {
      const requirement = passwordUnlock('secret123');

      expect(requirement.type).toBe('password');
      expect(requirement.password).toBe('secret123');
      expect(requirement.hint).toBeUndefined();
    });

    it('should include optional hint', () => {
      const requirement = passwordUnlock('secret123', 'Hint: It is a secret');

      expect(requirement.type).toBe('password');
      expect(requirement.password).toBe('secret123');
      expect(requirement.hint).toBe('Hint: It is a secret');
    });
  });

  describe('moduleComplete', () => {
    it('should create module complete requirement', () => {
      const requirement = moduleComplete('dep-module');

      expect(requirement.type).toBe('module-complete');
      expect(requirement.moduleId).toBe('dep-module');
    });
  });

  describe('andRequirements', () => {
    it('should create AND requirement with multiple requirements', () => {
      const req1 = passwordUnlock('secret');
      const req2 = moduleComplete('dep-module');
      
      const requirement = andRequirements(req1, req2);

      expect(requirement.type).toBe('and');
      expect(requirement.requirements).toHaveLength(2);
      expect(requirement.requirements[0]).toBe(req1);
      expect(requirement.requirements[1]).toBe(req2);
    });

    it('should handle single requirement', () => {
      const req1 = passwordUnlock('secret');
      
      const requirement = andRequirements(req1);

      expect(requirement.type).toBe('and');
      expect(requirement.requirements).toHaveLength(1);
      expect(requirement.requirements[0]).toBe(req1);
    });

    it('should handle multiple requirements', () => {
      const req1 = passwordUnlock('secret');
      const req2 = moduleComplete('dep1');
      const req3 = moduleComplete('dep2');
      
      const requirement = andRequirements(req1, req2, req3);

      expect(requirement.requirements).toHaveLength(3);
    });
  });

  describe('orRequirements', () => {
    it('should create OR requirement with multiple requirements', () => {
      const req1 = passwordUnlock('secret');
      const req2 = moduleComplete('dep-module');
      
      const requirement = orRequirements(req1, req2);

      expect(requirement.type).toBe('or');
      expect(requirement.requirements).toHaveLength(2);
      expect(requirement.requirements[0]).toBe(req1);
      expect(requirement.requirements[1]).toBe(req2);
    });

    it('should handle single requirement', () => {
      const req1 = passwordUnlock('secret');
      
      const requirement = orRequirements(req1);

      expect(requirement.type).toBe('or');
      expect(requirement.requirements).toHaveLength(1);
      expect(requirement.requirements[0]).toBe(req1);
    });
  });
});

