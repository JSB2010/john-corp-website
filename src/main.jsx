import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/video.css'
import './styles/network.css'
import './styles/animations.css'
import './apple-styles.css'
import App from './App.jsx'
import { initScrollAnimations } from './utils/scrollAnimations'
import { initAnimations } from './utils/initAnimations'

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Initialize animations after the app is rendered
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initAnimations();
});
