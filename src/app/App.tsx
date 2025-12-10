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
import type { View } from './components/ModuleEngine/hooks/useModuleViews.js';

/**
 * App component
 */
export function App() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View | null>(null);

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const handleExitModule = () => {
    setSelectedModuleId(null);
    setCurrentView(null);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  return (
    <ErrorBoundary>
      <FullScreenLayout>
        {selectedModuleId ? (
          <ModuleEngine 
            moduleId={selectedModuleId} 
            onExit={handleExitModule}
            onViewChange={handleViewChange}
          />
        ) : (
          <ModuleSelection onSelectModule={handleSelectModule} />
        )}
        {/* Floating chat widget - always on top, auto-minimizes on view changes */}
        <FloatingChatWidget
          title="Support"
          position="bottom-right"
          startMinimized={true}
          viewChangeKey={currentView || undefined}
        />
      </FullScreenLayout>
    </ErrorBoundary>
  );
}
