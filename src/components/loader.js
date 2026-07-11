import { $ } from '../utils/dom.js';

/**
 * Show the global loader overlay.
 * @param {string} [message] - Optional custom message to display.
 */
export function showLoader(message) {
  const overlay = $('#loader-overlay');
  if (overlay) {
    if (message) {
      const msgEl = $('h3', overlay);
      if (msgEl) msgEl.textContent = message;
    }
    overlay.classList.add('active');
  }
}

/**
 * Hide the global loader overlay.
 */
export function hideLoader() {
  const overlay = $('#loader-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}
