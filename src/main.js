import './styles/index.css';
import 'highlight.js/styles/github-dark.css'; // Add HLJS theme (fixes audit issue #5)
import { initApp } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('ServiceWorker registration failed: ', err);
      });
    });
  }
});
