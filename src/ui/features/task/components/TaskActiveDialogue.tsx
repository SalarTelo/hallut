/**
 * Task Active Dialogue Component
 * Displays dialogue when a task is active/accepted
 */

import { Button } from '@ui/shared/components/Button.js';
import { Card } from '@ui/shared/components/Card.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';
import { getThemeValue } from '@utils/theme.js';
import { addOpacityToColor } from '@utils/color.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface TaskActiveDialogueProps {
  /**
   * Dialogue lines to display
   */
  lines: string[];

  /**
   * Text for the ready button
   */
  readyText?: string;

  /**
   * Callback when user is ready to start working
   */
  onReady: () => void;
}

/**
 * Task active dialogue component
 */
export function TaskActiveDialogue({
  lines,
  readyText = 'Start Working',
  onReady,
}: TaskActiveDialogueProps) {
  const borderColorValue = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);

  return (
    <CenteredLayout className="p-4">
      <Card
        padding="lg"
        dark
        pixelated
        className="max-w-2xl w-full animate-scale-in"
        borderColor={borderColorValue}
      >
        <div className="space-y-4">
          <div className="text-white pixelated">
            {lines.map((line, index) => (
              <p key={index} className="mb-2 text-white leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <div
            className="flex justify-end pt-3 border-t"
            style={{ borderColor: addOpacityToColor(borderColorValue, 0.2) }}
          >
            <Button variant="primary" onClick={onReady} size="md" pixelated>
              {readyText}
            </Button>
          </div>
        </div>
      </Card>
    </CenteredLayout>
  );
}

