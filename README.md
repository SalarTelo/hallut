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

**Prerequisites:**
- Node.js version 18 or later
- Docker and Docker Compose

```bash
# Complete setup (installs dependencies, starts Ollama container, pulls model)
npm run setup

# Start development server
npm run dev

# Or use the combined command to ensure Ollama is running
npm run dev:with-ollama
```

**Manual Setup (if you prefer step-by-step):**
```bash
# Install dependencies
npm install

# Start Ollama container
npm run docker:up

# Pull the default model (wait a few seconds for Ollama to start)
npm run ollama:pull

# Start development server
npm run dev
```

## Important Commands

### Development
- `npm run dev` - Start development server
- `npm run dev:with-ollama` - Start dev server and ensure Ollama is running
- `npm run lint` - Lint code

### Setup & Docker
- `npm run setup` - Complete setup (install deps, start Ollama, pull model)
- `npm run docker:up` - Start Ollama container
- `npm run docker:down` - Stop Ollama container
- `npm run docker:logs` - View Ollama container logs
- `npm run ollama:pull` - Pull default model (llama3.2)


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

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
- **Ollama** - AI chat and image analysis (containerized)

## Documentation

**Important**: You'll spend most of your time creating modules in the `modules/` folder. The documentation focuses on practical module development.

## Showcase Modules

The platform includes comprehensive showcase modules that demonstrate larger aspects of module creation:

### Hub Module
- **[module-creator-showcase](modules/module-creator-showcase/)** - Main entry point
  - Navigation hub for all showcase modules
  - Complete the exploration task to unlock all submodules
  - **Start here!**

### Showcase Submodules

1. **[showcase-basics](modules/showcase-basics/)** - Foundation and structure
   - Basic NPC with dialogue tree
   - Simple tasks and objects
   - Module configuration basics

2. **[showcase-dialogues](modules/showcase-dialogues/)** - Conversation systems
   - Dialogue trees with branching
   - State-based dialogues
   - Task-ready and task-complete nodes

3. **[showcase-tasks](modules/showcase-tasks/)** - All task types
   - Text tasks with various validators
   - Multiple choice tasks
   - Custom submission components

4. **[showcase-objects](modules/showcase-objects/)** - All object types
   - Note, Sign, Image, Video viewers
   - Chat windows
   - Custom component renderers

5. **[showcase-progression](modules/showcase-progression/)** - Unlocking and chains
   - Task chains
   - Locked NPCs and objects
   - Unlock requirements

6. **[showcase-advanced](modules/showcase-advanced/)** - Advanced features
   - Password-protected modules
   - Custom component renderers
   - Module handlers
   - Password: `advanced123`

**Each showcase module includes a detailed README explaining what it demonstrates!**

## Module Structure

When creating modules, you'll work in the `modules/` folder. Each module follows this structure:

```
modules/
├── module-creator-showcase/  # Hub module - entry point
├── showcase-basics/          # Foundation examples
├── showcase-dialogues/       # Dialogue examples
├── showcase-tasks/           # Task examples
├── showcase-objects/         # Object examples
├── showcase-progression/     # Progression examples
└── showcase-advanced/        # Advanced features
    ├── index.ts              # Module definition
    ├── config.ts             # Module configuration
    ├── components/           # Custom React components (optional)
    │   └── CustomViewer.tsx
    └── content/              # Module content
        ├── index.ts          # Exports tasks and interactables
        ├── tasks.ts          # Task definitions
        ├── NPCs.ts           # NPC aggregation
        ├── objects.ts        # Object definitions
        └── NPC/              # NPC-specific code
            └── teacher/
                ├── index.ts      # NPC definition
                ├── dialogues.ts  # Dialogue tree
                └── state.ts      # State management (optional)
```

**You do NOT need to understand the `src/` code - that's engine-level that already works! (barely)**

## Docker & Ollama Setup

This project uses Ollama for AI chat and image analysis features. Ollama runs in a Docker container for portability.

### First Time Setup

Run `npm run setup` which will:
1. Install npm dependencies
2. Start the Ollama Docker container
3. Pull the default model (llama3.2)

### Managing Ollama

- **Start container**: `npm run docker:up`
- **Stop container**: `npm run docker:down`
- **View logs**: `npm run docker:logs`
- **Pull additional models**: `docker exec prototyp-ollama ollama pull <model-name>`

### Model Storage

Models are stored in a Docker volume (`ollama-data`) and persist across container restarts. You don't need to re-download models after restarting the container.

### Troubleshooting

**Ollama container won't start:**
- Ensure Docker is running
- Check if port 11434 is already in use: `lsof -i :11434`
- View container logs: `npm run docker:logs`

**Can't connect to Ollama:**
- Verify container is running: `docker ps | grep prototyp-ollama`
- Check if model is pulled: `docker exec prototyp-ollama ollama list`
- Restart container: `npm run docker:down && npm run docker:up`

**Using external Ollama instance:**
- Create a `.env` file with: `OLLAMA_URL=http://your-ollama-host:11434`
- The Vite proxy will use this URL instead of the container

## Contributing

This is an internal project. Contact the project owner for more information about contributing.

## License

Private project.
