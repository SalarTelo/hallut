# Core Concepts

Understand what modules, NPCs, tasks, and objects are - and how they fit together.

## Mental Model: Think Like a Game

AI Lab is built like a game where users (children learning AI) go through **modules** (levels). Each module has characters to talk to, tasks to solve, and objects to explore.

```
Game → Levels → Content
AI Lab → Modules → NPCs, Tasks, Objects
```

## What is a Module?

A **module** is a collection of content that users can explore. Think of it as a level in a game or a chapter in a book.

### Conceptual Diagram:

```
┌─────────────────────────────────────┐
│         A MODULE                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Title: "Introduction to AI"  │ │
│  │  Background: Blue              │ │
│  └───────────────────────────────┘ │
│                                     │
│  📍 NPC: Teacher                    │
│  📍 Object: Note                    │
│  📍 Task: Write about AI             │
│                                     │
│  When user completes module:        │
│  → Next module unlocks              │
└─────────────────────────────────────┘
```

### What does a module contain?

1. **Configuration** (config.ts)
   - Title and description
   - Background color or image
   - Welcome message
   - Position on worldmap

2. **Content** (content/)
   - NPCs (characters)
   - Objects (things to click on)
   - Tasks (things to solve)

### When do I use a module?

- When you want to create a new level or chapter
- When you want to group related content
- When you want to create progression (first module 1, then module 2)

### Example:

```
Module 1: "What is AI?"
  → NPC that explains
  → Task: Describe AI in your own words

Module 2: "Machine Learning"
  → Locked until module 1 is complete
  → NPC that explains ML
  → Task: Identify ML usage
```

**See `modules/example-1-basic/` for a minimal module example.**

## What is an NPC?

An **NPC** (Non-Player Character) is a character that users can interact with. Think of them as roles in a game.

### Conceptual Diagram:

```
       ┌──────────┐
       │   NPC    │
       │ (Teacher)│
       │    👨‍🏫   │
       └────┬─────┘
            │
            │ Click
            ↓
    ┌───────────────┐
    │   Dialogue    │
    │               │
    │ "Hello! I have│
    │  a task       │
    │  for you..."  │
    │               │
    │ [Accept]      │
    └───────────────┘
```

### What can an NPC do?

1. **Have dialogues**
   - Talk with users
   - Give information
   - Tell stories

2. **Give tasks**
   - Offer tasks
   - Follow up on task progress
   - Give feedback when task is complete

3. **Remember things**
   - NPC can "remember" if user has met them before
   - Dialogues can change based on what happened

### When do I use an NPC?

- When you want to give users information through dialogue
- When you want to offer tasks in a natural way
- When you want to create characters in your story

### Example NPCs:

```
👨‍🏫 Teacher    → Explains concepts, gives tasks
🤖 AI Expert   → Gives advanced information
👤 Guide       → Gives tips and guidance
📚 Librarian   → Gives information about resources
```

**See `modules/example-1-basic/` for a simple NPC, or `modules/example-2-dialogues/` for NPCs with dialogue trees.**

## What is a Task?

A **task** is an activity that users should solve. It can be validated to ensure the user understood.

### Conceptual Diagram:

```
┌─────────────────────────────┐
│      TASK                    │
│                             │
│  "Describe what AI is"      │
│                             │
│  ┌───────────────────────┐ │
│  │ [Text Field]          │ │
│  │                       │ │
│  │ User writes here...   │ │
│  └───────────────────────┘ │
│                             │
│  [Submit]                   │
│                             │
│  System validates:          │
│  ✓ Contains "AI"?           │
│  ✓ At least 50 words?      │
│                             │
│  → Success or Feedback       │
└─────────────────────────────┘
```

### Flow: What happens when user solves a task?

```
1. User sees the task
   ↓
2. User writes/uploads/answers
   ↓
3. User clicks "Submit"
   ↓
4. System validates (checks)
   ↓
5a. If correct → Success! Points, next step
5b. If incorrect → Feedback, try again
```

### Different types of tasks:

| Type | What user does | When to use |
|------|----------------|-------------|
| **Text** | Writes text | Reflection, description, analysis |
| **Image** | Uploads image | Visual proof, creation |
| **Code** | Writes code | Programming, logic |
| **Multiple Choice** | Selects answer | Test, knowledge check |
| **Custom** | Unique interaction | Games, simulation |

### When do I use a task?

- When you want to test user's understanding
- When you want to give users something active to do
- When you want to create progression (unlock content after task)

### Example tasks:

```
Text task: "Describe AI in your own words" (at least 50 words)
Image task: "Draw a sketch of how AI learns"
Code task: "Write a function that identifies images"
Multiple choice: "Which is NOT an example of AI?"
```

**See `modules/example-1-basic/` for a simple task, or `modules/example-3-progression/` for task chains.**

## What is an Object?

An **object** is something users can click on to get information or interact with.

### Conceptual Diagram:

```
       ┌──────────┐
       │  Object  │
       │  (Sign)  │
       │    📝    │
       └────┬─────┘
            │
            │ Click
            ↓
    ┌───────────────┐
    │   Note        │
    │               │
    │ "Welcome!     │
    │  This module  │
    │  teaches you  │
    │  about AI..." │
    │               │
    │   [Close]     │
    └───────────────┘
```

### What can an object do?

1. **Show information**
   - Notes to read
   - Signs with information
   - Images to look at

2. **Interact**
   - Chat windows
   - Custom components
   - Games or simulations

### Different types of objects:

| Type | What happens | When to use |
|------|--------------|-------------|
| **Note** | Shows text | Information, tips |
| **Sign** | Shows text with title | Important information |
| **Image** | Shows image | Visual information |
| **Chat** | Chat window | Interactive conversation |
| **Custom** | Custom component | Unique interaction |

### When do I use an object?

- When you want to give information without NPC
- When you want static elements (signs, notes)
- When you want visual content (images)
- When you want special interaction

### Example objects:

```
📝 Note → "Tip: AI learns from data"
🖼️ Image → Diagram of ML process
💬 Chat → Interactive AI assistant
📋 Sign → "Welcome to module 1"
```

**See `modules/example-1-basic/` for simple objects, or `modules/example-3-progression/` for locked objects.**

## How Does Everything Fit Together?

### Big Overview:

```
┌─────────────────────────────────────────────┐
│              A MODULE                        │
│                                              │
│  ┌────────┐    ┌────────┐    ┌────────┐    │
│  │  NPC   │    │ Object │    │ Object │    │
│  │        │    │        │    │        │    │
│  │ Talk   │    │ Info   │    │ Image  │    │
│  │    ↓   │    │        │    │        │    │
│  │Task   │    │        │    │        │    │
│  └───┬────┘    └────────┘    └────────┘    │
│      │                                      │
│      ↓                                      │
│  ┌────────┐                                │
│  │Task    │                                │
│  │        │                                │
│  │ Solve →│                                │
│  │Complete│                                │
│  │Unlock  │                                │
│  └────────┘                                │
│      │                                      │
│      ↓                                      │
│  Next module unlocks!                      │
└─────────────────────────────────────────────┘
```

### Data Flow: How do users interact?

```
1. User opens module
   ↓
2. Sees NPCs, objects, tasks
   ↓
3. Clicks on NPC → Dialogue → Gets task
   ↓
4. Clicks on object → Gets information
   ↓
5. Solves task → Validated → Feedback
   ↓
6. When task complete → Next module can unlock
```

### Example: A Complete Module

```
Module: "Introduction to AI"

1. NPC (Teacher) 👨‍🏫
   → Dialogue: "Welcome! Let's start..."
   → Offers task: "Describe AI"

2. Object (Note) 📝
   → Information: "AI is when computers think like humans"

3. Object (Image) 🖼️
   → Diagram: "How AI works"

4. Task: "Describe AI in your own words"
   → User writes
   → Validated
   → If correct: Module 2 unlocks!
```

**See `modules/example-3-progression/` for a complete example showing progression and unlocks together.**

## Summary: When Do I Use What?

### Use a **Module** when you want to:
- Create a new level/chapter
- Group related content
- Create progression

### Use an **NPC** when you want to:
- Give information through dialogue
- Offer tasks naturally
- Create characters

### Use a **Task** when you want to:
- Test understanding
- Give activity
- Create progression

### Use an **Object** when you want to:
- Give static information
- Show images
- Create unique interaction

## Next Steps

Now that you understand the core concepts:
- Go to [Module Guide](module-guide.md) to create your first module
- Read [Building Blocks](building-blocks.md) for details about NPCs, tasks, and objects
- Study `modules/example-1-basic/` for a minimal working example

