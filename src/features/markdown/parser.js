import { marked } from 'marked';
import DOMPurify from 'dompurify';
import AppState from '../../state/app-state.js';

export class MarkdownParser {
  /**
   * Parse markdown string to HTML.
   * @param {string} rawText - Markdown text.
   * @returns {string} Sanitized HTML.
   */
  parse(rawText) {
    // Fix for marked v12: simple parse without options causing TypeError
    const text = rawText.replace(/\\([#*_\-~>`!])/g, '$1');
    let html = '';
    
    try {
      html = marked.parse(text, { breaks: true, gfm: true });
    } catch (e) {
      // Silent error handling
    }
    
    if (typeof DOMPurify !== 'undefined') {
      html = DOMPurify.sanitize(html, { 
        ADD_ATTR: ['class', 'type', 'checked', 'disabled'] 
      });
    }
    
    AppState.content.parsedHTML = html;
    return html;
  }
}
