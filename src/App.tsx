/**
 * App Component
 * Root component that orchestrates the entire application
 */

import { useState } from 'react';
import { ErrorBoundary } from './ui/shared/components/ErrorBoundary.js';
import { ModuleSelection } from './ui/features/module/ModuleSelection.js';
import { ModuleEngine } from './ui/features/module/ModuleEngine.js';
import { FullScreenLayout } from './ui/shared/components/layouts/index.js';

/**
 * App component
 */
export function App() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleExitModule = () => {
    setSelectedModuleId(null);
  };

  return (
    <ErrorBoundary>
      <FullScreenLayout>
        {selectedModuleId ? (
          <ModuleEngine moduleId={selectedModuleId} onExit={handleExitModule} />
        ) : (
          <ModuleSelection onSelectModule={handleSelectModule} />
        )}
      </FullScreenLayout>
    </ErrorBoundary>
  );
}

