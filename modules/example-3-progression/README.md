# Example 3: Progression Module

Demonstrates unlock requirements, task chains, and locked content.

## What This Demonstrates

- ✅ Task chains (Task 1 → unlocks Task 2 → unlocks Task 3)
- ✅ Locked NPCs (Expert NPC unlocks after Task 1)
- ✅ Locked objects (Chests unlock after tasks)
- ✅ Unlock requirements (`taskComplete`)
- ✅ Progression between content

## Structure

```
example-3-progression/
├── index.ts
├── config.ts
└── content/
    ├── index.ts
    ├── tasks.ts         # 3 tasks with unlock chain
    ├── NPCs.ts
    ├── objects.ts       # Locked objects
    └── NPC/
        ├── teacher/     # Always available
        └── expert/      # Locked until Task 1 done
```

## Task Chain

```
Task 1: Introduction (always available)
    ↓ [Complete Task 1]
Task 2: Quiz (unlocked)
    ↓ [Complete Task 2]
Task 3: Reflection (unlocked)
```

## Unlock Flow

1. **Start**: Only Teacher NPC and Welcome Sign available
2. **After Task 1**: Expert NPC and Chest 1 unlock
3. **After Task 2**: Chest 2 unlocks
4. **After Task 3**: All content available

## Key Points

1. **Task Dependencies**: Each task unlocks the next
2. **Locked NPCs**: Expert NPC is locked until introTask is done
3. **Locked Objects**: Chests unlock as you progress
4. **Progression**: Content unlocks in a logical sequence

## Try This

1. Start with Teacher NPC → Get Task 1
2. Complete Task 1 → Expert NPC and Chest 1 unlock
3. Talk to Expert NPC → Get Task 2
4. Complete Task 2 → Chest 2 unlocks
5. Complete Task 3 → All content unlocked!

## When to Use This as Reference

- Learning about unlock requirements
- Creating task chains
- Locking NPCs and objects
- Designing progression

## Next Steps

- See `example-1-basic/` for simpler examples
- See `example-2-dialogues/` for dialogue examples
- See `example-3a-task-unlock/` and `example-3b-module-unlock/` for unlock examples
- Read `docs/progression.md` for detailed documentation

