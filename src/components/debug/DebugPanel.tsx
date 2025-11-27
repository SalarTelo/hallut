import { useState, useEffect } from 'react';
import { useModuleStore, useModuleActions } from '../../store/moduleStore.js';
import { StorageService } from '../../services/storage.js';
// Validation removed - moduleValidator was for old JSON system

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'state' | 'storage' | 'actions'>('state');

  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const moduleProgress = useModuleStore((state) => 
    currentModuleId ? state.getProgress(currentModuleId) : null
  );
  const moduleState = moduleProgress?.state || {};
  
  // Get completed modules from store
  const completedModules = useModuleStore((state) => state.getCompletedModules());

  const { addCompletedModule, updateProgress } = useModuleActions();

  // Toggle with backtick key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          opacity: 0.3,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.3';
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Debug (`)
        </button>
      </div>
    );
  }

  const handleResetModule = () => {
    if (currentModuleId && confirm('Reset current module state? This will clear all progress.')) {
      updateProgress(currentModuleId, {
        completedTasks: [],
        state: {},
      });
      window.location.reload();
    }
  };

  const handleClearStorage = () => {
    if (confirm('Clear all localStorage? This will reset everything.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleCompleteModule = () => {
    if (currentModuleId) {
      addCompletedModule(currentModuleId);
      window.location.reload();
    }
  };


  const handleSetModuleState = () => {
    if (!currentModuleId) {
      alert('No module selected');
      return;
    }
    const key = prompt('Enter state key:');
    const value = prompt('Enter state value (JSON):');
    if (key && value) {
      try {
        const parsedValue = JSON.parse(value);
        const currentState = moduleProgress?.state || {};
        updateProgress(currentModuleId, {
          state: {
            ...currentState,
            [key]: parsedValue,
          },
        });
      } catch {
        const currentState = moduleProgress?.state || {};
        updateProgress(currentModuleId, {
          state: {
            ...currentState,
            [key]: value,
          },
        });
      }
    }
  };

  // Get Zustand persisted state directly from localStorage
  const getZustandState = () => {
    try {
      const zustandData = localStorage.getItem('module-progress');
      if (zustandData) {
        return JSON.parse(zustandData);
      }
    } catch (error) {
      console.error('Failed to parse Zustand state:', error);
    }
    return null;
  };

  const zustandState = getZustandState();
  
  const storageData = {
    currentModuleId: currentModuleId,
    completedModules: completedModules,
    zustandState: zustandState?.state || null,
    locale: StorageService.getLocale(), // Locale is separate, can stay in StorageService
    // Get module progress for current module if available
    moduleProgress: moduleProgress,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '500px',
        maxHeight: '80vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #666',
        borderRadius: '8px',
        zIndex: 10000,
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px',
          borderBottom: '1px solid #444',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Debug Panel</div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 8px',
          }}
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #444',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        }}
      >
        {(['state', 'storage', 'actions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px',
              background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #4CAF50' : '2px solid transparent',
              color: '#fff',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontSize: '12px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '12px',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {activeTab === 'state' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#888', marginBottom: '8px', fontSize: '11px' }}>CURRENT STATE</div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Module ID:</strong> {currentModuleId || 'null'}
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Completed Modules:</strong> {completedModules.length}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#888', marginBottom: '8px', fontSize: '11px' }}>MODULE STATE</div>
              <pre
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  overflowX: 'auto',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(moduleState, null, 2)}
              </pre>
            </div>

          </div>
        )}

        {activeTab === 'storage' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#888', marginBottom: '8px', fontSize: '11px' }}>LOCAL STORAGE</div>
              <pre
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  overflowX: 'auto',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(storageData, null, 2)}
              </pre>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#888', marginBottom: '8px', fontSize: '11px' }}>ALL STORAGE KEYS</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>
                {Object.keys(localStorage)
                  .filter((key) => 
                    key.startsWith('module-') || 
                    key === 'module-store' || 
                    key === 'locale' || 
                    key === 'currentModuleId' || 
                    key === 'completedModules'
                  )
                  .map((key) => (
                    <div key={key} style={{ marginBottom: '4px' }}>
                      {key}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <div style={{ color: '#888', marginBottom: '12px', fontSize: '11px' }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleSetModuleState}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  border: '1px solid #2196F3',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Set Module State
              </button>

              {currentModuleId && (
                <button
                  onClick={handleCompleteModule}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    border: '1px solid #FFC107',
                    borderRadius: '4px',
                    color: '#fff',
                  cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Mark Module Complete
                </button>
              )}

              <button
                onClick={handleResetModule}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(244, 67, 54, 0.2)',
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Reset Module State
              </button>

              <button
                onClick={handleClearStorage}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(244, 67, 54, 0.3)',
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Clear All Storage (Reload)
              </button>
            </div>

            <div style={{ marginTop: '20px', color: '#888', fontSize: '11px' }}>
              <div style={{ marginBottom: '8px' }}>KEYBOARD SHORTCUTS:</div>
              <div style={{ marginBottom: '4px' }}>• Press ` (backtick) to toggle panel</div>
              <div style={{ marginBottom: '4px' }}>• Click outside or × to close</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

