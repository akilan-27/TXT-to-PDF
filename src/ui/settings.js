import AppState from '../state/app-state.js';
import { $ } from '../utils/dom.js';

/**
 * Initialize the settings drawer UI and bind state changes.
 */
export function initSettingsDrawer() {
  const btnSettings = $('#btn-settings');
  const drawer = $('#settings-drawer');
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');

  // Load state into DOM
  const optFormat = $('#opt-format');
  const optOrientation = $('#opt-orientation');
  const optMargin = $('#opt-margin');
  const optPageNumbers = $('#opt-page-numbers');
  const optFont = $('#opt-font');
  const optSize = $('#opt-size');
  const optSpacing = $('#opt-spacing');
  const optHeader = $('#opt-header');
  const optFooter = $('#opt-footer');
  const optWatermark = $('#opt-watermark');
  const optAuthor = $('#opt-author');
  const optTitle = $('#opt-title');

  if (optFormat) optFormat.value = AppState.settings.format;
  if (optOrientation) optOrientation.value = AppState.settings.orientation;
  if (optMargin) optMargin.value = AppState.settings.margin;
  if (optPageNumbers) optPageNumbers.value = AppState.settings.pageNumbers;
  if (optFont) optFont.value = AppState.settings.font;
  if (optSize) optSize.value = AppState.settings.size;
  if (optSpacing) optSpacing.value = AppState.settings.spacing;
  if (optHeader) optHeader.value = AppState.settings.header;
  if (optFooter) optFooter.value = AppState.settings.footer;
  if (optWatermark) optWatermark.value = AppState.settings.watermark;
  if (optAuthor) optAuthor.value = AppState.settings.author;
  if (optTitle) optTitle.value = AppState.settings.title;

  const toggleDrawer = () => {
    if (drawer) {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        btnSettings.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('open');
        btnSettings.setAttribute('aria-expanded', 'true');
      }
    }
  };

  if (btnSettings) {
    btnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  }

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (
      drawer &&
      drawer.classList.contains('open') &&
      !drawer.contains(e.target) &&
      e.target !== btnSettings &&
      !btnSettings.contains(e.target)
    ) {
      drawer.classList.remove('open');
      btnSettings.setAttribute('aria-expanded', 'false');
    }
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const expanded = navLinks.classList.contains('show');
      menuToggle.setAttribute('aria-expanded', expanded.toString());
    });
  }

  // Bind setting changes
  [optFormat, optOrientation, optMargin, optPageNumbers, optFont, optSize, optSpacing, optHeader, optFooter, optWatermark, optAuthor, optTitle].forEach((el) => {
    if (el) {
      el.addEventListener('change', (e) => {
        let val = e.target.value;
        if (val === 'true') val = true;
        if (val === 'false') val = false;

        let key = e.target.id.replace('opt-', '');
        if (key === 'page-numbers') key = 'pageNumbers';

        AppState.settings[key] = val;
        AppState.saveSettings();
        
        // Dispatch custom event for previewer
        document.dispatchEvent(new CustomEvent('settingsChanged'));
      });
    }
  });
}
