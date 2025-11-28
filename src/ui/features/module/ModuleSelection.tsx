/**
 * Modulväljarkomponent
 * Visar tillgängliga moduler och möjliggör val
 * Visar låst/upplåst/slutförd status
 */

import { useModuleStore } from '@stores/moduleStore/index.js';
import { useModuleDiscovery } from '@ui/shared/hooks/useModuleDiscovery.js';
import { ModulePath } from '@ui/shared/components/ModulePath.js';
import { Card } from '@ui/shared/components/Card.js';
import { LoadingState } from '@ui/shared/components/LoadingState.js';
import { EmptyState } from '@ui/shared/components/EmptyState.js';

export interface ModuleSelectionProps {
  /**
   * Callback när en modul väljs
   */
  onSelectModule: (moduleId: string) => void;
}

/**
 * Modulväljarkomponent
 */
export function ModuleSelection({ onSelectModule }: ModuleSelectionProps) {
  const { moduleIds, loading, worldmap } = useModuleDiscovery();
  const { getModuleProgression } = useModuleStore();

  const handleSelectModule = (moduleId: string) => {
    const progression = getModuleProgression(moduleId);
    if (progression === 'unlocked' || progression === 'completed') {
      onSelectModule(moduleId);
    }
  };

  if (loading) {
    return <LoadingState message="Laddar moduler..." />;
  }

  if (moduleIds.length === 0) {
    return <EmptyState message="Inga moduler tillgängliga" />;
  }

  if (!worldmap) {
    return <LoadingState message="Laddar världskarta..." />;
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--theme-background-color)' }}>
      {/* Dekorativa gradient-överlägg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 140, 0, 0.08) 0%, transparent 70%)',
            animationDelay: '1s',
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(135, 206, 235, 0.05) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 pixelated text-yellow-300 animate-fade-in">
            Världskarta
          </h1>
          <p className="text-base pixelated text-white mt-1 animate-fade-in-delay">
            Välj ditt nästa äventyr
          </p>
        </div>

        {/* Världskarta */}
        <div className="max-w-6xl mx-auto">
          <Card 
            padding="md" 
            dark 
            pixelated
            className="min-h-[500px] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(23, 23, 43, 0.98) 0%, rgba(15, 15, 35, 0.98) 100%)',
            }}
          >
            {/* Subtilt rutnätsmönster */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(var(--theme-border-color) 1px, transparent 1px),
                  linear-gradient(90deg, var(--theme-border-color) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            
            <div className="relative z-10">
              <ModulePath
                worldmap={worldmap}
                onSelectModule={handleSelectModule}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
