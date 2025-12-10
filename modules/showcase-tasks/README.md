# Showcase: Tasks

This module demonstrates all task types, validators, and task features.

## Purpose

Learn all available task submission types, validation methods, and task configuration options.

## What This Module Demonstrates

### Task Submission Types
- **Text Submission** - `textSubmission()`
- **Multiple Choice** - `multipleChoiceSubmission()`
- **Custom Submission** - `customSubmission()` with custom React components

### Validators
- **Text Length** - `textLengthValidator()` - Validates minimum character count
- **Word Count** - `wordCountValidator()` - Validates minimum word count
- **Keywords** - `keywordsValidator()` - Validates presence of specific keywords
- **Custom Validation** - Write your own validation logic

Note: All text validators (length, word count, keywords) are variations of the same "Text Task" type.

### Task Features
- Task dialogues (offer, ready, complete)
- Task metadata (hints, examples)
- Task overview (requirements, goals)
- Success/failure responses
- Custom submission components with `taskSubmissionComponents`

## Key Files

- `content/tasks.ts` - All task type examples
- `content/NPC/teacher/index.ts` - NPC offering all tasks
- `content/NPC/teacher/dialogues.ts` - Dialogue tree with task variations
- `components/CustomTaskSubmission.tsx` - Custom task submission component
- `index.ts` - Module definition with `taskSubmissionComponents`

## Code Examples

### Text Task with Length Validator
```typescript
export const textLengthTask = createTask({
  id: 'text-length',
  name: 'Text Task (Length Validator)',
  description: 'Write a message (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Great!', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  // ...
});
```

### Multiple Choice Task
```typescript
export const multipleChoiceTask = createTask({
  id: 'multiple-choice',
  name: 'Multiple Choice Task',
  description: 'Which task type allows selection?',
  submission: multipleChoiceSubmission([
    'Text Task',
    'Multiple Choice Task',
    'Custom Task',
  ]),
  validate: (input) => {
    if (input.type === 'multiple_choice' && input.choice === 'Multiple Choice Task') {
      return success('correct', 'Correct!', 100);
    }
    return failure('incorrect', 'Not quite. Try again!');
  },
  // ...
});
```

### Word Count Validator
```typescript
validate: wordCountValidator(5, (text, wordCount) => {
  return success('complete', `Great! You used ${wordCount} words.`, 100);
})
```

### Keywords Validator
```typescript
validate: keywordsValidator(['task', 'activity'], (text, foundKeywords) => {
  return success('complete', `Found keywords: ${foundKeywords.join(', ')}`, 100);
})
```

### Custom Submission Component
```typescript
// In your task definition
export const customTask = createTask({
  id: 'custom',
  name: 'Custom Submission Task',
  description: 'This demonstrates custom submission components.',
  submission: customSubmission('CustomTaskSubmission', {
    instruction: 'Select your favorite color and enter a reason',
  }),
  validate: (input) => {
    if (input.type === 'custom' && input.data) {
      const data = input.data as { color?: string; reason?: string };
      if (data.color && data.reason && data.reason.length >= 10) {
        return success('complete', 'Great!', 100);
      }
      return failure('incomplete', 'Please complete all fields.');
    }
    return failure('invalid', 'Invalid submission.');
  },
  // ...
});

// In your module index.ts
import { customTaskSubmissionRenderer } from './components/CustomTaskSubmission.jsx';

export default defineModule({
  id: 'my-module',
  // ...
  taskSubmissionComponents: {
    CustomTaskSubmission: customTaskSubmissionRenderer,
  },
});
```

## Task Metadata

Tasks can include helpful metadata:
```typescript
meta: {
  hints: ['Hint 1', 'Hint 2'],
  examples: ['Example 1', 'Example 2'],
}
```

## Task Dialogues

Tasks can have dialogue messages:
```typescript
dialogues: {
  offer: ['I have a task for you.'],
  ready: ['Ready to submit?'],
  complete: ['Excellent!'],
}
```

## Custom Submission Components

Custom submission components allow you to create unique task submission interfaces:

1. **Create a React component** that accepts `value`, `onChange`, and `config` props
2. **Export a renderer function** that wraps your component
3. **Register it** in your module's `taskSubmissionComponents` field
4. **Use it** in tasks with `customSubmission('ComponentName', config)`

See `components/CustomTaskSubmission.tsx` for a complete example.

## Unlock Requirement

This module unlocks when the hub module (`module-creator-showcase`) is completed.

## Next Steps

After learning all task types, explore:
- **showcase-progression** - Use tasks in progression chains
- **showcase-advanced** - Advanced task features
