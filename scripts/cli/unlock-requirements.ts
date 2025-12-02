/**
 * Unlock Requirement Builder
 * Handles building unlock requirements for modules
 */

import prompts from 'prompts';
import chalk from 'chalk';

export async function buildUnlockRequirement(
  modules: string[],
  currentModuleId: string
): Promise<string | null> {
  const { hasRequirement } = await prompts({
    type: 'confirm',
    name: 'hasRequirement',
    message: 'Does this module have unlock requirements?',
    initial: false,
  });

  if (!hasRequirement) return null;

  const requirements: string[] = [];

  while (true) {
    const { type } = await prompts({
      type: 'select',
      name: 'type',
      message: 'Select requirement type',
      choices: [
        { title: 'Module completion', value: 'module-complete' },
        { title: 'Task completion', value: 'task-complete' },
        { title: 'Password', value: 'password' },
        { title: 'State check', value: 'state-check' },
        { title: 'Custom function', value: 'custom' },
        { title: 'Done adding requirements', value: 'done' },
      ],
    });

    if (type === 'done') break;
    if (!type) break;

    switch (type) {
      case 'module-complete': {
        const availableModules = modules.filter(m => m !== currentModuleId);
        if (availableModules.length === 0) {
          console.log(chalk.yellow('No other modules available for dependency'));
          break;
        }
        const { selectedModules } = await prompts({
          type: 'multiselect',
          name: 'selectedModules',
          message: 'Select which module(s) must be completed',
          choices: availableModules.map(m => ({ title: m, value: m })),
        });
        if (selectedModules && selectedModules.length > 0) {
          if (selectedModules.length === 1) {
            requirements.push(`moduleComplete('${selectedModules[0]}')`);
          } else {
            requirements.push(`andRequirements(${selectedModules.map(m => `moduleComplete('${m}')`).join(', ')})`);
          }
        }
        break;
      }
      case 'task-complete': {
        const { taskId } = await prompts({
          type: 'text',
          name: 'taskId',
          message: 'Task ID (you\'ll need to import the task later)',
          validate: (v) => v ? true : 'Task ID required',
        });
        if (taskId) {
          requirements.push(`taskComplete(/* TODO: Import ${taskId}Task */)`);
        }
        break;
      }
      case 'password': {
        const { password, hint } = await prompts([
          {
            type: 'password',
            name: 'password',
            message: 'Password',
            validate: (v) => v ? true : 'Password required',
          },
          {
            type: 'text',
            name: 'hint',
            message: 'Hint (optional)',
          },
        ]);
        if (password) {
          requirements.push(hint ? `passwordUnlock('${password}', '${hint}')` : `passwordUnlock('${password}')`);
        }
        break;
      }
      case 'state-check': {
        const { key, value } = await prompts([
          {
            type: 'text',
            name: 'key',
            message: 'State key',
            validate: (v) => v ? true : 'Key required',
          },
          {
            type: 'text',
            name: 'value',
            message: 'State value',
            validate: (v) => v ? true : 'Value required',
          },
        ]);
        if (key && value) {
          requirements.push(`stateCheck('${key}', ${isNaN(Number(value)) ? `'${value}'` : value})`);
        }
        break;
      }
      case 'custom': {
        requirements.push('/* TODO: Custom unlock requirement\n * Implement custom check function here\n */ null');
        break;
      }
    }

    if (requirements.length > 1) {
      const { combine } = await prompts({
        type: 'select',
        name: 'combine',
        message: 'How to combine requirements?',
        choices: [
          { title: 'AND (all must be met)', value: 'and' },
          { title: 'OR (any can be met)', value: 'or' },
          { title: 'Add another requirement', value: 'add' },
          { title: 'Done', value: 'done' },
        ],
      });
      if (combine === 'done') break;
      if (combine === 'and' || combine === 'or') {
        const combined = combine === 'and' 
          ? `andRequirements(${requirements.join(', ')})`
          : `orRequirements(${requirements.join(', ')})`;
        return combined;
      }
    }
  }

  if (requirements.length === 0) return null;
  if (requirements.length === 1) return requirements[0];
  return `andRequirements(${requirements.join(', ')})`;
}

