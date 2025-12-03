# Getting Started

A guide to get started with AI Lab and create your first modules.

## What is AI Lab?

AI Lab is a platform where you create **modules** - think of them as levels in a game. Each module can contain:
- **NPCs** (characters) that users can talk to
- **Tasks** that users can solve
- **Objects** that users can interact with

## Quick Start

### Step 1: Install the Project

**Prerequisites:**
- Node.js version 18 or later
- npm or yarn

```bash
# Clone/open the project
cd prototyp

# Install dependencies
npm install
```

**What happens here?**
- npm installs all necessary packages the project needs
- This only needs to be done once (or when packages are updated)

### Step 2: Start the Development Server

```bash
npm run dev
```

You should see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**What happens here?**
- The development server starts
- Open your browser and go to `http://localhost:5173`
- You'll see the AI Lab application!

### Step 3: Explore Example Modules

When you open the application, you'll see:

```
┌─────────────────────────────────────┐
│    [Worldmap]                       │
│                                     │
│    ⚪ Example Module                │
│       (Starting Point)              │
│                                     │
└─────────────────────────────────────┘
```

**Click on "Example Module"** to open it.

Inside the module you'll see:
- An NPC (character with shield icon)
- An object (sign)
- You can click on them to interact!

**Why start here?**
- Example modules show all basic functions
- You can see how everything fits together
- They give you inspiration for your own modules

## Progressive Learning Path

We have numbered example modules that show progressive complexity. Each module has dedicated documentation:

1. **[Module 1: Basic](../modules/example-1-basic/README.md)** - Simplest possible module
   - See `modules/example-1-basic/` for minimal setup
   - One NPC with dialogue tree, one task, one object
   - Basic state management
   - No unlock requirements

2. **[Module 2: Dialogues](../modules/example-2-dialogues/README.md)** - Dialogue trees and state
   - See `modules/example-2-dialogues/` for dialogue examples
   - Multiple dialogue nodes
   - State-based conditional entry
   - NPCs that remember interactions

3. **[Module 3: Progression](../modules/example-3-progression/README.md)** - Unlock requirements
   - See `modules/example-3-progression/` for progression examples
   - Task chains
   - Locked NPCs and objects
   - **Module unlocks:** Unlocks 2 additional modules (3A and 3B) to demonstrate unlock requirements visually

4. **example-3a-task-unlock/** - Module unlock via task completion
   - See `modules/example-3a-task-unlock/` for task-based module unlocking

5. **example-3b-module-unlock/** - Module unlock via module completion
   - See `modules/example-3b-module-unlock/` for module-based unlocking

## Important Commands

```bash
# Start development server (run this when working)
npm run dev

# Run CLI tool (helps you create modules)
npm run cli

# Validate modules (check that everything is correct)
npm run module:validate

# Build for production
npm run build
```

## Project Structure (What You Need to Know)

You'll work in the `modules/` folder. Here's what you need to understand:

```
prototyp/
└── modules/              ← You work here!
    ├── example-1-basic/         ← Simplest example - start here!
    ├── example-2-dialogues/     ← Dialogue examples
    ├── example-3-progression/   ← Progression examples
    ├── example-3a-task-unlock/ ← Module unlock via task
    └── example-3b-module-unlock/ ← Module unlock via module completion
```

## Next Steps

1. **Read the documentation**:
   - [Module 1: Basic](../modules/example-1-basic/README.md) - Start here! Simplest module
   - [Module 2: Dialogues](../modules/example-2-dialogues/README.md) - Dialogue trees and state
   - [Module 3: Progression](../modules/example-3-progression/README.md) - Unlock requirements
   - [Core Concepts](core-concepts.md) - Understand modules, NPCs, tasks, objects
   - [Module Guide](module-guide.md) - Step-by-step tutorial
   - [Building Blocks](building-blocks.md) - Detailed NPC, task, object guides

2. **Study the examples**:
   - Start with [Module 1: Basic](../modules/example-1-basic/README.md) - Simplest possible module
   - Progress through numbered modules (1 → 2 → 3)
   - See how Module 3 unlocks additional modules (3A and 3B) on the worldmap
   - Use the numbered example modules as comprehensive references

3. **Create your first module**:
   - Follow the [Module Guide](module-guide.md)
   - Use `example-1-basic/` as a template
   - Test it in the development server

## Getting Help

- Check the [Troubleshooting](troubleshooting.md) guide
- Review example modules in `modules/`
- Read the [Reference](reference.md) for API details

