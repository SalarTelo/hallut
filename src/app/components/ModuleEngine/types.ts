/**
 * Module Engine Types
 * Type definitions for ModuleEngine
 */

import type { ComponentRenderer } from './components/ContentModals.js';

export interface ModuleEngineProps {
  moduleId: string;
  locale?: string;
  onExit?: () => void;
  /**
   * Optional map of custom component renderers for object interactions
   * Keys are component names, values are render functions
   */
  customComponents?: Map<string, ComponentRenderer> | Record<string, ComponentRenderer>;
}

