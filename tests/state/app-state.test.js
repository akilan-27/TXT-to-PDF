import { describe, it, expect, beforeEach } from 'vitest';
import AppState from '../../src/state/app-state.js';
import { STORAGE_KEYS, DEFAULTS } from '../../src/utils/constants.js';

describe('AppState', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset state
    AppState.theme = DEFAULTS.theme;
    AppState.settings.format = DEFAULTS.format;
    AppState.content.rawMarkdown = '';
  });

  it('should initialize with default values', () => {
    expect(AppState.theme).toBe(DEFAULTS.theme);
    expect(AppState.settings.format).toBe(DEFAULTS.format);
  });

  it('should save and load settings from localStorage', () => {
    AppState.theme = 'light';
    AppState.settings.format = 'letter';
    
    AppState.saveSettings();
    
    expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('light');
    expect(localStorage.getItem(STORAGE_KEYS.format)).toBe('letter');
  });

  it('should save and load content from localStorage', () => {
    const text = '# Hello World';
    AppState.saveContent(text);
    
    expect(AppState.content.rawMarkdown).toBe(text);
    expect(localStorage.getItem(STORAGE_KEYS.rawMarkdown)).toBe(text);
  });
});
