/**
 * Generate Game Context
 * Build script to extract module data into a JSON file for AI context
 */

import { readdir } from 'fs/promises';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import type { Task } from '../src/core/task/types.js';
import type { Interactable, NPC } from '../src/core/module/types/index.js';

interface ModuleContext {
  id: string;
  name: string;
  description?: string;
  tasks: Record<string, TaskContext>;
  npcs: Record<string, NPCContext>;
  objectTypes: string[];
}

interface TaskContext {
  id: string;
  name: string;
  description: string;
  requirements: string;
  goals: string[];
  submissionType: string;
  dialogueOffer: string;
  dialogueReady: string;
  dialogueComplete: string;
  hints?: string[];
  examples?: string[];
}

interface NPCContext {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  role?: string;
}

/**
 * Extract task data from task definition
 */
function extractTasks(tasks: Task[]): Record<string, TaskContext> {
  const result: Record<string, TaskContext> = {};
  
  tasks.forEach(task => {
    try {
      result[task.id] = {
        id: task.id,
        name: task.name || '',
        description: task.description || '',
        requirements: task.overview?.requirements || '',
        goals: task.overview?.goals || [],
        submissionType: task.submission?.type || 'text',
        dialogueOffer: task.dialogues?.offer?.[0] || '',
        dialogueReady: task.dialogues?.ready?.[0] || '',
        dialogueComplete: task.dialogues?.complete?.[0] || '',
        hints: task.meta?.hints || [],
        examples: task.meta?.examples || [],
      };
    } catch (error) {
      console.warn(`Failed to extract task ${task.id}:`, error);
    }
  });
  
  return result;
}

/**
 * Extract NPC data from interactables
 */
function extractNPCs(interactables: Interactable[]): Record<string, NPCContext> {
  const result: Record<string, NPCContext> = {};
  
  interactables
    .filter((i): i is NPC => i.type === 'npc')
    .forEach(npc => {
      try {
        // Use static personality field or default
        const personality = (npc as NPC & { personality?: string }).personality || 'A helpful character';
        const npcMeta = (npc as NPC & { meta?: { role?: string } }).meta;
        result[npc.id] = {
          id: npc.id,
          name: npc.name || '',
          avatar: npc.avatar || '👤',
          personality,
          role: npcMeta?.role,
        };
      } catch (error) {
        console.warn(`Failed to extract NPC ${npc.id}:`, error);
      }
    });
  
  return result;
}

/**
 * Extract object types from interactables
 */
function extractObjectTypes(interactables: Interactable[]): string[] {
  const types: string[] = [];
  
  interactables
    .filter(i => i.type === 'object')
    .forEach(obj => {
      try {
        const component = obj.interaction?.component || 'note';
        if (!types.includes(component)) {
          types.push(component);
        }
      } catch {
        // Skip if extraction fails
      }
    });
  
  return types;
}

/**
 * Generate context file from all modules
 */
async function generateContext() {
  const modulesDir = join(process.cwd(), 'modules');
  const modules = await readdir(modulesDir, { withFileTypes: true });
  
  const context: { modules: Record<string, ModuleContext> } = { modules: {} };
  
  for (const moduleDir of modules) {
    if (!moduleDir.isDirectory()) continue;
    
    try {
      // Dynamically import module
      const modulePath = join(modulesDir, moduleDir.name, 'index.ts');
      const moduleDef = await import(modulePath);
      const module = moduleDef.default;
      
      if (!module) {
        console.warn(`Module ${moduleDir.name}: no default export found`);
        continue;
      }
      
      // Extract context with fault tolerance
      const moduleContext: ModuleContext = {
        id: module.id || moduleDir.name,
        name: module.id || moduleDir.name,
        tasks: {},
        npcs: {},
        objectTypes: [],
      };
      
      // Safely extract fields, skip if missing
      if (module.config?.manifest?.title) {
        moduleContext.name = module.config.manifest.title;
      } else {
        console.warn(`Module ${moduleDir.name}: missing title, using ID`);
      }
      
      if (module.config?.manifest?.description) {
        moduleContext.description = module.config.manifest.description;
      }
      
      if (module.content?.tasks) {
        try {
          moduleContext.tasks = extractTasks(module.content.tasks);
        } catch (error) {
          console.warn(`Module ${moduleDir.name}: failed to extract tasks:`, error);
        }
      }
      
      if (module.content?.interactables) {
        try {
          moduleContext.npcs = extractNPCs(module.content.interactables);
          moduleContext.objectTypes = extractObjectTypes(module.content.interactables);
        } catch (error) {
          console.warn(`Module ${moduleDir.name}: failed to extract interactables:`, error);
        }
      }
      
      context.modules[module.id || moduleDir.name] = moduleContext;
    } catch (error) {
      console.warn(`Failed to process module ${moduleDir.name}:`, error);
      // Still include module with minimal data
      context.modules[moduleDir.name] = {
        id: moduleDir.name,
        name: moduleDir.name,
        tasks: {},
        npcs: {},
        objectTypes: [],
      };
    }
  }
  
  // Write to config directory
  const outputPath = join(process.cwd(), 'src/config/gameContext.json');
  await writeFile(outputPath, JSON.stringify(context, null, 2));
  console.log(`Generated context file: ${outputPath}`);
  console.log(`Processed ${Object.keys(context.modules).length} modules`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateContext().catch(console.error);
}

export { generateContext };
