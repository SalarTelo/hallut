/**
 * Custom Task Submission Component
 * 
 * A custom submission component for tasks that demonstrates
 * how to create unique task submission interfaces.
 */

import { useState } from 'react';
import type { TaskSubmissionComponentRenderer } from '@core/module/types/index.js';
import { Button } from '@ui/shared/components/primitives/index.js';
import { Textarea } from '@ui/shared/components/primitives/index.js';

export interface CustomTaskSubmissionProps {
  /**
   * Current submission value
   */
  value?: { color?: string; reason?: string };

  /**
   * Callback when submission changes
   */
  onChange: (value: { color: string; reason: string }) => void;

  /**
   * Config passed from task definition
   */
  config?: {
    instruction?: string;
  };
}

/**
 * Custom Task Submission component
 * 
 * This demonstrates a custom submission interface with color selection
 * and text input, different from standard text or multiple choice tasks.
 */
export function CustomTaskSubmission({
  value = {},
  onChange,
  config,
}: CustomTaskSubmissionProps) {
  // Handle null/undefined value
  const safeValue = value && typeof value === 'object' ? value : {};
  const [selectedColor, setSelectedColor] = useState<string>(safeValue.color || '');
  const [reason, setReason] = useState<string>(safeValue.reason || '');

  const colors = [
    { name: 'Red', value: 'red', hex: '#ef4444' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Green', value: 'green', hex: '#10b981' },
    { name: 'Yellow', value: 'yellow', hex: '#fbbf24' },
    { name: 'Purple', value: 'purple', hex: '#a855f7' },
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onChange({ color, reason });
  };

  const handleReasonChange = (newReason: string) => {
    setReason(newReason);
    onChange({ color: selectedColor, reason: newReason });
  };

  return (
    <div className="space-y-4">
      {config?.instruction && (
        <p className="text-gray-300 text-sm mb-4">{config.instruction}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select your favorite color:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorSelect(color.value)}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${selectedColor === color.value
                  ? 'border-yellow-400 bg-gray-800 scale-105'
                  : 'border-gray-600 bg-gray-800/60 hover:bg-gray-700/80 hover:border-gray-500'
                }
              `}
              style={{
                backgroundColor: selectedColor === color.value ? `${color.hex}20` : undefined,
              }}
            >
              <div
                className="w-full h-12 rounded mb-2"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-gray-300">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Why is this your favorite color?
        </label>
        <Textarea
          value={reason}
          onChange={(e) => handleReasonChange(e.target.value)}
          placeholder="Enter your reason here (at least 10 characters)..."
          rows={4}
          className="w-full"
        />
        <p className="text-xs text-gray-400 mt-1">
          {reason.length}/10 characters minimum
        </p>
      </div>
    </div>
  );
}

/**
 * Component renderer for module registration
 * 
 * This function bridges the React component to the TaskSubmissionComponentRenderer interface
 * required by the module system.
 * 
 * The renderer is defined after the component to ensure CustomTaskSubmission is fully initialized.
 */
export const customTaskSubmissionRenderer: TaskSubmissionComponentRenderer = (props) => {
  // Access CustomTaskSubmission at call time, not module load time
  return (
    <CustomTaskSubmission
      value={props.value as { color?: string; reason?: string }}
      onChange={(val) => props.onChange(val)}
      config={props.config}
    />
  );
};

