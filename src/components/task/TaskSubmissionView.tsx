/**
 * Task submission view - routes to appropriate submission component
 */

import type { Task } from '../../types/module.types.js';
import type { TaskSubmission } from '../../types/task.types.js';
import { TextSubmission } from './TextSubmission.js';
import { ImageSubmission } from './ImageSubmission.js';
import { CodeSubmission } from './CodeSubmission.js';
import { CustomSubmission } from './CustomSubmission.js';

export interface TaskSubmissionViewProps {
  task: Task;
  onSubmit: (submission: TaskSubmission) => void;
  initialValue?: string;
}

export function TaskSubmissionView({ task, onSubmit, initialValue }: TaskSubmissionViewProps) {
  const submissionType = task.submission.type;
  
  // Route to appropriate submission component
  switch (submissionType) {
    case 'text':
      return (
        <TextSubmission
          task={task}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    
    case 'image':
      return (
        <ImageSubmission
          task={task}
          onSubmit={onSubmit}
        />
      );
    
    case 'code':
      return (
        <CodeSubmission
          task={task}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
    
    case 'custom':
      return (
        <CustomSubmission
          task={task}
          onSubmit={onSubmit}
        />
      );
    
    default:
      // Fallback to text
      return (
        <TextSubmission
          task={task}
          onSubmit={onSubmit}
          initialValue={initialValue}
        />
      );
  }
}

