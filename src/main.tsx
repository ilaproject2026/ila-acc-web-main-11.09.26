import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import { ThemeTypographyProvider } from './context/ThemeTypographyContext'

createRoot(getElementByIdOrThrow()).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeTypographyProvider>
        <App />
      </ThemeTypographyProvider>
    </ErrorBoundary>
  </StrictMode>,
)

function getElementByIdOrThrow() {
  const el = document.getElementById('root');
  if (!el) throw new Error('Root element not found');
  return el;
}