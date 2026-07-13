import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './enhancements.css'
import App from './App'

// Early load mobile developer tools if activated in local storage
if (typeof window !== 'undefined' && localStorage.getItem('wawasan_eruda_enabled') === 'true') {
  const erudaWin = window as unknown as { eruda?: unknown };
  import('eruda')
    .then((module) => {
      if (!document.getElementById('eruda') && !erudaWin.eruda) {
        module.default.init();
      }
    })
    .catch((err) => {
      console.warn('Failed to load mobile devtools console:', err);
    });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
