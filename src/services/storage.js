/**
 * localStorage service wrapper with JSON support.
 */

/**
 * Get a value from localStorage.
 * @param {string} key - Storage key.
 * @param {*} [defaultValue=null] - Default if key not found.
 * @returns {*} Parsed value or default.
 */
export function storageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    // Try parsing as JSON; fall back to raw string
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Set a value in localStorage.
 * @param {string} key - Storage key.
 * @param {*} value - Value to store (will be serialized if not string).
 */
export function storageSet(key, value) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e) {
    // Silent fail
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key - Storage key.
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // Silent fail
  }
}

/**
 * Clear all localStorage.
 */
export function storageClear() {
  try {
    localStorage.clear();
  } catch (e) {
    // Silent fail
  }
}
