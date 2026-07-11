import { $ } from '../../utils/dom.js';

/**
 * Update the line numbers based on text content.
 * @param {string} text - The editor content.
 * @param {Element} container - The line numbers container element.
 * @param {number} lastCount - The previous line count to avoid unnecessary DOM updates.
 * @returns {number} The new line count.
 */
export function renderLineNumbers(text, container, lastCount) {
  const lines = text.split('\n').length;
  
  // Update Word/Char count in status bar
  const countEl = $('#word-count');
  if (countEl) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    countEl.innerHTML = `Words: ${words} &nbsp;|&nbsp; Characters: ${text.length}`;
  }
  
  if (lastCount === lines) return lastCount;
  
  let numbersHTML = '';
  const maxLines = Math.max(1, lines);
  for (let i = 1; i <= maxLines; i++) {
    numbersHTML += `<div class="line-number-cell">${i}</div>`;
  }
  
  container.innerHTML = numbersHTML;
  return lines;
}
