/**
 * Task Offer Modal Component
 * Shows task details in a quest-like popup before accepting
 */

import { Modal } from '../overlays/Modal.js';
import { ModalContent } from '../overlays/ModalContent.js';
import { PixelIcon } from '../icons/PixelIcon.js';
import { useThemeBorderColor } from '../../hooks/useThemeBorderColor.js';
import type { Task } from '@core/task/types.js';

export interface TaskOfferModalProps {
  isOpen: boolean;
  task: Task;
  onAccept: () => void;
  onDecline: () => void;
  borderColor?: string;
}

/**
 * Task Offer Modal component
 * Displays task information in a quest-like format
 */
export function TaskOfferModal({
  isOpen,
  task,
  onAccept,
  onDecline,
  borderColor,
}: TaskOfferModalProps) {
  const borderColorValue = useThemeBorderColor(borderColor);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDecline}
      closeOnEscape={true}
      closeOnOverlayClick={true}
      size="lg"
      ariaLabel="Task Offer"
    >
      <div
        className="bg-black border-2 rounded-lg"
        style={{
          borderColor: borderColorValue,
        }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{
            borderColor: `${borderColorValue}30`,
            background: `linear-gradient(135deg, ${borderColorValue}15 0%, ${borderColorValue}05 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${borderColorValue}25`,
                border: `2px solid ${borderColorValue}`,
              }}
            >
              <PixelIcon type="note" size={20} color={borderColorValue} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-yellow-300 pixelated">New Task Available</h2>
              <p className="text-xs text-gray-300">{task.name}</p>
            </div>
            <button
              onClick={onDecline}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
              aria-label="Close"
            >
              <PixelIcon type="close" size={16} color="currentColor" />
            </button>
          </div>
        </div>

        <ModalContent borderColor={borderColorValue}>
          <div className="space-y-4">
            {/* Task Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-2 pixelated">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            {/* Requirements */}
            {task.overview?.requirements && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-2 pixelated">Requirements</h3>
                <p className="text-sm text-gray-300">{task.overview.requirements}</p>
              </div>
            )}

            {/* Goals */}
            {task.overview?.goals && task.overview.goals.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-2 pixelated">Goals</h3>
                <ul className="list-disc list-inside space-y-1">
                  {task.overview.goals.map((goal, index) => (
                    <li key={index} className="text-sm text-gray-300">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints (if available) */}
            {task.meta?.hints && task.meta.hints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-2 pixelated">Hints</h3>
                <ul className="list-disc list-inside space-y-1">
                  {task.meta.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-gray-400 italic">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: `${borderColorValue}30` }}>
              <button
                onClick={onDecline}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 active:scale-95 pixelated"
                style={{
                  borderColor: `${borderColorValue}60`,
                  backgroundColor: `${borderColorValue}10`,
                  color: borderColorValue,
                }}
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 active:scale-95 pixelated font-bold"
                style={{
                  borderColor: borderColorValue,
                  backgroundColor: borderColorValue,
                  color: '#000',
                }}
              >
                Accept Task
              </button>
            </div>
          </div>
        </ModalContent>
      </div>
    </Modal>
  );
}
