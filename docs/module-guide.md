# Module Guide: Create Your First Module

A complete step-by-step guide from zero to a working module.

## Overview

We'll create a simple module called "hello-world" with:
1. A module configuration (title, background, welcome)
2. An NPC (character users can talk to)
3. A task (text task users can solve)
4. An object (sign with information)

**Before you start**: Study `modules/example-1-basic/` - it shows the simplest possible module!

## Step 1: Create Module Structure

### Why this step?

Every module needs a consistent folder structure. This makes it easy for the system to find and load the module automatically.

### How to do it

1. Create module folder:

```bash
mkdir -p modules/hello-world/content/NPC/guide
```

### Visual Representation

```
modules/
└── hello-world/              ← Your new module
    ├── content/              ← All content goes here
    │   ├── NPC/              ← NPC-specific code (dialogues)
    │   └── ...
    ├── index.ts              ← Module definition
    └── config.ts             ← Module configuration
```

**Why this structure?**
- `content/` - Keeps tasks and interactables organized
- `NPC/` - Dialogue trees for NPCs kept separate for better structure
- This structure matches example modules and makes it easy to find things

## Step 2: Create Module Configuration

### Why this step?

Configuration defines the module's basic information. Without configuration, the module cannot be loaded by the system.

### Create config.ts

Create the file `modules/hello-world/config.ts`:

```typescript
import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'hello-world',           // Unique ID (must be unique in entire system!)
      'Hello World',           // Display name (what users see)
      '1.0.0',                // Version
      'My first module'         // Description
    ),
    background: colorBackground('#2d3748'), // Dark gray background
    welcome: createWelcome('System', [
      'Welcome to the Hello World module!',
      'This is your first module.',
    ]),
    worldmap: {
      position: { x: 25, y: 50 }, // Position on worldmap (0-100)
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'A simple module to get started',
    },
  });
}
```

**See `modules/example-1-basic/config.ts` for reference.**

## Step 3: Create a Simple Task

### Why this step?

Tasks are central - they give users something to do. We start simple to understand the basics.

### Create tasks.ts

Create the file `modules/hello-world/content/tasks.ts`:

```typescript
import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/tasks.js';

export const greetingTask = createTask({
  id: 'greeting-task',
  name: 'Write a Greeting',
  description: 'Write a greeting with at least 5 characters.',
  submission: textSubmission(),
  validate: textLengthValidator(5, (text) => {
    // Check if text contains a greeting word
    const lowerText = text.toLowerCase();
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return success('greeting_found', 'Excellent! You included a greeting.', 100);
    }
    return failure('no_greeting', 'Your text should include a greeting word like "hello", "hi", or "hey".');
  }),
  overview: {
    requirements: 'Write at least 5 characters',
    goals: ['Include a greeting word'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have a simple task for you if you\'re interested.'],
    ready: ['Are you ready to submit your greeting?'],
    complete: ['Excellent! You completed the task.'],
  },
});

export const tasks = [greetingTask];
```

**See `modules/example-1-basic/content/tasks.ts` for reference.**

## Step 4: Create an NPC

### Why this step?

NPCs give tasks to users in a natural way. We'll create a simple NPC without dialogues first.

### Create NPC files

Create `modules/hello-world/content/NPC/guide/index.ts`:

```typescript
import { createNPC, pos } from '@builders/index.js';
import { greetingTask } from '../../tasks.js';

export const guideNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: pos(30, 40),
  avatar: '👤',
  tasks: [greetingTask],
  // No dialogueTree - this is the simplest NPC possible
});
```

**See `modules/example-1-basic/content/NPC/guide/index.ts` for reference.**

### Create NPCs.ts

Create `modules/hello-world/content/NPCs.ts`:

```typescript
import { guideNPC } from './NPC/guide/index.js';

export const NPCs = [guideNPC];
```

## Step 5: Create an Object

### Why this step?

Objects provide information and make the module more interactive.

### Create objects.ts

Create `modules/hello-world/content/objects.ts`:

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
    content: 'Welcome to the Hello World module! This is your first module. Click on the Guide NPC to get a task.',
    title: 'Welcome Sign',
  }),
});

export const objects = [welcomeSign];
```

**See `modules/example-1-basic/content/objects.ts` for reference.**

## Step 6: Create Content Index

### Why this step?

This file exports all content and combines NPCs and objects into interactables.

### Create content/index.ts

Create `modules/hello-world/content/index.ts`:

```typescript
export * from './tasks.js';
export * from './NPCs.js';
export * from './objects.js';

// Combine NPCs and objects into interactables
import { NPCs } from './NPCs.js';
import { objects } from './objects.js';
export const interactables = [...NPCs, ...objects];
```

## Step 7: Create Module Definition

### Why this step?

This is the entry point - it tells the system about your module.

### Create index.ts

Create `modules/hello-world/index.ts`:

```typescript
import { defineModule } from '@core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

const config = createConfig();

export default defineModule({
  id: 'hello-world',
  config,
  content: {
    interactables,
    tasks,
  },
});
```

**See `modules/example-1-basic/index.ts` for reference.**

## Step 8: Test Your Module

1. Start the development server:
```bash
npm run dev
```

2. Open `http://localhost:5173` in your browser

3. You should see your module on the worldmap!

4. Click on it to open and test:
   - Click on the Guide NPC → Should offer the task
   - Click on the Welcome Sign → Should show information
   - Complete the task → Should validate correctly

## What You've Created

You now have a working module with:
- ✅ Module configuration
- ✅ One NPC with a task
- ✅ One object
- ✅ One task with validation

## Next Steps

1. **Add dialogues**: See `modules/example-2-dialogues/` to learn about dialogue trees
2. **Add progression**: See `modules/example-3-progression/` to learn about unlock requirements
3. **Read more**: Check [Building Blocks](building-blocks.md) for detailed guides

## Common Issues

- **Module doesn't appear**: Check that `index.ts` exports `defineModule` with `default`
- **NPC doesn't show**: Check that NPC is exported in `NPCs.ts` and included in `interactables`
- **Task doesn't work**: Check validation logic and return `success()` or `failure()`

See [Troubleshooting](troubleshooting.md) for more help.

