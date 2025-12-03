# Troubleshooting: When Things Don't Work

Common problems and how to solve them.

## Module Doesn't Load

### Problem
Module doesn't appear on worldmap or in list.

### Solutions

1. **Check that index.ts exports defineModule**

```typescript
// ✅ Correct
export default defineModule({
  id: 'my-module',
  // ...
});

// ❌ Wrong
export defineModule({ // Missing default
```

2. **Check that module ID matches**

```typescript
// In index.ts
export default defineModule({
  id: 'my-module', // Must match
  // ...
});

// In config.ts
manifest: createManifest('my-module', ...) // Same ID
```

3. **Run validation**

```bash
npm run module:validate
```

4. **Check TypeScript errors**

```bash
npm run build
```

**Compare with `modules/example-1-basic/index.ts` for correct structure.**

## NPC Doesn't Appear

### Problem
NPC doesn't show when module opens.

### Solutions

1. **Check export**

```typescript
// In content/NPCs.ts
export const myNPC = createNPC({ /* ... */ });

export const NPCs = [myNPC]; // ✅ Must include NPC
```

2. **Check that NPCs are included in interactables**

```typescript
// In content/index.ts
import { NPCs } from './NPCs.js';
import { objects } from './objects.js';
export const interactables = [...NPCs, ...objects]; // ✅ Must combine NPCs and objects
```

3. **Check positions**

```typescript
position: pos(50, 50), // ✅ Must be between 0-100
```

4. **Check unlock requirements**

If NPC is locked, check that unlock requirement is met.

**Compare with `modules/example-1-basic/` for correct structure.**

## Task Doesn't Work

### Problem
Task doesn't validate correctly or crashes.

### Solutions

1. **Check validation logic**

```typescript
validate: (input) => {
  // Make sure you handle all cases
  if (input.type === 'text') {
    // Your logic
  }
  return failure('error', 'Message');
}
```

2. **Test with different inputs**

Try different answers to see what happens.

3. **Check success/failure**

```typescript
// ✅ Correct
return success('reason', 'Details', 100);
return failure('reason', 'Details');

// ❌ Wrong - must return something
```

**See `modules/example-1-basic/content/tasks.ts` for correct validation.**

## Dialogues Crash

### Problem
Dialogues don't work or crash.

### Solutions

1. **Check that all nodes exist**

```typescript
dialogueTree()
  .nodes(greeting, taskOffer) // ✅ All nodes must exist
  .build();
```

2. **Check next references**

```typescript
choices: {
  next: taskOffer, // ✅ Node must exist in .nodes()
}
```

3. **Check entry configuration**

```typescript
.configureEntry()
  .default(greeting) // ✅ Must reference a node
```

**See `modules/example-2-dialogues/content/NPC/teacher/dialogues.ts` for correct structure.**

## Unlock Doesn't Work

### Problem
Content doesn't unlock when requirement is met.

### Solutions

1. **Check unlock requirement**

```typescript
unlockRequirement: taskComplete(myTask), // ✅ Task must exist
```

2. **Check that requirement is met**

- Is task actually complete?
- Is module complete?
- Is state value correct?

3. **Use debug tools**

```bash
npm run cli
# Choose "Debug Tools"
```

**See `modules/example-3-progression/` for unlock requirement examples.**

## Common TypeScript Errors

### "Cannot find module"

**Solution:** Check imports:

```typescript
import { createNPC } from '@utils/builders/index.js'; // ✅ .js extension
```

### "Property does not exist"

**Solution:** Check type:

```typescript
tasks: [myTask], // ✅ Array, not Record
```

## Tips for Troubleshooting

1. **Run validation often**
   ```bash
   npm run module:validate
   ```

2. **Check console**
   - Browser console for runtime errors
   - Terminal for build errors

3. **Test step by step**
   - Create minimal version first
   - Add features one at a time

4. **Compare with examples**
   - Check `modules/example-1-basic/`
   - See how it's done there

## Next Steps

- See [Module Guide](module-guide.md) for basic structure
- Read [Building Blocks](building-blocks.md) for details
- Check [Reference](reference.md) for API details

