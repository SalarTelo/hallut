/**
 * Content Modals Component
 * Renders content viewer modals (Image, Note, Sign, Chat, and custom components)
 * 
 * Uses a generic modal state - looks up the component by name and renders it
 */

import type { ReactNode } from 'react';
import { ImageViewer } from '@ui/shared/components/content/index.js';
import { NoteViewer } from '@ui/shared/components/content/index.js';
import { SignViewer } from '@ui/shared/components/content/index.js';
import { ChatWindow } from '@ui/shared/components/game/index.js';
import type { ModalState } from '../hooks/useModuleModals.js';

export type ComponentRenderer = (props: {
  isOpen: boolean;
  onClose: () => void;
  props: Record<string, unknown>;
  borderColor?: string;
}) => ReactNode;

export interface ContentModalsProps {
  /**
   * Current modal state (null if no modal open)
   */
  modal: ModalState | null;
  
  /**
   * Callback to close the modal
   */
  onClose: () => void;
  
  /**
   * Border color for modals
   */
  borderColor: string;
  
  /**
   * Optional map of custom component renderers
   * Keys are component names, values are render functions
   * Custom components will override predefined components with the same name
   */
  customComponents?: Map<string, ComponentRenderer> | Record<string, ComponentRenderer>;
}

/**
 * Content Modals component
 * Renders modals based on component name - supports predefined and custom components
 */
export function ContentModals({
  modal,
  onClose,
  borderColor,
  customComponents,
}: ContentModalsProps) {
  // Get component renderer (custom first, then predefined)
  const getComponentRenderer = (componentName: string): ComponentRenderer | undefined => {
    // Check custom components first (allows overriding predefined)
    if (customComponents) {
      const customRenderer = customComponents instanceof Map
        ? customComponents.get(componentName)
        : customComponents[componentName];
      
      if (customRenderer) {
        return customRenderer;
      }
    }

    // Predefined component renderers
    const predefinedRenderers: Record<string, ComponentRenderer> = {
      ImageViewer: ({ isOpen, onClose, props, borderColor }) => (
        <ImageViewer
          isOpen={isOpen}
          onClose={onClose}
          imageUrl={(props.imageUrl as string) || ''}
          title={props.title as string | undefined}
          borderColor={borderColor}
        />
      ),
      NoteViewer: ({ isOpen, onClose, props, borderColor }) => (
        <NoteViewer
          isOpen={isOpen}
          onClose={onClose}
          content={(props.content as string) || ''}
          title={props.title as string | undefined}
          borderColor={borderColor}
        />
      ),
      SignViewer: ({ isOpen, onClose, props, borderColor }) => (
        <SignViewer
          isOpen={isOpen}
          onClose={onClose}
          content={(props.content as string) || ''}
          title={props.title as string | undefined}
          borderColor={borderColor}
        />
      ),
      ChatWindow: ({ isOpen, onClose, props, borderColor }) => (
        <ChatWindow
          isOpen={isOpen}
          onClose={onClose}
          title={props.title as string | undefined}
          borderColor={borderColor}
        />
      ),
    };

    return predefinedRenderers[componentName];
  };

  // Render current modal
  if (!modal) {
    return null;
  }

  const renderer = getComponentRenderer(modal.component);

  if (!renderer) {
    console.warn(
      `[ContentModals] Unknown component "${modal.component}". ` +
      `Predefined: ImageViewer, NoteViewer, SignViewer, ChatWindow. ` +
      `Provide custom renderer via customComponents prop.`
    );
    return null;
  }

  return renderer({
    isOpen: true,
    onClose,
    props: modal.props,
    borderColor,
  });
}

