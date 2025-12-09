/**
 * Feature Components
 * Export all feature components from a single entry point
 * 
 * Note: This file is kept for backward compatibility.
 * Components are now organized in views/ and app/components/
 */

// Re-export from views
export { DialogueView } from '../views/DialogueView.js';

// Re-export from app components
// Note: These are .tsx files, but we use .js extension per TypeScript module resolution rules
export { ModuleSelection } from '@app/components/ModuleSelection.js';
export { ModuleEngine } from '@app/components/ModuleEngine.js';

