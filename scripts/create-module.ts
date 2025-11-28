#!/usr/bin/env node

/**
 * Modulscaffoldingskript
 * Skapar en ny modul med korrekt filstruktur matchande exempelmodulen
 * 
 * Användning: npm run module:create <modul-id>
 * Exempel: npm run module:create min-nya-modul
 * 
 * Genererad struktur:
 * modules/{moduleId}/
 * ├── index.ts          # Modulingång (IModule-implementation)
 * ├── config.ts         # Manifest, bakgrund, välkomst
 * ├── constants.ts      # ID:n och funktionsnamn
 * ├── dialogues.ts      # Dialogdefinitioner
 * ├── interactables.ts  # Interaktiva objektdefinitioner
 * ├── tasks/
 * │   └── index.ts      # Uppgiftsexporter
 * └── handlers/
 *     └── index.ts      # Hanterarexporter
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');

// ============================================================================
// Validering
// ============================================================================

function validateModuleId(id: string): void {
  if (!id) {
    throw new Error('Modul-ID krävs');
  }
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error('Modul-ID måste vara gemener alfanumeriskt med bindestreck (t.ex. "min-modul")');
  }
}

function toDisplayName(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toPascalCase(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toConstantCase(id: string): string {
  return id.toUpperCase().replace(/-/g, '_');
}

// ============================================================================
// Mallar
// ============================================================================

const indexTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul
 * Huvudmodulens ingångspunkt som implementerar IModule-gränssnittet
 * 
 * Filstruktur:
 * - index.ts: Modulens ingångspunkt (denna fil)
 * - config.ts: Manifest, bakgrund, välkomstmeddelande
 * - constants.ts: ID:n och funktionsnamn
 * - dialogues.ts: Dialogdefinitioner
 * - interactables.ts: Interaktiva objekt/NPC:er
 * - tasks/: Uppgiftsdefinitioner
 * - handlers/: Händelsehanterare
 */

import type { IModule, InteractableFunctionResult, ModuleContext } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import type { DialogueCompletionAction } from '../../src/types/dialogue.types.js';

import { manifest, background, welcome } from './config.js';
import { dialogues } from './dialogues.js';
import { interactables } from './interactables.js';
import { tasks } from './tasks/index.js';
import { handleInteraction, handleDialogueCompletion } from './handlers/index.js';
import { INTERACTABLE_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * ${displayName}-modulens implementation
 */
const ${toPascalCase(moduleId).toLowerCase()}Module: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest,
      background,
      welcome,
      dialogues,
      interactables,
      tasks,
      requires: [],
    };
  },

  handleInteractableFunction(
    interactableId: string,
    functionName: string,
    context: ModuleContext
  ): InteractableFunctionResult {
    return handleInteraction(interactableId, functionName, context);
  },

  async handleDialogueCompletion(
    dialogueId: string,
    action: DialogueCompletionAction,
    context: ModuleContext
  ): Promise<void> {
    await handleDialogueCompletion(dialogueId, action, context);
  },
};

export default ${toPascalCase(moduleId).toLowerCase()}Module;
`;

const configTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul Konfiguration
 * Modulmanifest, bakgrund och välkomstinställningar
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Modulmanifest
 */
export const manifest: ModuleConfig['manifest'] = {
  id: '${moduleId}',
  name: '${displayName}',
  version: '1.0.0',
  summary: 'En kort beskrivning av vad denna modul handlar om och vad spelaren kan förvänta sig.',
};

/**
 * Bakgrundskonfiguration
 */
export const background: ModuleConfig['background'] = {
  color: '#2d3748', // Mörk skiffergrå - ändra för att matcha ditt tema
};

/**
 * Välkomstdialog som visas när modulen startas
 */
export const welcome: ModuleConfig['welcome'] = {
  speaker: 'Guide',
  lines: [
    'Välkommen till ${displayName}!',
    'Utforska och interagera med elementen runt omkring dig.',
  ],
};
`;

const constantsTemplate = (moduleId: string) => `/**
 * Modulkonstanter
 * Centraliserade ID:n och funktionsnamn för typsäkerhet
 */

/**
 * Interaktiva objekt-ID:n
 * Lägg till dina interaktiva objekt-ID:n här
 */
export const INTERACTABLE_IDS = {
  GUIDE: 'guide',
  AI_COMPANION: 'ai-companion',
  // Lägg till fler interaktiva objekt här
} as const;

/**
 * Uppgifts-ID:n
 * Lägg till dina uppgifts-ID:n här
 */
export const TASK_IDS = {
  EXAMPLE: 'task-1',
  // Lägg till fler uppgifter här
} as const;

/**
 * Dialog-ID:n
 * Lägg till dina dialog-ID:n här
 */
export const DIALOGUE_IDS = {
  GUIDE_GREETING: 'guide-greeting',
  GUIDE_TASK_OFFER: 'guide-task-offer',
  GUIDE_TASK_READY: 'guide-task-ready',
  GUIDE_COMPLETE: 'guide-complete',
  // Lägg till fler dialoger här
} as const;

/**
 * Funktionsnamn för interaktiva objekthanterare
 */
export const FUNCTION_NAMES = {
  GUIDE_INTERACT: 'guide-interact',
  SUBMIT_TASK: 'submit-task',
  // Lägg till fler funktioner här
} as const;
`;

const dialoguesTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul Dialoger
 * Alla dialogdefinitioner för modulen
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import { DIALOGUE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Alla dialoger för modulen
 * 
 * Dialogstruktur:
 * - speaker: Namn på talaren
 * - lines: Array med dialograder
 * - choices: Valfri array med val och åtgärder
 * 
 * Val-åtgärder:
 * - { type: 'accept-task', taskId: string }
 * - { type: 'set-state', key: string, value: unknown }
 * - { type: 'function', functionName: string }
 * - null (fortsätt bara)
 */
export const dialogues: ModuleConfig['dialogues'] = {
  [DIALOGUE_IDS.GUIDE_GREETING]: {
    speaker: 'Guide',
    lines: [
      'Hej, resenär!',
      'Jag ser att du har hittat hit.',
      'Det finns mycket att utforska och lära sig.',
    ],
    choices: [
      {
        text: 'Berätta mer',
        action: null,
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_TASK_OFFER]: {
    speaker: 'Guide',
    lines: [
      'Jag har en uppgift till dig.',
      'Vill du prova?',
    ],
    choices: [
      {
        text: 'Ja, jag provar',
        action: { type: 'accept-task', taskId: TASK_IDS.EXAMPLE },
      },
      {
        text: 'Inte just nu',
        action: { type: 'set-state', key: 'task_declined', value: true },
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_TASK_READY]: {
    speaker: 'Guide',
    lines: [
      'Har du slutfört uppgiften?',
      'Om du behöver hjälp finns AI-kompanjonen här för att assistera.',
    ],
    choices: [
      {
        text: 'Ja, jag är redo att skicka in',
        action: { type: 'function', functionName: FUNCTION_NAMES.SUBMIT_TASK },
      },
      {
        text: 'Inte än',
        action: null,
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_COMPLETE]: {
    speaker: 'Guide',
    lines: [
      'Utmärkt arbete!',
      'Du har slutfört allt här.',
      'Lycka till på din resa!',
    ],
    choices: [
      {
        text: 'Tack!',
        action: null,
      },
    ],
  },
};
`;

const interactablesTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul Interaktiva objekt
 * Alla definitioner för interaktiva objekt (NPC:er, föremål etc.)
 */

import type { Interactable } from '../../src/types/interactable.types.js';
import { InteractableActionType, taskComplete } from '../../src/types/interactable.types.js';
import { INTERACTABLE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Guide-NPC - huvudsaklig interaktionspunkt
 * Använder funktionsåtgärd för villkorlig dialog
 */
export const guideInteractable: Interactable = {
  id: INTERACTABLE_IDS.GUIDE,
  type: 'npc',
  name: 'Guide',
  position: { x: 50, y: 50 },
  avatar: '🧑‍🏫',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Function,
    function: FUNCTION_NAMES.GUIDE_INTERACT,
  },
};

/**
 * AI-kompanjon - hjälper med uppgifter
 */
export const aiCompanionInteractable: Interactable = {
  id: INTERACTABLE_IDS.AI_COMPANION,
  type: 'object',
  name: 'AI-kompanjon',
  position: { x: 25, y: 40 },
  avatar: '🤖',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Chat,
  },
};

/**
 * Alla interaktiva objekt för modulen
 */
export const interactables: Interactable[] = [
  guideInteractable,
  aiCompanionInteractable,
];
`;

const tasksIndexTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul Uppgifter
 * Exportera alla uppgiftsdefinitioner
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import { exampleTask } from './exampleTask.js';

/**
 * Alla uppgifter för modulen
 */
export const tasks: Task[] = [exampleTask];

export { exampleTask };
`;

const exampleTaskTemplate = (moduleId: string, displayName: string) => `/**
 * Exempeluppgift Definition
 * Använd denna som mall för att skapa nya uppgifter
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import type { TaskSubmission } from '../../../src/types/module/task.types.js';
import type { TaskSolveResult } from '../../../src/types/core/taskSolveResult.types.js';
import { TASK_IDS } from '../constants.js';

/**
 * Minsta textlängd som krävs
 */
const MIN_LENGTH = 100;

/**
 * Lösningsfunktion - validerar inskickningen
 * 
 * @param input - Uppgiftsinskickningen
 * @returns Lösningsresultat med framgång/misslyckande och feedback
 */
function solveExampleTask(input: TaskSubmission): TaskSolveResult {
  // Kontrollera inskickningstyp
  if (input.type !== 'text' || !('text' in input)) {
    return {
      solved: false,
      reason: 'invalid_submission',
      details: 'Vänligen skicka in ditt svar som text.',
    };
  }

  const text = (input.text as string).trim();

  // Kontrollera längd
  if (text.length < MIN_LENGTH) {
    return {
      solved: false,
      reason: 'too_short',
      details: \`Ditt svar behöver vara längre. Minimum: \${MIN_LENGTH} tecken. Nuvarande: \${text.length} tecken.\`,
    };
  }

  // Lägg till din egen valideringslogik här
  // Till exempel, kontrollera obligatoriska nyckelord, mönster etc.

  return {
    solved: true,
    reason: 'complete',
    details: 'Bra jobbat! Du har slutfört uppgiften.',
    score: 100,
  };
}

/**
 * Exempeluppgiftens definition
 */
export const exampleTask: Task = {
  id: TASK_IDS.EXAMPLE,
  name: 'Exempeluppgift',
  description: \`Detta är en exempeluppgift. Skriv minst \${MIN_LENGTH} tecken för att slutföra den.\`,
  solveFunction: solveExampleTask,
  submission: {
    type: 'text',
  },
  overview: {
    requirements: \`Skriv minst \${MIN_LENGTH} tecken.\`,
    goals: [
      'Öva på att använda uppgiftssystemet',
      'Få hjälp av AI-kompanjonen vid behov',
    ],
  },
};
`;

const handlersIndexTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName}-modul Hanterare
 * Exportera alla hanterarfunktioner
 */

export { handleInteraction } from './interactionHandler.js';
export { handleDialogueCompletion } from './dialogueHandler.js';
`;

const interactionHandlerTemplate = (moduleId: string, displayName: string) => `/**
 * Interaktionshanterare
 * Bestämmer vilken dialog/åtgärd som ska visas baserat på spelstatus
 */

import type { ModuleContext, InteractableFunctionResult } from '../../../src/types/core/moduleClass.types.js';
import { DIALOGUE_IDS, TASK_IDS, INTERACTABLE_IDS, FUNCTION_NAMES } from '../constants.js';

/**
 * Hantera funktionsanrop för interaktiva objekt
 * Returnerar lämplig dialog baserat på uppgiftsstatus
 */
export function handleInteraction(
  interactableId: string,
  functionName: string,
  context: ModuleContext
): InteractableFunctionResult {
  // Guide-NPC-logik
  if (interactableId === INTERACTABLE_IDS.GUIDE && functionName === FUNCTION_NAMES.GUIDE_INTERACT) {
    return getGuideDialogue(context);
  }

  // Standard: ingen åtgärd
  return { type: 'none' };
}

/**
 * Bestäm vilken dialog guiden ska visa
 */
function getGuideDialogue(context: ModuleContext): InteractableFunctionResult {
  const exampleCompleted = context.isTaskCompleted(TASK_IDS.EXAMPLE);
  const activeTaskId = context.getCurrentTaskId();

  // Alla uppgifter klara
  if (exampleCompleted) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_COMPLETE };
  }

  // Uppgiften är aktiv - kolla om redo att skicka in
  if (activeTaskId === TASK_IDS.EXAMPLE) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_TASK_READY };
  }

  // Ingen aktiv uppgift - erbjud uppgiften
  return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_TASK_OFFER };
}
`;

const dialogueHandlerTemplate = (moduleId: string, displayName: string) => `/**
 * Dialoghanterare
 * Hanterar åtgärder vid dialogslut
 */

import type { ModuleContext } from '../../../src/types/core/moduleClass.types.js';
import type { DialogueCompletionAction } from '../../../src/types/dialogue.types.js';
import { FUNCTION_NAMES } from '../constants.js';

/**
 * Hantera åtgärder vid dialogslut
 * Anropas när en dialog slutar med en 'function'-åtgärdstyp
 */
export async function handleDialogueCompletion(
  _dialogueId: string,
  action: DialogueCompletionAction,
  context: ModuleContext
): Promise<void> {
  // Hantera funktionsåtgärder
  if (action.type === 'function') {
    if (action.functionName === FUNCTION_NAMES.SUBMIT_TASK) {
      // Öppna uppgiftsinlämning för aktuell aktiv uppgift
      const currentTaskId = context.getCurrentTaskId();
      if (currentTaskId && context.openTaskSubmission) {
        context.openTaskSubmission(currentTaskId);
      }
    }
    // Lägg till fler funktionshanterare här
  }
}
`;

// ============================================================================
// Huvudskript
// ============================================================================

async function createModule(moduleId: string): Promise<void> {
  try {
    validateModuleId(moduleId);

    // Kontrollera om modulen redan finns
    const modulePath = path.join(MODULES_DIR, moduleId);
    try {
      await fs.access(modulePath);
      throw new Error(`Modul "${moduleId}" finns redan på ${modulePath}`);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }

    const displayName = toDisplayName(moduleId);

    console.log(`\nSkapar modul "${moduleId}" (${displayName})...\n`);

    // Skapa mappar
    await fs.mkdir(modulePath, { recursive: true });
    await fs.mkdir(path.join(modulePath, 'tasks'), { recursive: true });
    await fs.mkdir(path.join(modulePath, 'handlers'), { recursive: true });

    // Skapa filer
    const files = [
      ['index.ts', indexTemplate(moduleId, displayName)],
      ['config.ts', configTemplate(moduleId, displayName)],
      ['constants.ts', constantsTemplate(moduleId)],
      ['dialogues.ts', dialoguesTemplate(moduleId, displayName)],
      ['interactables.ts', interactablesTemplate(moduleId, displayName)],
      ['tasks/index.ts', tasksIndexTemplate(moduleId, displayName)],
      ['tasks/exampleTask.ts', exampleTaskTemplate(moduleId, displayName)],
      ['handlers/index.ts', handlersIndexTemplate(moduleId, displayName)],
      ['handlers/interactionHandler.ts', interactionHandlerTemplate(moduleId, displayName)],
      ['handlers/dialogueHandler.ts', dialogueHandlerTemplate(moduleId, displayName)],
    ];

    for (const [filename, content] of files) {
      const filePath = path.join(modulePath, filename);
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`   Skapade ${filename}`);
    }

    console.log(`\nModul "${moduleId}" skapades framgångsrikt!`);
    console.log(`Plats: ${modulePath}\n`);
    console.log('Skapade filer:');
    console.log('   - index.ts          (Modulens ingångspunkt)');
    console.log('   - config.ts         (Manifest, bakgrund, välkomst)');
    console.log('   - constants.ts      (ID:n och funktionsnamn)');
    console.log('   - dialogues.ts      (Dialogdefinitioner)');
    console.log('   - interactables.ts  (NPC:er och objekt)');
    console.log('   - tasks/index.ts    (Uppgiftsexporter)');
    console.log('   - tasks/exampleTask.ts (Exempeluppgiftsmall)');
    console.log('   - handlers/index.ts (Hanterarexporter)');
    console.log('   - handlers/interactionHandler.ts (Interaktionslogik)');
    console.log('   - handlers/dialogueHandler.ts (Dialogslut)');
    console.log('\nNästa steg:');
    console.log('   1. Redigera config.ts för att anpassa manifest, bakgrund och välkomstmeddelande');
    console.log('   2. Redigera constants.ts för att definiera dina ID:n');
    console.log('   3. Redigera dialogues.ts för att skapa dina dialogträd');
    console.log('   4. Redigera interactables.ts för att lägga till NPC:er och objekt');
    console.log('   5. Redigera tasks/exampleTask.ts eller skapa nya uppgiftsfiler');
    console.log('   6. Redigera handlers/ för att implementera din spellogik');
    console.log('   7. Kör: npm run dev för att testa din modul');
    console.log('\nTips:');
    console.log('   - Använd bygghjälparna: import { createTask, createNPC } from "../../src/utils"');
    console.log('   - Kör: npm run module:validate ' + moduleId + ' för att kontrollera fel');
    console.log('');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Okänt fel';
    console.error('Fel vid skapande av modul:', message);
    process.exit(1);
  }
}

// Hämta modul-ID från kommandorad
const moduleId = process.argv[2];

if (!moduleId) {
  console.error('Användning: npm run module:create <modul-id>');
  console.error('   Exempel: npm run module:create min-nya-modul');
  console.error('');
  console.error('   Modul-ID måste vara gemener alfanumeriskt med bindestreck.');
  console.error('   Exempel: slottsport, skogsväg, bymarknad');
  process.exit(1);
}

createModule(moduleId);
