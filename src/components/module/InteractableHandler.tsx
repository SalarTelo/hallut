/**
 * InteractableHandler - Handles interactable clicks and dispatches actions
 */

import { useState, useEffect } from 'react';
import type { Interactable, InteractableAction } from '../../types/interactable.types.js';
import { InteractableActionType } from '../../types/interactable.types.js';
import { Dialogue } from './Dialogue.js';
import { ComponentOverlay } from './ComponentOverlay.js';
import { getComponent, parseModuleComponentType } from '../../engine/ComponentRegistry.js';
import { loadModuleComponent } from '../../engine/ModuleComponentLoader.js';
import { useModuleStore } from '../../store/moduleStore.js';
import { DialogueSystem } from '../../dialogue/DialogueSystem.js';

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
  const [Component, setComponent] = useState<any>(null);
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
  const [dialogueData, setDialogueData] = useState<import('../../dialogue/DialogueSystem.js').DialogueData | null>(null);


  // Load dialogue data when dialogue action is triggered
  useEffect(() => {
    if (interactable.action.type === InteractableActionType.Dialogue && currentModuleId && currentModule) {
      const dialogueConfig = currentModule.dialogues[interactable.action.dialogue];
      if (dialogueConfig) {
        const data = DialogueSystem.getDialogueData(
          dialogueConfig,
          currentModuleId,
          interactable.id,
          () => {
            setDialogueData(null);
            if (onActionComplete) {
              onActionComplete();
            }
          }
        );
        if (data) {
          setDialogueData(data);
        }
      }
    }
  }, [interactable.action, currentModuleId, currentModule, interactable.id, onActionComplete]);

  const handleAction = (action: InteractableAction) => {
    switch (action.type) {
      case InteractableActionType.Dialogue: {
        // Dialogue is handled by useEffect above
        if (dialogueData) {
          return (
            <Dialogue
              speaker={dialogueData.speaker}
              lines={dialogueData.lines}
              choices={dialogueData.choices?.map(c => c.text)}
              inputType={dialogueData.choices ? 'choices' : undefined}
              onResponse={(response) => {
                // Find and call the handler for the selected choice
                const choice = dialogueData.choices?.find(c => c.text === response);
                if (choice) {
                  choice.handler();
                }
              }}
              onNext={dialogueData.onComplete}
            />
          );
        }
        return null;
      }

      case InteractableActionType.Component: {
        // Check if it's a module-specific component (format: moduleId:componentName)
        const moduleComponentType = parseModuleComponentType(action.component);
        if (moduleComponentType && currentModuleId === moduleComponentType.moduleId) {
          return (
            <ComponentOverlay onClose={onActionComplete}>
              <ModuleComponentLoader 
                moduleId={moduleComponentType.moduleId}
                componentName={moduleComponentType.componentName}
                onNext={onActionComplete}
              />
            </ComponentOverlay>
          );
        }
        
        const Component = getComponent(action.component);
        if (!Component) {
          console.warn(`Component "${action.component}" not found`);
          return null;
        }
        
        return (
          <ComponentOverlay onClose={onActionComplete}>
            <Component onNext={onActionComplete} />
          </ComponentOverlay>
        );
      }

      case InteractableActionType.Task: {
        // Tasks are handled by the dialogue system now
        // Defer action complete to avoid setState during render
        if (onActionComplete) {
          setTimeout(() => {
            onActionComplete();
          }, 0);
        }
        return null;
      }

      case InteractableActionType.Function: {
        // Defer function execution to avoid setState during render
        setTimeout(() => {
          action.function();
          // Defer action complete to avoid setState during render
          if (onActionComplete) {
            setTimeout(() => {
              onActionComplete();
            }, 0);
          }
        }, 0);
        return null;
      }

      default:
        return null;
    }
  };

  // Handle non-dialogue actions
  if (interactable.action.type !== InteractableActionType.Dialogue) {
    return handleAction(interactable.action);
  }

  // Dialogue is handled by useEffect above
  if (dialogueData) {
    return (
      <Dialogue
        speaker={dialogueData.speaker}
        lines={dialogueData.lines}
        choices={dialogueData.choices?.map(c => c.text)}
        inputType={dialogueData.choices ? 'choices' : undefined}
        onResponse={(response) => {
          // Find and call the handler for the selected choice
          const choice = dialogueData.choices?.find(c => c.text === response);
          if (choice) {
            choice.handler();
          }
        }}
        onNext={dialogueData.onComplete}
      />
    );
  }

  return null;
}
