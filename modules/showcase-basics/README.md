# Showcase: Basics

This module demonstrates the fundamental building blocks of module creation.

## Purpose

Learn the essential structure and basic content types that every module needs.

## What This Module Demonstrates

### Module Structure
- **config.ts**: Module configuration with manifest, background, welcome message, and worldmap
- **index.ts**: Module definition using `defineModule()`
- **content/**: Organized content structure

### Basic NPC
- NPC with dialogue tree
- NPC with task assignment
- Simple NPC setup
- Task-ready and task-complete dialogue nodes

### Basic Object
- Note viewer object
- Simple information display
- Object positioning

### Basic Task
- Text submission task
- Length validation
- Success/failure responses

### Worldmap Configuration
- Module positioning on worldmap
- Icon configuration
- Module summary

## Key Files

- `config.ts` - Module configuration
- `content/NPC/basic/index.ts` - Basic NPC definition
- `content/NPC/basic/dialogues.ts` - Basic dialogue tree
- `content/objects.ts` - Note object
- `content/tasks.ts` - Simple text task

## Code Examples

### Basic NPC
```typescript
export const basicNPC = createNPC({
  id: 'basic-npc',
  name: 'Basic NPC',
  position: position(30, 40),
  avatar: '',
  tasks: [basicTask],
  dialogueTree: basicDialogueTree,
});
```

### Basic Object
```typescript
export const basicNote = createObject({
  id: 'basic-note',
  name: 'Basic Note',
  position: position(70, 40),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Basic Note Object',
    content: 'This is a basic Note object...',
  }),
});
```

### Basic Task
```typescript
export const basicTask = createTask({
  id: 'basic-task',
  name: 'Basic Text Task',
  description: 'Write a simple message (at least 10 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    if (text.length >= 10) {
      return success('complete', 'Great!', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  // ...
});
```

## Unlock Requirement

This module unlocks when the hub module (`module-creator-showcase`) is completed.

## Next Steps

After understanding the basics, explore:
- **showcase-dialogues** - Add conversations to NPCs
- **showcase-tasks** - Learn all task types
- **showcase-objects** - Explore all object types
