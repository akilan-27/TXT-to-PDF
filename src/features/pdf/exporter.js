import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AppState from '../../state/app-state.js';
import { PDFEngine } from './engine.js';
import { PAGE_SIZES } from '../../utils/constants.js';
import { showLoader, hideLoader } from '../../components/loader.js';
import { showToast } from '../../components/toast.js';
import { wrapAsync } from '../../services/error-handler.js';

export const generatePDF = wrapAsync(async () => {
  const html = AppState.content.parsedHTML;
  if (!html || !html.trim()) {
    showToast('Nothing to export.', 'warning');
    return;
  }

  showLoader('Generating PDF...');

  let exportWrapper = null;
  try {
    const settings = AppState.settings;
    const ps = PAGE_SIZES[settings.format] || PAGE_SIZES.a4;
    let pw = ps.width;
    let ph = ps.height;
    if (settings.orientation === 'landscape') {
      pw = ps.height;
      ph = ps.width;
    }

    const { wrapper } = await PDFEngine.createPages(html, settings);
    exportWrapper = wrapper;

    // Mount offscreen
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-99999px';
    wrapper.style.top = '0';
    wrapper.style.zIndex = '1';
    wrapper.style.background = 'transparent';
    wrapper.style.overflow = 'visible';
    document.body.appendChild(wrapper);
    
    await new Promise((r) => setTimeout(r, 120));

    const pageEls = wrapper.querySelectorAll('.pdf-page-container');
    const doc = new jsPDF({
      unit: 'mm',
      format: [pw, ph],
      orientation: settings.orientation || 'portrait',
      compress: true,
    });

    if (settings.title) doc.setProperties({ title: settings.title });
    if (settings.author) doc.setProperties({ author: settings.author });
    if (settings.subject) doc.setProperties({ subject: settings.subject });
    if (settings.keywords) doc.setProperties({ keywords: settings.keywords });

    for (let i = 0; i < pageEls.length; i++) {
      const pageDom = pageEls[i];

      const canvas = await html2canvas(pageDom, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (i > 0) doc.addPage([pw, ph], settings.orientation || 'portrait');
      doc.addImage(imgData, 'JPEG', 0, 0, pw, ph);
    }

    let filename = 'TXT_to_PDF.pdf';
    const raw = AppState.content.rawMarkdown || '';
    const h1Match = raw.match(/^#\s+(.+)$/m);
    
    if (settings.title) {
      filename = settings.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '.pdf';
    } else if (h1Match && h1Match[1].trim()) {
      filename = h1Match[1].trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '.pdf';
    }

    doc.save(filename);
    showToast('PDF exported successfully!', 'success');
  } finally {
    if (exportWrapper && exportWrapper.parentNode) {
      exportWrapper.remove();
    }
    hideLoader();
  }
}, 'PDF Export');
