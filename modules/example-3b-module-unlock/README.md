# Example 3B: Module Unlock Module

This module demonstrates how modules can be unlocked by completing another entire module.

## What This Module Shows

- **Module unlock via module completion**: This module is unlocked when you complete the entire `example-3-progression` module
- **Module-to-module dependency**: Shows how modules can depend on other modules
- **Unlockable module structure**: Shows how to create a module that starts locked

## How It Works

1. Complete all tasks in `example-3-progression` module
2. The entire module is marked as complete
3. This module (`example-3b-module-unlock`) becomes available on the worldmap
4. You can now access this module and complete its tasks

## Key Concepts

- **Unlock requirement**: The module config uses `unlockRequirement: moduleComplete('example-3-progression')` to specify what unlocks it
- **Module completion**: All tasks in the prerequisite module must be completed
- **Module dependency**: This module depends on `example-3-progression` being fully completed

## Difference from Example 3A

- **Example 3A**: Unlocked by completing a specific task
- **Example 3B**: Unlocked by completing an entire module

## Files

- `config.ts` - Module configuration with module unlock requirement
- `content/tasks.ts` - Tasks available in this module
- `content/NPC/guide/` - NPC with dialogue explaining the unlock mechanism

## Related Documentation

- See `docs/progression.md` for more on unlock requirements
- See `docs/module-3-progression.md` for the full progression example
- See `docs/core-concepts.md` for module structure

