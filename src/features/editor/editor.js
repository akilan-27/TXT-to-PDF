import AppState from '../../state/app-state.js';
import { $ } from '../../utils/dom.js';
import { debounce } from '../../utils/debounce.js';
import { DEBOUNCE_MS } from '../../utils/constants.js';
import { renderLineNumbers } from './line-numbers.js';
import { handleFiles } from './file-handler.js';
import { initDropzone } from './dropzone.js';
import { showConfirm } from '../../components/modal.js';

export class EditorController {
  constructor() {
    this.input = $('#markdown-input');
    this.lineNumbers = $('#line-numbers');
    this.emptyDropzone = $('#empty-dropzone');
    this.fileInput = $('#file-upload');
    this.btnClear = $('#btn-clear');
    this.btnFullscreen = $('#btn-fullscreen');
    this.encodingBadge = $('#encoding-badge');
    this._lastLineCount = 0;

    this.initEditor();
    this.bindEvents();
    initDropzone(this.emptyDropzone, (files) => this.handleFilesCallback(files));
  }

  initEditor() {
    this.input.value = AppState.content.rawMarkdown || '';
    this.updateEditorState();
    this.triggerUpdate();
  }

  bindEvents() {
    const debouncedUpdate = debounce(() => this.triggerUpdate(), DEBOUNCE_MS);

    this.input.addEventListener('input', () => {
      this.updateEditorState();
      debouncedUpdate();
    });

    this.input.addEventListener('scroll', () => {
      this.lineNumbers.scrollTop = this.input.scrollTop;
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.input.selectionStart;
        const end = this.input.selectionEnd;
        this.input.value = this.input.value.substring(0, start) + '    ' + this.input.value.substring(end);
        this.input.selectionStart = this.input.selectionEnd = start + 4;
        this.triggerUpdate();
      }
    });

    this.btnClear.addEventListener('click', async () => {
      if (await showConfirm('Clear Editor', 'Are you sure you want to clear the editor?')) {
        this.input.value = '';
        this.updateEditorState();
        this.triggerUpdate();
      }
    });

    if (this.btnFullscreen) {
      this.btnFullscreen.addEventListener('click', () => {
        const workspace = $('.workspace');
        if (workspace) {
          workspace.classList.toggle('fullscreen-mode');
          const icon = $('i', this.btnFullscreen);
          if (workspace.classList.contains('fullscreen-mode')) {
            icon.className = 'fa-solid fa-compress';
          } else {
            icon.className = 'fa-solid fa-expand';
          }
        }
      });
    }

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) this.handleFilesCallback(e.target.files);
    });

    this.emptyDropzone.addEventListener('click', (e) => {
      // Don't intercept clicks on the upload button itself
      if (!e.target.closest('button')) {
        this.input.focus();
      }
    });
  }

  updateEditorState() {
    this.updateDropzoneVisibility();
    this._lastLineCount = renderLineNumbers(this.input.value, this.lineNumbers, this._lastLineCount);
  }

  updateDropzoneVisibility() {
    if (this.input.value.trim().length === 0) {
      this.emptyDropzone.classList.remove('hidden-dropzone');
    } else {
      this.emptyDropzone.classList.add('hidden-dropzone');
    }
  }

  triggerUpdate() {
    AppState.saveContent(this.input.value);
    // Parse happens centrally via app.js event listener, but we emit the trigger
    document.dispatchEvent(new CustomEvent('editorContentChanged'));
  }

  async handleFilesCallback(files) {
    if (!files || files.length === 0) return;
    try {
      const { content, encoding } = await handleFiles(files);
      
      if (this.input.value.trim()) {
        const shouldMerge = await showConfirm(
          'Existing Content Found',
          'Your editor already contains text. Do you want to merge this file with the existing text, or clear the editor and open it as a new file?',
          { confirmText: 'Merge File', cancelText: 'Open New (Clear Old)' }
        );
        
        if (shouldMerge) {
          this.input.value += '\n\n---\n\n' + content;
        } else {
          this.input.value = content;
        }
      } else {
        this.input.value = content;
      }
      
      if (this.encodingBadge) {
        this.encodingBadge.style.display = 'inline-block';
        this.encodingBadge.innerText = encoding.toUpperCase();
      }
      
      this.updateEditorState();
      this.triggerUpdate();
    } catch (err) {
      // Handled internally by error-handler
    }
  }
}
