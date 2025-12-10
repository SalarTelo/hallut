/**
 * Showcase: Basics - Objects
 * 
 * Demonstrates basic object creation with Note viewer.
 */

import {
  createObject,
  showNoteViewer,
  position,
} from '@builders/index.js';

/**
 * Basic Note Object
 * 
 * Demonstrates:
 * - Basic object creation
 * - Note viewer interaction
 * - Simple information display
 */
export const basicNote = createObject({
  id: 'basic-note',
  name: 'Basic Note',
  position: position(70, 40),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Basic Note Object',
    content: 'This is a basic Note object. Notes are simple text displays that provide information to users. They are one of the most common object types for sharing information without requiring dialogue.',
  }),
});

/**
 * All objects for this module
 */
export const objects = [basicNote];
