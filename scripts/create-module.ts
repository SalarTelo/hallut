#!/usr/bin/env node

/**
 * Module scaffolding script (TypeScript)
 * Creates a new module with TypeScript files
 * 
 * Usage: npm run module:create <module-id>
 * Example: npm run module:create my-new-module
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');

// Validate module ID
function validateModuleId(id: string): void {
  if (!id) {
    throw new Error('Module ID is required');
  }
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error('Module ID must be lowercase alphanumeric with hyphens (e.g., "my-module")');
  }
}

// Template for module.ts
const moduleTemplate = (id: string, displayName: string) => `/**
 * ${displayName} Module
 * Main module definition using TypeScript
 */

import { InteractableType, InteractableActionType } from '../../src/types/interactable.types.js';
import type { ModuleConfig, Interactable, Task } from '../../src/types/module.types.js';
import { task1_solve } from './taskSolvers.js';
import { getTranslations } from './translations.js';

export function createModule(locale: string = 'sv'): ModuleConfig {
  const t = getTranslations(locale);
  
  // Define tasks
  const tasks: Task[] = [
    {
      id: 'task-1',
      order: 1,
      name: t.tasks.task1.name,
      description: t.tasks.task1.description,
      solveFunction: task1_solve,
      intro: {
        speaker: 'mentor',
        lines: t.tasks.task1.intro.lines,
      },
    },
  ];
  
  // Define interactables
  const interactables: Interactable[] = [
    {
      id: 'mentor',
      type: InteractableType.NPC,
      name: t.interactables.mentor.name,
      position: { x: 30, y: 60 },
      avatar: '👨‍🏫',
      locked: false,
      unlockRequirement: null,
      action: {
        type: InteractableActionType.Dialogue,
        dialogue: 'mentor_intro',
      },
    },
  ];
  
  return {
    manifest: {
      id: '${id}',
      name: t.manifest.name,
      version: '1.0.0',
    },
    background: {
      color: '#4a5568',
      image: null,
    },
    welcome: {
      speaker: 'mentor',
      lines: t.welcome.lines,
    },
    interactables,
    tasks,
  };
}

// Default export for default locale
export const module = createModule('sv');
`;

// Template for translations.ts
const translationsTemplate = (id: string, displayName: string) => `/**
 * Translations for ${id} module
 */

interface ModuleTranslations {
  manifest: {
    name: string;
    description: string;
  };
  welcome: {
    lines: string[];
  };
  interactables: {
    mentor: {
      name: string;
    };
  };
  dialogues: {
    mentor_intro: {
      lines: string[];
    };
  };
  tasks: {
    task1: {
      name: string;
      description: string;
      intro: {
        lines: string[];
      };
    };
  };
}

export const translations: Record<string, ModuleTranslations> = {
  sv: {
    manifest: {
      name: '${displayName}',
      description: 'Beskrivning av din modul',
    },
    welcome: {
      lines: [
        'Välkommen till ${displayName}!',
        'Detta är en mall för att komma igång.',
      ],
    },
    interactables: {
      mentor: {
        name: 'Mentor',
      },
    },
    dialogues: {
      mentor_intro: {
        lines: [
          'Hej! Jag är din mentor.',
          'Låt oss börja med första uppgiften.',
        ],
      },
    },
    tasks: {
      task1: {
        name: 'Första uppgiften',
        description: 'Beskrivning av första uppgiften',
        intro: {
          lines: [
            'Nu ska vi börja med din första uppgift!',
            'Följ instruktionerna nedan.',
          ],
        },
      },
    },
  },
  en: {
    manifest: {
      name: '${displayName}',
      description: 'Description of your module',
    },
    welcome: {
      lines: [
        'Welcome to ${displayName}!',
        'This is a template to get you started.',
      ],
    },
    interactables: {
      mentor: {
        name: 'Mentor',
      },
    },
    dialogues: {
      mentor_intro: {
        lines: [
          'Hello! I am your mentor.',
          'Let's start with the first task.',
        ],
      },
    },
    tasks: {
      task1: {
        name: 'First Task',
        description: 'Description of the first task',
        intro: {
          lines: [
            'Now let's start with your first task!',
            'Follow the instructions below.',
          ],
        },
      },
    },
  },
};

export function getTranslations(locale: string = 'sv'): ModuleTranslations {
  return translations[locale] || translations.sv;
}

export const t = translations.sv;
`;

// Template for dialogues.ts
const dialoguesTemplate = (id: string) => `/**
 * Dialogue trees for ${id} module
 */

import { t } from './translations.js';

export const dialogues = {
  mentor_intro: {
    speaker: 'mentor',
    lines: t.dialogues.mentor_intro.lines,
  },
} as const;

export type DialogueId = keyof typeof dialogues;
`;

// Template for taskSolvers.ts
const taskSolversTemplate = (id: string) => `/**
 * Task solve functions for ${id} module
 */

import type { TaskSolveResult } from '../../src/types/module.types.js';

export function task1_solve(input: { answer: string }): TaskSolveResult {
  const { answer } = input;
  
  // Check minimum length
  const wordCount = answer.trim().split(/\\s+/).length;
  if (wordCount < 50) {
    return {
      solved: false,
      reason: 'Svaret är för kort',
      details: \`Du har \${wordCount} ord. Minst 50 ord krävs.\`,
    };
  }
  
  // Add your validation logic here
  
  return {
    solved: true,
    reason: 'Utmärkt arbete!',
    details: 'Ditt svar uppfyller alla krav.',
  };
}
`;

// Template for components/ExampleCustomStep.tsx
const exampleComponentTemplate = (moduleId: string) => `/**
 * Example Custom Step Component
 * 
 * Use this as a template for creating your own custom components.
 */

import { useModuleStore } from '../../../src/store/moduleStore.js';

export interface ExampleCustomStepProps {
  title?: string;
  message?: string;
  onNext: () => void;
  onPrevious?: () => void;
  [key: string]: any;
}

export default function ExampleCustomStep({
  title = 'Custom Step',
  message = 'This is a custom component!',
  onNext,
  onPrevious,
  ...props
}: ExampleCustomStepProps) {
  // Access module state if needed
  const moduleState = useModuleStore((state) => state.moduleState);
  
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={onNext}>Continue</button>
        {onPrevious && <button onClick={onPrevious} style={{ marginLeft: '1rem' }}>Back</button>}
      </div>
    </div>
  );
}
`;

async function createModule(moduleId: string): Promise<void> {
  try {
    validateModuleId(moduleId);

    // Check if module already exists
    const modulePath = path.join(MODULES_DIR, moduleId);
    try {
      await fs.access(modulePath);
      throw new Error(`Module "${moduleId}" already exists`);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Create module directory
    await fs.mkdir(modulePath, { recursive: true });

    // Generate display name from ID
    const displayName = moduleId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create module.ts
    const modulePath_file = path.join(modulePath, 'module.ts');
    await fs.writeFile(modulePath_file, moduleTemplate(moduleId, displayName), 'utf-8');

    // Create translations.ts
    const translationsPath = path.join(modulePath, 'translations.ts');
    await fs.writeFile(translationsPath, translationsTemplate(moduleId, displayName), 'utf-8');

    // Create dialogues.ts
    const dialoguesPath = path.join(modulePath, 'dialogues.ts');
    await fs.writeFile(dialoguesPath, dialoguesTemplate(moduleId), 'utf-8');

    // Create taskSolvers.ts
    const taskSolversPath = path.join(modulePath, 'taskSolvers.ts');
    await fs.writeFile(taskSolversPath, taskSolversTemplate(moduleId), 'utf-8');

    // Create components directory with example
    const componentsPath = path.join(modulePath, 'components');
    await fs.mkdir(componentsPath, { recursive: true });
    
    // Create example component
    const exampleComponentPath = path.join(componentsPath, 'ExampleCustomStep.tsx');
    await fs.writeFile(exampleComponentPath, exampleComponentTemplate(moduleId), 'utf-8');
    
    // Create components index file
    const componentsIndexPath = path.join(componentsPath, 'index.ts');
    const componentsIndex = `/**
 * Module Component Exports
 * Export all custom components for this module here
 */

export { default as ExampleCustomStep } from './ExampleCustomStep.js';

// Add more components here:
// export { default as MyCustomComponent } from './MyCustomComponent.js';
`;
    await fs.writeFile(componentsIndexPath, componentsIndex, 'utf-8');

    console.log(`✅ Module "${moduleId}" created successfully!`);
    console.log(`📁 Location: ${modulePath}`);
    console.log(`\n📝 Files created:`);
    console.log(`   - module.ts (main module definition)`);
    console.log(`   - translations.ts (SV + EN translations)`);
    console.log(`   - dialogues.ts (dialogue trees)`);
    console.log(`   - taskSolvers.ts (task solve functions)`);
    console.log(`   - components/ExampleCustomStep.tsx (example custom component)`);
    console.log(`   - components/index.ts (component exports)`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Edit ${path.join(modulePath, 'module.ts')} to configure your module`);
    console.log(`   2. Edit ${path.join(modulePath, 'translations.ts')} to add translations`);
    console.log(`   3. Edit ${path.join(modulePath, 'taskSolvers.ts')} to implement task logic`);
    console.log(`   4. Create custom components in ${path.join(modulePath, 'components/')}`);
    console.log(`   5. Test your module in the app`);
    console.log(`\n💡 Tip: Use npm run task:create to add more tasks!`);
  } catch (error: any) {
    console.error('❌ Error creating module:', error.message);
    process.exit(1);
  }
}

// Get module ID from command line
const moduleId = process.argv[2];

if (!moduleId) {
  console.error('❌ Usage: npm run module:create <module-id>');
  console.error('   Example: npm run module:create my-new-module');
  process.exit(1);
}

createModule(moduleId);

