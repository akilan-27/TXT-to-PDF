# Architecture

TXT to PDF Pro is built as a single-page application (SPA) using vanilla JavaScript and Vite.

## Core Concepts

### 1. State Management
All application state is centralized in `src/state/app-state.js`.
- Components read from this state.
- Changes to settings emit a `settingsChanged` event on `document`.
- Changes to editor content emit an `editorContentChanged` event.

### 2. Module Boundaries
- **Features (`src/features/`)**: Contain the core business logic (Editor, PDF Engine, Markdown Parser).
- **UI (`src/ui/`)**: Handle DOM interactions for the app shell (Navigation, Settings, Theme).
- **Components (`src/components/`)**: Reusable, stateless UI widgets (Toast, Modal, Loader).
- **Services (`src/services/`)**: Wrappers for external APIs (localStorage, Error handling).

### 3. Data Flow
1. User types in `EditorController`.
2. Controller triggers `editorContentChanged`.
3. `MarkdownParser` receives event, parses raw text to HTML via Marked + DOMPurify, stores in `AppState`.
4. `PDFPreviewer` receives event, reads HTML from `AppState`, passes to `PDFEngine`.
5. `PDFEngine` calculates block heights, groups elements, handles pagination, returns page DOM nodes.
6. `PDFPreviewer` mounts page DOM nodes for display.
7. User clicks Export.
8. `generatePDF()` calls `html2canvas` on each mounted page node, creates a `jsPDF` instance, and triggers download.

### 4. Styling Strategy
- Vanilla CSS with custom properties (`variables.css`).
- BEM-like naming conventions.
- No Tailwind or heavy CSS frameworks to maintain a small footprint.
