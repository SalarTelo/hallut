/**
 * Showcase: Objects - All Object Types
 * 
 * Demonstrates all available object types and interactions.
 */

import {
  createObject,
  showNoteViewer,
  showSignViewer,
  showImageViewer,
  showVideoViewer,
  showChatWindow,
  showComponent,
  position,
  taskComplete,
} from '@builders/index.js';
import { unlockTask } from './tasks.js';

/**
 * Note Viewer Object
 * 
 * Demonstrates:
 * - showNoteViewer()
 * - Simple text display
 */
export const noteObject = createObject({
  id: 'note-object',
  name: 'Note Object',
  position: position(20, 30),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Note Viewer',
    content: 'This is a Note object. Notes display text information in a simple format. They are great for tips, explanations, or general information.',
  }),
});

/**
 * Sign Viewer Object
 * 
 * Demonstrates:
 * - showSignViewer()
 * - Text with title display
 */
export const signObject = createObject({
  id: 'sign-object',
  name: 'Sign Object',
  position: position(40, 30),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Sign Viewer',
    content: 'This is a Sign object. Signs are similar to Notes but are typically used for more prominent information, announcements, or important notices. They display a title and content.',
  }),
});

/**
 * Image Viewer Object
 * 
 * Demonstrates:
 * - showImageViewer()
 * - Image display
 */
export const imageObject = createObject({
  id: 'image-object',
  name: 'Image Object',
  position: position(60, 30),
  avatar: 'note',
  onInteract: showImageViewer({
    title: 'Image Viewer',
    imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Image+Viewer+Example',
  }),
});

/**
 * Video Viewer Object
 * 
 * Demonstrates:
 * - showVideoViewer()
 * - Video display (YouTube)
 */
export const videoObject = createObject({
  id: 'video-object',
  name: 'Video Object',
  position: position(80, 30),
  avatar: 'note',
  onInteract: showVideoViewer({
    title: 'Video Viewer',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }),
});

/**
 * Chat Window Object
 * 
 * Demonstrates:
 * - showChatWindow()
 * - Interactive chat interface
 */
export const chatObject = createObject({
  id: 'chat-object',
  name: 'Chat Object',
  position: position(30, 50),
  avatar: 'note',
  onInteract: showChatWindow({
    title: 'Chat Window',
    placeholder: 'Type a message to test the chat window...',
  }),
});

/**
 * Custom Component Object
 * 
 * Demonstrates:
 * - showComponent()
 * - Custom React component interaction
 */
export const customObject = createObject({
  id: 'custom-object',
  name: 'Custom Component Object',
  position: position(50, 50),
  avatar: 'note',
  onInteract: showComponent('CustomObjectViewer', {
    title: 'Custom Object Viewer',
    content: 'This is a fully custom React component viewer for objects! It demonstrates how to create unique, module-specific interactions beyond standard object types.',
    feature: 'Custom Object Components',
    interactive: true,
  }),
});

/**
 * Locked Object
 * 
 * Demonstrates:
 * - Locked objects
 * - Unlock requirements
 * - taskComplete() requirement
 */
export const lockedObject = createObject({
  id: 'locked-object',
  name: 'Locked Object',
  position: position(70, 50),
  avatar: 'note',
  locked: true,
  unlockRequirement: taskComplete(unlockTask),
  onInteract: showSignViewer({
    title: 'Locked Object (Now Unlocked!)',
    content: 'This object was locked until you completed the unlock task. Locked objects can be unlocked by completing tasks, modules, or other requirements.',
  }),
});

/**
 * All objects for this module
 */
export const objects = [
  noteObject,
  signObject,
  imageObject,
  videoObject,
  chatObject,
  customObject,
  lockedObject,
];
