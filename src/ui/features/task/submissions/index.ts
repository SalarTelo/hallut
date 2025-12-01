/**
 * Submission Components
 * Registry and exports for submission UI components
 */

import { registerSubmissionComponent } from './registry';
import { TextSubmission } from './TextSubmission';
import { ImageSubmission } from './ImageSubmission';
import { CodeSubmission } from './CodeSubmission';
import { MultipleChoiceSubmission } from './MultipleChoiceSubmission';
import type {
  TextTaskSubmission,
  ImageTaskSubmission,
  CodeTaskSubmission,
  MultipleChoiceTaskSubmission,
} from '../../../../types/taskTypes.js';

// Register built-in submission components
// Components are properly typed for their specific submission types
registerSubmissionComponent<TextTaskSubmission>('text', TextSubmission);
registerSubmissionComponent<ImageTaskSubmission>('image', ImageSubmission);
registerSubmissionComponent<CodeTaskSubmission>('code', CodeSubmission);
registerSubmissionComponent<MultipleChoiceTaskSubmission>(
  'multiple_choice',
  MultipleChoiceSubmission
);

// Export components for direct use if needed
export { TextSubmission } from './TextSubmission';
export { ImageSubmission } from './ImageSubmission';
export { CodeSubmission } from './CodeSubmission';
export { MultipleChoiceSubmission } from './MultipleChoiceSubmission';
export {
  registerSubmissionComponent,
  getSubmissionComponent,
  hasSubmissionComponent,
} from './registry';
export type { SubmissionComponentProps } from './registry';

