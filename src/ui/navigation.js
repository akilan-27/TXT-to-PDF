import { MAIN_SECTIONS, LEGAL_SECTIONS } from '../utils/constants.js';
import { $, $$ } from '../utils/dom.js';

/**
 * Initialize scroll spy behavior for the navbar.
 */
export function initScrollSpy() {
  const sections = $$('section');
  const navLinks = $$('.nav-links a');

  window.addEventListener('scroll', () => {
    // Don't run scroll spy if a legal/about section is currently shown
    const anyLegalVisible = LEGAL_SECTIONS.some((id) => {
      const sec = $(`#${id}`);
      return sec && sec.style.display !== 'none' && sec.style.display !== '';
    });
    if (anyLegalVisible) return;

    let current = '';
    
    sections.forEach((section) => {
      if (section.style.display === 'none') return;
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) current = section.getAttribute('id');
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Initialize SPA navigation logic.
 */
export function initNavigation() {
  const navLinks = $$('.nav-links a');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href').substring(1);

      // Update active state immediately on click
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');

      if (LEGAL_SECTIONS.includes(targetId)) {
        // Hide main sections, hide all other legal sections, show target
        MAIN_SECTIONS.forEach((id) => {
          const sec = $(`#${id}`);
          if (sec) sec.style.display = 'none';
        });
        LEGAL_SECTIONS.forEach((id) => {
          const sec = $(`#${id}`);
          if (sec) sec.style.display = 'none';
        });
        const targetSec = $(`#${targetId}`);
        if (targetSec) targetSec.style.display = 'block';
        
        window.scrollTo(0, 0);
      } else {
        // Show all main sections, hide all legal sections
        LEGAL_SECTIONS.forEach((id) => {
          const sec = $(`#${id}`);
          if (sec) sec.style.display = 'none';
        });
        
        const home = $('#home');
        if (home) home.style.display = 'flex';
        
        MAIN_SECTIONS.filter(id => id !== 'home').forEach((id) => {
          const sec = $(`#${id}`);
          if (sec) sec.style.display = 'block';
        });

        // Scroll to the target section after showing all sections
        const targetSec = $(`#${targetId}`);
        if (targetSec) {
          setTimeout(() => {
            targetSec.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      }

      // Close mobile menu
      const navLinksMenu = $('#nav-links');
      if (navLinksMenu && navLinksMenu.classList.contains('show')) {
        navLinksMenu.classList.remove('show');
      }
    });
  });

  // Handle footer links
  const footerLinks = $$('footer a[href^="#"]');
  footerLinks.forEach((footerLink) => {
    footerLink.addEventListener('click', (e) => {
      const targetHref = footerLink.getAttribute('href');
      e.preventDefault();
      const navLink = $(`.nav-links a[href="${targetHref}"]`);
      if (navLink) navLink.click();
    });
  });
}

/**
 * Initialize intersection observers for scroll reveal animations.
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  $$('.scroll-reveal').forEach((el) => observer.observe(el));
}
