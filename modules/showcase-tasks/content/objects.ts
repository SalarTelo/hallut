/**
 * Showcase: Tasks - Objects
 * 
 * Information objects about task features.
 */

import {
  createObject,
  showSignViewer,
  position,
} from '@builders/index.js';

/**
 * Task Types Info
 */
export const taskTypesInfo = createObject({
  id: 'task-types-info',
  name: 'Task Types Information',
  position: position(70, 30),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Task Types',
    content: 'Available task types:\n\n• Text - Users write text\n• Multiple Choice - Users select from options\n• Image - Users upload images\n• Code - Users write code\n• Custom - Custom component interactions\n\nEach type has different validation methods.',
  }),
});

/**
 * Validators Info
 */
export const validatorsInfo = createObject({
  id: 'validators-info',
  name: 'Validators Information',
  position: position(70, 50),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Task Validators',
    content: 'Available validators:\n\n• textLengthValidator() - Check minimum length\n• wordCountValidator() - Check minimum word count\n• keywordsValidator() - Check for keywords\n• Custom validation - Write your own logic\n\nValidators return success() or failure() results.',
  }),
});

/**
 * All objects for this module
 */
export const objects = [taskTypesInfo, validatorsInfo];
