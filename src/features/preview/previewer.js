import AppState from '../../state/app-state.js';
import { PDFEngine } from '../pdf/engine.js';
import { ZoomController } from './zoom.js';
import { $, createElement } from '../../utils/dom.js';
import { wrapAsync } from '../../services/error-handler.js';

export class PDFPreviewer {
  constructor() {
    this.viewer = $('#pdf-viewer');
    this.initialFitDone = false;
    this.zoomController = new ZoomController(this.viewer);
    
    this.bindEvents();
    
    window.addEventListener('resize', () => {
      if (this.viewer.clientWidth > 0 && !this.initialFitDone) {
        this.zoomController.fitToScreen();
        this.initialFitDone = true;
      }
    });
  }

  bindEvents() {
    document.addEventListener('editorContentChanged', () => this.render());
    document.addEventListener('settingsChanged', () => this.render());
  }

  render = wrapAsync(async () => {
    const html = AppState.content.parsedHTML;
    if (!html.trim()) {
      this.viewer.innerHTML = '';
      const emptyPage = createElement('div', {
        className: 'pdf-page-container page-shadow',
        style: {
          transform: `scale(${AppState.preview.zoom})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          transformOrigin: 'top center',
          margin: '0 auto'
        }
      }, [
        createElement('p', {
          style: { color: '#999', fontFamily: 'var(--font-sans)' },
          textContent: 'Document preview will appear here.'
        })
      ]);
      this.viewer.appendChild(emptyPage);
      return;
    }

    const { wrapper, totalPages } = await PDFEngine.createPages(html, AppState.settings);
    
    AppState.preview.totalPages = totalPages;
    this.viewer.innerHTML = '';
    
    const pageCountEl = $('#page-count');
    if (pageCountEl) pageCountEl.textContent = `Pages: ${totalPages}`;

    Array.from(wrapper.children).forEach((page) => {
      const pageWrapper = createElement('div', { className: 'page-wrapper fade-in page-shadow' });
      
      page.style.transformOrigin = 'top left';
      page.style.margin = '0';
      page.classList.remove('page-shadow');
      
      pageWrapper.appendChild(page);
      this.viewer.appendChild(pageWrapper);
    });

    if (!this.initialFitDone && this.viewer.clientWidth > 0) {
      this.zoomController.fitToScreen();
      this.initialFitDone = true;
    } else {
      this.zoomController.setZoom(AppState.preview.zoom);
    }
  }, 'PDF Preview Render');
}
