/**
 * Uppgiftsutvärderingsresultatkomponent
 * Visar resultatet efter uppgiftsutvärdering
 */

import { Button } from '@ui/shared/components/Button.js';
import { Card } from '@ui/shared/components/Card.js';
import { Badge } from '@ui/shared/components/Badge.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';
import { getThemeValue } from '@utils/theme.js';
import { addOpacityToColor } from '@utils/color.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';
import type { TaskSolveResult } from '@types/core/taskSolveResult.types.js';

export interface TaskEvaluatedResultProps {
  /**
   * Utvärderingsresultat
   */
  result: TaskSolveResult;

  /**
   * Callback när användaren fortsätter efter löst uppgift
   */
  onContinue: () => void;
}

/**
 * Uppgiftsutvärderingsresultatkomponent
 */
export function TaskEvaluatedResult({
  result,
  onContinue,
}: TaskEvaluatedResultProps) {
  const borderColorValue = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);
  const isSolved = result.solved;

  return (
    <CenteredLayout className="p-4">
      <Card
        padding="lg"
        dark
        pixelated
        className="max-w-2xl w-full animate-scale-in"
        borderColor={borderColorValue}
      >
        <div className="space-y-5">
          {/* Statusmärke */}
          <div
            className="flex items-center justify-center pb-3 border-b"
            style={{ borderColor: borderColorValue, opacity: 0.3 }}
          >
            {isSolved ? (
              <Badge variant="success" size="lg">Uppgift löst!</Badge>
            ) : (
              <Badge variant="danger" size="lg">Uppgift ej löst</Badge>
            )}
          </div>

          {/* Resultatdetaljer */}
          <div className="text-white pixelated">
            <h3 className="!text-yellow-200 text-sm font-bold mb-2 uppercase tracking-wide">
              Resultat
            </h3>
            <p className="!text-white mb-3">
              {result.reason || 'Inget resultat tillgängligt'}
            </p>
            {result.details && (
              <p
                className="!text-white mt-3 pt-3 border-t text-sm leading-relaxed"
                style={{ borderColor: addOpacityToColor(borderColorValue, 0.2) }}
              >
                {result.details}
              </p>
            )}
            {result.score !== undefined && (
              <p className="!text-white mt-3 text-sm">
                Poäng: <span className="!text-yellow-200 font-bold">{result.score}</span>
              </p>
            )}
          </div>

          {/* Fortsätt-knapp (endast för lösta uppgifter) */}
          {isSolved && (
            <div
              className="flex justify-end pt-3 border-t"
              style={{ borderColor: borderColorValue, opacity: 0.2 }}
            >
              <Button
                variant="primary"
                onClick={onContinue}
                size="md"
                pixelated
              >
                Fortsätt
              </Button>
            </div>
          )}
        </div>
      </Card>
    </CenteredLayout>
  );
}
