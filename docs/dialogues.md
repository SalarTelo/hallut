# Dialogues: Create Interactive Conversations

Guide for creating dialogues where users can talk with NPCs.

## What is a Dialogue?

A **dialogue** is a conversation between a user and an NPC. Users can read text, choose between options, and trigger actions (like accepting tasks).

### Conceptually

```
User clicks on NPC
    ↓
Dialogue opens
    ↓
NPC says something
    ↓
User chooses option
    ↓
Something happens (task accepted, state updated, etc.)
```

**See `modules/example-2-dialogues/` for complete dialogue examples.**

## Simple Dialogue

### Basic dialogue

```typescript
import { dialogueNode } from '@utils/builders/dialogues.js';

const greeting = dialogueNode({
  lines: [
    'Hello there!',
    'Welcome to the module.',
  ],
  choices: {
    hello: {
      text: 'Hello!',
      next: null, // Closes dialogue
    },
  },
});
```

## Dialogue Trees

Dialogue trees connect multiple dialogue nodes together.

### Creating a Dialogue Tree

```typescript
import {
  dialogueTree,
  dialogueNode,
  acceptTask,
  callFunction,
} from '@utils/builders/dialogues.js';
import { teacherState } from './state.js';
import { myTask } from '../../tasks.js';

const greeting = dialogueNode({
  lines: ['Hello!'],
  choices: {
    accept: {
      text: 'I\'ll help',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;
        }),
        acceptTask(myTask),
      ],
    },
  },
});

export const teacherDialogueTree = dialogueTree()
  .nodes(greeting)
  .configureEntry()
    .default(greeting)
  .build();
```

**See `modules/example-2-dialogues/content/NPC/teacher/dialogues.ts` for a complete example.**

## State Management

NPCs can "remember" things using state.

### State Reference

```typescript
// state.ts
import { stateRef } from '@utils/builders/dialogues.js';

export const teacherState = stateRef({ id: 'teacher' });
```

### Using State in Dialogues

```typescript
import { teacherState } from './state.js';

const greeting = dialogueNode({
  lines: ['Hello!'],
  choices: {
    hello: {
      text: 'Hello!',
      next: null,
      actions: [
        callFunction((ctx) => {
          teacherState(ctx).hasMet = true;  // Remember user
        }),
      ],
    },
  },
});
```

**See `modules/example-2-dialogues/content/NPC/teacher/state.ts` for state examples.**

## Conditional Entry

Dialogues can change based on state.

```typescript
const firstGreeting = dialogueNode({
  lines: ['Hello! First time here?'],
  // ...
});

const generalGreeting = dialogueNode({
  lines: ['Hello again!'],
  // ...
});

export const dialogueTree = dialogueTree()
  .nodes(firstGreeting, generalGreeting)
  .configureEntry()
    .when((ctx) => teacherState(ctx).hasMet === true).use(generalGreeting)
    .default(firstGreeting)
  .build();
```

**See `modules/example-2-dialogues/` for conditional dialogue examples.**

## Actions

Actions are things that happen when a choice is selected.

### Accept Task

```typescript
import { acceptTask } from '@utils/builders/dialogues.js';

choices: {
  accept: {
    text: 'I\'ll help',
    next: null,
    actions: [
      acceptTask(myTask),
    ],
  },
}
```

### Call Function

```typescript
import { callFunction } from '@utils/builders/dialogues.js';

choices: {
  update: {
    text: 'Update state',
    next: null,
    actions: [
      callFunction((ctx) => {
        teacherState(ctx).hasMet = true;
      }),
    ],
  },
}
```

## Task-Specific Dialogues

Dialogues can be linked to tasks.

```typescript
const taskReady = dialogueNode({
  task: myTask,  // Link to task
  lines: ['Are you ready to submit?'],
  choices: {
    yes: {
      text: 'Yes',
      next: null,
      actions: [
        callFunction(async (context) => {
          if (context.openTaskSubmission) {
            context.openTaskSubmission(myTask);
          }
        }),
      ],
    },
  },
});
```

## Next Steps

- See `modules/example-2-dialogues/` for complete dialogue examples
- Read [Building Blocks](building-blocks.md) for NPC details
- Check [Reference](reference.md) for API details

