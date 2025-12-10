/**
 * AI Assistant Service
 * Context-aware AI assistant using Ollama with game state integration
 */

import { streamChatMessageWithSystem, type OllamaMessage } from './ollamaService.js';
import { buildSystemPrompt } from '../utils/contextBuilder.js';
import { useAppStore } from '@core/state/store.js';

/**
 * Active task state
 */
export interface ActiveTaskState {
  taskId: string;
  taskName: string;
  status: 'in_progress';
  moduleId: string;
  moduleName: string;
}

/**
 * Get active tasks from store (only in-progress/accepted, not completed)
 */
function getActiveTasksFromStore(moduleId: string): ActiveTaskState[] {
  const store = useAppStore.getState();
  const progress = store.getProgress(moduleId);
  if (!progress) return [];
  
  const module = store.currentModule;
  if (!module) return [];
  
  const activeTasks: ActiveTaskState[] = [];
  
  // Only get current task (in-progress or accepted)
  if (progress.state.currentTaskId) {
    const task = module.tasks.find(t => t.id === progress.state.currentTaskId);
    if (task) {
      const isCompleted = progress.state.completedTasks?.includes(task.id) || false;
      if (!isCompleted) {
        activeTasks.push({
          taskId: task.id,
          taskName: task.name,
          status: 'in_progress',
          moduleId,
          moduleName: module.config.manifest.name,
        });
      }
    }
  }
  
  return activeTasks;
}

/**
 * Stream chat with context-aware assistant
 * @param message - User message
 * @param moduleId - Current module ID
 * @param history - Conversation history
 * @returns Async generator yielding text chunks
 */
export async function* streamContextualChat(
  message: string,
  moduleId: string,
  history: OllamaMessage[] = []
): AsyncGenerator<string, void, unknown> {
  const activeTasks = getActiveTasksFromStore(moduleId);
  const systemPrompt = buildSystemPrompt(moduleId, activeTasks);
  
  // Build messages with system prompt
  const messages: OllamaMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message },
  ];
  
  // Use extended Ollama service with system messages
  yield* streamChatMessageWithSystem(messages);
}
