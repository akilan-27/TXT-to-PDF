import AppState from '../../state/app-state.js';
import { $ } from '../../utils/dom.js';
import { PAGE_SIZES } from '../../utils/constants.js';

export class ZoomController {
  constructor(viewerEl) {
    this.viewer = viewerEl;
    this.zoomLevelEl = $('#zoom-level');
    this.btnZoomIn = $('#zoom-in');
    this.btnZoomOut = $('#zoom-out');
    
    this.bindEvents();
  }

  bindEvents() {
    // Reduced zoom step from 0.1 to 0.05 for finer control
    this.btnZoomIn.addEventListener('click', () => this.setZoom(AppState.preview.zoom + 0.05));
    this.btnZoomOut.addEventListener('click', () => this.setZoom(AppState.preview.zoom - 0.05));

    this.viewer.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        // Finer zoom sensitivity for mouse wheel scrolling
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        this.setZoom(AppState.preview.zoom + delta);
      }
    }, { passive: false });
  }

  fitToScreen() {
    const viewerWidth = this.viewer.clientWidth;
    if (viewerWidth === 0) return;
    
    const targetWidthPx = viewerWidth - 80;
    const settings = AppState.settings;
    const ps = PAGE_SIZES[settings.format] || PAGE_SIZES.a4;
    let pw = ps.width;
    if (settings.orientation === 'landscape') {
      pw = ps.height;
    }
    const pageWidthPx = pw * 3.78;

    let level = targetWidthPx / pageWidthPx;
    level = Math.max(0.2, Math.min(level, 2.0));
    this.setZoom(level);
  }

  setZoom(level) {
    level = Math.max(0.2, Math.min(level, 3.0));
    AppState.preview.zoom = level;
    this.zoomLevelEl.innerText = `${Math.round(level * 100)}%`;

    const settings = AppState.settings;
    const ps = PAGE_SIZES[settings.format] || PAGE_SIZES.a4;
    let pw = ps.width;
    let ph = ps.height;
    if (settings.orientation === 'landscape') {
      pw = ps.height;
      ph = ps.width;
    }

    Array.from(this.viewer.children).forEach((wrapper) => {
      if (wrapper.classList.contains('page-wrapper')) {
        wrapper.style.width = `calc(${pw}mm * ${level})`;
        wrapper.style.height = `calc(${ph}mm * ${level})`;
        const page = wrapper.querySelector('.pdf-page-container');
        if (page) {
          page.style.transform = `scale(${level})`;
        }
      } else if (wrapper.classList.contains('pdf-page-container')) {
        wrapper.style.transform = `scale(${level})`;
      }
    });
  }
}
