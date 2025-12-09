/**
 * Task Builders
 * Central export for all task builders
 */

// Submissions
export {
  textSubmission,
  imageSubmission,
  codeSubmission,
  multipleChoiceSubmission,
  customSubmission,
} from './submissions.js';

// Results
export {
  success,
  failure,
} from './results.js';

// Validators
export {
  textLengthValidator,
  wordCountValidator,
  keywordsValidator,
  combineValidators,
} from './validators.js';

// Task creation
export {
  createTask,
  type TaskOptions,
} from './task.js';

// Utils
export {
  getTextFromSubmission,
} from './utils.js';

