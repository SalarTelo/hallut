/**
 * Game-Specific Components
 * Components specific to the game/module system
 */

export { ModuleBackground, type ModuleBackgroundProps } from './ModuleBackground.js';
export { InteractableIcon, type InteractableIconProps, type IconShape } from './InteractableIcon.js';
export { ModulePath, type ModulePathProps } from './ModulePath.js';
export { ModuleInfoModal, type ModuleInfoModalProps } from './ModuleInfoModal.js';
export { ModuleProgressIndicator, type ModuleProgressIndicatorProps } from './ModuleProgressIndicator.js';
export { TaskTracker, type TaskTrackerProps } from './TaskTracker.js';
export { ChatWindow, type ChatWindowProps, type ChatMessage } from './ChatWindow.js';
export { FloatingChatWidget, type FloatingChatWidgetProps } from './FloatingChatWidget.js';
export { PasswordUnlockModal, type PasswordUnlockModalProps } from './PasswordUnlockModal.js';

// ModulePath sub-components
export { ModuleNode, type ModuleNodeProps } from './modulePath/ModuleNode.js';
export { ConnectionLines, type ConnectionLinesProps } from './modulePath/ConnectionLines.js';
export { ModuleTooltip, type ModuleTooltipProps } from './modulePath/ModuleTooltip.js';
export { formatModuleName } from './modulePath/utils.js';

