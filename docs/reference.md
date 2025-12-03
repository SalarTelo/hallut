# Reference: Quick Reference

Quick lookup for all builders and functions.

## Module Builders

### createModuleConfig
Create module configuration:
```typescript
createModuleConfig({ manifest, background, welcome, worldmap })
```

### createManifest
Create module manifest:
```typescript
createManifest(id, name, version, description)
```

### colorBackground / imageBackground
Background:
```typescript
colorBackground('#2d3748')
imageBackground('/images/bg.jpg')
```

## NPC Builders

### createNPC
Create NPC:
```typescript
createNPC({ id, name, position, avatar, tasks?, dialogueTree? })
```

### pos
Position:
```typescript
pos(50, 50) // x, y in percent (0-100)
```

**See `modules/example-1-basic/content/NPC/guide/index.ts` for examples.**

## Task Builders

### createTask
Create task:
```typescript
createTask({ id, name, description, submission, validate, ... })
```

### Submission Types
```typescript
textSubmission()
imageSubmission()
codeSubmission('typescript')
multipleChoiceSubmission(['Option 1', 'Option 2'])
customSubmission('ComponentName')
```

### Validators
```typescript
textLengthValidator(minLength, callback)
wordCountValidator(minWords, callback)
keywordsValidator(['word1', 'word2'], callback)
```

### Result
```typescript
success(reason, details, score?)
failure(reason, details)
```

**See `modules/example-1-basic/content/tasks.ts` for examples.**

## Object Builders

### createObject
Create object:
```typescript
createObject({ id, name, position, avatar, interaction, ... })
```

### Interactions
```typescript
showNoteViewer({ content, title })
showSignViewer({ content, title })
showImageViewer({ imageUrl, title })
showChatWindow({ messages })
showComponent('ComponentName', props)
```

**See `modules/example-1-basic/content/objects.ts` for examples.**

## Dialogue Builders

### dialogueTree
Create dialogue tree:
```typescript
dialogueTree()
  .nodes(...nodes)
  .configureEntry()
    .when(condition).use(node)
    .default(node)
  .build()
```

### dialogueNode
Create dialogue node:
```typescript
dialogueNode({ lines, choices, task? })
```

### Actions
```typescript
acceptTask(task)
callFunction((ctx) => { /* ... */ })
```

### Conditions
```typescript
taskComplete(task)
taskActive(task)
stateCheck(key, value)
interactableStateCheck(id, key, value)
moduleStateCheck(key, value)
```

### State Reference
```typescript
const state = stateRef({ id: 'npc-id' })
state(ctx).field = value
```

**See `modules/example-2-dialogues/content/NPC/teacher/` for examples.**

## Unlock Builders

### Requirements
```typescript
taskComplete(task)
moduleComplete(moduleId)
stateCheck(key, value)
andRequirements([req1, req2])
orRequirements([req1, req2])
```

**See `modules/example-3-progression/` for unlock examples.**

## Next Steps

- See [Building Blocks](building-blocks.md) for detailed examples
- Read [Module Guide](module-guide.md) for tutorial
- Check [Troubleshooting](troubleshooting.md) if something doesn't work

