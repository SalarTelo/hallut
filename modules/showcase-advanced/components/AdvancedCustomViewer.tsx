/**
 * Advanced Custom Viewer Component
 * 
 * A custom viewer component demonstrating how to create custom modals
 * for module-specific interactions beyond standard object types.
 */

import type { ReactNode } from 'react';
import { Overlay } from '@ui/shared/components/overlays/index.js';
import { ModalHeader } from '@ui/shared/components/overlays/index.js';
import type { ComponentRenderer } from '@core/module/types/index.js';

export interface AdvancedCustomViewerProps {
  /**
   * Whether the viewer is open
   */
  isOpen: boolean;

  /**
   * Callback to close the viewer
   */
  onClose: () => void;

  /**
   * Custom props passed from the object
   */
  props: {
    title?: string;
    content?: string;
    feature?: string;
    codeExample?: string;
  };

  /**
   * Border color (default from theme)
   */
  borderColor?: string;
}

/**
 * Advanced Custom Viewer component
 * 
 * This demonstrates a custom component that goes beyond standard viewers.
 * It can include interactive elements, custom layouts, or unique functionality.
 */
export function AdvancedCustomViewer({
  isOpen,
  onClose,
  props,
  borderColor = '#fbbf24',
}: AdvancedCustomViewerProps): ReactNode {
  if (!isOpen) return null;

  const {
    title = 'Advanced Custom Viewer',
    content = 'This is a custom component viewer!',
    feature = 'Custom Components',
    codeExample = 'showComponent("AdvancedCustomViewer", { ... })',
  } = props;

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnEscape={true}
      closeOnOverlayClick={true}
    >
      <div
        className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 20px ${borderColor}40`,
        }}
      >
        <ModalHeader
          title={title}
          onClose={onClose}
          borderColor={borderColor}
        />

        <div className="space-y-4">
          {/* Main content */}
          <div className="text-gray-300 leading-relaxed">
            <p className="mb-4">{content}</p>
            
            {/* Feature highlight */}
            <div
              className="p-4 rounded-lg mb-4"
              style={{
                backgroundColor: `${borderColor}15`,
                border: `1px solid ${borderColor}40`,
              }}
            >
              <h4 className="text-yellow-400 font-bold mb-2 text-sm pixelated">
                ✨ Feature: {feature}
              </h4>
              <p className="text-gray-300 text-sm">
                Custom components allow you to create unique interactions
                beyond standard object types like NoteViewer or SignViewer.
              </p>
            </div>

            {/* Code example */}
            <div className="bg-gray-800 rounded p-3 mb-4">
              <p className="text-gray-400 text-xs mb-2 font-mono">Usage:</p>
              <code className="text-green-400 text-xs font-mono break-all">
                {codeExample}
              </code>
            </div>

            {/* Benefits list */}
            <div className="space-y-2">
              <p className="text-yellow-400 font-bold text-sm pixelated mb-2">
                Benefits of Custom Components:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 ml-2">
                <li>Create unique, module-specific interactions</li>
                <li>Implement custom layouts and designs</li>
                <li>Add interactive elements beyond static content</li>
                <li>Integrate with module-specific state and handlers</li>
                <li>Build specialized viewers for your content</li>
              </ul>
            </div>

            {/* Implementation note */}
            <div
              className="mt-4 p-3 rounded"
              style={{
                backgroundColor: `${borderColor}10`,
                borderLeft: `3px solid ${borderColor}`,
              }}
            >
              <p className="text-xs text-gray-400">
                <strong className="text-yellow-400">Note:</strong> This component
                is registered in the module definition's <code className="text-green-400">components</code> field
                and can be used with <code className="text-green-400">showComponent()</code> in object definitions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/**
 * Component renderer for module registration
 * 
 * This function bridges the React component to the ComponentRenderer interface
 * required by the module system.
 */
export const advancedCustomViewerRenderer: ComponentRenderer = ({ isOpen, onClose, props, borderColor }) => {
  return (
    <AdvancedCustomViewer
      isOpen={isOpen}
      onClose={onClose}
      props={props}
      borderColor={borderColor}
    />
  );
};
