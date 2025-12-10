/**
 * Showcase: Dialogues - Objects
 * 
 * Information objects about dialogue features.
 */

import {
  createObject,
  showSignViewer,
  position,
} from '@builders/index.js';

/**
 * Dialogue Info Object
 */
export const dialogueInfo = createObject({
  id: 'dialogue-info',
  name: 'Dialogue Information',
  position: position(70, 40),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Dialogue Features',
    content: 'This module demonstrates:\n\n• dialogueTree() - Create dialogue trees\n• dialogueNode() - Create dialogue nodes\n• Branching dialogues with choices\n• State-based dialogues with stateRef\n• Conditional dialogue entry\n• Offering tasks via dialogue\n\nTalk to the Dialogue Teacher to see these in action!',
  }),
});

/**
 * All objects for this module
 */
export const objects = [dialogueInfo];
