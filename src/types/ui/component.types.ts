/**
 * UI Component Types
 * Types for UI components
 * Depends on: Module types
 */

import type { ModuleComponentProps } from '../module/moduleConfig.types.js';
import type { ComponentType } from 'react';

/**
 * Re-export for convenience
 */
export type { ModuleComponentProps };

/**
 * Generic component type for module components
 */
export type ModuleComponent = ComponentType<ModuleComponentProps>;

