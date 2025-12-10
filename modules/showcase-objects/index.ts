/**
 * Showcase: Objects
 * 
 * Demonstrates all object types and interaction methods.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';
import { customObjectViewerRenderer } from './components/CustomObjectViewer.jsx';

const config = createConfig();

/**
 * Custom component renderers
 * 
 * Demonstrates custom component renderers in module definitions.
 * These allow modules to create unique, module-specific interactions
 * beyond standard object types like NoteViewer or SignViewer.
 */
const customComponents = {
  CustomObjectViewer: customObjectViewerRenderer,
};

export default defineModule({
  id: 'showcase-objects',
  config,
  content: {
    interactables,
    tasks,
  },
  components: customComponents,
});
