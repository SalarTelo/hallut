/**
 * Module Creator Showcase - Hub Objects
 * 
 * Information objects that explain each submodule.
 */

import {
  createObject,
  showSignViewer,
  position,
} from '@builders/index.js';

/**
 * Basics Module Info
 * 
 * Information about the basics submodule.
 */
export const basicsInfo = createObject({
  id: 'basics-info',
  name: 'Basics Module Info',
  position: position(20, 20),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Basics',
    content: 'The Basics submodule demonstrates:\n\n• Module structure (config.ts, index.ts, content/)\n• Basic NPC creation\n• Basic object creation (Note)\n• Simple text task\n• Worldmap configuration\n\nThis is the foundation for all modules.',
  }),
});

/**
 * Dialogues Module Info
 */
export const dialoguesInfo = createObject({
  id: 'dialogues-info',
  name: 'Dialogues Module Info',
  position: position(40, 20),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Dialogues',
    content: 'The Dialogues submodule demonstrates:\n\n• Dialogue trees\n• Branching dialogues\n• State-based dialogues\n• Conditional dialogue entry\n• Offering tasks via dialogue\n• State management (stateRef)\n\nLearn how to create interactive conversations.',
  }),
});

/**
 * Tasks Module Info
 */
export const tasksInfo = createObject({
  id: 'tasks-info',
  name: 'Tasks Module Info',
  position: position(60, 20),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Tasks',
    content: 'The Tasks submodule demonstrates:\n\n• Text tasks with validators\n• Multiple choice tasks\n• Image submission tasks\n• Code submission tasks\n• Custom submission tasks\n• Task dialogues and metadata\n\nSee all task types and validation methods.',
  }),
});

/**
 * Objects Module Info
 */
export const objectsInfo = createObject({
  id: 'objects-info',
  name: 'Objects Module Info',
  position: position(80, 20),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Objects',
    content: 'The Objects submodule demonstrates:\n\n• Note viewer\n• Sign viewer\n• Image viewer\n• Video viewer\n• Chat window\n• Custom component objects\n• Locked objects\n\nExplore all object interaction types.',
  }),
});

/**
 * Progression Module Info
 */
export const progressionInfo = createObject({
  id: 'progression-info',
  name: 'Progression Module Info',
  position: position(20, 60),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Progression',
    content: 'The Progression submodule demonstrates:\n\n• Task chains\n• Locked NPCs and objects\n• Module unlock requirements\n• Task-based unlocks\n• Module-based unlocks\n• Combined requirements (AND/OR)\n\nLearn how to create progression systems.',
  }),
});

/**
 * Advanced Module Info
 */
export const advancedInfo = createObject({
  id: 'advanced-info',
  name: 'Advanced Module Info',
  position: position(40, 60),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Showcase: Advanced',
    content: 'The Advanced submodule demonstrates:\n\n• Password unlock requirements\n• Module handlers (onChoiceAction)\n• Custom component renderers\n• Complex state management\n• Module context usage\n\n⚠️ This module is password-protected!\n\nPassword: "advanced123"\n\nThis demonstrates password-protected modules.',
  }),
});

/**
 * All objects for this module
 */
export const objects = [
  basicsInfo,
  dialoguesInfo,
  tasksInfo,
  objectsInfo,
  progressionInfo,
  advancedInfo,
];
