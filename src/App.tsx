import { useMemo } from 'react';
import { ModuleEngine } from './components/ModuleEngine.js';
import { ModuleSelection } from './components/ModuleSelection.js';
import { registerDefaultComponents } from './engine/registerComponents.js';
import { useI18n } from './i18n/context.js';
import type { Module } from './components/ModuleSelection.js';
import { useCurrentModuleId, useModuleActions } from './store/moduleStore.js';
import { DebugPanel } from './components/debug/DebugPanel.js';
import { ModuleErrorBoundary } from './components/error/ModuleErrorBoundary.js';
import './App.css';

// Register default components
registerDefaultComponents();

function App() {
  const { t } = useI18n();
  const currentModuleId = useCurrentModuleId();
  const { setModuleId } = useModuleActions();

  // Available modules in order (like Mario World)
  const availableModules: Module[] = useMemo(() => [
    {
      id: 'text-generation',
      name: 'Text Generation',
      description: 'Learn how AI can help you create stories, write creatively, and generate text. Master the art of AI-assisted writing!',
      icon: '✍️',
    },
      {
          id: 'image-recognition',
          name: 'Image recognition',
          description: 'Learn how AI can help you create stories, write creatively, and generate text. Master the art of AI-assisted writing!',
          icon: '👀️',
      },
      {
          id: 'sound-generation',
          name: 'Sound Generation',
          description: 'Learn how AI can help you create stories, write creatively, and generate text. Master the art of AI-assisted writing!',
          icon: '🎵',
      },
  ], [t]);

  const handleSelectModule = (moduleId: string) => {
    setModuleId(moduleId);
  };

  const handleExitModule = () => {
    setModuleId(null);
  };

  return (
    <>
      <DebugPanel />
      <ModuleErrorBoundary>
        {currentModuleId ? (
          <ModuleEngine moduleId={currentModuleId} onExit={handleExitModule} />
        ) : (
          <ModuleSelection modules={availableModules} onSelectModule={handleSelectModule} />
        )}
      </ModuleErrorBoundary>
    </>
  );
}

export default App;
