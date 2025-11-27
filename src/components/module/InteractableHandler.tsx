/**
 * InteractableHandler - Handles interactable clicks and dispatches actions
 * Refactored to remove React anti-patterns (setTimeout hacks, render-time side effects)
 */

import { useState, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { Interactable } from '../../types/interactable.types.js';
import { InteractableActionType } from '../../types/interactable.types.js';
import { ComponentOverlay } from './ComponentOverlay.js';
import { InteractableDialogue } from './InteractableDialogue.js';
import { getComponent, parseModuleComponentType } from '../../engine/ComponentRegistry.js';
import { loadModuleComponent } from '../../engine/ModuleComponentLoader.js';
import { useModuleStore } from '../../store/moduleStore.js';
import { DialogueSystem } from '../../dialogue/DialogueSystem.js';
import type { DialogueData } from '../../dialogue/DialogueSystem.js';

// Type for module component props
export interface ModuleComponentProps {
  onNext?: () => void;
  [key: string]: unknown;
}

export interface InteractableHandlerProps {
  interactable: Interactable;
  onActionComplete?: () => void;
}

// Component loader for module-specific components
function ModuleComponentLoader({ 
  moduleId, 
  componentName, 
  onNext 
}: { 
  moduleId: string; 
  componentName: string; 
  onNext?: () => void;
}) {
  const [Component, setComponent] = useState<ComponentType<ModuleComponentProps> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadModuleComponent(moduleId, componentName)
      .then((LoadedComponent) => {
        if (LoadedComponent) {
          setComponent(LoadedComponent);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.warn(`Failed to load module component ${moduleId}/${componentName}:`, error);
        setLoading(false);
      });
  }, [moduleId, componentName]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!Component) {
    return <div>Component not found</div>;
  }
  
  return <Component onNext={onNext} />;
}

export function InteractableHandler({ interactable, onActionComplete }: InteractableHandlerProps) {
  const currentModule = useModuleStore((state) => state.currentModule);
  const currentModuleId = useModuleStore((state) => state.currentModuleId);
  const [dialogueData, setDialogueData] = useState<DialogueData | null>(null);
  const [showComponent, setShowComponent] = useState<{ type: 'module' | 'global'; moduleId?: string; componentName?: string; component?: ComponentType<ModuleComponentProps> } | null>(null);

  // Handle action complete callback
  const handleActionComplete = useCallback(() => {
    setDialogueData(null);
    setShowComponent(null);
    if (onActionComplete) {
      onActionComplete();
    }
  }, [onActionComplete]);

  // Load dialogue data when dialogue action is triggered
  useEffect(() => {
    if (interactable.action.type === InteractableActionType.Dialogue && currentModuleId && currentModule) {
      const dialogueConfig = currentModule.dialogues[interactable.action.dialogue];
      if (dialogueConfig) {
        const data = DialogueSystem.getDialogueData(
          dialogueConfig,
          currentModuleId,
          interactable.id,
          handleActionComplete
        );
        if (data) {
          setDialogueData(data);
        }
      }
    }
  }, [interactable.action, currentModuleId, currentModule, interactable.id, handleActionComplete]);

  // Handle non-dialogue actions on mount
  useEffect(() => {
    const action = interactable.action;
    
    if (action.type === InteractableActionType.Component) {
      // Check if it's a module-specific component (format: moduleId:componentName)
      const moduleComponentType = parseModuleComponentType(action.component);
      if (moduleComponentType && currentModuleId === moduleComponentType.moduleId) {
        setShowComponent({
          type: 'module',
          moduleId: moduleComponentType.moduleId,
          componentName: moduleComponentType.componentName,
        });
        return;
      }
      
      // Try to get global component
      const Component = getComponent(action.component);
      if (Component) {
        setShowComponent({
          type: 'global',
          component: Component,
        });
      } else {
        console.warn(`Component "${action.component}" not found`);
        handleActionComplete();
      }
    } else if (action.type === InteractableActionType.Task) {
      // Tasks are handled by the dialogue system now
      // Just close immediately
      handleActionComplete();
    } else if (action.type === InteractableActionType.Function) {
      // Execute function in effect, not during render
      try {
        action.function();
      } catch (error) {
        console.error('Error executing interactable function:', error);
      }
      handleActionComplete();
    }
  }, [interactable.action, currentModuleId, handleActionComplete]);

  // Render dialogue if available
  if (dialogueData) {
    return <InteractableDialogue dialogueData={dialogueData} />;
  }

  // Render component overlay if component action
  if (showComponent) {
    if (showComponent.type === 'module' && showComponent.moduleId && showComponent.componentName) {
      return (
        <ComponentOverlay onClose={handleActionComplete}>
          <ModuleComponentLoader 
            moduleId={showComponent.moduleId}
            componentName={showComponent.componentName}
            onNext={handleActionComplete}
          />
        </ComponentOverlay>
      );
    }
    
    if (showComponent.type === 'global' && showComponent.component) {
      const Component = showComponent.component;
      return (
        <ComponentOverlay onClose={handleActionComplete}>
          <Component onNext={handleActionComplete} />
        </ComponentOverlay>
      );
    }
  }

  return null;
}
