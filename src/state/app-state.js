/**
 * Centralized application state management.
 */
import { storageGet, storageSet } from '../services/storage.js';
import { DEFAULTS, STORAGE_KEYS } from '../utils/constants.js';

/**
 * Application state singleton.
 * Emits 'stateChanged' custom events on the document when state updates.
 */
const AppState = {
  // ---- Theme ----
  theme: storageGet(STORAGE_KEYS.theme, DEFAULTS.theme),

  // ---- PDF / Export Settings ----
  settings: {
    format: storageGet(STORAGE_KEYS.format, DEFAULTS.format),
    orientation: storageGet(STORAGE_KEYS.orientation, DEFAULTS.orientation),
    margin: parseInt(storageGet(STORAGE_KEYS.margin, DEFAULTS.margin), 10),
    pageNumbers: storageGet(STORAGE_KEYS.pageNumbers, DEFAULTS.pageNumbers) !== 'false',
    font: storageGet(STORAGE_KEYS.font, DEFAULTS.font),
    encoding: storageGet(STORAGE_KEYS.encoding, DEFAULTS.encoding),
    size: storageGet(STORAGE_KEYS.size, DEFAULTS.size),
    spacing: storageGet(STORAGE_KEYS.spacing, DEFAULTS.spacing),
    header: storageGet(STORAGE_KEYS.header, DEFAULTS.header),
    footer: storageGet(STORAGE_KEYS.footer, DEFAULTS.footer),
    watermark: storageGet(STORAGE_KEYS.watermark, DEFAULTS.watermark),
    author: storageGet(STORAGE_KEYS.author, DEFAULTS.author),
    title: storageGet(STORAGE_KEYS.title, DEFAULTS.title),
    keywords: storageGet(STORAGE_KEYS.keywords, DEFAULTS.keywords),
    subject: storageGet(STORAGE_KEYS.subject, DEFAULTS.subject),
  },

  // ---- Document Content ----
  content: {
    rawMarkdown: storageGet(STORAGE_KEYS.rawMarkdown, ''),
    parsedHTML: '',
  },

  // ---- Preview State ----
  preview: {
    zoom: 1.0,
    totalPages: 1,
  },

  // ---- Persist Settings ----
  saveSettings() {
    storageSet(STORAGE_KEYS.theme, this.theme);
    storageSet(STORAGE_KEYS.format, this.settings.format);
    storageSet(STORAGE_KEYS.orientation, this.settings.orientation);
    storageSet(STORAGE_KEYS.margin, this.settings.margin);
    storageSet(STORAGE_KEYS.pageNumbers, this.settings.pageNumbers);
    storageSet(STORAGE_KEYS.font, this.settings.font);
    storageSet(STORAGE_KEYS.encoding, this.settings.encoding);
    storageSet(STORAGE_KEYS.size, this.settings.size);
    storageSet(STORAGE_KEYS.spacing, this.settings.spacing);
    storageSet(STORAGE_KEYS.header, this.settings.header);
    storageSet(STORAGE_KEYS.footer, this.settings.footer);
    storageSet(STORAGE_KEYS.watermark, this.settings.watermark);
    storageSet(STORAGE_KEYS.author, this.settings.author);
    storageSet(STORAGE_KEYS.title, this.settings.title);
    storageSet(STORAGE_KEYS.keywords, this.settings.keywords);
    storageSet(STORAGE_KEYS.subject, this.settings.subject);
  },

  // ---- Persist Content ----
  saveContent(markdown) {
    this.content.rawMarkdown = markdown;
    storageSet(STORAGE_KEYS.rawMarkdown, markdown);
  },
};

export default AppState;
