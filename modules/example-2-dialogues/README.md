# Example 2: Dialogues Module

Demonstrates dialogue trees, state management, and conditional dialogue entry.

## What This Demonstrates

- ✅ Dialogue trees with multiple nodes
- ✅ State management (NPC remembers player)
- ✅ Conditional dialogue entry (different dialogue first time vs. later)
- ✅ Actions in dialogues (accepting tasks, updating state)
- ✅ State references (`stateRef`)

## Structure

```
example-2-dialogues/
├── index.ts
├── config.ts
└── content/
    ├── index.ts
    ├── tasks.ts
    ├── NPCs.ts
    ├── objects.ts
    └── NPC/
        └── teacher/
            ├── index.ts      # NPC definition
            ├── dialogues.ts  # Dialogue tree
            └── state.ts      # State management
```

## Key Points

1. **Dialogue Tree**: The teacher has a dialogue tree, not just tasks
2. **State Management**: Uses `stateRef` to remember if player has met them
3. **Conditional Entry**: First greeting vs. general greeting based on state
4. **Actions**: Dialogues can accept tasks and update state

## Try This

1. Talk to the teacher the first time → See first greeting
2. Talk to the teacher again → See different greeting (they remember you!)
3. Accept the task through dialogue
4. Notice how the dialogue changes based on state

## When to Use This as Reference

- Learning how to create dialogue trees
- Understanding state management in NPCs
- Seeing how conditional dialogue entry works
- Learning about actions in dialogues

## Next Steps

- See `example-1-basic/` for simpler examples
- See `example-3-progression/` to learn about unlock requirements
- Read `docs/dialogues.md` for detailed dialogue documentation

