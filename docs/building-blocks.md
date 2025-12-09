# Building Blocks: NPCs, Tasks, and Objects

Everything you need to know about the fundamental building blocks of a module.

## Overview

Every module consists of **building blocks** that you combine to create an interactive experience:

```
Module
├── NPCs (characters)
├── Tasks (activities)
└── Objects (interactive elements)
```

**See `modules/example-1-basic/` for a minimal example of all building blocks.**

## NPCs (Non-Player Characters)

NPCs are characters that users can interact with. They can give tasks, have dialogues, and remember things.

### Basic NPC

```typescript
import { createNPC, pos } from '@builders/index.js';

export const myNPC = createNPC({
  id: 'my-npc',              // Unique ID
  name: 'Teacher',           // Display name
  position: pos(50, 50),     // Position (x, y in percent)
  avatar: '👨‍🏫',             // Emoji or icon
});
```

**See `modules/example-1-basic/content/NPC/guide/index.ts` for a simple NPC example.**

### NPC with Tasks

```typescript
import { createNPC, pos } from '@builders/index.js';
import { myTask } from './tasks.js';

export const teacherNPC = createNPC({
  id: 'teacher',
  name: 'Teacher',
  position: pos(30, 40),
  avatar: '👨‍🏫',
  tasks: [myTask],  // Array of tasks
});
```

### NPC with Dialogues

```typescript
import { createNPC, pos } from '@builders/index.js';
import { myTask } from './tasks.js';
import { myDialogueTree } from './dialogues.js';

export const teacherNPC = createNPC({
  id: 'teacher',
  name: 'Teacher',
  position: pos(30, 40),
  avatar: '👨‍🏫',
  tasks: [myTask],
  dialogueTree: myDialogueTree,  // Dialogue tree
});
```

**See `modules/example-2-dialogues/content/NPC/teacher/` for NPCs with dialogue trees.**

### NPC Structure

Each NPC should be in its own folder:

```
content/
└── NPC/
    └── teacher/
        ├── index.ts       # NPC definition
        ├── dialogues.ts   # Dialogue tree (optional)
        └── state.ts       # State management (optional)
```

**See `modules/example-2-dialogues/` for complete NPC structure.**

## Tasks

Tasks are activities that users solve. They can be validated to ensure understanding.

### Basic Text Task

```typescript
import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/tasks.js';

export const myTask = createTask({
  id: 'my-task',
  name: 'My Task',
  description: 'Write something (at least 10 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    if (text.length >= 10) {
      return success('complete', 'Great job!', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Complete the task'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have a task for you.'],
    ready: ['Are you ready to submit?'],
    complete: ['Excellent work!'],
  },
});
```

**See `modules/example-1-basic/content/tasks.ts` for a simple task example.**

### Multiple Choice Task

```typescript
import {
  createTask,
  multipleChoiceSubmission,
  success,
  failure,
} from '@builders/tasks.js';

export const quizTask = createTask({
  id: 'quiz',
  name: 'Quiz',
  description: 'What is the capital of France?',
  submission: multipleChoiceSubmission([
    'London',
    'Paris',
    'Berlin',
    'Madrid',
  ]),
  validate: (input) => {
    if (input.type === 'multiple_choice' && input.choice === 'Paris') {
      return success('correct', 'Correct!', 100);
    }
    return failure('incorrect', 'Not quite. Try again!');
  },
  // ... rest of config
});
```

**See `modules/example-3-progression/content/tasks.ts` for multiple choice examples.**

### Task with Unlock Requirement

```typescript
import { taskComplete } from '@builders/interactables.js';

export const lockedTask = createTask({
  id: 'locked-task',
  name: 'Locked Task',
  // ... other config
  unlockRequirement: taskComplete(prerequisiteTask), // Locked until this task is done
});
```

**See `modules/example-3-progression/content/tasks.ts` for task chains.**

## Objects

Objects are things users can click on to get information or interact with.

### Basic Object (Sign)

```typescript
import {
  createObject,
  showSignViewer,
  pos,
} from '@builders/index.js';

export const welcomeSign = createObject({
  id: 'welcome-sign',
  name: 'Welcome Sign',
  position: pos(70, 30),
  avatar: 'note',
  interaction: showSignViewer({
    content: 'Welcome to the module!',
    title: 'Welcome Sign',
  }),
});
```

**See `modules/example-1-basic/content/objects.ts` for simple object examples.**

### Note Object

```typescript
import {
  createNoteObject,
  pos,
} from '@builders/index.js';

export const infoNote = createNoteObject({
  id: 'info-note',
  name: 'Info Note',
  position: pos(60, 60),
  content: 'This is some information.',
  title: 'Information',
  avatar: 'note',
});
```

### Locked Object

```typescript
import {
  createObject,
  showNoteViewer,
  pos,
  taskComplete,
} from '@builders/index.js';
import { prerequisiteTask } from './tasks.js';

export const lockedChest = createObject({
  id: 'locked-chest',
  name: 'Locked Chest',
  position: pos(80, 70),
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(prerequisiteTask),
  interaction: showNoteViewer({
    content: 'You unlocked this chest!',
    title: 'Unlocked Chest',
  }),
});
```

**See `modules/example-3-progression/content/objects.ts` for locked object examples.**

## Next Steps

- See [Dialogues](dialogues.md) for dialogue trees
- See [Progression](progression.md) for unlock requirements
- Study `modules/example-1-basic/` through `modules/example-3-progression/` for examples
- See `modules/example-3a-task-unlock/` and `modules/example-3b-module-unlock/` for unlock examples

