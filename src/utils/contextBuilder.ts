/**
 * Context Builder
 * Utilities for building AI context from game state
 */

import gameContext from '@config/gameContext.json';
import type { ActiveTaskState } from '@services/aiAssistantService.js';

interface TaskContext {
  id: string;
  name: string;
  description: string;
  requirements: string;
  goals: string[];
  hints?: string[];
  examples?: string[];
}

interface NPCContext {
  id: string;
  name: string;
  personality?: string;
  role?: string;
}

/**
 * Get relevant task definitions for active tasks
 */
interface GameContext {
  modules: Record<string, {
    id: string;
    name: string;
    tasks: Record<string, TaskContext>;
    npcs: Record<string, NPCContext>;
  }>;
}

export function getRelevantTasks(
  moduleId: string,
  activeTasks: ActiveTaskState[]
): TaskContext[] {
  const context = gameContext as unknown as GameContext;
  const module = context.modules[moduleId];
  if (!module) return [];
  
  return activeTasks
    .map(active => module.tasks[active.taskId])
    .filter(Boolean);
}

/**
 * Build system prompt with context boundaries (30% shorter, focused)
 */
export function buildSystemPrompt(
    currentModuleId: string,
    activeTasks: ActiveTaskState[]
): string {
    const context = gameContext as unknown as GameContext;
    const module = context.modules[currentModuleId];

    if (!module) {
        throw new Error(`Module ${currentModuleId} not found in context`);
    }

    const relevantTasks = getRelevantTasks(currentModuleId, activeTasks);

    const taskList = relevantTasks.map(t => {
        const req = t.requirements ? `\n  - Requirements: ${t.requirements}` : '';
        const goals = t.goals?.length ? `\n  - Goals: ${t.goals.join(', ')}` : '';
        const hints = t.hints?.length ? `\n  - Hints: ${t.hints.join(', ')}` : '';
        const examples = t.examples?.length ? `\n  - Examples: ${t.examples.join(', ')}` : '';

        return `• ${t.name}: ${t.description}${req}${goals}${hints}${examples}`;
    }).join('\n\n');

    const npcList = Object.values(module.npcs || {})
        .map(npc => {
            const role = npc.role ? ` (${npc.role})` : '';
            const personality = npc.personality || 'A helpful character';
            return `• ${npc.name}${role}: ${personality}`;
        })
        .join('\n');

    const activeTaskNames = activeTasks.length
        ? activeTasks.map(t => t.taskName).join(', ')
        : 'None';

    return `You are an AI assistant embedded in an educational RPG about artificial intelligence. Your job is to help the player understand the tasks in the current module and support their learning in a clear and helpful way.

CURRENT MODULE:
- ${module.name} (${module.id})

ACTIVE TASKS:
${activeTaskNames}

TASK DETAILS:
${taskList || 'No active tasks'}

NPCS IN THIS MODULE:
${npcList || 'None'}

IMPORTANT RULES:
1. ONLY discuss content from the current module: "${module.name}".
2. ONLY reference tasks listed in the “Task Details” section.
3. If the player asks about anything outside this module, respond:
   "I can only help with the current module right now."

4. Task assistance:
   - Give short, direct answers by default.
   - If the player explicitly asks for a full solution (“write it”, “do it for me”), provide it.
   - For reflection tasks, do NOT write the reflection, but you may give brief ideas or points to consider.

5. Creative-writing rule:
   - Only generate stories or fictional content if the task specifically requires it.

STYLE OVERRIDE (MOST IMPORTANT):
- Keep responses extremely short unless the player asks for more detail.
- Default to 1–2 sentences.
- No lists, no multi-step explanations, no teaching tone unless requested.
- Speak casually, like a normal person.
- Do not ask follow-up questions unless the player explicitly requests clarification.
- Do not repeat task descriptions unless the player directly asks for them.`;
}
