/**
 * Shared UI Components
 *
 * Reusable components organized by category for better discoverability.
 * All components accept a className prop for customization.
 *
 * @example
 * ```typescript
 * import { Button, Card, LoadingState } from '@ui/shared/components/index.js';
 * ```
 */

// ============================================================================
// Primitives - Basic UI building blocks
// ============================================================================

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button.js';
export { Card, type CardProps } from './Card.js';
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge.js';
export { Input, type InputProps } from './Input.js';
export { Textarea, type TextareaProps } from './Textarea.js';

// ============================================================================
// Overlays & Modals - Overlay components for dialogs and modals
// ============================================================================

export { Modal, type ModalProps } from './Modal.js';
export { Overlay, type OverlayProps } from './Overlay.js';
export { ModalHeader, type ModalHeaderProps } from './ModalHeader.js';
export { ModalContent, type ModalContentProps } from './ModalContent.js';
export { CloseButton, type CloseButtonProps } from './CloseButton.js';

// ============================================================================
// Feedback - Loading, error, and empty states
// ============================================================================

export { LoadingSpinner, type LoadingSpinnerProps } from './LoadingSpinner.js';
export { LoadingState, type LoadingStateProps } from './LoadingState.js';
export { ErrorDisplay, type ErrorDisplayProps } from './ErrorDisplay.js';
export { EmptyState, type EmptyStateProps } from './EmptyState.js';
export { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary.js';

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

export { ModuleBackground, type ModuleBackgroundProps } from './ModuleBackground.js';
export { InteractableIcon, type InteractableIconProps, type IconShape } from './InteractableIcon.js';
export { ModulePath, type ModulePathProps } from './ModulePath.js';
export { ModuleNode, type ModuleNodeProps } from './modulePath/ModuleNode.js';
export { ConnectionLines, type ConnectionLinesProps } from './modulePath/ConnectionLines.js';
export { ModuleTooltip, type ModuleTooltipProps } from './modulePath/ModuleTooltip.js';
export { ModuleInfoModal, type ModuleInfoModalProps } from './ModuleInfoModal.js';
export { ModuleProgressIndicator, type ModuleProgressIndicatorProps } from './ModuleProgressIndicator.js';
export { TaskTracker, type TaskTrackerProps } from './TaskTracker.js';
export { ChatWindow, type ChatWindowProps, type ChatMessage } from './ChatWindow.js';
export { PasswordUnlockModal, type PasswordUnlockModalProps } from './PasswordUnlockModal.js';

// ============================================================================
// Content Viewers - Components for displaying various content types
// ============================================================================

export { ImageViewer, type ImageViewerProps } from './ImageViewer.js';
export { NoteViewer, type NoteViewerProps } from './NoteViewer.js';
export { SignViewer, type SignViewerProps } from './SignViewer.js';
export { ContentViewer, type ContentViewerProps } from './ContentViewer.js';
export { ImageAnalysisView, type ImageAnalysisViewProps } from './ImageAnalysisView.js';

// ============================================================================
// Utilities - Helper components
// ============================================================================

export { PixelIcon, type PixelIconProps, type PixelIconType } from './PixelIcon.js';

