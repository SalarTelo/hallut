/**
 * Feature Components
 * 
 * This file provides backward compatibility exports for feature components.
 * 
 * Note: Feature-specific components are now organized in:
 * - `views/` - View-level components (DialogueView, TaskView, etc.)
 * - `app/components/` - Application-level components (ModuleSelection, ModuleEngine)
 * 
 * @deprecated Consider importing directly from views/ or app/components/ instead
 * 
 * @example
 * ```typescript
 * // Prefer direct imports:
 * import { DialogueView } from '@ui/views/DialogueView.js';
 * import { ModuleSelection } from '@app/components/ModuleSelection.js';
 * 
 * // Or use this file for backward compatibility:
 * import { DialogueView, ModuleSelection } from '@ui/features/index.js';
 * ```
 */

// Re-export from views
export { DialogueView } from '../views/DialogueView.js';
export type { DialogueViewProps } from '../views/DialogueView.js';

// Re-export from app components
// Note: These are .tsx files, but we use .js extension per TypeScript module resolution rules
export { ModuleSelection } from '@app/components/ModuleSelection.js';
export { ModuleEngine } from '@app/components/ModuleEngine.js';

