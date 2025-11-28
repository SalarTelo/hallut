#!/usr/bin/env node

/**
 * Task creation helper (TypeScript)
 * Adds a new task to an existing module
 * 
 * Usage: npm run task:create <module-id> <task-id> [options]
 * Example: npm run task:create text-generation task-3 --order 3
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');

interface TaskOptions {
  order?: number;
  name?: string;
  description?: string;
  intro?: {
    speaker?: string;
    lines?: string[];
  };
}

function parseArgs(): { moduleId: string; taskId: string; options: TaskOptions } {
  const args = process.argv.slice(2);
  const moduleId = args[0];
  const taskId = args[1];
  const options: TaskOptions = {};

  for (let i = 2; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      if (key === 'order') {
        options.order = parseInt(value, 10);
      } else if (key === 'name') {
        options.name = value;
      } else if (key === 'description') {
        options.description = value;
      } else if (key === 'speaker') {
        if (!options.intro) options.intro = {};
        options.intro.speaker = value;
      }
    }
  }

  return { moduleId, taskId, options };
}

async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

async function addTaskToModule(
  modulePath: string,
  taskId: string,
  options: TaskOptions
): Promise<void> {
  const moduleFilePath = path.join(modulePath, 'module.ts');
  let moduleContent = await readFile(moduleFilePath);

  // Find the tasks array
  const tasksMatch = moduleContent.match(/const tasks: Task\[\] = \[([\s\S]*?)\];/);
  if (!tasksMatch) {
    throw new Error('Could not find tasks array in module.ts');
  }

  // Determine order
  const order = options.order || (tasksMatch[1].match(/order:\s*(\d+)/g)?.length || 0) + 1;

  // Generate task entry
  const taskName = options.name || `Task ${order}`;
  const taskDescription = options.description || `Description for ${taskName}`;
  const speaker = options.intro?.speaker || 'mentor';
  const introLines = options.intro?.lines || [
    `Nu ska vi börja med ${taskName.toLowerCase()}!`,
    'Följ instruktionerna nedan.',
  ];

  const taskEntry = `    {
      id: '${taskId}',
      order: ${order},
      name: t.tasks.${taskId}.name,
      description: t.tasks.${taskId}.description,
      solveFunction: ${taskId}_solve,
      intro: {
        speaker: '${speaker}',
        lines: t.tasks.${taskId}.intro.lines,
      },
    },`;

  // Insert task before closing bracket
  const newTasksContent = tasksMatch[1] + '\n' + taskEntry;
  moduleContent = moduleContent.replace(
    /const tasks: Task\[\] = \[([\s\S]*?)\];/,
    `const tasks: Task[] = [${newTasksContent}\n  ];`
  );

  // Add import for solve function
  if (!moduleContent.includes(`${taskId}_solve`)) {
    moduleContent = moduleContent.replace(
      /import { ([^}]+) } from '\.\/taskSolvers\.js';/,
      `import { $1, ${taskId}_solve } from './taskSolvers.js';`
    );
  }

  await writeFile(moduleFilePath, moduleContent);
}

async function addTaskSolver(
  modulePath: string,
  taskId: string,
  taskName: string
): Promise<void> {
  const taskSolversPath = path.join(modulePath, 'taskSolvers.ts');
  let taskSolversContent = await readFile(taskSolversPath);

  // Add solve function
  const solveFunction = `
export function ${taskId}_solve(input: { answer: string }): TaskSolveResult {
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

  // Append to file
  taskSolversContent += solveFunction;
  await writeFile(taskSolversPath, taskSolversContent);
}

async function addTaskTranslations(
  modulePath: string,
  taskId: string,
  taskName: string,
  taskDescription: string,
  introLines: string[]
): Promise<void> {
  const translationsPath = path.join(modulePath, 'translations.ts');
  let translationsContent = await readFile(translationsPath);

  // Add to tasks interface
  if (!translationsContent.includes(`task${taskId}:`)) {
    const tasksInterfaceMatch = translationsContent.match(/tasks: \{([\s\S]*?)\};/);
    if (tasksInterfaceMatch) {
      const taskInterfaceEntry = `    ${taskId}: {
      name: string;
      description: string;
      intro: {
        lines: string[];
      };
    };`;
      translationsContent = translationsContent.replace(
        /tasks: \{([\s\S]*?)\};/,
        `tasks: {$1    ${taskInterfaceEntry}\n  };`
      );
    }
  }

  // Add to SV translations
  const svTaskEntry = `      ${taskId}: {
        name: '${taskName}',
        description: '${taskDescription}',
        intro: {
          lines: [
            '${introLines.join("',\n            '")}',
          ],
        },
      },`;

  const svTasksMatch = translationsContent.match(/sv: \{[\s\S]*?tasks: \{([\s\S]*?)\},/);
  if (svTasksMatch) {
    translationsContent = translationsContent.replace(
      /(sv: \{[\s\S]*?tasks: \{)([\s\S]*?)(\},)/,
      `$1$2      ${svTaskEntry}\n$3`
    );
  }

  // Add to EN translations
  const enTaskEntry = `      ${taskId}: {
        name: '${taskName}',
        description: '${taskDescription}',
        intro: {
          lines: [
            '${introLines.join("',\n            '")}',
          ],
        },
      },`;

  const enTasksMatch = translationsContent.match(/en: \{[\s\S]*?tasks: \{([\s\S]*?)\},/);
  if (enTasksMatch) {
    translationsContent = translationsContent.replace(
      /(en: \{[\s\S]*?tasks: \{)([\s\S]*?)(\},)/,
      `$1$2      ${enTaskEntry}\n$3`
    );
  }

  await writeFile(translationsPath, translationsContent);
}

async function main(): Promise<void> {
  const { moduleId, taskId, options } = parseArgs();

  if (!moduleId || !taskId) {
    console.error('Usage: npm run task:create <module-id> <task-id> [options]');
    console.error('\nOptions:');
    console.error('  --order <number>        Task order (default: next available)');
    console.error('  --name <text>          Task name');
    console.error('  --description <text>   Task description');
    console.error('  --speaker <id>         Speaker ID for intro (default: mentor)');
    console.error('\nExamples:');
    console.error('  npm run task:create text-generation task-3 --order 3');
    console.error('  npm run task:create text-generation task-4 --name "New Task" --description "Do something"');
    process.exit(1);
  }

  try {
    const modulePath = path.join(MODULES_DIR, moduleId);
    
    // Check if module exists
    try {
      await fs.access(modulePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(`Module "${moduleId}" not found. Create it first with: npm run module:create ${moduleId}`);
      }
      throw error;
    }

    const taskName = options.name || `Task ${taskId}`;
    const taskDescription = options.description || `Description for ${taskName}`;
    const introLines = options.intro?.lines || [
      `Nu ska vi börja med ${taskName.toLowerCase()}!`,
      'Följ instruktionerna nedan.',
    ];

    console.log(`\n📝 Adding task "${taskId}" to module "${moduleId}"...\n`);

    // Update module.ts
    await addTaskToModule(modulePath, taskId, options);
    console.log('Updated module.ts');

    // Add solve function
    await addTaskSolver(modulePath, taskId, taskName);
    console.log('Added solve function to taskSolvers.ts');

    // Add translations
    await addTaskTranslations(modulePath, taskId, taskName, taskDescription, introLines);
    console.log('Added translations to translations.ts');

    console.log(`\nTask "${taskId}" added successfully!`);
    console.log(`\nNext steps:`);
    console.log(`   1. Edit ${path.join(modulePath, 'taskSolvers.ts')} to implement ${taskId}_solve logic`);
    console.log(`   2. Edit ${path.join(modulePath, 'translations.ts')} to customize translations`);
    console.log(`   3. Test your task in the app`);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

