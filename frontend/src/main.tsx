import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/css/animate.min.css'
import './assets/css/bootstrap.min.css'
import './assets/css/default.css'
import './assets/css/dripicons.css'
import './assets/css/magnific-popup.css'
import './assets/css/meanmenu.css'
import './assets/css/responsive.css'
import './assets/css/slick.css'
import './assets/css/style.css'
import './assets/fontawesome/css/all.min.css'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
