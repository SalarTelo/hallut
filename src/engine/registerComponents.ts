import { registerComponent } from './ComponentRegistry.js';
import { Dialogue } from '../components/module/Dialogue.js';
import { AiChat } from '../components/module/AiChat.js';
import { AiChatModal } from '../components/module/AiChatModal.js';
import { GuardAgent } from '../components/module/GuardAgent.js';
import { AnswerSubmission } from '../components/module/AnswerSubmission.js';
import { WorldMapView } from '../components/module/WorldMapView.js';
import { EnvironmentView } from '../components/module/EnvironmentView.js';
import { CriteriaDisplay } from '../components/module/CriteriaDisplay.js';
import { TaskAcceptance } from '../components/module/TaskAcceptance.js';
import { LabAssistant } from '../components/module/LabAssistant.js';
import { FridgeModal } from '../components/module/FridgeModal.js';

export function registerDefaultComponents() {
  registerComponent('Dialogue', Dialogue);
  registerComponent('AiChat', AiChat);
  registerComponent('AiChatModal', AiChatModal);
  registerComponent('GuardAgent', GuardAgent);
  registerComponent('AnswerSubmission', AnswerSubmission);
  registerComponent('WorldMap', WorldMapView);
  registerComponent('Environment', EnvironmentView);
  registerComponent('CriteriaDisplay', CriteriaDisplay);
  registerComponent('TaskAcceptance', TaskAcceptance);
  registerComponent('LabAssistant', LabAssistant);
  registerComponent('FridgeModal', FridgeModal);
}

// Export CharacterCard for potential future use
export { CharacterCard } from '../components/module/CharacterCard.js';

