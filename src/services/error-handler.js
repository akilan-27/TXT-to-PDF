/**
 * Centralized error handling service.
 */
import { showToast } from '../components/toast.js';

/**
 * Handle an error with logging and user notification.
 * @param {Error} error - The error object.
 * @param {string} [context=''] - Description of what was happening when the error occurred.
 */
export function handleError(error, context = '') {
  const message = context ? `${context}: ${error.message}` : error.message;
  // Silenced for production
  showToast(getUserMessage(context), 'error');
}

/**
 * Get a user-friendly message for an error context.
 * @param {string} context - Error context.
 * @returns {string} User-friendly message.
 */
function getUserMessage(context) {
  const messages = {
    'PDF Export': 'PDF generation failed. Please try again.',
    'File Upload': 'Could not read the file. Please try a different file.',
    'File Decode': 'Failed to decode the file. Try a different encoding.',
    'Multi-file Decode': 'Failed to decode one or more files. Try a different encoding.',
    'Markdown Parse': 'There was an issue rendering the markdown.',
    'Settings Save': 'Could not save settings.',
  };
  return messages[context] || 'Something went wrong. Please try again.';
}

/**
 * Wrap an async function with error handling.
 * @param {Function} fn - Async function to wrap.
 * @param {string} [context=''] - Error context for logging.
 * @returns {Function} Wrapped function.
 */
export function wrapAsync(fn, context = '') {
  return async function (...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      handleError(error, context);
    }
  };
}
