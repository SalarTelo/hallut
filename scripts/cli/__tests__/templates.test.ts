/**
 * Templates Tests
 * Comprehensive tests for template generation functions
 */

import { describe, it, expect } from 'vitest';
import {
  getIndexTemplate,
  getConfigTemplate,
  getContentIndexTemplate,
  getTasksTemplateQuick,
  getTasksTemplateDetailed,
  getObjectsTemplateQuick,
  getObjectsTemplateDetailed,
  getNPCsTemplate,
  getNPCIndexTemplate,
  getNPCDialoguesTemplate,
  getNPCStateTemplate,
} from '../templates.js';

describe('Templates', () => {
  describe('getIndexTemplate', () => {
    it('should generate index template with module ID and display name', () => {
      const result = getIndexTemplate('my-module', 'My Module');

      expect(result).toContain('My Module Module');
      expect(result).toContain("id: 'my-module'");
      expect(result).toContain('defineModule');
      expect(result).toContain('createConfig');
      expect(result).toContain('tasks, interactables');
    });

    it('should include proper imports', () => {
      const result = getIndexTemplate('test', 'Test');

      expect(result).toContain("@core/module/define.js");
      expect(result).toContain('./config.js');
      expect(result).toContain('./content/index.js');
    });

    it('should have proper structure', () => {
      const result = getIndexTemplate('test', 'Test');

      expect(result).toContain('export default');
      expect(result).toContain('config,');
      expect(result).toContain('content: {');
    });

    it('should handle different module IDs', () => {
      const result1 = getIndexTemplate('module-1', 'Module 1');
      const result2 = getIndexTemplate('another-module', 'Another Module');

      expect(result1).toContain("id: 'module-1'");
      expect(result2).toContain("id: 'another-module'");
    });

    it('should include comments', () => {
      const result = getIndexTemplate('test', 'Test');

      expect(result).toContain('/**');
      expect(result).toContain('*');
    });
  });

  describe('getConfigTemplate', () => {
    it('should generate config template with all parameters', () => {
      const result = getConfigTemplate(
        'my-module',
        'My Module',
        'A test module',
        '1.0.0',
        '#1a1a2e',
        'null',
        ''
      );

      expect(result).toContain("'my-module'");
      expect(result).toContain("'My Module'");
      expect(result).toContain("'1.0.0'");
      expect(result).toContain("'A test module'");
      expect(result).toContain("'#1a1a2e'");
    });

    it('should include unlock requirement when provided', () => {
      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        'moduleComplete("other")',
        ''
      );

      expect(result).toContain('unlockRequirement:');
      expect(result).toContain('moduleComplete("other")');
    });

    it('should include worldmap when provided', () => {
      const worldmap = `worldmap: {
      position: { x: 50, y: 50 },
      icon: {
        shape: 'circle',
        size: 48,
      },
    }`;

      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        '',
        worldmap
      );

      expect(result).toContain('worldmap:');
      expect(result).toContain('position: { x: 50, y: 50 }');
      expect(result).toContain("shape: 'circle'");
    });

    it('should include correct imports for moduleComplete', () => {
      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        'moduleComplete("other")',
        ''
      );

      expect(result).toContain(', moduleComplete');
    });

    it('should include correct imports for passwordUnlock', () => {
      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        'passwordUnlock("pass")',
        ''
      );

      expect(result).toContain(', passwordUnlock');
    });

    it('should include correct imports for andRequirements', () => {
      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        'andRequirements(...)',
        ''
      );

      expect(result).toContain(', andRequirements');
    });

    it('should handle empty unlock requirement', () => {
      const result = getConfigTemplate(
        'test',
        'Test',
        'Desc',
        '1.0.0',
        '#000',
        '',
        ''
      );

      expect(result).not.toContain('unlockRequirement:');
    });
  });

  describe('getContentIndexTemplate', () => {
    it('should export from tasks, NPCs, and objects', () => {
      const result = getContentIndexTemplate();

      expect(result).toContain("export * from './tasks.js'");
      expect(result).toContain("export * from './NPCs.js'");
      expect(result).toContain("export * from './objects.js'");
    });

    it('should include comments', () => {
      const result = getContentIndexTemplate();

      expect(result).toContain('/**');
      expect(result).toContain('Module Content');
    });
  });

  describe('getTasksTemplateQuick', () => {
    it('should export empty tasks array', () => {
      const result = getTasksTemplateQuick();

      expect(result).toContain('export const tasks:');
      expect(result).toContain('Array<import');
      expect(result).toContain('Task');
    });

    it('should include necessary imports', () => {
      const result = getTasksTemplateQuick();

      expect(result).toContain('createTask');
      expect(result).toContain('textSubmission');
      expect(result).toContain('textLengthValidator');
      expect(result).toContain('success');
      expect(result).toContain('failure');
    });

    it('should include TODO comments', () => {
      const result = getTasksTemplateQuick();

      expect(result).toContain('TODO');
    });
  });

  describe('getTasksTemplateDetailed', () => {
    it('should include example task', () => {
      const result = getTasksTemplateDetailed();

      expect(result).toContain('exampleTask');
      expect(result).toContain('createTask');
    });

    it('should export tasks array with example', () => {
      const result = getTasksTemplateDetailed();

      expect(result).toContain('export const tasks = [exampleTask]');
    });

    it('should include task validation logic', () => {
      const result = getTasksTemplateDetailed();

      expect(result).toContain('textLengthValidator');
      expect(result).toContain('success');
      expect(result).toContain('failure');
    });

    it('should include task structure', () => {
      const result = getTasksTemplateDetailed();

      expect(result).toContain('id:');
      expect(result).toContain('name:');
      expect(result).toContain('description:');
      expect(result).toContain('submission:');
      expect(result).toContain('validate:');
    });
  });

  describe('getObjectsTemplateQuick', () => {
    it('should export empty objects array', () => {
      const result = getObjectsTemplateQuick();

      expect(result).toContain('export const objects:');
      expect(result).toContain('Array<import');
      expect(result).toContain('Object');
    });

    it('should include imports even for empty objects array', () => {
      const result = getObjectsTemplateQuick();

      // Template should include imports so users can add objects easily
      expect(result).toContain('import {');
      expect(result).toContain('createObject');
      expect(result).toContain('pos');
      expect(result).toContain('from \'@utils/builders/index.js\'');
      expect(result).toContain('export const objects');
      expect(result).toContain('Array<import(\'@core/types/interactable.js\').Object>');
    });
  });

  describe('getObjectsTemplateDetailed', () => {
    it('should include multiple example objects', () => {
      const result = getObjectsTemplateDetailed();

      expect(result).toContain('signObject');
      expect(result).toContain('imageObject');
      expect(result).toContain('customObject');
    });

    it('should export objects array with examples', () => {
      const result = getObjectsTemplateDetailed();

      expect(result).toContain('export const objects = [signObject, imageObject, customObject]');
    });

    it('should include different interaction types', () => {
      const result = getObjectsTemplateDetailed();

      expect(result).toContain('showNoteViewer');
      expect(result).toContain('createImageObject');
      expect(result).toContain('type: \'component\'');
    });

    it('should include positions', () => {
      const result = getObjectsTemplateDetailed();

      expect(result).toContain('pos(');
      expect(result).toMatch(/pos\(\d+, \d+\)/);
    });
  });

  describe('getNPCsTemplate', () => {
    it('should export empty NPCs array', () => {
      const result = getNPCsTemplate();

      expect(result).toContain('export const NPCs:');
      expect(result).toContain('Array<import');
      expect(result).toContain('NPC');
    });

    it('should export interactables combining NPCs', () => {
      const result = getNPCsTemplate();

      expect(result).toContain('export const interactables = [...NPCs]');
    });

    it('should include TODO for imports', () => {
      const result = getNPCsTemplate();

      expect(result).toContain('TODO: Import your NPCs here');
    });

    it('should include instructions', () => {
      const result = getNPCsTemplate();

      expect(result).toContain('To add a new NPC:');
    });
  });

  describe('getNPCIndexTemplate', () => {
    it('should generate NPC index with all parameters', () => {
      const result = getNPCIndexTemplate(
        'guard',
        'Guard',
        { x: 20, y: 30 },
        'shield',
        true,
        true
      );

      expect(result).toContain("id: 'guard'");
      expect(result).toContain("name: 'Guard'");
      expect(result).toContain('pos(20, 30)');
      expect(result).toContain("avatar: 'shield'");
    });

    it('should include task import when hasTasks is true', () => {
      const result = getNPCIndexTemplate(
        'guard',
        'Guard',
        { x: 20, y: 30 },
        'shield',
        true,
        false
      );

      expect(result).toContain("import { exampleTask } from '../../tasks.js'");
    });

    it('should include dialogue import when hasDialogue is true', () => {
      const result = getNPCIndexTemplate(
        'guard',
        'Guard',
        { x: 20, y: 30 },
        'shield',
        false,
        true
      );

      expect(result).toContain('guardDialogueTree');
      expect(result).toContain("import { guardDialogueTree } from './dialogues.js'");
    });

    it('should include tasks in NPC definition when hasTasks is true', () => {
      const result = getNPCIndexTemplate(
        'guard',
        'Guard',
        { x: 20, y: 30 },
        'shield',
        true,
        false
      );

      expect(result).toContain('tasks: [exampleTask]');
    });

    it('should handle different positions', () => {
      const result = getNPCIndexTemplate(
        'npc',
        'NPC',
        { x: 50, y: 75 },
        'avatar',
        false,
        false
      );

      expect(result).toContain('pos(50, 75)');
    });

    it('should handle different avatars', () => {
      const result = getNPCIndexTemplate(
        'npc',
        'NPC',
        { x: 0, y: 0 },
        'custom-avatar',
        false,
        false
      );

      expect(result).toContain("avatar: 'custom-avatar'");
    });
  });

  describe('getNPCDialoguesTemplate', () => {
    it('should generate dialogue template', () => {
      const result = getNPCDialoguesTemplate('guard', 'Guard');

      expect(result).toContain('guardDialogueTree');
      expect(result).toContain('dialogueTree');
      expect(result).toContain('dialogueNode');
    });

    it('should include greeting dialogue node', () => {
      const result = getNPCDialoguesTemplate('guard', 'Guard');

      expect(result).toContain('const greeting = dialogueNode');
      expect(result).toContain('Hello there!');
    });

    it('should include state import', () => {
      const result = getNPCDialoguesTemplate('guard', 'Guard');

      expect(result).toContain('guardState');
      expect(result).toContain("import { guardState } from './state.js'");
    });

    it('should include dialogue tree builder', () => {
      const result = getNPCDialoguesTemplate('guard', 'Guard');

      expect(result).toContain('.nodes(greeting)');
      expect(result).toContain('.configureEntry()');
      expect(result).toContain('.default(greeting)');
      expect(result).toContain('.build()');
    });

    it('should handle different NPC names', () => {
      const result = getNPCDialoguesTemplate('merchant', 'Merchant');

      expect(result).toContain('merchantDialogueTree');
      expect(result).toContain('merchantState');
    });
  });

  describe('getNPCStateTemplate', () => {
    it('should generate state template', () => {
      const result = getNPCStateTemplate('guard', 'Guard');

      expect(result).toContain('guardState');
      expect(result).toContain('stateRef');
    });

    it('should include state reference', () => {
      const result = getNPCStateTemplate('guard', 'Guard');

      expect(result).toContain("stateRef({ id: 'guard' })");
    });

    it('should include state interface', () => {
      const result = getNPCStateTemplate('guard', 'Guard');

      expect(result).toContain('export interface GuardState');
      expect(result).toContain('hasMet?: boolean');
    });

    it('should handle NPC names with spaces', () => {
      const result = getNPCStateTemplate('shop-keeper', 'Shop Keeper');

      expect(result).toContain('ShopKeeperState');
    });

    it('should include comments with examples', () => {
      const result = getNPCStateTemplate('guard', 'Guard');

      expect(result).toContain('guardState(context).hasMet = true');
    });

    it('should handle different NPC IDs', () => {
      const result = getNPCStateTemplate('merchant', 'Merchant');

      expect(result).toContain("stateRef({ id: 'merchant' })");
      expect(result).toContain('MerchantState');
    });
  });
});

