/**
 * Shared UI Components
 *
 * Reusable components organized by type:
 *
 * Primitives (root level):
 * - Button, Card, Input, Textarea, Modal, Badge
 *
 * Feedback:
 * - LoadingSpinner, LoadingState, ErrorDisplay, EmptyState, ErrorBoundary
 *
 * Domain-specific:
 * - layouts/: CenteredLayout, ContainerLayout, FullScreenLayout
 * - dialogue/: DialogueAvatar, DialogueText, DialogueChoices
 * - modulePath/: ModuleNode, ConnectionLines, ModuleTooltip
 *
 * Game UI:
 * - DialogueBox, ModuleBackground, InteractableIcon, ModulePath
 * - ModuleInfoModal, ChatWindow, TaskTracker, ModuleProgressIndicator, ImageViewer
 *
 * Usage:
 * ```typescript
 * import { Button, Card, LoadingState } from '@ui/shared/components/index.js';
 * ```
 *
 * All components accept a className prop for customization.
 */

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button.js';
export { Card, type CardProps } from './Card.js';
export { Input, type InputProps } from './Input.js';
export { Textarea, type TextareaProps } from './Textarea.js';
export { Modal, type ModalProps } from './Modal.js';
export { Overlay, type OverlayProps } from './Overlay.js';
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge.js';
export { DialogueBox, type DialogueBoxProps, type AvatarType } from './DialogueBox.js';
export { ModuleBackground, type ModuleBackgroundProps } from './ModuleBackground.js';
export { InteractableIcon, type InteractableIconProps, type IconShape } from './InteractableIcon.js';
export { ModulePath, type ModulePathProps } from './ModulePath.js';
export { ModuleInfoModal, type ModuleInfoModalProps } from './ModuleInfoModal.js';
export { ChatWindow, type ChatWindowProps, type ChatMessage } from './ChatWindow.js';
export { TaskTracker, type TaskTrackerProps } from './TaskTracker.js';
export { ModuleProgressIndicator, type ModuleProgressIndicatorProps } from './ModuleProgressIndicator.js';
export { LoadingSpinner, type LoadingSpinnerProps } from './LoadingSpinner.js';
export { LoadingState, type LoadingStateProps } from './LoadingState.js';
export { ErrorDisplay, type ErrorDisplayProps } from './ErrorDisplay.js';
export { EmptyState, type EmptyStateProps } from './EmptyState.js';
export { ImageViewer, type ImageViewerProps } from './ImageViewer.js';
export { NoteViewer, type NoteViewerProps } from './NoteViewer.js';
export { SignViewer, type SignViewerProps } from './SignViewer.js';
export { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary.js';

