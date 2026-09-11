import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'

createRoot(getElementByIdOrThrow()).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

function getElementByIdOrThrow() {
  const el = document.getElementById('root');
  if (!el) throw new Error('Root element not found');
  return el;
}