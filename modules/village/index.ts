/**
 * Village Module
 * A peaceful village to visit
 */

import { defineModule } from '../../src/core/module/define.js';
import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import { createTask, textSubmission, textLengthValidator, success } from '../../src/utils/builders/tasks.js';
import {
  createNPC,
  createObject,
  createLocation,
  createNoteObject,
  createImageObject,
  pos,
  showDialogue,
  showSignViewer,
  showChatWindow,
  showNote,
} from '../../src/utils/builders/interactables.js';
import { createDialogue } from '../../src/utils/builders/dialogues.js';

const task = createTask({
  id: 'help-villagers',
  name: 'Help the Villagers',
  description: 'Help the villagers with their tasks.',
  submission: textSubmission(),
  validate: textLengthValidator(15, () => {
    return success('helped', 'You helped the villagers!', 100);
  }),
  overview: {
    requirements: 'Write at least 15 characters',
    goals: ['Help the villagers', 'Complete their requests'],
  },
});

// NPC with dialogues
const mayor = createNPC({
  id: 'mayor',
  name: 'Mayor',
  position: pos(30, 40),
  avatar: '👨‍💼',
  dialogues: {
    greeting: createDialogue({
      id: 'mayor-greeting',
      speaker: 'Mayor',
      lines: [
        'Welcome to our peaceful village!',
        'I am the mayor here.',
        'Feel free to explore and talk to everyone.',
      ],
    }),
    help: createDialogue({
      id: 'mayor-help',
      speaker: 'Mayor',
      lines: [
        'We could really use your help!',
        'There are many tasks to complete around the village.',
      ],
    }),
  },
});

// NPC with task
const blacksmith = createNPC({
  id: 'blacksmith',
  name: 'Blacksmith',
  position: pos(70, 30),
  avatar: '🔨',
  dialogues: {
    greeting: createDialogue({
      id: 'blacksmith-greeting',
      speaker: 'Blacksmith',
      lines: [
        'I forge the finest weapons in the land!',
        'But I need help gathering materials.',
      ],
    }),
  },
  tasks: {
    'help-villagers': task,
  },
});

// Object with component interaction
const sign = createObject({
  id: 'village-sign',
  name: 'Village Sign',
  position: pos(20, 20),
  avatar: '📜',
  interaction: showSignViewer({
    content: 'Welcome to Peaceful Village!\n\nPopulation: 150\nEstablished: 1205',
    title: 'Village Sign',
  }),
});

// Object with note interaction
const noticeBoard = createNoteObject({
  id: 'notice-board',
  name: 'Notice Board',
  position: pos(80, 60),
  avatar: '📋',
  content: `Village Announcements

1. The annual harvest festival is coming soon!
2. New traders have arrived at the marketplace.
3. The old well needs repairs - volunteers needed.
4. Lost cat: Last seen near the blacksmith's shop.

- Mayor's Office`,
  title: 'Village Notice Board',
});

// Object with image interaction
const painting = createImageObject({
  id: 'village-painting',
  name: 'Village Painting',
  position: pos(50, 70),
  avatar: '🖼️',
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  title: 'Village Landscape',
});

// Object with component interaction (Chat)
const aiCompanion = createObject({
  id: 'ai-companion',
  name: 'AI Companion',
  position: pos(15, 60),
  avatar: '🤖',
  interaction: showChatWindow({
    title: 'AI Companion',
    placeholder: 'Ask me anything about the village...',
  }),
});

// Location
const well = createLocation({
  id: 'village-well',
  name: 'Old Well',
  position: pos(40, 50),
  avatar: '⛲',
  interaction: showDialogue(createDialogue({
    id: 'well-dialogue',
    speaker: 'Well',
    lines: [
      'An ancient well stands here.',
      'The water is clear and refreshing.',
      'Legend says it grants wishes on full moons.',
    ],
  })),
});

// Locked interactable (requires task completion)
const treasureChest = createObject({
  id: 'treasure-chest',
  name: 'Treasure Chest',
  position: pos(60, 80),
  avatar: '💎',
  locked: true,
  unlockRequirement: {
    type: 'task-complete',
    task,
  },
  interaction: showNote(
    'You found a treasure chest!\n\nInside you discover:\n- 100 gold coins\n- A magical amulet\n- Ancient scrolls',
    'Treasure Discovered!'
  ),
});

const config = createModuleConfig({
  manifest: createManifest('village', 'Peaceful Village', '1.0.0', 'A cozy village where villagers need your help'),
  background: colorBackground('#3a2a1a'),
  welcome: createWelcome('Mayor', [
    'Welcome to our village!',
    'We could use your help.',
  ]),
  taskOrder: [task],
  worldmap: {
    position: { x: 35, y: 30 }, // Top left branch
    icon: {
      shape: 'circle',
      size: 48,
    },
  },
});

export default defineModule({
  id: 'village',
  config,
  content: {
    interactables: [
      mayor,
      blacksmith,
      sign,
      noticeBoard,
      painting,
      aiCompanion,
      well,
      treasureChest,
    ],
    tasks: [task],
  },
});

