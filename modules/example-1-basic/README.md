# Example 1: Basic Module

The simplest possible working module. Use this as a reference when creating your first module.

## What This Demonstrates

- ✅ Basic module structure (index.ts, config.ts, content/)
- ✅ One NPC with a dialogue tree and task
- ✅ One simple object (sign)
- ✅ Basic text task with validation
- ✅ Simple state management (NPC remembers if you've met)
- ✅ Dialogue tree with conditional entry
- ✅ No unlock requirements

## Structure

```
example-1-basic/
├── index.ts              # Module definition
├── config.ts             # Module configuration
└── content/
    ├── index.ts         # Exports tasks, NPCs, objects, interactables
    ├── tasks.ts         # One simple task
    ├── NPCs.ts          # NPC aggregation
    ├── objects.ts        # One simple object
    └── NPC/
        └── guide/
            └── index.ts  # NPC definition (no dialogues)
```

## Key Points

1. **Basic NPC**: The Guide NPC has a simple dialogue tree that offers tasks
2. **Simple State**: NPC remembers if you've met them (basic state management)
3. **Simple Task**: Basic text validation with length check
4. **Simple Object**: Just a sign with information
5. **Minimal Complexity**: Basic dialogues and state, but no unlock requirements or complex progression

## When to Use This as Reference

- Creating your very first module
- Understanding the absolute minimum needed
- Learning the basic file structure
- Seeing how tasks, NPCs, and objects work at the simplest level

## Next Steps

After understanding this example:
- See `example-2-dialogues/` to learn about dialogue trees
- See `example-3-progression/` to learn about unlock requirements
- Read `docs/module-guide.md` for step-by-step instructions

