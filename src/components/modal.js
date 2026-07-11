import { createElement, $ } from '../utils/dom.js';

let modalBackdrop = null;

/**
 * Initialize the modal container if it doesn't exist.
 */
function initModal() {
  if (modalBackdrop) return;
  
  modalBackdrop = createElement('div', { className: 'modal-backdrop' }, [
    createElement('div', { className: 'modal' }, [
      createElement('h3', { className: 'modal-title' }),
      createElement('div', { className: 'modal-body' }),
      createElement('div', { className: 'modal-actions' })
    ])
  ]);
  
  document.body.appendChild(modalBackdrop);
}

/**
 * Show a confirmation modal (replaces window.confirm).
 * @param {string} title - The title of the modal.
 * @param {string} message - The message body.
 * @param {Object} [options] - Options for customizing the modal.
 * @param {string} [options.confirmText='Confirm'] - Text for the confirm button.
 * @param {string} [options.cancelText='Cancel'] - Text for the cancel button.
 * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled.
 */
export function showConfirm(title, message, options = {}) {
  const { confirmText = 'Confirm', cancelText = 'Cancel' } = options;
  return new Promise((resolve) => {
    initModal();
    
    const titleEl = $('.modal-title', modalBackdrop);
    const bodyEl = $('.modal-body', modalBackdrop);
    const actionsEl = $('.modal-actions', modalBackdrop);
    
    titleEl.textContent = title;
    bodyEl.textContent = message;
    
    // Clear previous actions
    actionsEl.innerHTML = '';
    
    const cancelBtn = createElement('button', { className: 'btn btn-secondary', textContent: cancelText });
    const confirmBtn = createElement('button', { className: 'btn btn-primary', textContent: confirmText });
    
    const cleanup = (result) => {
      modalBackdrop.classList.remove('active');
      resolve(result);
    };
    
    cancelBtn.addEventListener('click', () => cleanup(false));
    confirmBtn.addEventListener('click', () => cleanup(true));
    
    actionsEl.appendChild(cancelBtn);
    actionsEl.appendChild(confirmBtn);
    
    modalBackdrop.classList.add('active');
    confirmBtn.focus();
  });
}

/**
 * Show a prompt modal (replaces window.prompt).
 * @param {string} title - The title of the modal.
 * @param {string} message - The message body.
 * @param {string} [defaultValue=''] - The default input value.
 * @returns {Promise<string|null>} Resolves to the input string, or null if cancelled.
 */
export function showPrompt(title, message, defaultValue = '') {
  return new Promise((resolve) => {
    initModal();
    
    const titleEl = $('.modal-title', modalBackdrop);
    const bodyEl = $('.modal-body', modalBackdrop);
    const actionsEl = $('.modal-actions', modalBackdrop);
    
    titleEl.textContent = title;
    
    // Clear previous body/actions
    bodyEl.innerHTML = '';
    actionsEl.innerHTML = '';
    
    const msgEl = createElement('p', { textContent: message });
    const inputEl = createElement('input', { type: 'text', className: 'modal-input', value: defaultValue });
    
    bodyEl.appendChild(msgEl);
    bodyEl.appendChild(inputEl);
    
    const cancelBtn = createElement('button', { className: 'btn btn-secondary', textContent: 'Cancel' });
    const confirmBtn = createElement('button', { className: 'btn btn-primary', textContent: 'OK' });
    
    const cleanup = (result) => {
      modalBackdrop.classList.remove('active');
      resolve(result);
    };
    
    cancelBtn.addEventListener('click', () => cleanup(null));
    confirmBtn.addEventListener('click', () => cleanup(inputEl.value));
    
    // Handle Enter key in input
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') cleanup(inputEl.value);
      if (e.key === 'Escape') cleanup(null);
    });
    
    actionsEl.appendChild(cancelBtn);
    actionsEl.appendChild(confirmBtn);
    
    modalBackdrop.classList.add('active');
    inputEl.focus();
    inputEl.select();
  });
}
