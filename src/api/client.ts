import type { ModuleConfig, EvaluationResponse, TaskConfig } from '../types/module.types.js';
import type { Locale } from '../i18n/translations.js';
import { getModule as getModuleFromRegistry } from './moduleRegistry.js';

/**
 * Load module using TypeScript module registry
 * Modules are loaded via Vite glob imports
 */
export async function getModule(id: string, locale: string = 'sv'): Promise<ModuleConfig> {
  try {
    const module = getModuleFromRegistry(id, locale);
    if (!module) {
      throw new Error(`Module '${id}' not found`);
    }
    return module;
  } catch (error) {
    throw new Error(`Failed to load module '${id}': ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Evaluate answer client-side
 * This replaces the backend evaluation endpoint
 */
function evaluateAnswerLogic(answer: string, task: TaskConfig): {
  evaluation: 'too_short' | 'missing_keywords' | 'weak' | 'good' | 'excellent';
  details?: string;
} {
  const trimmedAnswer = answer.trim();

  // Check minimum length
  if (task.minLength && trimmedAnswer.length < task.minLength) {
    return {
      evaluation: 'too_short',
      details: `Answer must be at least ${task.minLength} characters long. Current length: ${trimmedAnswer.length}`,
    };
  }

  // Check keywords
  if (task.keywords && task.keywords.length > 0) {
    const answerLower = trimmedAnswer.toLowerCase();
    const missingKeywords = task.keywords.filter(
      (keyword) => !answerLower.includes(keyword.toLowerCase())
    );

    if (missingKeywords.length > 0) {
      return {
        evaluation: 'missing_keywords',
        details: `Answer is missing required keywords: ${missingKeywords.join(', ')}`,
      };
    }
  }

  // Quality heuristics based on length and content
  const wordCount = trimmedAnswer.split(/\s+/).filter((w) => w.length > 0).length;
  const hasMultipleSentences = (trimmedAnswer.match(/[.!?]+/g) || []).length >= 2;
  const hasGoodLength = trimmedAnswer.length >= (task.minLength || 50) * 1.5;

  if (wordCount < 10 || trimmedAnswer.length < 30) {
    return {
      evaluation: 'weak',
      details: 'Answer is too brief. Try adding more detail.',
    };
  }

  if (hasGoodLength && hasMultipleSentences && wordCount >= 20) {
    return {
      evaluation: 'excellent',
      details: 'Great answer! Well-structured and detailed.',
    };
  }

  return {
    evaluation: 'good',
    details: 'Good answer! You covered the main points.',
  };
}

/**
 * Generate guard reply using fallback responses
 * This replaces the LLM-based guard agent
 */
function generateGuardReply(
  evaluation: { evaluation: string; details?: string },
  locale: Locale = 'sv'
): string {
  const isSwedish = locale === 'sv';
  
  const fallbacks: Record<string, Record<string, string>> = {
    sv: {
      too_short: "Hmm, det är lite kort! Kan du berätta mer?",
      missing_keywords: "Bra början! Men jag tror du saknar något viktigt. Försök igen!",
      weak: "Inte dåligt, men jag tror du kan göra bättre! Lägg till fler detaljer.",
      good: "Bra gjort! Det är ett bra svar. Fortsätt så!",
      excellent: "Utmärkt arbete! Du förstår verkligen detta. Imponerande!",
    },
    en: {
      too_short: "Hmm, that's a bit short! Can you tell me more?",
      missing_keywords: "Good start! But I think you're missing something important. Try again!",
      weak: "Not bad, but I think you can do better! Add more details.",
      good: "Well done! That's a solid answer. Keep it up!",
      excellent: "Excellent work! You really understand this. Impressive!",
    },
  };

  const localeFallbacks = fallbacks[locale] || fallbacks.en;
  return localeFallbacks[evaluation.evaluation] || (isSwedish ? "Bra försök! Fortsätt försöka!" : "Good effort! Keep trying!");
}

/**
 * Evaluate answer and generate guard reply
 * This replaces the backend /api/guard/evaluate endpoint
 */
export async function evaluateAnswer(
  answer: string,
  task: TaskConfig,
  locale: Locale = 'sv'
): Promise<EvaluationResponse> {
  // Run deterministic evaluation
  const evaluation = evaluateAnswerLogic(answer, task);

  // Generate guard reply using fallback responses
  const reply = generateGuardReply(evaluation, locale);

  return {
    evaluation: evaluation.evaluation as EvaluationResponse['evaluation'],
    details: evaluation.details,
    reply,
  };
}
