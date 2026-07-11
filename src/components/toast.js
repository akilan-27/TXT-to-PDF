import { TOAST_DURATION_MS } from '../utils/constants.js';
import { createElement, $ } from '../utils/dom.js';

/**
 * Display a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='success'] - 'success', 'error', or 'warning'.
 */
export function showToast(message, type = 'success') {
  let toast = $('#toast-notification');
  
  if (!toast) {
    // Create the toast container if it doesn't exist
    toast = createElement('div', { id: 'toast-notification', className: 'toast' }, [
      createElement('i', { className: 'fa-solid fa-circle-check' }),
      createElement('span', { id: 'toast-message' })
    ]);
    document.body.appendChild(toast);
  }

  const msgEl = $('#toast-message', toast);
  const icon = $('i', toast);
  
  msgEl.textContent = message;
  toast.className = `toast ${type}`;
  
  if (type === 'success') icon.className = 'fa-solid fa-circle-check';
  else if (type === 'error') icon.className = 'fa-solid fa-circle-xmark';
  else if (type === 'warning') icon.className = 'fa-solid fa-triangle-exclamation';

  // Force reflow
  void toast.offsetWidth;

  toast.classList.add('show');

  // Clear existing timeout if any
  if (toast._timeoutId) {
    clearTimeout(toast._timeoutId);
  }

  toast._timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, TOAST_DURATION_MS);
}
