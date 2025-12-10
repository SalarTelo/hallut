# Showcase: Progression

This module demonstrates unlock requirements, task chains, and progression systems.

## Purpose

Learn how to create progression by locking content and chaining tasks together.

## What This Module Demonstrates

### Task Chains
- Tasks that unlock other tasks
- Sequential task progression
- `taskComplete()` requirement

### Locked NPCs
- NPCs with unlock requirements
- NPCs that appear after completing tasks
- Locked state management

### Locked Objects
- Objects with unlock requirements
- Objects that unlock via task completion
- Progression through object unlocking

### Unlock Requirements
- `taskComplete()` - Unlock when task is completed
- `moduleComplete()` - Unlock when module is completed
- Combined requirements (AND/OR)

## Key Files

- `content/tasks.ts` - Task chain demonstration
- `content/NPC/guide/index.ts` - Guide NPC
- `content/NPC/guide/dialogues.ts` - Guide dialogue tree
- `content/NPC/locked/index.ts` - Locked NPC
- `content/NPC/locked/dialogues.ts` - Locked NPC dialogue tree
- `content/objects.ts` - Locked object

## Code Examples

### Task Chain
```typescript
// Task 1: Always available
export const task1 = createTask({
  id: 'task-1',
  // ...
  unlockRequirement: null,
});

// Task 2: Requires Task 1
export const task2 = createTask({
  id: 'task-2',
  // ...
  unlockRequirement: taskComplete(task1),
});

// Task 3: Requires Task 2
export const task3 = createTask({
  id: 'task-3',
  // ...
  unlockRequirement: taskComplete(task2),
});
```

### Locked NPC
```typescript
export const lockedNPC = createNPC({
  id: 'locked-npc',
  name: 'Locked NPC',
  position: position(50, 40),
  avatar: '🔒',
  locked: true,
  unlockRequirement: taskComplete(task1),
  tasks: [task3],
  dialogueTree: lockedDialogueTree,
});
```

Note: Both the locked object and locked NPC unlock from the same task (task1), demonstrating that multiple interactables can unlock from a single task completion.

### Locked Object
```typescript
export const lockedObject = createObject({
  id: 'locked-object',
  name: 'Locked Object',
  position: position(70, 40),
  avatar: 'note',
  locked: true,
  unlockRequirement: taskComplete(task1),
  onInteract: showSignViewer({
    title: 'Locked Object (Now Unlocked!)',
    content: 'This object was locked until you completed Task 1.',
  }),
});
```

### Module Unlock Requirement
```typescript
// In config.ts
unlockRequirement: moduleComplete('prerequisite-module')
```

### Combined Requirements
```typescript
import { andRequirements, orRequirements } from '@builders/index.js';

// Requires BOTH tasks
unlockRequirement: andRequirements([
  taskComplete(task1),
  taskComplete(task2),
])

// Requires EITHER task
unlockRequirement: orRequirements([
  taskComplete(task1),
  taskComplete(task2),
])
```

## Progression Flow

This module demonstrates a simple progression flow:

1. **Task 1** - Always available, unlocks Task 2, locked object, and locked NPC
2. **Task 2** - Unlocks Task 3
3. **Task 3** - Final task in the chain (offered by locked NPC)
4. **Locked NPC** - Appears after Task 1, offers Task 3
5. **Locked Object** - Unlocks after Task 1

Note: Both the locked object and locked NPC unlock simultaneously from Task 1, demonstrating that multiple interactables can unlock from a single task completion.

## Unlock Requirement

This module unlocks when the hub module (`module-creator-showcase`) is completed.

## Next Steps

After learning progression, explore:
- **showcase-advanced** - Advanced progression with password locks
