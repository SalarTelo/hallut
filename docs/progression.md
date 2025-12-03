# Progression: Unlock Requirements and Worldmap

Guide for creating progression by locking content and organizing modules on the worldmap.

## What is Progression?

Progression is how users move from one step to the next. You lock content based on requirements - when users complete a task, the next module unlocks.

### Conceptually

```
Module 1 (Always open)
    ↓ [User completes task]
Module 2 (Locked → Opens)
    ↓ [User completes task]
Module 3 (Locked → Opens)
```

**See `modules/example-3-progression/README.md` for complete progression examples.**

## Unlock Requirements

Unlock requirements lock content (modules, NPCs, objects) until users meet the requirement.

### Task Complete

Unlock when a task is complete:

```typescript
import { taskComplete } from '@utils/builders/interactables.js';
import { prerequisiteTask } from './tasks.js';

// Lock an NPC
export const lockedNPC = createNPC({
  id: 'locked-teacher',
  name: 'Locked Teacher',
  locked: true,
  unlockRequirement: taskComplete(prerequisiteTask),
});

// Lock an object
export const lockedChest = createObject({
  id: 'locked-chest',
  name: 'Locked Chest',
  locked: true,
  unlockRequirement: taskComplete(prerequisiteTask),
  // ...
});
```

**See `modules/example-3-progression/README.md` for task-based unlocks.**

### Module Complete

Unlock when a module is complete:

```typescript
import { moduleComplete } from '@utils/builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    // ...
    unlockRequirement: moduleComplete('prerequisite-module'),
  });
}
```

**See `modules/example-3-progression/README.md` for module unlock examples. Module 3B (`example-3b-module-unlock`) demonstrates this pattern.**

### Combined Requirements

Use AND/OR to combine requirements:

```typescript
import { andRequirements, orRequirements, taskComplete } from '@utils/builders/index.js';

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

**See `modules/example-3-progression/` for combined requirements.**

## Task Chains

Create progression by chaining tasks:

```typescript
// Task 1: Always available
export const task1 = createTask({
  id: 'task-1',
  // ...
  unlockRequirement: null,
});

import { taskComplete } from '@utils/builders/interactables.js';

// Task 2: Requires Task 1
export const task2 = createTask({
  id: 'task-2',
  // ...
  unlockRequirement: taskComplete(task1), // Locked until task1 is done
});

// Task 3: Requires Task 2
export const task3 = createTask({
  id: 'task-3',
  // ...
  unlockRequirement: taskComplete(task2), // Locked until task2 is done
});
```

**See `modules/example-3-progression/README.md` and `modules/example-3-progression/content/tasks.ts` for a complete task chain.**

## Worldmap

Configure module position on the worldmap:

```typescript
worldmap: {
  position: { x: 25, y: 50 },  // Position (0-100)
  icon: {
    shape: 'circle',  // or 'diamond', 'square'
    size: 56,
  },
  summary: 'Module description',
}
```

## Module Unlocks

Modules can be unlocked in two ways:

### 1. Task-Based Module Unlock

A module unlocks when a specific task is completed:

```typescript
// In the unlocking module's config:
unlockRequirement: taskComplete(module3UnlockTask),
```

**Example:** Module 3A (`example-3a-task-unlock`) is unlocked by completing `module3UnlockTask` in Module 3.

**Visual on worldmap:**
- Module appears locked (gray) until task is completed
- After task completion, module unlocks (yellow)
- Path line shows connection from the unlocking module

### 2. Module Completion Unlock

A module unlocks when another module is completed:

```typescript
// In the unlocking module's config:
unlockRequirement: moduleComplete('example-3-progression'),
```

**Example:** Module 3B (`example-3b-module-unlock`) is unlocked by completing Module 3.

**Visual on worldmap:**
- Module appears locked (gray) until prerequisite module is completed
- After module completion, module unlocks (yellow)
- Path line shows connection and transitions from green (completed) to yellow (unlocked)

### Visual Progression Example

```
Module 2 (Dialogues)
    ↓
Module 3 (Progression) [Complete tasks here]
    ├─→ Module 3A (Task unlock) [Locked until task complete]
    │   └─→ Unlocks when module3UnlockTask is completed
    │
    └─→ Module 3B (Module unlock) [Locked until module complete]
        └─→ Unlocks when Module 3 is completed
```

**See `modules/example-3-progression/README.md` for detailed examples of module unlocks.**

## Progression Flow Example

```
Start:
  - Module 1 available
  - Task 1 available
  - NPC 1 available

After Task 1:
  - Module 2 unlocks
  - Task 2 unlocks
  - NPC 2 unlocks
  - Object 1 unlocks

After Task 2:
  - Task 3 unlocks
  - Object 2 unlocks
```

**See `modules/example-3-progression/README.md` for a visual progression flow.**

## Next Steps

- See `modules/example-3-progression/README.md` for progression examples
- See `modules/example-3-progression/` for code examples
- See `modules/example-3a-task-unlock/` for task-based module unlock
- See `modules/example-3b-module-unlock/` for module completion unlock
- See `modules/example-3-progression/` for complex progression examples
- Read [Building Blocks](building-blocks.md) for details
