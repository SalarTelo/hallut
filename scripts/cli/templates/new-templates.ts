/**
 * Template Functions (Improved)
 * Uses separate template files for better maintainability
 */

import { loadTemplate, indent, ifCondition } from './utils.js';

export function getTasksTemplateDetailed(): string {
  return loadTemplate('tasks-detailed.hbs');
}

// Example of how you'd use it with variables:
export function getIndexTemplate(moduleId: string, displayName: string): string {
  return loadTemplate('index.hbs', {
    moduleId,
    displayName,
  });
}

// For conditional content, you can build it in the function:
export function getNPCDialoguesTemplate(
  npcId: string, 
  npcName: string, 
  hasExampleTask: boolean = false
): string {
  const baseTemplate = loadTemplate('npc-dialogues-base.hbs', { npcId, npcName });
  
  if (hasExampleTask) {
    const taskImport = loadTemplate('npc-dialogues-task-import.hbs', { npcId });
    const taskAcceptChoice = loadTemplate('npc-dialogues-task-accept.hbs', { npcId });
    const taskReadyNode = loadTemplate('npc-dialogues-task-ready.hbs', { npcId, npcName });
    const generalGreeting = loadTemplate('npc-dialogues-general-greeting.hbs', { npcId, npcName });
    
    // Combine templates
    return baseTemplate
      .replace('{{TASK_IMPORT}}', taskImport)
      .replace('{{TASK_ACCEPT_CHOICE}}', indent(taskAcceptChoice, 4))
      .replace('{{GENERAL_GREETING}}', generalGreeting)
      .replace('{{TASK_READY}}', taskReadyNode)
      .replace('{{NODES}}', 'greeting, generalGreeting, taskReady')
      .replace('{{ENTRY_LOGIC}}', indent(
        `.when((ctx) => ${npcId}State(ctx).hasMet === true).use(generalGreeting)\n    .default(greeting)`,
        4
      ));
  }
  
  return baseTemplate
    .replace('{{TASK_IMPORT}}', '')
    .replace('{{TASK_ACCEPT_CHOICE}}', '')
    .replace('{{GENERAL_GREETING}}', '')
    .replace('{{TASK_READY}}', '')
    .replace('{{NODES}}', 'greeting')
    .replace('{{ENTRY_LOGIC}}', indent('.default(greeting)', 4));
}

