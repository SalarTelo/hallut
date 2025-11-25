import { AnswerSubmission } from './AnswerSubmission.js';
import { CriteriaDisplay } from './CriteriaDisplay.js';
import { CharacterCard } from './CharacterCard.js';
import { Dialogue } from './Dialogue.js';
import { evaluateAnswer } from '../../api/client.js';
import { useI18n } from '../../i18n/context.js';
import type { TaskConfig, EvaluationResponse, Task } from '../../types/module.types.js';
import { useState, useMemo } from 'react';
import { useModuleStore } from '../../store/moduleStore.js';
import { moduleActions } from '../../store/moduleActions.js';

export interface GuardAgentProps {
  task?: TaskConfig;
  onAnswerSubmit?: (answer: string) => void;
  onNext?: () => void;
  moduleState?: Record<string, unknown>;
}

export function GuardAgent({
  task: taskProp,
  onAnswerSubmit,
  onNext,
  moduleState: _moduleState,
}: GuardAgentProps) {
  const { t, locale } = useI18n();
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const currentModule = useModuleStore((state) => state.currentModule);
  const moduleProgress = useModuleStore((state) => 
    currentModuleId ? state.getProgress(currentModuleId) : null
  );
  const moduleState = moduleProgress?.state || {};
  const moduleData = currentModule;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [guardResponse, setGuardResponse] = useState<string | null>(null);
  const [isReadyConfirmed, setIsReadyConfirmed] = useState(false);
  
  // Get current task from prop, moduleData, or moduleState
  const task = useMemo(() => {
    if (taskProp) return taskProp;
    
    // Try to get task from moduleData using currentTaskId
    if (moduleState.currentTaskId && moduleData?.tasks) {
      const foundTask = moduleData.tasks.find(t => t.id === moduleState.currentTaskId);
      if (foundTask) {
        return {
          id: foundTask.id,
          description: foundTask.description,
          minLength: undefined,
          keywords: undefined,
          twists: undefined,
          bonusChallenges: undefined,
        } as TaskConfig;
      }
    }
    
    return null;
  }, [taskProp, moduleState.currentTaskId, moduleData]);
  
  // If no task found, show message
  if (!task) {
    return (
      <CharacterCard
        name={t.guard.name}
        role={t.guard.role}
        avatar="🛡️"
        avatarColor="guard"
      >
        <div className="game-surface" style={{ marginBottom: 'var(--spacing-6)' }}>
          <p className="text-base" style={{ color: 'var(--game-text-primary)' }}>
            {locale === 'sv' 
              ? 'Du måste först acceptera en uppgift från mentorn.'
              : 'You must first accept a task from the mentor.'}
          </p>
        </div>
      </CharacterCard>
    );
  }
  
  // Check if user has accepted the task
  const hasAcceptedTask = task.id && moduleState.currentTaskId === task.id;
  
  // If task is accepted but user hasn't confirmed ready, show ready dialogue
  if (hasAcceptedTask && !isReadyConfirmed) {
    const handleReadyConfirm = () => {
      setIsReadyConfirmed(true);
      // Signal to ModuleEngine to show TaskWork
      if (currentModuleId) {
        moduleActions.setReadyToSubmit(currentModuleId, true);
      }
    };
    
    return (
      <Dialogue
        speaker={t.guard.name}
        role={t.guard.role}
        avatar="🛡️"
        lines={[
          locale === 'sv' 
            ? 'Hej! Har du skrivit din berättelse?'
            : 'Hello! Have you written your story?',
          locale === 'sv'
            ? 'Är du redo att lämna in den?'
            : 'Are you ready to submit it?',
        ]}
        onNext={handleReadyConfirm}
      />
    );
  }

  const handleSubmit = async (answer: string): Promise<EvaluationResponse> => {
    const response = await evaluateAnswer(answer, task, locale);
    setHasSubmitted(true);
    setGuardResponse(response.reply);

    if (onAnswerSubmit) {
      onAnswerSubmit(answer);
    }

    // Only mark task as complete and unlock next nodes on good/excellent evaluation
    if (response.evaluation === 'excellent' || response.evaluation === 'good') {
      // Call completeWorldMapNode if it exists in moduleState (from WorldMapView)
      const completeNode = (moduleState as Record<string, unknown>).completeWorldMapNode;
      if (completeNode && typeof completeNode === 'function') {
        (completeNode as () => void)();
      }
      // Auto-advance after a delay
      if (onNext) {
        setTimeout(() => {
          onNext();
        }, 4000);
      }
    }

    return response;
  };

  return (
    <>
      <CriteriaDisplay task={task} />
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          opacity: hasSubmitted ? 0.95 : 1,
          transition: 'opacity var(--transition-base)',
        }}
      >
        <CharacterCard
          name={t.guard.name}
          role={t.guard.role}
          avatar="🛡️"
          avatarColor="guard"
        >
          {guardResponse && (
            <div className="game-surface" style={{ marginBottom: 'var(--spacing-6)' }}>
              <div
                className="h4"
                style={{
                  marginBottom: 'var(--spacing-3)',
                  color: 'var(--game-world-border)',
                  fontFamily: 'var(--font-family-pixel)',
                }}
              >
                {t.guard.response}
              </div>
              <p
                className="text-base"
                style={{
                  lineHeight: 'var(--line-height-relaxed)',
                  color: 'var(--game-text-primary)',
                  margin: 0,
                }}
              >
                {guardResponse}
              </p>
            </div>
          )}

          <AnswerSubmission onSubmit={handleSubmit} task={task} moduleState={moduleState} />
        </CharacterCard>
      </div>
    </>
  );
}
