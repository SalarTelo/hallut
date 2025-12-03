# Common Patterns: "How Do I Do X?"

Practical patterns and solutions for common problems when creating modules.

## Dialogue Patterns

### Branching Dialogue

A dialogue that changes based on choice:

```typescript
const node1 = dialogueNode({
  lines: ['What do you want to do?'],
  choices: {
    optionA: { text: 'Option A', next: nodeA },
    optionB: { text: 'Option B', next: nodeB },
  },
});
```

**See `modules/example-2-dialogues/` for dialogue examples.**

### State-Based Dialogue

Dialogue that remembers previous interactions:

```typescript
const npcState = stateRef({ id: 'my-npc' });

.configureEntry()
  .when((ctx) => npcState(ctx).hasMet === true).use(generalGreeting)
  .default(firstGreeting)
```

**See `modules/example-2-dialogues/content/NPC/teacher/dialogues.ts` for state-based dialogues.**

### Offering Task in Dialogue

Offer task via dialogue:

```typescript
const taskOffer = dialogueNode({
  lines: ['I have a task for you.'],
  choices: {
    accept: {
      text: 'Accept',
      next: null,
      actions: [acceptTask(myTask)],
    },
  },
});
```

## Task Patterns

### Task Chain

Chain tasks together:

```typescript
// Task 1: Always available
export const task1 = createTask({
  id: 'task-1',
  unlockRequirement: null,
  // ...
});

import { taskComplete } from '@utils/builders/interactables.js';

// Task 2: Requires Task 1
export const task2 = createTask({
  id: 'task-2',
  unlockRequirement: taskComplete(task1), // Locked until task1 is done
  // ...
});
```

**See `modules/example-3-progression/content/tasks.ts` for task chains.**

### Multiple Task Types

Use different submission types:

```typescript
// Text task
submission: textSubmission()

// Multiple choice
submission: multipleChoiceSubmission(['A', 'B', 'C'])

// Code task
submission: codeSubmission('typescript')
```

**See `modules/example-3-progression/content/tasks.ts` for multiple task types.**

## Object Patterns

### Locked Object

Lock object until requirement met:

```typescript
export const lockedChest = createObject({
  id: 'chest',
  locked: true,
  unlockRequirement: taskComplete(prerequisiteTask),
  // ...
});
```

**See `modules/example-3-progression/content/objects.ts` for locked objects.**

### Information Objects

Provide information through objects:

```typescript
// Sign
interaction: showSignViewer({
  content: 'Information here',
  title: 'Title',
})

// Note
interaction: showNoteViewer({
  content: 'Note content',
  title: 'Note Title',
})
```

**See `modules/example-1-basic/content/objects.ts` for object examples.**

## Progression Patterns

### Linear Progression

Simple chain: Task 1 → Task 2 → Task 3

**See `modules/example-3-progression/` for linear progression.**

### Branching Progression

Multiple paths with combined requirements:

```typescript
unlockRequirement: andRequirements([
  taskComplete(task1),
  taskComplete(task2),
])
```

**See `modules/example-3-progression/` for branching progression.**

## NPC Patterns

### Basic NPC (With Simple Dialogue)

```typescript
export const basicNPC = createNPC({
  id: 'guide',
  name: 'Guide',
  position: pos(30, 40),
  avatar: '👤',
  tasks: [myTask],
  dialogueTree: myDialogueTree, // Even basic NPCs should have a dialogue tree to offer tasks
});
```

**See `modules/example-1-basic/content/NPC/guide/index.ts` for a basic NPC with dialogue.**

### NPC with Dialogues and State

```typescript
export const complexNPC = createNPC({
  id: 'teacher',
  name: 'Teacher',
  position: pos(30, 40),
  avatar: '👨‍🏫',
  tasks: [myTask],
  dialogueTree: myDialogueTree,
});
```

**See `modules/example-2-dialogues/content/NPC/teacher/` for complex NPC.**

## Next Steps

- Study `modules/example-1-basic/` through `modules/example-3-progression/` for patterns
- See `modules/example-3a-task-unlock/` and `modules/example-3b-module-unlock/` for unlock patterns
- See [Reference](reference.md) for API details
- Check [Troubleshooting](troubleshooting.md) if something doesn't work

