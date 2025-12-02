/**
 * Object Creation Wizard
 * Handles adding new objects to modules
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { MODULES_DIR, getExistingModules, fileExists } from './utils.js';

export async function createObject(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Create New Object         │'));
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
  const objectsPath = path.join(modulePath, 'content/objects.ts');

  if (!(await fileExists(objectsPath))) {
    console.log(chalk.red(`\n❌ Objects file not found. Does the module use the new structure?\n`));
    return;
  }

  const objectDetails = await prompts([
    {
      type: 'text',
      name: 'objectId',
      message: 'Object ID',
      validate: (v) => /^[a-z0-9-]+$/.test(v) || 'Object ID must be lowercase alphanumeric with hyphens',
      format: (val) => val.trim().toLowerCase(),
    },
    {
      type: 'text',
      name: 'objectName',
      message: 'Object Name',
    },
    {
      type: 'number',
      name: 'x',
      message: 'X position (0-100)',
      initial: 50,
      validate: (v) => v >= 0 && v <= 100 || 'Must be between 0 and 100',
    },
    {
      type: 'number',
      name: 'y',
      message: 'Y position (0-100)',
      initial: 50,
      validate: (v) => v >= 0 && v <= 100 || 'Must be between 0 and 100',
    },
    {
      type: 'select',
      name: 'interactionType',
      message: 'Interaction type',
      choices: [
        { title: 'Note viewer (displays text)', value: 'note' },
        { title: 'Image viewer (displays image)', value: 'image' },
        { title: 'Custom component', value: 'custom' },
      ],
    },
  ]);

  if (Object.keys(objectDetails).length === 0) return;

  const { objectId, objectName, x, y, interactionType } = objectDetails;

  let contentDetails: Record<string, unknown> = {};
  if (interactionType === 'note') {
    const note = await prompts([
      {
        type: 'text',
        name: 'content',
        message: 'Note content',
      },
      {
        type: 'text',
        name: 'title',
        message: 'Note title (optional)',
      },
    ]);
    contentDetails = note;
  } else if (interactionType === 'image') {
    const image = await prompts([
      {
        type: 'text',
        name: 'imageUrl',
        message: 'Image URL/path',
      },
      {
        type: 'text',
        name: 'title',
        message: 'Image title (optional)',
      },
    ]);
    contentDetails = image;
  } else {
    const custom = await prompts([
      {
        type: 'text',
        name: 'componentName',
        message: 'Component name',
      },
    ]);
    contentDetails = custom;
  }

  const spinner = ora('Adding object...').start();

  try {
    let objectsContent = await fs.readFile(objectsPath, 'utf-8');

    // Ensure imports are present
    const hasCreateObject = objectsContent.includes('createObject');
    const hasPos = objectsContent.includes('pos(');
    const hasShowNoteViewer = objectsContent.includes('showNoteViewer');
    const hasShowImageViewer = objectsContent.includes('showImageViewer');
    const hasCreateImageObject = objectsContent.includes('createImageObject');

    if (!hasCreateObject || !hasPos || (interactionType === 'note' && !hasShowNoteViewer) || (interactionType === 'image' && !hasCreateImageObject && !hasShowImageViewer)) {
      // Add imports if missing
      const importsToAdd: string[] = [];
      if (!hasCreateObject) importsToAdd.push('createObject');
      if (!hasPos) importsToAdd.push('pos');
      if (interactionType === 'note' && !hasShowNoteViewer) importsToAdd.push('showNoteViewer');
      if (interactionType === 'image') {
        if (!hasCreateImageObject) importsToAdd.push('createImageObject');
        if (!hasShowImageViewer) importsToAdd.push('showImageViewer');
      }

      if (importsToAdd.length > 0) {
        // Find where to insert imports (after the file header comment)
        const importMatch = objectsContent.match(/import\s+{[^}]+}\s+from\s+'@utils\/builders\/index\.js';/);
        
        if (importMatch) {
          // Add to existing import
          const existingImports = importMatch[0].match(/{\s*([^}]+)\s*}/)?.[1] || '';
          const allImports = [...existingImports.split(',').map(i => i.trim()).filter(Boolean), ...importsToAdd];
          const uniqueImports = [...new Set(allImports)].sort();
          objectsContent = objectsContent.replace(
            importMatch[0],
            `import {\n  ${uniqueImports.join(',\n  ')},\n} from '@utils/builders/index.js';`
          );
        } else {
          // Add new import block after the header comment
          const headerEnd = objectsContent.indexOf('*/') + 2;
          const imports = `\n\nimport {\n  ${importsToAdd.join(',\n  ')},\n} from '@utils/builders/index.js';`;
          objectsContent = objectsContent.slice(0, headerEnd) + imports + objectsContent.slice(headerEnd);
        }
      }
    }

    const objectVarName = `${objectId}Object`;
    let objectCode = '';

    if (interactionType === 'note') {
      objectCode = `
/**
 * ${objectName}
 */
export const ${objectVarName} = createObject({
  id: '${objectId}',
  name: '${objectName}',
  position: pos(${x}, ${y}),
  avatar: 'note',
  interaction: showNoteViewer({
    content: '${contentDetails.content || ''}',
    title: '${contentDetails.title || objectName}',
  }),
});
`;
    } else if (interactionType === 'image') {
      objectCode = `
/**
 * ${objectName}
 */
export const ${objectVarName} = createImageObject({
  id: '${objectId}',
  name: '${objectName}',
  position: pos(${x}, ${y}),
  imageUrl: '${contentDetails.imageUrl || ''}',
  title: '${contentDetails.title || objectName}',
  avatar: 'image',
});
`;
    } else {
      objectCode = `
/**
 * ${objectName}
 */
export const ${objectVarName} = createObject({
  id: '${objectId}',
  name: '${objectName}',
  position: pos(${x}, ${y}),
  avatar: 'box',
  interaction: {
    type: 'component',
    component: '${contentDetails.componentName || 'YourComponent'}',
    props: {
      // TODO: Add component props
    },
  },
});
`;
    }

    // Find objects array and add object
    if (objectsContent.includes('export const objects = [')) {
      const objectsArrayIndex = objectsContent.indexOf('export const objects = [');
      objectsContent = objectsContent.slice(0, objectsArrayIndex) + objectCode + '\n\n' + objectsContent.slice(objectsArrayIndex);

      if (objectsContent.match(/export const objects = \[\s*\]/)) {
        objectsContent = objectsContent.replace(
          'export const objects = []',
          `export const objects = [${objectVarName}]`
        );
      } else {
        objectsContent = objectsContent.replace(
          /export const objects = \[([^\]]*)\]/,
          (match, existing) => {
            const existingObjects = existing.trim();
            return existingObjects 
              ? `export const objects = [${existingObjects},\n  ${objectVarName}]`
              : `export const objects = [${objectVarName}]`;
          }
        );
      }
    } else {
      objectsContent += '\n' + objectCode;
      objectsContent += `\n\nexport const objects = [${objectVarName}];`;
    }

    await fs.writeFile(objectsPath, objectsContent, 'utf-8');

    spinner.succeed(chalk.green(`Object "${objectId}" added successfully!`));
    console.log(chalk.gray(`   File: ${objectsPath}\n`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to add object: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

