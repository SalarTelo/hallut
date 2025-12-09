/**
 * Module Definition
 * Helper to define modules
 */

import type { ModuleDefinition, ModuleConfig, ModuleContent, ModuleHandlers } from './types/index.js';

/**
 * Define a module
 */
export function defineModule(options: {
  id: string;
  config: ModuleConfig;
  content: ModuleContent;
  handlers?: ModuleHandlers;
  components?: Record<string, import('./types/index.js').ComponentRenderer>;
}): ModuleDefinition {
  return {
    id: options.id,
    config: options.config,
    content: options.content,
    handlers: options.handlers,
    components: options.components,
  };
}

