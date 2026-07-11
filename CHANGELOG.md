# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-08

### Added
- Vite build system
- ESLint, Prettier, and EditorConfig
- Vitest unit testing framework
- GitHub Actions CI pipeline
- Centralized `AppState` and `storage` modules
- Reusable `modal` component (replacing `confirm`/`prompt`)
- `debounce` utility for editor performance
- Accessibility fixes (skip-to-content, aria-expanded, prefers-reduced-motion)
- Highlight.js CSS theme for proper code block styling

### Changed
- Refactored single-file monolith (`index.html`) into modular architecture (~50 files)
- Migrated all CDN dependencies to npm packages
- Extracted 316 lines of inline CSS into 9 modular CSS files
- Extracted 865 lines of inline JavaScript into ES modules
- Consolidated CSS custom properties (tokens) into `variables.css`
- Improved error handling with user-friendly toast messages

### Removed
- `gsap` dependency (was loaded via CDN but never used)
- Unused `.empty-dropzone-inner` DOM element and styles
- Dead code branch in PDF pagination engine
