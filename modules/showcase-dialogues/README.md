# Showcase: Dialogues

This module demonstrates dialogue trees, branching conversations, and state-based dialogues.

## Purpose

Learn how to create interactive conversations with NPCs using dialogue trees, branching, and state management.

## What This Module Demonstrates

### Dialogue Trees
- `dialogueTree()` - Create dialogue trees
- `dialogueNode()` - Create dialogue nodes
- Connecting nodes together

### Branching Dialogues
- Multiple choice options
- Different conversation paths based on choices
- Navigating between dialogue nodes

### State-Based Dialogues
- `stateRef()` - Create state references
- Conditional dialogue entry based on state
- NPCs that "remember" previous interactions

### Dialogue Actions
- `offerTask()` - Offer tasks via dialogue
- `callFunction()` - Execute custom functions
- State updates in dialogue actions

### Task-Specific Dialogue Nodes
- `taskReady` - Dialogue node shown when task is ready for submission
- `taskComplete` - Dialogue node shown when task is completed
- Task-specific dialogue flow

## Key Files

- `content/NPC/teacher/dialogues.ts` - Comprehensive dialogue tree
- `content/NPC/teacher/state.ts` - State management
- `content/NPC/teacher/index.ts` - NPC with dialogue tree

## Code Examples

### Dialogue Tree with State
```typescript
export const teacherDialogueTree = createDialogueTree()
  .nodes(firstGreeting, stateBasedGreeting, branchingChoice)
  .configureEntry()
    .when((ctx) => teacherState(ctx).hasMet === true).use(stateBasedGreeting)
    .default(firstGreeting)
  .build();
```

### Branching Dialogue
```typescript
const branchingChoice = createDialogueNode({
  lines: ['Choose an option:'],
  choices: {
    optionA: {
      text: 'Option A',
      next: branchingOptionA,
    },
    optionB: {
      text: 'Option B',
      next: branchingOptionB,
    },
  },
});
```

### State Reference
```typescript
export const teacherState = stateRef({ id: 'dialogue-teacher' });

// In dialogue action:
callFunction((ctx) => {
  teacherState(ctx).hasMet = true;
})
```

### Offering Task
```typescript
const taskOffer = createDialogueNode({
  lines: ['I have a task for you.'],
  choices: {
    accept: {
      text: 'Accept',
      next: null,
      actions: [offerTask(dialogueTask)],
    },
  },
});
```

### Task-Specific Nodes
```typescript
// Node shown when task is ready for submission
const taskReady = createDialogueNode({
  task: myTask,
  lines: ['Are you ready to submit?'],
  choices: { /* ... */ },
});

// Node shown when task is completed
const taskComplete = createDialogueNode({
  lines: ['Excellent! Task completed.'],
  choices: { /* ... */ },
});
```

## Unlock Requirement

This module unlocks when the hub module (`module-creator-showcase`) is completed.

## Next Steps

After learning dialogues, explore:
- **showcase-tasks** - Learn all task types
- **showcase-progression** - Use dialogues with progression systems
