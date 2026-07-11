# Folder Structure

```
txt-to-pdf-pro/
├── public/                 # Static assets copied directly to dist/
│   ├── favicon.ico
│   ├── logo.png
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/                    # Source code
│   ├── components/         # Reusable UI widgets (Toast, Modal, Loader)
│   ├── features/           # Core domain logic
│   │   ├── editor/         # Textarea, file handling, drag-drop
│   │   ├── markdown/       # Markdown parsing (Marked + DOMPurify)
│   │   ├── pdf/            # Pagination engine and Export logic
│   │   └── preview/        # PDF viewer and zoom controls
│   ├── services/           # Wrappers around browser APIs (storage, errors)
│   ├── state/              # Centralized AppState
│   ├── styles/             # Modular CSS files
│   ├── ui/                 # App shell DOM logic (Nav, Settings, Theme)
│   ├── utils/              # Helper functions (DOM, constants, debounce)
│   ├── app.js              # Application bootstrapper
│   └── main.js             # Vite entry point
│
├── tests/                  # Vitest unit tests
├── docs/                   # Project documentation
├── index.html              # Main HTML shell (no inline styles/scripts)
└── package.json            # NPM dependencies and scripts
```
