import hljs from 'highlight.js';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import { PAGE_SIZES } from '../../utils/constants.js';
import { createElement } from '../../utils/dom.js';

export const PDFEngine = {
  /** Measure how many CSS pixels equal one millimetre on this display. */
  _pxPerMm() {
    const r = createElement('div', {
      style: {
        width: '100mm',
        height: '0',
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
      },
    });
    document.body.appendChild(r);
    const v = r.getBoundingClientRect().width / 100;
    document.body.removeChild(r);
    return v;
  },

  /**
   * Paginate rendered HTML into self-contained page DOM nodes.
   */
  async createPages(html, settings) {
    const ps = PAGE_SIZES[settings.format] || PAGE_SIZES.a4;
    let pw = ps.width;
    let ph = ps.height;
    if (settings.orientation === 'landscape') {
      pw = ps.height;
      ph = ps.width;
    }

    const margin = parseInt(settings.margin, 10) || 20;
    const cwMm = pw - margin * 2;
    const chMm = ph - margin * 2;
    const pxMm = this._pxPerMm();
    const chPx = chMm * pxMm;
    const font = settings.font || 'var(--font-sans)';
    const size = settings.size || '12pt';
    const spacing = settings.spacing || '1.6';

    /* ---- hidden measurer ---- */
    const m = createElement('div', {
      className: 'markdown-body',
      style: {
        width: `${cwMm}mm`,
        fontFamily: font,
        fontSize: size,
        lineHeight: spacing,
        position: 'absolute',
        visibility: 'hidden',
        top: '-99999px',
        left: '0',
        color: 'black',
        background: 'white',
        textAlign: 'left',
        padding: '0',
        margin: '0',
      },
      innerHTML: html,
    });

    // Apply syntax highlighting
    m.querySelectorAll('pre code').forEach((b) => hljs.highlightElement(b));

    // Apply KaTeX Math rendering
    renderMathInElement(m, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
    
    document.body.appendChild(m);

    // Wait for any images to finish loading
    const imgs = m.querySelectorAll('img');
    if (imgs.length) {
      await Promise.all(
        Array.from(imgs).map((i) =>
          i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; })
        )
      );
    }
    await new Promise((r) => setTimeout(r, 60)); // reflow

    // Wrap bare text-nodes in <p>
    Array.from(m.childNodes).forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
        const p = document.createElement('p');
        m.replaceChild(p, n);
        p.appendChild(n);
      }
    });

    const children = Array.from(m.children);
    if (children.length === 0) {
      document.body.removeChild(m);
      return this._emptyPage(pw, ph, margin, font, size, spacing);
    }

    /* ---- measure blocks ---- */
    const cTop = m.getBoundingClientRect().top;
    const blocks = children.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        node: el,
        top: r.top - cTop,
        bottom: r.bottom - cTop,
        isHeading: /^H[1-6]$/.test(el.tagName),
      };
    });
    document.body.removeChild(m);

    /* ---- paginate ---- */
    const pages = [];
    let cur = [];
    let base = 0;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];

      if (cur.length === 0) {
        cur.push(i);
        base = b.top;
      } else if (b.bottom - base <= chPx + 1) {
        cur.push(i);
      } else {
        pages.push(cur);
        cur = [i];
        base = b.top;
      }

      /* Orphan-heading prevention */
      if (
        b.isHeading &&
        cur.length >= 1 &&
        cur[cur.length - 1] === i &&
        i + 1 < blocks.length
      ) {
        const nxt = blocks[i + 1];
        if (nxt.bottom - base > chPx + 1 && cur.length > 1) {
          cur.pop();
          pages.push(cur);
          cur = [i];
          base = b.top;
        }
      }
    }
    if (cur.length) pages.push(cur);

    if (pages.length === 0) {
      return this._emptyPage(pw, ph, margin, font, size, spacing);
    }

    const total = pages.length;

    /* ---- build page DOM ---- */
    const wrapper = document.createElement('div');
    wrapper.style.width = `${pw}mm`;

    pages.forEach((idxs, pi) => {
      const pc = createElement('div', {
        className: 'pdf-page-container',
        style: {
          width: `${pw}mm`,
          height: `${ph}mm`,
          background: 'white',
          position: 'relative',
          overflow: 'hidden',
          pageBreakAfter: 'always',
          boxSizing: 'border-box',
        }
      });

      const ca = createElement('div', {
        className: 'markdown-body',
        style: {
          position: 'absolute',
          top: `${margin}mm`,
          left: `${margin}mm`,
          right: `${margin}mm`,
          bottom: `${margin}mm`,
          overflow: 'hidden',
          background: 'white',
          fontFamily: font,
          fontSize: size,
          lineHeight: spacing,
          color: 'black',
          textAlign: 'left',
        }
      });

      idxs.forEach((idx) => ca.appendChild(blocks[idx].node.cloneNode(true)));
      pc.appendChild(ca);

      if (settings.pageNumbers) {
        const pn = createElement('div', {
          style: {
            position: 'absolute',
            bottom: `${margin / 2}mm`,
            left: '0',
            width: '100%',
            textAlign: 'center',
            fontSize: '9pt',
            color: '#888',
            fontFamily: font,
          },
          textContent: `Page ${pi + 1} of ${total}`,
        });
        pc.appendChild(pn);
      }

      if (settings.header) {
        const hd = createElement('div', {
          style: {
            position: 'absolute',
            top: `${margin / 2}mm`,
            left: `${margin}mm`,
            right: `${margin}mm`,
            textAlign: 'right',
            fontSize: '9pt',
            color: '#888',
            fontFamily: font,
          },
          textContent: settings.header,
        });
        pc.appendChild(hd);
      }

      if (settings.footer) {
        const ft = createElement('div', {
          style: {
            position: 'absolute',
            bottom: `${margin / 2}mm`,
            left: `${margin}mm`,
            textAlign: 'left',
            fontSize: '9pt',
            color: '#888',
            fontFamily: font,
          },
          textContent: settings.footer,
        });
        pc.appendChild(ft);
      }

      if (settings.watermark) {
        const wm = createElement('div', {
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontSize: '80pt',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.05)',
            fontFamily: font,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: '0'
          },
          textContent: settings.watermark,
        });
        pc.appendChild(wm);
      }

      wrapper.appendChild(pc);
    });

    return { wrapper, totalPages: total };
  },

  _emptyPage(pw, ph, margin, font, size, spacing) {
    const wrapper = document.createElement('div');
    wrapper.style.width = `${pw}mm`;

    const pc = createElement('div', {
      className: 'pdf-page-container',
      style: {
        width: `${pw}mm`,
        height: `${ph}mm`,
        background: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }
    });

    const ca = createElement('div', {
      className: 'markdown-body',
      style: {
        position: 'absolute',
        top: `${margin}mm`,
        left: `${margin}mm`,
        right: `${margin}mm`,
        bottom: `${margin}mm`,
        overflow: 'hidden',
        background: 'white',
        fontFamily: font,
        fontSize: size,
        lineHeight: spacing,
        color: 'black',
        textAlign: 'left',
      }
    });

    pc.appendChild(ca);
    wrapper.appendChild(pc);
    return { wrapper, totalPages: 1 };
  },
};
