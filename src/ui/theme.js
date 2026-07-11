import AppState from '../state/app-state.js';
import { $ } from '../utils/dom.js';

/**
 * Initialize the theme based on AppState.
 */
export function initTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  updateThemeIcon();

  const toggleBtn = $('#theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes.
 */
export function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', AppState.theme);
  AppState.saveSettings();
  updateThemeIcon();
}

/**
 * Update the theme toggle icon.
 */
export function updateThemeIcon() {
  const icon = $('#theme-toggle i');
  if (icon) {
    icon.className = AppState.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}
