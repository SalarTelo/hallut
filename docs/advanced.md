# Advanced: Everything You Need to Know About the System

Consolidated guide for advanced topics.

## System Architecture

### Overview

AI Lab is built with a modular architecture:

```
Content Layer (modules/)
    ↓
Core Layer (src/core/) - Module loading, state, services
    ↓
UI Layer (src/ui/) - React components
```

### Module Loading

```
System starts → Loads modules/ → Registers modules → Shows on worldmap
```

**What happens:**
1. System searches for `modules/*/index.ts`
2. Each module exports `defineModule`
3. Modules are registered automatically
4. Worldmap shows all modules

### Data Flow

```
User Action → React Component → Hook → Action → Zustand Store → UI Update
```

## State Management

### How State Works

State is centralized in a Zustand store:

```typescript
{
  modules: {
    [moduleId]: {
      progress: 'locked' | 'unlocked' | 'completed',
      state: { ... }, // Custom module state
      tasks: { ... },
      interactables: { ... },
    }
  }
}
```

### State References in Dialogues

Use `stateRef` to access state:

```typescript
const npcState = stateRef({ id: 'my-npc' });

// In an action
callFunction((ctx) => {
  npcState(ctx).hasMet = true;
});
```

**See `modules/example-2-dialogues/content/NPC/teacher/state.ts` for state examples.**

## Development Workflow

### Efficient Workflow

1. **Create module structure**
   ```bash
   mkdir -p modules/my-module/content
   ```

2. **Develop content**
   - Create tasks.ts
   - Create NPCs.ts and objects.ts
   - Create content/index.ts to combine them
   - Create dialogues

3. **Test locally**
   ```bash
   npm run dev
   ```

4. **Validate**
   ```bash
   npm run module:validate
   ```

### Testing

```bash
npm test              # Watch mode
npm run test:run      # Once
npm run test:coverage # With coverage
```

### Debugging

Use CLI debug tools:

```bash
npm run cli
# Choose "Debug Tools"
```

## Custom Components

### When do you need to create one?

- When predefined components aren't enough
- For unique interaction
- For complex visual representation

### How to do it

1. Create component in `src/ui/shared/components/`
2. Export from `index.ts`
3. Use in object:

```typescript
interaction: showComponent('MyComponent', { props })
```

## Worldmap Advanced

### Complex Layouts

Place modules strategically:

```
    Module 2
      ↑
Module 1 → Module 3
```

### Dynamic Connections

Connections can be shown based on state or unlock requirements.

## Best Practices

1. **Organize code** - Follow module structure
2. **Validate often** - Run `npm run module:validate`
3. **Test locally** - Test before committing
4. **Use state** - For dynamic content
5. **Document** - Comment complex logic

## Next Steps

- See [Module Guide](module-guide.md) for basics
- Read [Building Blocks](building-blocks.md) for details
- Check [Reference](reference.md) for API
- Study `modules/example-3-progression/` for complex progression patterns
- See `modules/example-3a-task-unlock/` and `modules/example-3b-module-unlock/` for unlock patterns

