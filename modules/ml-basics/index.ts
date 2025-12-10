/**
 * Machine Learning Basics Module
 * 
 * An educational module introducing fundamental machine learning concepts
 * through interactive tasks, engaging NPCs, and informative content.
 * 
 * This module demonstrates:
 * - Comprehensive task definitions with rich meta information
 * - Educational NPC with personality and adaptive dialogues
 * - Informative objects that enhance learning
 * - Clear learning objectives and progression
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'ml-basics',
  config,
  content: {
    interactables,
    tasks,
  },
});
