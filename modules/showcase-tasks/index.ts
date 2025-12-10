/**
 * Showcase: Tasks
 * 
 * Demonstrates all task types, validators, and task features.
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';
import { customTaskSubmissionRenderer } from './components/CustomTaskSubmission.jsx';

const config = createConfig();

/**
 * Custom task submission components
 */
const taskSubmissionComponents = {
  CustomTaskSubmission: customTaskSubmissionRenderer,
};

export default defineModule({
  id: 'showcase-tasks',
  config,
  content: {
    interactables,
    tasks,
  },
  taskSubmissionComponents,
});
