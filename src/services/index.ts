/**
 * Services
 *
 * Business logic layer - stateless functions that process data.
 * Services return results; they don't modify state directly.
 * State modifications happen through stores.
 *
 * Available Services:
 * - dialogueService: Generates dialogue configurations from modules
 * - errorService: Centralized error handling and logging
 * - moduleService: Module progression, unlocking, completion checks
 * - taskService: Task evaluation and submission handling
 * - worldmapService: World map and module discovery
 * - ollamaService: AI chat integration with Ollama API
 *
 * Actions (services/actions/):
 * - moduleActions: Store action helpers for module state
 *
 * Usage:
 * ```typescript
 * import { generateDialoguesFromModule } from '@services/dialogueService.js';
 * import { checkModuleDependencies } from '@services/moduleService.js';
 * import { handleError } from '@services/errorService.js';
 * ```
 *
 * Pattern: Services are pure functions that take data and return results.
 * They may read from stores but should not write to them directly.
 */

export { generateDialoguesFromModule, getDialogueConfig } from './dialogueService.js';
export { handleError, registerErrorHandler, getUserFriendlyMessage } from './errorService.js';
export {
  // Chat
  sendChatMessage,
  streamChatMessage,
  // Vision
  analyzeImage,
  sendChatWithImages,
  // Image Generation
  generateImage,
  streamImageGeneration,
  // Utilities
  checkOllamaAvailable,
  getAvailableModels,
  fileToBase64,
  imageUrlToBase64,
  DEFAULT_MODELS,
  // Types
  type OllamaMessage,
} from './ollamaService.js';
export type { ErrorHandler } from './errorService.js';
export {
  checkModuleDependencies,
  checkModuleUnlockStatus,
  checkModuleCompletionStatus,
  getModuleProgressionState,
  initializeModuleProgression,
  isModuleFullyCompleted,
  getModuleProgressionInitActions,
} from './moduleService.js';
export { evaluateTaskSubmission, validateTaskSubmission } from './taskService.js';
export { generateWorldmap, getWorldmap, clearWorldmapCache } from './worldmapService.js';
export { moduleActions } from './actions/index.js';

