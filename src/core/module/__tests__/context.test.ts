/**
 * Module Context Tests
 * Tests for module context creation and interactable state methods
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createModuleContext } from '../context.js';
import { actions } from '@core/state/actions.js';
import type { ModuleData } from '@core/module/types/index.js';
import type { Interactable } from '@core/module/types/index.js';

describe('createModuleContext', () => {
  let moduleData: ModuleData;
  const moduleId = 'test-module';
  const locale = 'sv';

  beforeEach(() => {
    moduleData = {
      id: moduleId,
      config: {
        manifest: { id: moduleId, name: 'Test', version: '1.0.0' },
        background: { color: '#000' },
        welcome: { speaker: 'System', lines: ['Welcome'] },
      },
      interactables: [
        {
          id: 'test-npc',
          type: 'npc',
          name: 'Test NPC',
          position: { x: 50, y: 50 },
        },
      ],
      tasks: [],
    };
  });

  it('should create context with module ID and locale', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    expect(context.moduleId).toBe(moduleId);
    expect(context.locale).toBe(locale);
  });

  it('should provide setModuleStateField method', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    const spy = vi.spyOn(actions, 'setModuleStateField');
    
    context.setModuleStateField('key', 'value');
    expect(spy).toHaveBeenCalledWith(moduleId, 'key', 'value');
  });

  it('should provide getModuleStateField method', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    vi.spyOn(actions, 'getModuleStateField').mockReturnValue('value');
    
    const result = context.getModuleStateField('key');
    expect(result).toBe('value');
  });

  it('should provide setInteractableState method', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    const spy = vi.spyOn(actions, 'setInteractableStateField');
    
    context.setInteractableState('npc-id', 'hasMet', true);
    expect(spy).toHaveBeenCalledWith(moduleId, 'npc-id', 'hasMet', true);
  });

  it('should provide getInteractableState method', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    vi.spyOn(actions, 'getInteractableStateField').mockReturnValue(true);
    
    const result = context.getInteractableState('npc-id', 'hasMet');
    expect(result).toBe(true);
  });

  it('should provide getInteractable method', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    
    const interactable = context.getInteractable('test-npc');
    expect(interactable).toBeDefined();
    expect(interactable?.id).toBe('test-npc');
  });

  it('should return null for non-existent interactable', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    
    const interactable = context.getInteractable('non-existent');
    expect(interactable).toBeNull();
  });

  it('should provide task methods', () => {
    const context = createModuleContext(moduleId, locale, moduleData);
    
    expect(context.acceptTask).toBeDefined();
    expect(context.completeTask).toBeDefined();
    expect(context.isTaskCompleted).toBeDefined();
    expect(context.getCurrentTask).toBeDefined();
    expect(context.getCurrentTaskId).toBeDefined();
  });
});
