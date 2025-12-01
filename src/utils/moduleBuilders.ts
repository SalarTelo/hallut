/**
 * Module Builder Helpers
 * Type-safe helpers for creating module configurations
 */

import type { IModule, ModuleContext, InteractableFunctionResult } from '../types/core/moduleClass.types.js';
import type { ModuleConfig, Task } from '../types/module/moduleConfig.types.js';
import type { DialogueCompletionAction } from '../types/dialogue.types.js';
import type { Interactable } from '../types/interactable.types.js';

// Re-export all builders from sub-modules for convenience
export * from './dialogueBuilders.js';
export * from './taskBuilders.js';
export * from './interactableBuilders.js';

// ============================================================================
// Module Config Builders
// ============================================================================

/**
 * Skapa ett modulmanifest
 * 
 * @param id - Modul-ID (bör matcha mappnamn)
 * @param name - Visningsnamn
 * @param version - Semantisk version (standard: '1.0.0')
 * @param summary - Valfri sammanfattning för världskarteverktygstips
 * 
 * @textGen
 * manifest: createManifest('min-modul', 'Min modul', '1.0.0', 'En kort beskrivning')
 */
export function createManifest(
  id: string,
  name: string,
  version: string = '1.0.0',
  summary?: string
): ModuleConfig['manifest'] {
  return { id, name, version, summary };
}

/**
 * Create a background configuration
 * 
 * @param options - Background options (color or image)
 * 
 * @textGen
 * background: createBackground({ color: '#2d1b1b' })
 * background: createBackground({ image: '/backgrounds/castle.jpg' })
 */
export function createBackground(options: {
  color?: string;
  image?: string;
}): ModuleConfig['background'] {
  return options;
}

/**
 * Shorthand for color background
 * 
 * @textGen
 * background: colorBackground('#2d1b1b')
 */
export function colorBackground(color: string): ModuleConfig['background'] {
  return { color };
}

/**
 * Shorthand for image background
 * 
 * @textGen
 * background: imageBackground('/backgrounds/castle.jpg')
 */
export function imageBackground(image: string, fallbackColor?: string): ModuleConfig['background'] {
  return { image, color: fallbackColor };
}

/**
 * Create a welcome message configuration
 * 
 * @param speaker - Speaker name
 * @param lines - Welcome message lines
 * 
 * @textGen
 * welcome: createWelcome('Guard', [
 *   'Welcome to the castle!',
 *   'I am the guard of this gate.'
 * ])
 */
export function createWelcome(
  speaker: string,
  lines: string[]
): ModuleConfig['welcome'] {
  return { speaker, lines };
}

/**
 * Create a theme configuration
 * 
 * @param borderColor - Border color (default: yellow #FFD700)
 * @param accentColors - Optional accent colors
 * 
 * @textGen
 * theme: createTheme('#fbbf24')
 * theme: createTheme('#fbbf24', { primary: '#3b82f6' })
 */
export function createTheme(
  borderColor: string,
  accentColors?: {
    primary?: string;
    secondary?: string;
    highlight?: string;
  }
): NonNullable<ModuleConfig['theme']> {
  const theme: NonNullable<ModuleConfig['theme']> = { borderColor };
  if (accentColors) {
    theme.accentColors = accentColors;
  }
  return theme;
}

// ============================================================================
// Module Config Builder
// ============================================================================

/**
 * Module configuration options
 */
export interface ModuleConfigOptions {
  /** Module ID and name */
  manifest: ModuleConfig['manifest'];
  /** Background configuration */
  background: ModuleConfig['background'];
  /** Welcome message */
  welcome: ModuleConfig['welcome'];
  /** Interactable objects */
  interactables: Interactable[];
  /** Tasks */
  tasks: Task[];
  /** Optional dialogues */
  dialogues?: ModuleConfig['dialogues'];
  /** Optional theme */
  theme?: ModuleConfig['theme'];
  /** Optional module dependencies */
  requires?: string[];
}

/**
 * Create a module configuration
 * 
 * @param options - Module configuration options
 * @returns ModuleConfig object
 * 
 * @textGen
 * const config = createModuleConfig({
 *   manifest: createManifest('my-module', 'My Module'),
 *   background: colorBackground('#2d1b1b'),
 *   welcome: createWelcome('Guard', ['Welcome!']),
 *   interactables: [guard, companion],
 *   tasks: [storyTask, recipeTask],
 *   dialogues,
 * });
 */
export function createModuleConfig(options: ModuleConfigOptions): ModuleConfig {
  const {
    manifest,
    background,
    welcome,
    interactables,
    tasks,
    dialogues,
    theme,
    requires,
  } = options;

  const config: ModuleConfig = {
    manifest,
    background,
    welcome,
    interactables,
    tasks,
  };

  if (dialogues) {
    config.dialogues = dialogues;
  }

  if (theme) {
    config.theme = theme;
  }

  if (requires && requires.length > 0) {
    config.requires = requires;
  }

  return config;
}

// ============================================================================
// IModule Builder
// ============================================================================

/**
 * Function handler type
 */
export type FunctionHandler = (
  interactableId: string,
  functionName: string,
  context: ModuleContext
) => InteractableFunctionResult | Promise<InteractableFunctionResult>;

/**
 * Dialogue completion handler type
 */
export type DialogueHandler = (
  dialogueId: string,
  action: DialogueCompletionAction,
  context: ModuleContext
) => void | Promise<void>;

/**
 * Module implementation options
 */
export interface ModuleOptions {
  /** Module configuration (can be static or function of locale) */
  config: ModuleConfig | ((locale: string) => ModuleConfig);
  /** Optional function handler */
  onInteractableFunction?: FunctionHandler;
  /** Optional dialogue completion handler */
  onDialogueComplete?: DialogueHandler;
  /** Optional run callback */
  onRun?: (moduleId: string, context: ModuleContext) => void;
  /** Optional cleanup callback */
  onCleanup?: (moduleId: string) => void;
}

/**
 * Create a module implementation
 * 
 * @param options - Module options
 * @returns IModule implementation
 * 
 * @textGen
 * // Simple module with static config
 * export default createModule({
 *   config: createModuleConfig({
 *     manifest: createManifest('my-module', 'My Module'),
 *     background: colorBackground('#2d1b1b'),
 *     welcome: createWelcome('Guide', ['Welcome!']),
 *     interactables: [],
 *     tasks: [],
 *   }),
 * });
 * 
 * // Module with handlers
 * export default createModule({
 *   config: createModuleConfig({ ... }),
 *   onInteractableFunction: (interactableId, functionName, context) => {
 *     if (functionName === 'guard-interact') {
 *       return { type: 'dialogue', dialogueId: 'guard-greeting' };
 *     }
 *     return { type: 'none' };
 *   },
 *   onDialogueComplete: (dialogueId, action, context) => {
 *     // Handle custom dialogue actions
 *   },
 * });
 */
export function createModule(options: ModuleOptions): IModule {
  const {
    config,
    onInteractableFunction,
    onDialogueComplete,
    onRun,
    onCleanup,
  } = options;

  const module: IModule = {
    init(locale: string): ModuleConfig {
      if (typeof config === 'function') {
        return config(locale);
      }
      return config;
    },
  };

  if (onRun) {
    module.run = onRun;
  }

  if (onCleanup) {
    module.cleanup = onCleanup;
  }

  if (onInteractableFunction) {
    module.handleInteractableFunction = onInteractableFunction;
  }

  if (onDialogueComplete) {
    module.handleDialogueCompletion = onDialogueComplete;
  }

  return module;
}

// ============================================================================
// Simple Module Builder
// ============================================================================

/**
 * Enkla modulalternativ (för moduler utan hanterare)
 */
export interface SimpleModuleOptions {
  /** Modul-ID */
  id: string;
  /** Modulvisningsnamn */
  name: string;
  /** Bakgrundsfärg */
  backgroundColor: string;
  /** Välkomsttalare */
  welcomeSpeaker: string;
  /** Välkomstrader */
  welcomeLines: string[];
  /** Valfri sammanfattning för världskarteverktygstips */
  summary?: string;
  /** Valfria interaktiva objekt */
  interactables?: Interactable[];
  /** Valfria uppgifter */
  tasks?: Task[];
  /** Valfria dialoger */
  dialogues?: ModuleConfig['dialogues'];
  /** Valfri temakantfärg */
  borderColor?: string;
  /** Valfria obligatoriska moduler */
  requires?: string[];
}

/**
 * Create a simple module without handlers
 * Good for skeleton modules or simple content modules
 * 
 * @param options - Simple module options
 * @returns IModule implementation
 * 
 * @textGen
 * export default createSimpleModule({
 *   id: 'village',
 *   name: 'Quaint Village',
 *   backgroundColor: '#2e2e1a',
 *   welcomeSpeaker: 'Villager',
 *   welcomeLines: ['Welcome to our village!'],
 * });
 */
export function createSimpleModule(options: SimpleModuleOptions): IModule {
  const {
    id,
    name,
    backgroundColor,
    welcomeSpeaker,
    welcomeLines,
    summary,
    interactables = [],
    tasks = [],
    dialogues = {},
    borderColor,
    requires,
  } = options;

  return createModule({
    config: createModuleConfig({
      manifest: createManifest(id, name, '1.0.0', summary),
      background: colorBackground(backgroundColor),
      welcome: createWelcome(welcomeSpeaker, welcomeLines),
      interactables,
      tasks,
      dialogues,
      theme: borderColor ? createTheme(borderColor) : undefined,
      requires,
    }),
  });
}

