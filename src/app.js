import AppState from './state/app-state.js';
import { initTheme } from './ui/theme.js';
import { initNavigation, initScrollSpy, initScrollReveal } from './ui/navigation.js';
import { initSettingsDrawer } from './ui/settings.js';
import { EditorController } from './features/editor/editor.js';
import { MarkdownParser } from './features/markdown/parser.js';
import { PDFPreviewer } from './features/preview/previewer.js';
import { generatePDF } from './features/pdf/exporter.js';
import { $, createElement } from './utils/dom.js';
import { PARTICLE_COUNT, HERO_TEXT_LINES } from './utils/constants.js';

export function initApp() {
  // 1. Core UI Init
  initTheme();
  initSettingsDrawer();
  initNavigation();
  initScrollSpy();
  initScrollReveal();

  // 2. Feature Controllers
  const parser = new MarkdownParser();

  // Central event router for parser (must be bound before Previewer)
  document.addEventListener('editorContentChanged', () => {
    parser.parse(AppState.content.rawMarkdown);
  });

  new PDFPreviewer(); // listens to 'editorContentChanged' and 'settingsChanged'
  new EditorController(); // triggers 'editorContentChanged'

  // Export binding
  const btnExport = $('#btn-export');
  if (btnExport) {
    btnExport.addEventListener('click', generatePDF);
  }

  // Hero animations
  generateParticles();
  startTypingAnimation();
  
  // Navbar scroll listener
  const navbar = $('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  // Mobile Tabs Logic
  const mobileTabs = document.querySelectorAll('.mobile-tab');
  const workspace = $('.workspace');
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state on buttons
      mobileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Toggle workspace view class
      const target = tab.getAttribute('data-target');
      if (target === 'preview-panel') {
        workspace.classList.add('show-preview');
        // Force re-render of preview when switched to it
        document.dispatchEvent(new CustomEvent('editorContentChanged'));
      } else {
        workspace.classList.remove('show-preview');
      }
    });
  });

  // Cookie Consent Logic
  const cookieBanner = $('#cookie-banner');
  const btnAcceptCookies = $('#btn-accept-cookies');
  if (cookieBanner && btnAcceptCookies) {
    if (!localStorage.getItem('cookies-accepted')) {
      cookieBanner.style.display = 'flex';
    }
    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // Initial trigger to render PDF preview if there's saved content
  if (AppState.content.rawMarkdown) {
    document.dispatchEvent(new CustomEvent('editorContentChanged'));
  }

  // Reveal UI after initialization to prevent FOUC
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
}

function generateParticles() {
  const container = $('.hero-particles');
  if (!container) return;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = createElement('div', { className: 'particle' });
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = Math.random() * 10 + 10 + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(p);
  }
}

function startTypingAnimation() {
  const typedEl = $('#hero-desc');
  if (!typedEl) return;

  // Add transition for smooth fade
  typedEl.style.transition = 'opacity 0.4s ease';

  let lineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let text = '';
  let isPaused = false;

  function type() {
    if (isPaused) return;

    const currentLine = HERO_TEXT_LINES[lineIdx];

    if (isDeleting) {
      // Fade out as we near end of deletion
      if (charIdx <= 3) {
        typedEl.style.opacity = (charIdx / 3).toString();
      }
      text = currentLine.substring(0, charIdx - 1);
      charIdx--;
    } else {
      // Fade in as new text starts appearing
      if (charIdx <= 3) {
        typedEl.style.opacity = Math.min(1, charIdx / 3 + 0.3).toString();
      } else {
        typedEl.style.opacity = '1';
      }
      text = currentLine.substring(0, charIdx + 1);
      charIdx++;
    }

    typedEl.textContent = text;

    // Natural typing speed variation
    let typeSpeed;
    if (isDeleting) {
      typeSpeed = 18 + Math.random() * 10; // faster delete
    } else {
      typeSpeed = 55 + Math.random() * 35; // natural typing rhythm
    }

    if (!isDeleting && text === currentLine) {
      // Pause at end before deleting
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && text === '') {
      isDeleting = false;
      lineIdx = (lineIdx + 1) % HERO_TEXT_LINES.length;
      charIdx = 0;
      // Longer pause before next line
      typeSpeed = 600;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1200);
}

