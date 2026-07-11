/**
 * Page size definitions in millimeters.
 * @type {Object.<string, {width: number, height: number}>}
 */
export const PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a5: { width: 148, height: 210 },
};

/**
 * Default application settings.
 */
export const DEFAULTS = {
  theme: 'dark',
  format: 'a4',
  orientation: 'portrait',
  margin: 20,
  pageNumbers: true,
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  encoding: 'UTF-8',
  size: '12pt',
  spacing: '1.6',
  header: '',
  footer: '',
  watermark: '',
  author: '',
  title: '',
  keywords: '',
  subject: '',
};

/**
 * localStorage key names.
 */
export const STORAGE_KEYS = {
  theme: 'txt2pdf_theme',
  format: 'txt2pdf_format',
  orientation: 'txt2pdf_orientation',
  margin: 'txt2pdf_margin',
  pageNumbers: 'txt2pdf_page_numbers',
  font: 'txt2pdf_font',
  encoding: 'txt2pdf_encoding',
  size: 'txt2pdf_size',
  spacing: 'txt2pdf_spacing',
  rawMarkdown: 'txt2pdf_content_v2',
  header: 'txt2pdf_header',
  footer: 'txt2pdf_footer',
  watermark: 'txt2pdf_watermark',
  author: 'txt2pdf_author',
  title: 'txt2pdf_title',
  keywords: 'txt2pdf_keywords',
  subject: 'txt2pdf_subject',
};

/**
 * Debounce delay for editor input in milliseconds.
 */
export const DEBOUNCE_MS = 800;

/**
 * Toast notification display duration in milliseconds.
 */
export const TOAST_DURATION_MS = 3500;

/**
 * Main navigation section IDs.
 */
export const MAIN_SECTIONS = ['home', 'how-it-works', 'features', 'workspace', 'faq'];

/**
 * Additional (legal) section IDs that toggle visibility.
 */
export const LEGAL_SECTIONS = ['about', 'privacy', 'terms', 'disclaimer', 'contact'];

/**
 * Number of hero particles to generate.
 */
export const PARTICLE_COUNT = 60;

/**
 * Hero typing animation text lines.
 */
export const HERO_TEXT_LINES = [
  'Your files never leave your browser.',
  'Create beautiful PDFs instantly.',
  'Fast, secure, and completely free.',
];
