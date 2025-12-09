/**
 * App Component
 * Root component that orchestrates the entire application
 */

import { useState } from 'react';
import { ErrorBoundary } from '@ui/shared/components/feedback/index.js';
import { ModuleSelection } from './components/ModuleSelection.js';
import { ModuleEngine } from './components/ModuleEngine.js';
import { FullScreenLayout } from '../ui/shared/components/layouts/index.js';
import { FloatingChatWidget } from '../ui/shared/components/game/index.js';

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
        {/* Floating chat widget - always on top */}
        <FloatingChatWidget
          title="Support"
          position="bottom-right"
          startMinimized={true}
        />
      </FullScreenLayout>
    </ErrorBoundary>
  );
}
