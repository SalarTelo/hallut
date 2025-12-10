/**
 * Showcase: Advanced
 * 
 * Demonstrates advanced features: password locks, handlers, custom components, and state management.
 * 
 * ⚠️ This module is password-protected!
 * Password: "advanced123"
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';
import { advancedCustomViewerRenderer } from './components/AdvancedCustomViewer.jsx';

const config = createConfig();

/**
 * Custom component renderers
 * 
 * Demonstrates custom component renderers in module definitions.
 * These allow modules to create unique, module-specific interactions
 * beyond standard object types like NoteViewer or SignViewer.
 */
const customComponents = {
  AdvancedCustomViewer: advancedCustomViewerRenderer,
};

/**
 * Module handler for choice actions
 * 
 * Demonstrates module handlers (onChoiceAction).
 * This handler can intercept and handle dialogue choice actions.
 */
const handlers = {
  onChoiceAction: async (dialogueId: string, action: any, context: any) => {
    // Example: Log choice actions for debugging or analytics
    console.log('Choice action:', { dialogueId, action, context });
    
    // Example: Custom logic based on choice actions
    // You can modify state, trigger side effects, etc.
    // This demonstrates how modules can respond to dialogue choices
  },
};

export default defineModule({
  id: 'showcase-advanced',
  config,
  content: {
    interactables,
    tasks,
  },
  handlers,
  components: customComponents,
});
