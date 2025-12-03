# AI Lab

An interactive educational platform built with React and TypeScript. Create and manage modules with NPCs, tasks, dialogues, and unlockable content.

## Overview

AI Lab is a modular platform for creating interactive educational experiences. The system lets you build modules (like levels in a game) where users can interact with NPCs, solve tasks, have dialogues, and unlock new content.

### Key Features

- **Module System**: Create and manage interactive modules
- **NPCs**: Create characters with dialogues and tasks
- **Tasks**: Different types of tasks with validation
- **Dialogues**: Tree dialogues with conditions and choices
- **Unlock System**: Unlock content based on various requirements
- **Worldmap**: Navigate between modules on a worldmap
- **CLI Tools**: Interactive tool for creating content

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Important Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run cli` - Run CLI tool
- `npm run module:create` - Create a new module
- `npm run module:validate` - Validate module structure

## Project Structure

```
src/
├── core/           # Core engine (module system, state, services)
├── ui/             # React components and UI functions
├── utils/          # Helper functions and builders
└── services/       # Application services

modules/            # Module definitions
scripts/            # CLI tools for module creation
```

## Technologies

- React 19
- TypeScript
- Vite
- Zustand (state management)
- Tailwind CSS
- Vitest (testing)

## Documentation

**Important**: You'll spend 95% of your time creating modules in the `modules/` folder. These guides focus on practical module development.

### Getting Started

- **[Getting Started](docs/getting-started.md)** - Installation and first steps
- **[Core Concepts](docs/core-concepts.md)** - Understand what modules, NPCs, tasks, and objects are
- **[Module Guide](docs/module-guide.md)** - Complete tutorial: Create your first module step by step

### Building Blocks

- **[Building Blocks](docs/building-blocks.md)** - Everything about NPCs, tasks, and objects with practical examples
- **[Dialogues](docs/dialogues.md)** - Create dialogues with visual flow diagrams
- **[Progression](docs/progression.md)** - Unlock requirements and worldmap to create progression

### Practical

- **[Common Patterns](docs/common-patterns.md)** - "How do I do X?" - practical patterns
- **[Troubleshooting](docs/troubleshooting.md)** - When things don't work - common problems and solutions
- **[Reference](docs/reference.md)** - Quick reference - all builders and functions

### Advanced

- **[Advanced](docs/advanced.md)** - All advanced topics in one file (architecture, state management, etc.)

## Example Modules

We have numbered example modules that show progressive complexity:

1. **[example-1-basic](modules/example-1-basic/)** - Simplest possible module
   - One NPC, one task, one object
   - No dialogues, no state, no unlock requirements
   - **Start here if you're new!**

2. **[example-2-dialogues](modules/example-2-dialogues/)** - Dialogue trees and state
   - NPC with dialogue tree
   - State management
   - Conditional dialogue entry

3. **[example-3-progression](modules/example-3-progression/)** - Unlock requirements
   - Task chains
   - Locked NPCs and objects
   - Progression between content

4. **[example-3a-task-unlock](modules/example-3a-task-unlock/)** - Module unlock via task
   - Shows how modules unlock when specific tasks are completed

5. **[example-3b-module-unlock](modules/example-3b-module-unlock/)** - Module unlock via module completion
   - Shows how modules unlock when other modules are completed

**Study these examples alongside the documentation!**

## Module Structure (For Module Development)

The only thing you need to understand is the `modules/` folder:

```
modules/
├── example-1-basic/         # Simplest example - start here!
├── example-2-dialogues/     # Dialogue examples
├── example-3-progression/   # Progression examples
├── example-3a-task-unlock/  # Module unlock via task
└── example-3b-module-unlock/ # Module unlock via module completion
    ├── index.ts          # Module definition
    ├── config.ts         # Module configuration
    └── content/          # Module content
        ├── index.ts      # Exports tasks and interactables
        ├── tasks.ts      # Tasks
        ├── NPCs.ts       # NPC aggregation
        ├── objects.ts    # Objects
        └── NPC/          # NPC-specific code
            └── teacher/
                ├── index.ts      # NPC definition
                ├── dialogues.ts  # Dialogue tree
                └── state.ts      # State management
```

**You do NOT need to understand the `src/` code - that's engine-level that already works!**

## Contributing

This is an internal project. Contact the project owner for more information about contributing.

## License

Private project.
