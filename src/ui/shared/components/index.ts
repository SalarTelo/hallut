/**
 * Shared UI Components
 *
 * Reusable components organized by category for better discoverability.
 * All components accept a className prop for customization.
 *
 * Components are organized into logical folders:
 * - primitives/ - Basic UI building blocks
 * - feedback/ - Loading, error, and empty states
 * - overlays/ - Modals and overlay components
 * - layouts/ - Layout components
 * - dialogue/ - Dialogue system components
 * - game/ - Game-specific components
 * - content/ - Content viewer components
 * - icons/ - Icon components
 *
 * @example
 * ```typescript
 * import { Button, Card, LoadingState } from '@ui/shared/components/index.js';
 * ```
 *
 * @example
 * ```typescript
 * // You can also import from specific categories:
 * import { Button } from '@ui/shared/components/primitives/index.js';
 * import { Modal } from '@ui/shared/components/overlays/index.js';
 * ```
 */

// ============================================================================
// Primitives - Basic UI building blocks
// ============================================================================

export * from './primitives/index.js';

// ============================================================================
// Feedback - Loading, error, and empty states
// ============================================================================

export * from './feedback/index.js';

// ============================================================================
// Overlays & Modals - Overlay components for dialogs and modals
// ============================================================================

export * from './overlays/index.js';

// ============================================================================
// Layouts - Layout components for structuring content
// ============================================================================

export { CenteredLayout, type CenteredLayoutProps } from './layouts/CenteredLayout.js';
export { ContainerLayout, type ContainerLayoutProps } from './layouts/ContainerLayout.js';
export { FullScreenLayout, type FullScreenLayoutProps } from './layouts/FullScreenLayout.js';

// ============================================================================
// Dialogue - Dialogue system components
// ============================================================================

export { DialogueBox, type DialogueBoxProps, type AvatarType } from './DialogueBox.js';
export { FloatingAvatarBadge, type FloatingAvatarBadgeProps } from './dialogue/FloatingAvatarBadge.js';
export { DialogueText, type DialogueTextProps } from './dialogue/DialogueText.js';
export { DialogueChoices, type DialogueChoicesProps, type DialogueChoice } from './dialogue/DialogueChoices.js';

// ============================================================================
// Game UI - Game-specific UI components
// ============================================================================

export * from './game/index.js';

// ============================================================================
// Content Viewers - Components for displaying various content types
// ============================================================================

export * from './content/index.js';

// ============================================================================
// Icons - Icon components
// ============================================================================

export * from './icons/index.js';

