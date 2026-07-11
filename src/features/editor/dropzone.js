/**
 * Initialize drag-and-drop events for a dropzone.
 * @param {Element} dropzoneEl - The dropzone container.
 * @param {Function} onFileDrop - Callback function when a file is dropped.
 */
export function initDropzone(dropzoneEl, onFileDrop) {
  if (!dropzoneEl) return;

  dropzoneEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzoneEl.classList.add('dragover');
  });

  dropzoneEl.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropzoneEl.classList.remove('dragover');
  });

  dropzoneEl.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzoneEl.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  });
}
