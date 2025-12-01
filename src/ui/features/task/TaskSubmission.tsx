/**
 * Uppgiftsinlämningskomponent
 * Huvudorchestrator för uppgiftsinlämningsflödet
 * Delegerar rendering till underkomponenter baserat på status
 */

import type { Task } from '@types/module/moduleConfig.types.js';
import { useTaskSubmission } from './hooks/index.js';
import {
  TaskOfferDialogue,
  TaskActiveDialogue,
  TaskWorkingForm,
  TaskEvaluatedResult,
  TaskCompletedState,
} from './components/index.js';

export interface TaskSubmissionProps {
  /**
   * Uppgift att skicka in
   */
  task: Task;

  /**
   * Modul-ID
   */
  moduleId: string;

  /**
   * Callback när uppgiften är slutförd
   */
  onComplete?: (result: { solved: boolean; reason: string }) => void;

  /**
   * Callback när uppgiften accepteras
   */
  onAccept?: () => void;

  /**
   * Hoppa direkt till arbetsstatus (uppgiften redan accepterad)
   */
  skipToWorking?: boolean;
}

/**
 * Uppgiftsinlämningskomponent
 * Orkestrerar uppgiftsinlämningsflödet med underkomponenter
 */
export function TaskSubmission({
  task,
  moduleId,
  onComplete,
  onAccept,
  skipToWorking = false,
}: TaskSubmissionProps) {
  const {
    state,
    submission,
    result,
    error,
    handleAccept,
    handleStartWorking,
    handleSubmissionChange,
    handleSubmit,
    handleContinue,
  } = useTaskSubmission({
    task,
    moduleId,
    skipToWorking,
    onComplete,
    onAccept,
  });

  // Rendera erbjudandedialog
  if (state === 'offered' && task.offerDialogue) {
    return (
      <TaskOfferDialogue
        lines={task.offerDialogue.lines}
        acceptText={task.offerDialogue.acceptText}
        onAccept={handleAccept}
      />
    );
  }

  // Rendera aktiv dialog (om uppgiften har aktiv dialog)
  if (state === 'accepted' && task.activeDialogue) {
    return (
      <TaskActiveDialogue
        lines={task.activeDialogue.lines}
        readyText={task.activeDialogue.readyText}
        onReady={handleStartWorking}
      />
    );
  }

  // Rendera inlämningsformulär
  if (state === 'working' || state === 'evaluating') {
    return (
      <TaskWorkingForm
        taskName={task.name}
        taskDescription={task.description}
        submissionConfig={task.submission}
        value={submission}
        isEvaluating={state === 'evaluating'}
        error={error}
        onChange={handleSubmissionChange}
        onSubmit={handleSubmit}
      />
    );
  }

  // Rendera utvärderingsresultat
  if (state === 'evaluated' && result) {
    return (
      <TaskEvaluatedResult
        result={result}
        onContinue={handleContinue}
      />
    );
  }

  // Rendera slutfört tillstånd
  if (state === 'completed') {
    return <TaskCompletedState />;
  }

  return null;
}
