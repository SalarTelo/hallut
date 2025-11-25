import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import './styles/typography.css'
import './styles/components.css'
import './styles/animations.css'
import './styles/dialogue.css'
import './styles/game-theme.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider defaultLocale="sv">
      <App />
    </I18nProvider>
  </StrictMode>,
)
