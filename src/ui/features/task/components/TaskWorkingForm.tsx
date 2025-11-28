/**
 * Uppgiftsarbetsformulärkomponent
 * Formulär för att skicka in uppgiftssvar
 */

import { Button } from '@ui/shared/components/Button.js';
import { Card } from '@ui/shared/components/Card.js';
import { ContainerLayout } from '@ui/shared/components/layouts/index.js';
import { getThemeValue } from '@utils/theme.js';
import { addOpacityToColor } from '@utils/color.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

export interface TaskWorkingFormProps {
  /**
   * Uppgiftsnamn
   */
  taskName: string;

  /**
   * Uppgiftsbeskrivning
   */
  taskDescription?: string;

  /**
   * Inlämningstyp (text, kod, etc.)
   */
  submissionType: string;

  /**
   * Aktuellt inlämningsvärde
   */
  value: string;

  /**
   * Om formuläret är inaktiverat (utvärderas)
   */
  isEvaluating: boolean;

  /**
   * Felmeddelande att visa
   */
  error: string | null;

  /**
   * Callback när värdet ändras
   */
  onChange: (value: string) => void;

  /**
   * Callback när formuläret skickas in
   */
  onSubmit: () => void;
}

/**
 * Uppgiftsarbetsformulärkomponent
 */
export function TaskWorkingForm({
  taskName,
  taskDescription,
  submissionType,
  value,
  isEvaluating,
  error,
  onChange,
  onSubmit,
}: TaskWorkingFormProps) {
  const borderColorValue = getThemeValue('border-color', DEFAULT_THEME.BORDER_COLOR);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = borderColorValue;
    e.currentTarget.style.boxShadow = `0 0 8px ${borderColorValue}`;
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = borderColorValue;
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <ContainerLayout className="max-w-2xl">
      <Card
        padding="md"
        dark
        pixelated
        className="animate-scale-in"
        borderColor={borderColorValue}
      >
          <div className="space-y-3">
            {/* Rubrik */}
            <div
              className="pb-2 border-b"
              style={{ borderColor: addOpacityToColor(borderColorValue, 0.3) }}
            >
              <h3 className="!text-yellow-200 text-base font-bold pixelated mb-1.5">
                {taskName}
              </h3>
              {taskDescription && (
                <p className="!text-white text-xs pixelated leading-relaxed">
                  {taskDescription}
                </p>
              )}
            </div>

            {/* Textinlämningsinmatning */}
            {submissionType === 'text' && (
              <div>
                <label className="!text-yellow-200 block text-xs font-bold pixelated mb-1.5 uppercase tracking-wide">
                  Ditt svar
                </label>
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isEvaluating}
                  rows={8}
                  className="w-full bg-black border-2 pixelated text-white text-xs p-2.5 rounded focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
                  style={{ borderColor: borderColorValue }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Skriv ditt svar här..."
                />
              </div>
            )}

            {/* Kodinlämningsinmatning */}
            {submissionType === 'code' && (
              <div>
                <label className="!text-yellow-200 block text-xs font-bold pixelated mb-1.5 uppercase tracking-wide">
                  Din kod
                </label>
                <textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={isEvaluating}
                  rows={12}
                  className="w-full bg-black border-2 pixelated text-white text-xs p-2.5 rounded font-mono resize-y focus:outline-none focus:ring-2 transition-all placeholder:text-gray-500"
                  style={{ borderColor: borderColorValue }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Skriv din kod här..."
                />
              </div>
            )}

            {/* Felmeddelande */}
            {error && (
              <div
                className="p-2.5 border-2 rounded-md pixelated"
                style={{
                  borderColor: '#ff4444',
                  backgroundColor: 'rgba(255, 68, 68, 0.1)',
                }}
              >
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Skicka in-knapp */}
            <div
              className="flex justify-end pt-2 border-t"
              style={{ borderColor: addOpacityToColor(borderColorValue, 0.2) }}
            >
              <Button
                variant="primary"
                onClick={onSubmit}
                disabled={!value || isEvaluating}
                loading={isEvaluating}
                size="sm"
                pixelated
              >
                Skicka in
              </Button>
            </div>
          </div>
        </Card>
    </ContainerLayout>
  );
}
