/**
 * Task Creation Wizard
 * Handles adding new tasks to modules
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { MODULES_DIR, validateTaskId, getExistingModules, fileExists } from './utils.js';

export async function createTask(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Create New Task           │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.red('❌ No modules found. Create a module first.\n'));
    return;
  }

  const { moduleId } = await prompts({
    type: 'select',
    name: 'moduleId',
    message: 'Select module',
    choices: modules.map(m => ({ title: m, value: m })),
  });

  if (!moduleId) return;

  const modulePath = path.join(MODULES_DIR, moduleId);
  const tasksPath = path.join(modulePath, 'content/tasks.ts');

  if (!(await fileExists(tasksPath))) {
    console.log(chalk.red(`\n❌ Tasks file not found. Does the module use the new structure?\n`));
    return;
  }

  const taskDetails = await prompts([
    {
      type: 'text',
      name: 'taskId',
      message: 'Task ID',
      validate: validateTaskId,
      format: (val) => val.trim().toLowerCase(),
    },
    {
      type: 'text',
      name: 'taskName',
      message: 'Task Name',
    },
    {
      type: 'text',
      name: 'taskDescription',
      message: 'Task Description',
    },
    {
      type: 'number',
      name: 'minLength',
      message: 'Minimum text length',
      initial: 10,
      validate: (v) => v > 0 || 'Must be positive',
    },
    {
      type: 'text',
      name: 'requirement',
      message: 'Requirement description',
      initial: (prev, values) => `Write at least ${values.minLength} characters`,
    },
  ]);

  if (Object.keys(taskDetails).length === 0) return;

  const { taskId, taskName, taskDescription, minLength, requirement } = taskDetails;

  const spinner = ora('Adding task...').start();

  try {
    let tasksContent = await fs.readFile(tasksPath, 'utf-8');

    // Generate task code
    const taskVarName = `${taskId}Task`;
    const taskCode = `
/**
 * ${taskName}
 * TODO: Add custom validation logic
 */
export const ${taskVarName} = createTask({
  id: '${taskId}',
  name: '${taskName}',
  description: '${taskDescription}',
  submission: textSubmission(),
  validate: textLengthValidator(${minLength}, (text) => {
    // TODO: Add your custom validation logic here
    if (text.length >= ${minLength}) {
      return success('task_complete', 'Great job!', 100);
    }
    return failure('too_short', 'Please write at least ${minLength} characters.');
  }),
  overview: {
    requirements: '${requirement}',
    goals: ['Complete the task'],
  },
  unlockRequirement: null, // TODO: Add unlock requirement if needed
  dialogues: {
    offer: ['I have a task for you if you\'re interested.'],
    ready: ['Are you ready to submit your task?'],
    complete: ['Excellent work! You have completed the task.'],
  },
});
`;

    // Find tasks array and add task before it
    if (tasksContent.includes('export const tasks = [')) {
      const tasksArrayIndex = tasksContent.indexOf('export const tasks = [');
      tasksContent = tasksContent.slice(0, tasksArrayIndex) + taskCode + '\n\n' + tasksContent.slice(tasksArrayIndex);

      // Update tasks array
      if (tasksContent.match(/export const tasks = \[\s*\]/)) {
        tasksContent = tasksContent.replace(
          'export const tasks = []',
          `export const tasks = [${taskVarName}]`
        );
      } else {
        tasksContent = tasksContent.replace(
          /export const tasks = \[([^\]]*)\]/,
          (match, existing) => {
            const existingTasks = existing.trim();
            return existingTasks 
              ? `export const tasks = [${existingTasks},\n  ${taskVarName}]`
              : `export const tasks = [${taskVarName}]`;
          }
        );
      }
    } else {
      // Append to end if no tasks array found
      tasksContent += '\n' + taskCode;
      tasksContent += `\n\nexport const tasks = [${taskVarName}];`;
    }

    await fs.writeFile(tasksPath, tasksContent, 'utf-8');

    spinner.succeed(chalk.green(`Task "${taskId}" added successfully!`));
    console.log(chalk.gray(`   File: ${tasksPath}\n`));
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('   1. Edit the validation logic in tasks.ts'));
    console.log(chalk.dim('   2. Add the task to an NPC in content/NPC/*/index.ts'));
    console.log(chalk.dim('   3. Test your task in the app\n'));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to add task: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

