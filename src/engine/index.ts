/**
 * Modulmotor
 *
 * Hanterar modulladdning, registrering och orkestrering.
 *
 * Komponenter:
 * - moduleLoader: Laddar modulinstanser från modules/-mappen
 * - moduleRegistry: Lagrar och hämtar registrerade moduler
 * - moduleOrchestrator: Hanterar modulens livscykel (starta, stoppa)
 * - engineApi: Publikt API för motoroperationer
 *
 * Flöde:
 * 1. moduleLoader laddar modul från modules/-mappen
 * 2. moduleRegistry lagrar den laddade modulen
 * 3. moduleOrchestrator hanterar start/stopp av moduler
 *
 * Användning:
 * ```typescript
 * import { startModule, stopModule } from '@engine/moduleOrchestrator.js';
 * import { getModuleConfig } from '@engine/moduleRegistry.js';
 * ```
 */

export { loadModuleData, loadModuleInstance, clearModuleCache } from './moduleLoader.js';
export {
  discoverModules,
  registerModule,
  getModuleInstance,
  getModuleConfig,
  getRegisteredModuleIds,
  isModuleRegistered,
  clearModuleConfigCache,
} from './moduleRegistry.js';
export { startModule, stopModule, isModuleActive, getActiveModules } from './moduleOrchestrator.js';
export { createModuleContext, createEngineAPI } from './engineApi.js';
export type { EngineAPI } from './engineApi.js';
export {
  validateModuleConfig,
  logValidationIssues,
  assertValidModuleConfig,
} from './moduleValidator.js';
export type { ValidationIssue, ValidationResult, IssueSeverity } from './moduleValidator.js';
