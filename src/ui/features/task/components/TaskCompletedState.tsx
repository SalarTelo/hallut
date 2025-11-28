/**
 * Uppgift slutförd-statuskomponent
 * Visas när en uppgift har slutförts
 */

import { Card } from '@ui/shared/components/Card.js';
import { Badge } from '@ui/shared/components/Badge.js';
import { CenteredLayout } from '@ui/shared/components/layouts/index.js';
import { getThemeValue } from '@utils/theme.js';
import { DEFAULT_THEME } from '@constants/module.constants.js';

/**
 * Uppgift slutförd-statuskomponent
 */
export function TaskCompletedState() {
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
        <div className="text-center space-y-4">
          <Badge variant="success" size="lg">
            Uppgift slutförd
          </Badge>
          <p className="text-white pixelated">Denna uppgift har slutförts.</p>
        </div>
      </Card>
    </CenteredLayout>
  );
}
