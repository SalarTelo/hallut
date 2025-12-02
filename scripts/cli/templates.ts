/**
 * Template Functions
 * Code generation templates for modules, NPCs, tasks, and objects
 */

export function getIndexTemplate(moduleId: string, displayName: string): string {
  return `/**
 * ${displayName} Module
 * Module definition - This is the entry point for the module
 * 
 * This file uses defineModule() to create the module with its configuration
 * and content (tasks, NPCs, objects).
 */

import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

// Create config with tasks
const config = createConfig();

// Define module
export default defineModule({
  id: '${moduleId}',
  config,
  content: {
    interactables,
    tasks,
  },
});
`;
}

export function getConfigTemplate(
  moduleId: string,
  displayName: string,
  description: string,
  version: string,
  bgColor: string,
  unlockRequirement: string,
  worldmap: string
): string {
  return `/**
 * ${displayName} Module Configuration
 * 
 * This file contains the module's configuration including:
 * - Manifest: Module metadata (id, name, version, summary)
 * - Background: Visual background for the module
 * - Welcome: Welcome message shown when entering the module
 * - Unlock Requirement: Conditions that must be met to unlock this module
 * - Worldmap: Position and icon for the module on the worldmap
 */

import { createModuleConfig, createManifest, colorBackground, createWelcome${unlockRequirement.includes('moduleComplete') ? ', moduleComplete' : ''}${unlockRequirement.includes('passwordUnlock') ? ', passwordUnlock' : ''}${unlockRequirement.includes('andRequirements') ? ', andRequirements' : ''}${unlockRequirement.includes('orRequirements') ? ', orRequirements' : ''} } from '@utils/builders/modules.js';${unlockRequirement.includes('taskComplete') || unlockRequirement.includes('stateCheck') ? `\nimport { ${unlockRequirement.includes('taskComplete') ? 'taskComplete' : ''}${unlockRequirement.includes('taskComplete') && unlockRequirement.includes('stateCheck') ? ', ' : ''}${unlockRequirement.includes('stateCheck') ? 'stateCheck' : ''} } from '@utils/builders/interactables.js';` : ''}

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest('${moduleId}', '${displayName}', '${version}', '${description}'),
    background: colorBackground('${bgColor}'),
    welcome: createWelcome('System', [
      'Welcome to ${displayName}!',
      'This is your new module.',
    ]),${unlockRequirement ? `\n    unlockRequirement: ${unlockRequirement},` : ''}${worldmap ? `\n    ${worldmap}` : ''}
  });
}
`;
}

export function getContentIndexTemplate(): string {
  return `/**
 * Module Content
 * Central export for all content (tasks, NPCs, objects)
 * 
 * This file aggregates all content from the module and exports it.
 */

export * from './tasks.js';
export * from './NPCs.js';
export * from './objects.js';
`;
}

export function getTasksTemplateQuick(): string {
  return `/**
 * Module Tasks
 * 
 * Define all tasks for this module here.
 * Tasks are learning objectives that players complete.
 * 
 * TODO: Add your tasks below using createTask()
 * 
 * Note: If you create an example NPC, you may need to export an exampleTask
 * here for the NPC to reference. See getTasksTemplateDetailed() for an example.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@utils/builders/tasks.js';

/**
 * All tasks for this module
 */
export const tasks: Array<import('@core/types/task.js').Task> = [];
`;
}

export function getTasksTemplateDetailed(): string {
  return `/**
 * Module Tasks
 * 
 * Define all tasks for this module here.
 * Tasks are learning objectives that players complete.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@utils/builders/tasks.js';

/**
 * Example task: Write a greeting
 * 
 * This is an example task demonstrating the basic structure.
 * TODO: Replace with your own tasks.
 */
export const exampleTask = createTask({
  id: 'example',
  name: 'Example Task',
  description: 'This is an example task. Replace with your own.',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    // TODO: Add your custom validation logic here
    if (text.length >= 10) {
      return success('task_complete', 'Great job!', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Complete the example task'],
  },
  unlockRequirement: null, // No requirement - always available
  dialogues: {
    offer: ['I have a task for you if you\\'re interested.'],
    ready: ['Are you ready to submit your task?'],
    complete: ['Excellent work! You have completed the task.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [exampleTask];
`;
}

export function getObjectsTemplateQuick(): string {
  return `/**
 * Module Objects
 * 
 * Define all simple interactable objects (non-NPCs) here.
 * Objects are items that players can interact with (signs, chests, etc.)
 * 
 * TODO: Add your objects below using createObject() or helper functions
 */

import {
  createObject,
  createNoteObject,
  createImageObject,
  showNoteViewer,
  showImageViewer,
  pos,
} from '@utils/builders/index.js';

/**
 * All objects for this module
 */
export const objects: Array<import('@core/types/interactable.js').Object> = [];
`;
}

export function getObjectsTemplateDetailed(): string {
  return `/**
 * Module Objects
 * 
 * Define all simple interactable objects (non-NPCs) here.
 * Objects are items that players can interact with (signs, chests, etc.)
 */

import {
  createObject,
  createNoteObject,
  createImageObject,
  showNoteViewer,
  showImageViewer,
  pos,
} from '@utils/builders/index.js';

/**
 * Example Object: Sign (Note Viewer)
 * 
 * A simple sign that displays text when clicked.
 */
export const signObject = createObject({
  id: 'sign',
  name: 'Sign',
  position: pos(60, 50),
  avatar: 'note',
  interaction: showNoteViewer({
    content: 'This is an example sign. You can read it!',
    title: 'Welcome Sign',
  }),
});

/**
 * Example Object: Image Viewer
 * 
 * An object that displays an image when clicked.
 * TODO: Replace with your own images and paths.
 */
export const imageObject = createImageObject({
  id: 'example-image',
  name: 'Example Image',
  position: pos(40, 70),
  imageUrl: '/images/example.jpg', // TODO: Update path
  title: 'Example Image',
  avatar: 'image',
});

/**
 * Example Object: Custom Component
 * 
 * An object that opens a custom component when clicked.
 * TODO: Replace with your own component name and props.
 */
export const customObject = createObject({
  id: 'custom-object',
  name: 'Custom Object',
  position: pos(80, 30),
  avatar: 'box',
  interaction: {
    type: 'component',
    component: 'YourComponent', // TODO: Replace with your component name
    props: {
      // TODO: Add your component props
    },
  },
});

/**
 * All objects for this module
 */
export const objects = [signObject, imageObject, customObject];
`;
}

export function getNPCsTemplate(): string {
  return `/**
 * NPC Aggregation
 * 
 * This file imports and exports all NPCs from their individual folders.
 * Each NPC should have its own folder in content/NPC/{npc-name}/
 * 
 * To add a new NPC:
 * 1. Create the NPC folder: content/NPC/{npc-name}/
 * 2. Create the NPC files (index.ts, dialogues.ts, state.ts)
 * 3. Import and add to this array below
 */

// TODO: Import your NPCs here
// import { guardNPC } from './NPC/guard/index.js';

/**
 * All NPCs for this module
 */
export const NPCs: Array<import('@core/types/interactable.js').NPC> = [];

/**
 * Combined interactables (NPCs + objects)
 * This is exported and used by the module
 */
export const interactables = [...NPCs];
`;
}

export function getNPCIndexTemplate(npcId: string, npcName: string, position: { x: number; y: number }, avatar: string, hasTasks: boolean, hasDialogue: boolean): string {
  return `/**
 * ${npcName} NPC
 * NPC definition for ${npcName.toLowerCase()}
 * 
 * This file defines the NPC using createNPC().
 * It imports dialogue and state from other files in this folder.
 */

import { createNPC, pos } from '@utils/builders/index.js';${hasTasks ? `\nimport { exampleTask } from '../../tasks.js'; // Make sure exampleTask is exported in tasks.ts` : ''}${hasDialogue ? `\nimport { ${npcId}DialogueTree } from './dialogues.js';` : ''}

/**
 * ${npcName} NPC definition
 * 
 * Position: (${position.x}, ${position.y})
 * Avatar: ${avatar}
 */
export const ${npcId}NPC = createNPC({
  id: '${npcId}',
  name: '${npcName}',
  position: pos(${position.x}, ${position.y}),
  avatar: '${avatar}',${hasTasks ? `\n  tasks: [exampleTask], // TODO: Update with actual tasks` : ''}${hasDialogue ? `\n  dialogueTree: ${npcId}DialogueTree,` : `\n  dialogueTree: null, // TODO: Add dialogue tree`}
});
`;
}

export function getNPCDialoguesTemplate(npcId: string, npcName: string, hasExampleTask: boolean = false): string {
  const taskImport = hasExampleTask ? `\nimport { exampleTask } from '../../tasks.js';` : '';
  const taskAcceptChoice = hasExampleTask ? `
    accept_task: {
      text: 'I\\'ll help with that',
      next: null, // Close dialogue after accepting task
      actions: [
        callFunction((ctx) => { ${npcId}State(ctx).hasMet = true; }),
        acceptTask(exampleTask),
      ],
    },` : '';
  const taskReadyNode = hasExampleTask ? `
/**
 * Dialogue node: Task ready for submission
 * 
 * This is shown when the player has the task and is ready to submit.
 */
const taskReady = dialogueNode({
  task: exampleTask, // Link this dialogue to the task
  lines: [
    'Are you ready to submit your task?',
  ],
  choices: {
    yes: {
      text: 'Yes, I\\'m ready to submit',
      next: null, // Close dialogue and open task submission
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(exampleTask);
          }
        }),
      ],
    },
    not_yet: {
      text: 'Not yet',
      next: null, // Close dialogue
    },
  },
});
` : '';
  const taskReadyInNodes = hasExampleTask ? ', taskReady' : '';

  return `/**
 * ${npcName} Dialogue Tree
 * Dialogue configuration and conversation flow for ${npcName.toLowerCase()}
 * 
 * This file contains all dialogue nodes and the dialogue tree structure.
 * Dialogues are conversations that players have with this NPC.
 */

import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@utils/builders/dialogues.js';
import { ${npcId}State } from './state.js';${taskImport}

/**
 * Dialogue node: Initial greeting (first meeting)
 * 
 * This is shown when the player first interacts with ${npcName.toLowerCase()}.
 */
const greeting = dialogueNode({
  lines: [
    'Hello there!',
    'Welcome to the module.',${hasExampleTask ? `\n    'I have a task for you if you\\'re interested.',` : ''}
    'How can I help you?',
  ],
  choices: {${taskAcceptChoice}
    talk: {
      text: 'Just talking',
      next: null, // Close dialogue
      actions: [
        callFunction((ctx) => { ${npcId}State(ctx).hasMet = true; }),
      ],
    },
    later: {
      text: 'Maybe later',
      next: null, // Close dialogue
      actions: [
        callFunction((ctx) => { ${npcId}State(ctx).hasMet = true; }),
      ],
    },
  },
});

${hasExampleTask ? `/**
 * Dialogue node: General greeting (returning player)
 * 
 * This is shown when the player has met ${npcName.toLowerCase()} before.
 */
const generalGreeting = dialogueNode({
  lines: [
    'Hello!',
    'What can I do for you?',
  ],
  choices: {
    talk: {
      text: 'Just talking',
      next: null, // Close dialogue
    },
    later: {
      text: 'Never mind',
      next: null, // Close dialogue
    },
  },
});

` : ''}${taskReadyNode}/**
 * ${npcName} dialogue tree
 * 
 * Defines entry conditions and connects all dialogue nodes.
 * TODO: Add more dialogue nodes and configure entry logic.
 */
export const ${npcId}DialogueTree = dialogueTree()
  .nodes(greeting${hasExampleTask ? ', generalGreeting' : ''}${taskReadyInNodes})
  .configureEntry()
    ${hasExampleTask ? `.when((ctx) => ${npcId}State(ctx).hasMet === true).use(generalGreeting)\n    ` : ''}.default(greeting)
  .build();
${hasExampleTask ? `
// Note: The taskReady dialogue will automatically be shown when the exampleTask is active.
// The dialogue tree builder handles task-specific dialogue entry automatically.` : ''}
`;
}

export function getNPCStateTemplate(npcId: string, npcName: string): string {
  return `/**
 * ${npcName} NPC State
 * State management and type definitions for ${npcName.toLowerCase()}
 * 
 * This file manages NPC-specific state that persists across interactions.
 * Use stateRef() to create a reference that can be accessed in dialogues.
 */

import { stateRef } from '@utils/builders/dialogues.js';

/**
 * ${npcName} state reference
 * 
 * Use this to access and modify ${npcName.toLowerCase()}-specific state in dialogues and handlers.
 * Example: ${npcId}State(context).hasMet = true;
 */
export const ${npcId}State = stateRef({ id: '${npcId}' });

/**
 * ${npcName} state type definition
 * 
 * Define the shape of state specific to this NPC.
 * This is optional but helps with type safety.
 */
export interface ${npcName.replace(/\s+/g, '')}State {
  hasMet?: boolean;
  // TODO: Add other ${npcName.toLowerCase()}-specific state properties here
}
`;
}

