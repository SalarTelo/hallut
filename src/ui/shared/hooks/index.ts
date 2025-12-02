/**
 * Shared Hooks
 *
 * Reusable React hooks shared across features:
 *
 * UI Hooks:
 * - useTypewriter: Typewriter text effect
 * - useDialogueInteraction: Keyboard and click handling for dialogues
 *
 * Usage:
 * ```typescript
 * import { useTypewriter, useDialogueInteraction } from '@ui/shared/hooks/index.js';
 * ```
 *
 * Note: Feature-specific hooks live in their feature folders:
 * - ui/features/module/hooks/
 * - ui/features/task/hooks/
 * - ui/hooks/ (for feature hooks)
 */

export { useTypewriter } from './useTypewriter.js';
export type { UseTypewriterOptions, UseTypewriterReturn } from './useTypewriter.js';

export { useDialogueInteraction } from './useDialogueInteraction.js';
export type { UseDialogueInteractionOptions, UseDialogueInteractionReturn } from './useDialogueInteraction.js';
export { useThemeBorderColor } from './useThemeBorderColor.js';

