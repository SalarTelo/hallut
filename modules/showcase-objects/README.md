# Showcase: Objects

This module demonstrates all object types and interaction methods.

## Purpose

Learn all available object types and how to create interactive objects for users to explore.

## What This Module Demonstrates

### Object Types
- **Note Viewer** - `showNoteViewer()`
- **Sign Viewer** - `showSignViewer()`
- **Image Viewer** - `showImageViewer()`
- **Video Viewer** - `showVideoViewer()`
- **Chat Window** - `showChatWindow()`
- **Custom Component** - `showComponent()` with custom React components

### Locked Objects
- Objects with unlock requirements
- `taskComplete()` requirement
- Locked state management

## Key Files

- `content/objects.ts` - All object type examples
- `content/tasks.ts` - Task to unlock locked object
- `components/CustomObjectViewer.tsx` - Custom object viewer component
- `index.ts` - Module definition with `components` field

## Code Examples

### Note Viewer
```typescript
export const noteObject = createObject({
  id: 'note-object',
  name: 'Note Object',
  position: position(20, 30),
  avatar: 'note',
  onInteract: showNoteViewer({
    title: 'Note Viewer',
    content: 'This is a Note object...',
  }),
});
```

### Sign Viewer
```typescript
export const signObject = createObject({
  id: 'sign-object',
  name: 'Sign Object',
  position: position(40, 30),
  avatar: 'note',
  onInteract: showSignViewer({
    title: 'Sign Viewer',
    content: 'This is a Sign object...',
  }),
});
```

### Image Viewer
```typescript
export const imageObject = createObject({
  id: 'image-object',
  name: 'Image Object',
  position: position(60, 30),
  avatar: 'note',
  onInteract: showImageViewer({
    title: 'Image Viewer',
    imageUrl: 'https://example.com/image.jpg',
  }),
});
```

### Video Viewer
```typescript
export const videoObject = createObject({
  id: 'video-object',
  name: 'Video Object',
  position: position(80, 30),
  avatar: 'note',
  onInteract: showVideoViewer({
    title: 'Video Viewer',
    videoUrl: 'https://www.youtube.com/watch?v=...',
  }),
});
```

### Chat Window
```typescript
export const chatObject = createObject({
  id: 'chat-object',
  name: 'Chat Object',
  position: position(30, 50),
  avatar: 'note',
  onInteract: showChatWindow({
    title: 'Chat Window',
    placeholder: 'Type a message...',
  }),
});
```

### Custom Component
```typescript
// In your object definition
export const customObject = createObject({
  id: 'custom-object',
  name: 'Custom Component Object',
  position: position(50, 50),
  avatar: 'note',
  onInteract: showComponent('CustomObjectViewer', {
    title: 'Custom Component',
    content: 'This uses a custom component renderer...',
    interactive: true,
  }),
});

// In your module index.ts
import { customObjectViewerRenderer } from './components/CustomObjectViewer.jsx';

export default defineModule({
  id: 'my-module',
  // ...
  components: {
    CustomObjectViewer: customObjectViewerRenderer,
  },
});
```

### Locked Object
```typescript
export const lockedObject = createObject({
  id: 'locked-object',
  name: 'Locked Object',
  position: position(70, 50),
  avatar: 'note',
  locked: true,
  unlockRequirement: taskComplete(unlockTask),
  onInteract: showSignViewer({
    title: 'Locked Object (Now Unlocked!)',
    content: 'This object was locked until you completed the unlock task.',
  }),
});
```

## Object Positioning

Objects use percentage-based positioning (0-100):
```typescript
position: position(50, 50) // Center of screen
position: position(20, 30) // Left side, upper area
```

## Custom Component Renderers

Custom component renderers allow you to create unique object interactions:

1. **Create a React component** that accepts `isOpen`, `onClose`, `props`, and optional `borderColor`
2. **Export a renderer function** that wraps your component
3. **Register it** in your module's `components` field
4. **Use it** in objects with `showComponent('ComponentName', props)`

See `components/CustomObjectViewer.tsx` for a complete example.

## Unlock Requirement

This module unlocks when the hub module (`module-creator-showcase`) is completed.

## Next Steps

After learning all object types, explore:
- **showcase-progression** - Use objects in progression systems
- **showcase-advanced** - Custom component renderers
