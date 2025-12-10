/**
 * Professor Chen NPC
 * 
 * An enthusiastic machine learning educator who guides students
 * through fundamental ML concepts with engaging tasks and helpful explanations.
 */

import { createNPC, position } from '@builders/index.js';
import { supervisedLearningTask, neuralNetworksTask } from '../../tasks.js';
import { professorDialogueTree } from './dialogues.js';

/**
 * Professor Chen NPC definition
 * 
 * This NPC:
 * - Provides educational guidance on machine learning
 * - Offers tasks related to ML fundamentals
 * - Tracks student progress and engagement
 * - Adapts dialogue based on learning progress
 */
export const professorNPC = createNPC({
  id: 'professor-chen',
  name: 'Professor Chen',
  position: position(35, 45),
  avatar: '👨‍🏫',
  tasks: [supervisedLearningTask, neuralNetworksTask],
  dialogueTree: professorDialogueTree,
  meta: {
    role: 'educator',
    personality: 'Enthusiastic and supportive educator passionate about machine learning',
  },
});
