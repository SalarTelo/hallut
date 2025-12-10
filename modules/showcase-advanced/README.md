# Showcase: Advanced

This module demonstrates advanced features: password locks, handlers, custom components, and state management.

## Purpose

Learn advanced module features for complex interactions and custom functionality.

## What This Module Demonstrates

### Password Unlock Requirements
- `passwordUnlock()` - Password-protected modules
- Password hints
- Password unlock flow

### Module Handlers
- `onChoiceAction` - Intercept dialogue choice actions
- Custom handler logic
- Handler integration

### Custom Component Renderers
- Custom component registration
- `showComponent()` usage
- Component renderer structure

### Advanced State Management
- Complex state tracking
- State-based logic
- Module context usage

## Key Files

- `config.ts` - Password unlock configuration
- `index.ts` - Module handlers and custom components
- `content/NPC/teacher/dialogues.ts` - Advanced dialogue features
- `content/objects.ts` - Custom component objects

## Code Examples

### Password Unlock
```typescript
// In config.ts
unlockRequirement: passwordUnlock(
  'advanced123',
  'The password is "advanced123" - this demonstrates password-protected modules'
)
```

### Module Handlers
```typescript
const handlers = {
  onChoiceAction: async (dialogueId: string, action: any, context: any) => {
    // Custom logic for dialogue choices
    console.log('Choice action:', { dialogueId, action, context });
    // Modify state, trigger side effects, etc.
  },
};

export default defineModule({
  id: 'showcase-advanced',
  config,
  content: { interactables, tasks },
  handlers,
});
```

### Custom Component Renderers
```typescript
// In your component file (e.g., AdvancedCustomViewer.tsx)
export function AdvancedCustomViewer({ isOpen, onClose, props, borderColor }: AdvancedCustomViewerProps) {
  // Your custom React component implementation
  return (/* JSX */);
}

export const advancedCustomViewerRenderer: ComponentRenderer = ({ isOpen, onClose, props, borderColor }) => {
  return (<AdvancedCustomViewer isOpen={isOpen} onClose={onClose} props={props} borderColor={borderColor} />);
};

// In your module index.ts
import { advancedCustomViewerRenderer } from './components/AdvancedCustomViewer.jsx';

export default defineModule({
  id: 'showcase-advanced',
  config,
  content: { interactables, tasks },
  components: {
    AdvancedCustomViewer: advancedCustomViewerRenderer,
  },
});
```

### Using Custom Components
```typescript
export const customObject = createObject({
  id: 'custom-component',
  name: 'Custom Component Object',
  position: position(70, 40),
  avatar: 'note',
  onInteract: showComponent('AdvancedCustomViewer', {
    title: 'Custom Component',
    content: 'This uses a custom component renderer...',
  }),
});
```

## Password Protection

This module is password-protected to demonstrate password unlock requirements.

- **Password**: `advanced123`
- **Hint**: Provided in the unlock requirement
- **Purpose**: Demonstrates controlled access to modules

## Module Handlers

Handlers allow modules to respond to system events:
- `onChoiceAction` - Called when dialogue choices are made
- Useful for analytics, state management, side effects

## Custom Components

Custom component renderers allow:
- Unique interactions beyond standard object types
- Custom visualizations
- Complex component logic
- Integration with external systems

## Unlock Requirement

This module requires a password to unlock:
- Password: `advanced123`
- Hint is provided in the unlock requirement
- Password can be found in the hub module

## Advanced Features

This module showcases:
1. **Password Protection** - Controlled module access
2. **Handlers** - Event interception and custom logic
3. **Custom Components** - Unique interaction types
4. **State Management** - Complex state tracking

## Next Steps

After learning advanced features, you can:
- Create password-protected modules
- Implement custom handlers
- Build custom component renderers
- Manage complex state systems
