/**
 * Körningsmodul-validator
 * Validerar modulkonfiguration vid körning med hjälpsamma felmeddelanden
 */

import type { ModuleConfig, Task } from '../types/module/moduleConfig.types.js';
import type { Interactable, InteractableAction } from '../types/interactable.types.js';
import { InteractableActionType } from '../types/interactable.types.js';

// ============================================================================
// Typer
// ============================================================================

/**
 * Valideringsproblemsallvarlighetsgrad
 */
export type IssueSeverity = 'error' | 'warning' | 'info';

/**
 * Valideringsproblem
 */
export interface ValidationIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  path?: string;
  suggestion?: string;
}

/**
 * Valideringsresultat
 */
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// ============================================================================
// Hjälpfunktioner
// ============================================================================

function createIssue(
  severity: IssueSeverity,
  code: string,
  message: string,
  path?: string,
  suggestion?: string
): ValidationIssue {
  return { severity, code, message, path, suggestion };
}

function error(code: string, message: string, path?: string, suggestion?: string): ValidationIssue {
  return createIssue('error', code, message, path, suggestion);
}

function warning(code: string, message: string, path?: string, suggestion?: string): ValidationIssue {
  return createIssue('warning', code, message, path, suggestion);
}

function info(code: string, message: string, path?: string): ValidationIssue {
  return createIssue('info', code, message, path);
}

// ============================================================================
// Validatorer
// ============================================================================

/**
 * Validera modulmanifest
 */
function validateManifest(manifest: ModuleConfig['manifest'] | undefined): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!manifest) {
    issues.push(error('MISSING_MANIFEST', 'Modulkonfigurationen måste ha ett manifest', 'manifest'));
    return issues;
  }

  if (!manifest.id) {
    issues.push(error('MISSING_MANIFEST_ID', 'Manifestet måste ha ett id', 'manifest.id'));
  } else if (!/^[a-z0-9-]+$/.test(manifest.id)) {
    issues.push(
      warning(
        'INVALID_MANIFEST_ID',
        `Manifest-id "${manifest.id}" bör vara gemener alfanumeriskt med bindestreck`,
        'manifest.id',
        'Använd format som "min-modul" eller "slottsport"'
      )
    );
  }

  if (!manifest.name) {
    issues.push(error('MISSING_MANIFEST_NAME', 'Manifestet måste ha ett namn', 'manifest.name'));
  }

  if (!manifest.version) {
    issues.push(
      warning(
        'MISSING_VERSION',
        'Manifestet bör ha en version',
        'manifest.version',
        'Lägg till version som "1.0.0"'
      )
    );
  } else if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
    issues.push(
      info(
        'NON_SEMVER_VERSION',
        `Version "${manifest.version}" följer inte semantisk versionering`,
        'manifest.version'
      )
    );
  }

  return issues;
}

/**
 * Validera bakgrundskonfiguration
 */
function validateBackground(background: ModuleConfig['background'] | undefined): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!background) {
    issues.push(error('MISSING_BACKGROUND', 'Modulkonfigurationen måste ha en bakgrund', 'background'));
    return issues;
  }

  if (!background.color && !background.image) {
    issues.push(
      warning(
        'EMPTY_BACKGROUND',
        'Bakgrunden bör ha antingen färg eller bild',
        'background',
        'Lägg till background.color eller background.image'
      )
    );
  }

  return issues;
}

/**
 * Validera välkomstkonfiguration
 */
function validateWelcome(welcome: ModuleConfig['welcome'] | undefined): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!welcome) {
    issues.push(error('MISSING_WELCOME', 'Modulkonfigurationen måste ha ett välkomstmeddelande', 'welcome'));
    return issues;
  }

  if (!welcome.speaker) {
    issues.push(
      warning(
        'MISSING_WELCOME_SPEAKER',
        'Välkomsten bör ha en talare',
        'welcome.speaker'
      )
    );
  }

  if (!welcome.lines || welcome.lines.length === 0) {
    issues.push(
      warning(
        'EMPTY_WELCOME_LINES',
        'Välkomsten bör ha minst en rad',
        'welcome.lines',
        'Lägg till minst en välkomstmeddelanderad'
      )
    );
  }

  return issues;
}

/**
 * Validera ett enskilt interaktivt objekt
 */
function validateInteractable(
  interactable: Interactable,
  index: number,
  existingIds: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const path = `interactables[${index}]`;

  if (!interactable.id) {
    issues.push(error('MISSING_INTERACTABLE_ID', 'Interaktivt objekt måste ha ett id', path));
  } else {
    if (existingIds.has(interactable.id)) {
      issues.push(
        error(
          'DUPLICATE_INTERACTABLE_ID',
          `Duplicerat interaktivt objekt-id: "${interactable.id}"`,
          `${path}.id`,
          'Varje interaktivt objekt måste ha ett unikt id'
        )
      );
    }
    existingIds.add(interactable.id);
  }

  if (!interactable.name) {
    issues.push(
      warning(
        'MISSING_INTERACTABLE_NAME',
        `Interaktivt objekt "${interactable.id || index}" bör ha ett namn`,
        `${path}.name`
      )
    );
  }

  if (!interactable.position) {
    issues.push(
      error(
        'MISSING_INTERACTABLE_POSITION',
        `Interaktivt objekt "${interactable.id || index}" måste ha en position`,
        `${path}.position`
      )
    );
  } else {
    if (typeof interactable.position.x !== 'number' || typeof interactable.position.y !== 'number') {
      issues.push(
        error(
          'INVALID_POSITION',
          `Interaktivt objekt "${interactable.id || index}" position måste ha numeriska x och y`,
          `${path}.position`
        )
      );
    } else if (
      interactable.position.x < 0 || interactable.position.x > 100 ||
      interactable.position.y < 0 || interactable.position.y > 100
    ) {
      issues.push(
        warning(
          'POSITION_OUT_OF_BOUNDS',
          `Interaktivt objekt "${interactable.id}" position (${interactable.position.x}, ${interactable.position.y}) kan vara utanför skärmen`,
          `${path}.position`,
          'Positionsvärden bör vara mellan 0 och 100 (procent)'
        )
      );
    }
  }

  if (!interactable.action) {
    issues.push(
      error(
        'MISSING_INTERACTABLE_ACTION',
        `Interaktivt objekt "${interactable.id || index}" måste ha en åtgärd`,
        `${path}.action`
      )
    );
  } else {
    issues.push(...validateInteractableAction(interactable.action, interactable.id || String(index), path));
  }

  return issues;
}

/**
 * Validera interaktiv objektåtgärd
 */
function validateInteractableAction(
  action: InteractableAction,
  interactableId: string,
  basePath: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const path = `${basePath}.action`;

  if (!action.type) {
    issues.push(
      error(
        'MISSING_ACTION_TYPE',
        `Interaktivt objekt "${interactableId}" åtgärd måste ha en typ`,
        `${path}.type`
      )
    );
    return issues;
  }

  switch (action.type) {
    case InteractableActionType.Dialogue:
      if (!('dialogue' in action) || !action.dialogue) {
        issues.push(
          error(
            'MISSING_DIALOGUE_ID',
            `Dialogåtgärd för "${interactableId}" måste specificera ett dialog-id`,
            `${path}.dialogue`
          )
        );
      }
      break;

    case InteractableActionType.Task:
      if (!('task' in action) || !action.task) {
        issues.push(
          error(
            'MISSING_TASK_ID',
            `Uppgiftsåtgärd för "${interactableId}" måste specificera ett uppgifts-id`,
            `${path}.task`
          )
        );
      }
      break;

    case InteractableActionType.Function:
      if (!('function' in action) || !action.function) {
        issues.push(
          error(
            'MISSING_FUNCTION_NAME',
            `Funktionsåtgärd för "${interactableId}" måste specificera ett funktionsnamn`,
            `${path}.function`
          )
        );
      }
      break;

    case InteractableActionType.Image:
      if (!('imageUrl' in action) || !action.imageUrl) {
        issues.push(
          error(
            'MISSING_IMAGE_URL',
            `Bildåtgärd för "${interactableId}" måste specificera en imageUrl`,
            `${path}.imageUrl`
          )
        );
      }
      break;

    case InteractableActionType.Chat:
      // Chattåtgärd kräver inga ytterligare egenskaper
      break;

    default: {
      // Hantera okända åtgärdstyper
      const unknownAction = action as { type?: string };
      issues.push(
        warning(
          'UNKNOWN_ACTION_TYPE',
          `Interaktivt objekt "${interactableId}" har okänd åtgärdstyp: "${unknownAction.type}"`,
          `${path}.type`
        )
      );
    }
  }

  return issues;
}

/**
 * Validera interaktiva objektarray
 */
function validateInteractables(interactables: Interactable[] | undefined): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!interactables || !Array.isArray(interactables)) {
    issues.push(error('MISSING_INTERACTABLES', 'Modulkonfigurationen måste ha en interactables-array', 'interactables'));
    return issues;
  }

  const existingIds = new Set<string>();
  for (let i = 0; i < interactables.length; i++) {
    issues.push(...validateInteractable(interactables[i], i, existingIds));
  }

  return issues;
}

/**
 * Validera en enskild uppgift
 */
function validateTask(task: Task, index: number, existingIds: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const path = `tasks[${index}]`;

  if (!task.id) {
    issues.push(error('MISSING_TASK_ID', 'Uppgift måste ha ett id', path));
  } else {
    if (existingIds.has(task.id)) {
      issues.push(
        error(
          'DUPLICATE_TASK_ID',
          `Duplicerat uppgifts-id: "${task.id}"`,
          `${path}.id`,
          'Varje uppgift måste ha ett unikt id'
        )
      );
    }
    existingIds.add(task.id);
  }

  if (!task.name) {
    issues.push(
      warning(
        'MISSING_TASK_NAME',
        `Uppgift "${task.id || index}" bör ha ett namn`,
        `${path}.name`
      )
    );
  }

  if (!task.description) {
    issues.push(
      warning(
        'MISSING_TASK_DESCRIPTION',
        `Uppgift "${task.id || index}" bör ha en beskrivning`,
        `${path}.description`
      )
    );
  }

  if (!task.solveFunction || typeof task.solveFunction !== 'function') {
    issues.push(
      error(
        'MISSING_SOLVE_FUNCTION',
        `Uppgift "${task.id || index}" måste ha en solveFunction`,
        `${path}.solveFunction`,
        'Lägg till en funktion som validerar inskickningar'
      )
    );
  }

  if (!task.submission) {
    issues.push(
      error(
        'MISSING_SUBMISSION_CONFIG',
        `Uppgift "${task.id || index}" måste ha en submission-konfiguration`,
        `${path}.submission`
      )
    );
  } else if (!task.submission.type) {
    issues.push(
      error(
        'MISSING_SUBMISSION_TYPE',
        `Uppgift "${task.id || index}" submission måste ha en typ`,
        `${path}.submission.type`
      )
    );
  }

  return issues;
}

/**
 * Validera uppgiftsarray
 */
function validateTasks(tasks: Task[] | undefined): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!tasks || !Array.isArray(tasks)) {
    issues.push(error('MISSING_TASKS', 'Modulkonfigurationen måste ha en tasks-array', 'tasks'));
    return issues;
  }

  const existingIds = new Set<string>();
  for (let i = 0; i < tasks.length; i++) {
    issues.push(...validateTask(tasks[i], i, existingIds));
  }

  return issues;
}

/**
 * Validera dialoger och deras referenser
 */
function validateDialogues(
  dialogues: ModuleConfig['dialogues'],
  taskIds: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!dialogues) {
    return issues; // Dialoger är valfria
  }

  for (const [dialogueId, dialogue] of Object.entries(dialogues)) {
    const path = `dialogues.${dialogueId}`;

    if (!dialogue.speaker) {
      issues.push(
        warning(
          'MISSING_DIALOGUE_SPEAKER',
          `Dialog "${dialogueId}" bör ha en talare`,
          `${path}.speaker`
        )
      );
    }

    if (!dialogue.lines || dialogue.lines.length === 0) {
      issues.push(
        warning(
          'EMPTY_DIALOGUE_LINES',
          `Dialog "${dialogueId}" bör ha minst en rad`,
          `${path}.lines`
        )
      );
    }

    // Validera valåtgärder
    if (dialogue.choices) {
      for (let i = 0; i < dialogue.choices.length; i++) {
        const choice = dialogue.choices[i];
        const choicePath = `${path}.choices[${i}]`;

        if (!choice.text) {
          issues.push(
            warning(
              'EMPTY_CHOICE_TEXT',
              `Val i dialog "${dialogueId}" bör ha text`,
              `${choicePath}.text`
            )
          );
        }

        // Validera åtgärdsreferenser
        const actions = Array.isArray(choice.action)
          ? choice.action
          : choice.action ? [choice.action] : [];

        for (const action of actions) {
          if (action?.type === 'accept-task' && action.taskId) {
            if (!taskIds.has(action.taskId)) {
              issues.push(
                error(
                  'INVALID_TASK_REFERENCE',
                  `Dialog "${dialogueId}" refererar till icke-existerande uppgift "${action.taskId}"`,
                  `${choicePath}.action.taskId`,
                  `Tillgängliga uppgifter: ${Array.from(taskIds).join(', ') || 'inga'}`
                )
              );
            }
          }
        }
      }
    }
  }

  return issues;
}

// ============================================================================
// Huvudvalideringsfunktion
// ============================================================================

/**
 * Validera en modulkonfiguration
 * 
 * @param config - Modulkonfiguration att validera
 * @returns Valideringsresultat med problem
 * 
 * @example
 * const result = validateModuleConfig(config);
 * if (!result.valid) {
 *   console.error('Modulvalidering misslyckades:', result.issues);
 * }
 */
export function validateModuleConfig(config: ModuleConfig): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Validera varje sektion
  issues.push(...validateManifest(config.manifest));
  issues.push(...validateBackground(config.background));
  issues.push(...validateWelcome(config.welcome));
  issues.push(...validateInteractables(config.interactables));
  issues.push(...validateTasks(config.tasks));

  // Samla uppgifts-ID:n för referensvalidering
  const taskIds = new Set<string>();
  if (config.tasks) {
    for (const task of config.tasks) {
      if (task.id) {
        taskIds.add(task.id);
      }
    }
  }

  issues.push(...validateDialogues(config.dialogues, taskIds));

  // Kontrollera om det finns några fel (inte bara varningar)
  const hasErrors = issues.some(issue => issue.severity === 'error');

  return {
    valid: !hasErrors,
    issues,
  };
}

/**
 * Logga valideringsproblem till konsolen med formatering
 * 
 * @param result - Valideringsresultat att logga
 * @param moduleId - Valfritt modul-ID för kontext
 */
export function logValidationIssues(result: ValidationResult, moduleId?: string): void {
  const prefix = moduleId ? `[Modul: ${moduleId}] ` : '';

  if (result.valid && result.issues.length === 0) {
    console.log(`${prefix}✅ Modulkonfigurationen är giltig`);
    return;
  }

  const errors = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');
  const infos = result.issues.filter(i => i.severity === 'info');

  if (errors.length > 0) {
    console.error(`${prefix}❌ Modulvalideringsfel:`);
    for (const issue of errors) {
      console.error(`  • [${issue.code}] ${issue.message}`);
      if (issue.path) console.error(`    Sökväg: ${issue.path}`);
      if (issue.suggestion) console.error(`    Förslag: ${issue.suggestion}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`${prefix}⚠️ Modulvalideringsvarningar:`);
    for (const issue of warnings) {
      console.warn(`  • [${issue.code}] ${issue.message}`);
      if (issue.path) console.warn(`    Sökväg: ${issue.path}`);
      if (issue.suggestion) console.warn(`    Förslag: ${issue.suggestion}`);
    }
  }

  if (infos.length > 0) {
    console.info(`${prefix}ℹ️ Modulvalideringsinfo:`);
    for (const issue of infos) {
      console.info(`  • [${issue.code}] ${issue.message}`);
    }
  }
}

/**
 * Validera modulkonfiguration och kasta fel om ogiltig
 * Användbart för utveckling för att fånga fel tidigt
 * 
 * @param config - Modulkonfiguration
 * @param moduleId - Valfritt modul-ID för felmeddelanden
 * @throws Error om validering misslyckas
 */
export function assertValidModuleConfig(config: ModuleConfig, moduleId?: string): void {
  const result = validateModuleConfig(config);
  
  if (!result.valid) {
    const errors = result.issues.filter(i => i.severity === 'error');
    const errorMessages = errors.map(e => `  • [${e.code}] ${e.message}`).join('\n');
    const prefix = moduleId ? `Modul "${moduleId}"` : 'Modulkonfiguration';
    throw new Error(`${prefix} validering misslyckades:\n${errorMessages}`);
  }
}
