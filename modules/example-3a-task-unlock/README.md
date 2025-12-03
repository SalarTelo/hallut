# Example 3A: Task Unlock Module

This module demonstrates how modules can be unlocked by completing a specific task in another module.

## What This Module Shows

- **Module unlock via task completion**: This module is unlocked when you complete the `module3UnlockTask` in the `example-3-progression` module
- **Unlockable module structure**: Shows how to create a module that starts locked
- **Simple unlocked module**: Once unlocked, this module works like any other module

## How It Works

1. Complete all tasks in `example-3-progression`
2. Complete the final "Unlock New Module" task
3. This module (`example-3a-task-unlock`) becomes available on the worldmap
4. You can now access this module and complete its tasks

## Key Concepts

- **Unlock requirement**: The module config uses `unlockRequirement: taskComplete(module3UnlockTask)` to specify what unlocks it
- **Task reference**: The unlock requirement references a task from another module
- **Module dependency**: This module depends on `example-3-progression` being completed

## Files

- `config.ts` - Module configuration with unlock requirement
- `content/tasks.ts` - Tasks available in this module
- `content/NPC/guide/` - NPC with dialogue explaining the unlock mechanism

## Related Documentation

- See `docs/progression.md` for more on unlock requirements
- See `docs/module-3-progression.md` for the full progression example
- See `docs/core-concepts.md` for module structure

