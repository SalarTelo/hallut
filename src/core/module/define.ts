/**
 * Module Definition
 * Helper to define modules
 */

import type { ModuleDefinition, ModuleConfig, ModuleContent, ModuleHandlers } from '../types/module.js';

/**
 * Define a module
 */
export function defineModule(options: {
  id: string;
  config: ModuleConfig;
  content: ModuleContent;
  handlers?: ModuleHandlers;
}): ModuleDefinition {
  return {
    id: options.id,
    config: options.config,
    content: options.content,
    handlers: options.handlers,
  };
}

