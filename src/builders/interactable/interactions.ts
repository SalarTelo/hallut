/**
 * Interaction Builders
 * Functions for creating object interactions
 */

import type {
  ObjectInteraction,
  InteractableComponentName,
  NoteViewerProps,
  SignViewerProps,
  ChatWindowProps,
  ImageViewerProps,
} from '@core/module/types/index.js';

// showDialogue removed - objects should use showNoteViewer, showSignViewer, etc. instead
// For NPCs, use dialogueTree with createNPC

/**
 * Show component interaction
 * Accepts predefined type-safe components or custom component names
 */
export function showComponent(
  componentName: InteractableComponentName | string,
  props?: Record<string, unknown>
): ObjectInteraction {
  return {
    type: 'component',
    component: componentName,
    props,
  };
}

/**
 * Show NoteViewer component interaction (type-safe)
 */
export function showNoteViewer(props: NoteViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'NoteViewer',
    props,
  };
}

/**
 * Show SignViewer component interaction (type-safe)
 */
export function showSignViewer(props: SignViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'SignViewer',
    props,
  };
}

/**
 * Show ChatWindow component interaction (type-safe)
 */
export function showChatWindow(props?: ChatWindowProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'ChatWindow',
    props: props || {},
  };
}

/**
 * Show ImageViewer component interaction (type-safe)
 */
export function showImageViewer(props: ImageViewerProps): ObjectInteraction {
  return {
    type: 'component',
    component: 'ImageViewer',
    props,
  };
}

/**
 * Show image interaction (uses component pattern)
 */
export function showImage(imageUrl: string, title?: string): ObjectInteraction {
  return showImageViewer({ imageUrl, title });
}

/**
 * Show note interaction
 */
export function showNote(content: string, title?: string): ObjectInteraction {
  return {
    type: 'component',
    component: 'NoteViewer',
    props: { content, title },
  };
}

