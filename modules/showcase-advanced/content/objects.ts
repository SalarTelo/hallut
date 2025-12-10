/**
 * Showcase: Advanced - Objects
 * 
 * Demonstrates custom component objects.
 */

import {
  createObject,
  showSignViewer,
  showComponent,
  position,
} from '@builders/index.js';

/**
 * Custom Component Object
 * 
 * Demonstrates:
 * - showComponent() with custom components
 * - Custom component renderers (defined in module definition)
 * 
 * This uses the AdvancedCustomViewer component registered in the module definition.
 */
export const customComponentObject = createObject({
  id: 'custom-component',
  name: 'Custom Component Object',
  position: position(70, 40),
  avatar: 'note',
  onInteract: showComponent('AdvancedCustomViewer', {
    title: 'Advanced Custom Viewer',
    content: 'This is a fully custom React component viewer! It demonstrates how to create unique, module-specific interactions beyond standard object types.',
    feature: 'Custom Component Renderers',
    codeExample: 'showComponent("AdvancedCustomViewer", { title, content, feature, codeExample })',
  }),
});

/**
 * Password Info Object
 */
export const passwordInfo = createObject({
  id: 'password-info',
  name: 'Password Information',
  position: position(50, 40),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Password Unlock',
    content: 'This module was unlocked using a password! The password was "advanced123".\n\nPassword unlocks are useful for:\n• Special content access\n• Testing modules\n• Educational demonstrations\n• Controlled access to features',
  }),
});

/**
 * All objects for this module
 */
export const objects = [customComponentObject, passwordInfo];
