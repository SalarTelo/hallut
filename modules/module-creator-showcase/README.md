# Module Creator Showcase - Hub Module

This is the main hub module that serves as the entry point to all showcase submodules.

## Purpose

The hub module demonstrates basic module configuration and serves as a navigation center for exploring all module creation features.

## What This Module Demonstrates

- **Module Configuration**: Basic `config.ts` structure with manifest, background, welcome message, and worldmap configuration
- **NPC with Dialogue**: Guide NPC that explains the showcase system and offers tasks
- **Information Objects**: Objects that provide overviews of each submodule
- **Task System**: Exploration task that unlocks all showcase submodules when completed

## Structure

```
module-creator-showcase/
├── config.ts              # Module configuration
├── index.ts               # Module definition
├── content/
│   ├── index.ts           # Content aggregation
│   ├── tasks.ts           # Exploration task
│   ├── NPCs.ts            # NPC aggregation
│   ├── objects.ts         # Information objects
│   └── NPC/
│       └── guide/
│           ├── index.ts   # Guide NPC definition
│           ├── dialogues.ts # Dialogue tree
│           └── state.ts    # State management
└── README.md              # This file
```

## Key Features

### Exploration Task

Complete the "Explore the Showcase" task to unlock all showcase submodules. This demonstrates:
- Basic task creation
- Text submission and validation
- Task completion unlocking other modules

### Guide NPC

The Guide NPC explains:
- The purpose of the showcase system
- What each submodule covers
- The password for the Advanced module (advanced123)

### Information Objects

Six information objects provide overviews of each submodule:
- Basics Module Info
- Dialogues Module Info
- Tasks Module Info
- Objects Module Info
- Progression Module Info
- Advanced Module Info

## Unlock Flow

1. Hub module is always available (no unlock requirement)
2. Complete the exploration task
3. All submodules unlock (except Advanced, which requires password)
4. Explore submodules in any order

## Next Steps

After completing this module, explore the submodules:
- **showcase-basics** - Foundation and structure
- **showcase-dialogues** - Conversation systems
- **showcase-tasks** - All task types
- **showcase-objects** - All object types
- **showcase-progression** - Unlocking and chains
- **showcase-advanced** - Advanced features (password: advanced123)
