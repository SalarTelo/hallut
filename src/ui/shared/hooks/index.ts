/**
 * Shared Hooks
 *
 * Reusable React hooks shared across features:
 *
 * Module Hooks:
 * - useModuleLoading: Handles module loading lifecycle
 * - useModuleDiscovery: Discovers available modules
 *
 * Interaction Hooks:
 * - useInteractableActions: Handles interactable click actions
 * - useDialogueActions: Manages dialogue state and completion
 * - useDialogueInteraction: Keyboard/click handling for dialogues
 *
 * UI Hooks:
 * - useTypewriter: Typewriter text effect
 *
 * Usage:
 * ```typescript
 * import { useModuleLoading, useTypewriter } from '@ui/shared/hooks/index.js';
 * ```
 *
 * Note: Feature-specific hooks live in their feature folders:
 * - ui/features/module/hooks/
 * - ui/features/task/hooks/
 */

export { useModuleLoading } from './useModuleLoading.js';
export type { UseModuleLoadingOptions, UseModuleLoadingReturn } from './useModuleLoading.js';

export { useInteractableActions } from './useInteractableActions.js';
export type { UseInteractableActionsOptions, InteractableActionResult } from './useInteractableActions.js';

export { useDialogueActions } from './useDialogueActions.js';
export type { UseDialogueActionsOptions } from './useDialogueActions.js';

export { useTypewriter } from './useTypewriter.js';
export type { UseTypewriterOptions, UseTypewriterReturn } from './useTypewriter.js';

export { useModuleDiscovery } from './useModuleDiscovery.js';
export type { UseModuleDiscoveryReturn } from './useModuleDiscovery.js';

export { useDialogueInteraction } from './useDialogueInteraction.js';
export type { UseDialogueInteractionOptions, UseDialogueInteractionReturn } from './useDialogueInteraction.js';

