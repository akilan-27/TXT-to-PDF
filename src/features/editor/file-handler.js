import AppState from '../../state/app-state.js';
import jschardet from 'jschardet';
import { showPrompt } from '../../components/modal.js';
import { wrapAsync } from '../../services/error-handler.js';

/**
 * Handle file upload and encoding detection.
 * @param {File} file - The file to process.
 * @returns {Promise<{content: string, encoding: string}>}
 */
export const handleFile = wrapAsync(async (file) => {
  return new Promise((resolve, reject) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return reject(new Error('File is too large. Maximum size is 10MB.'));
    }
    
    if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/') || file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      return reject(new Error('Unsupported file type. Please upload a text or Markdown file.'));
    }

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const buffer = e.target.result;
        const uint8Array = new Uint8Array(buffer);
        
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        
        const detected = jschardet.detect(binaryString);
        let encodingToUse = AppState.settings.encoding || 'utf-8';
        
        if (detected && detected.confidence > 0.6 && detected.encoding) {
          encodingToUse = detected.encoding;
        } else {
          const guess = detected?.encoding || 'None';
          const userChoice = await showPrompt(
            'Encoding Detection',
            `We couldn't confidently detect the encoding (Guess: ${guess}). Please enter encoding (e.g., utf-8, windows-1252):`,
            encodingToUse
          );
          if (userChoice) encodingToUse = userChoice;
        }

        AppState.settings.encoding = encodingToUse;
        AppState.saveSettings();

        const content = new TextDecoder(encodingToUse).decode(uint8Array);
        resolve({ content, encoding: encodingToUse });
        
      } catch (err) {
        reject(new Error(`Failed to decode file using ${AppState.settings.encoding}.`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}, 'File Decode');

/**
 * Handle multiple files by concatenating their contents.
 * @param {FileList|File[]} files
 * @returns {Promise<{content: string, encoding: string}>}
 */
export const handleFiles = wrapAsync(async (files) => {
  let combinedContent = '';
  let lastEncoding = 'utf-8';
  
  // Sort files by name for consistent ordering
  const fileArray = Array.from(files).sort((a, b) => a.name.localeCompare(b.name));
  
  for (const file of fileArray) {
    const { content, encoding } = await handleFile(file);
    if (combinedContent) {
      combinedContent += '\n\n---\n\n';
    }
    combinedContent += content;
    lastEncoding = encoding;
  }
  
  return { content: combinedContent, encoding: lastEncoding };
}, 'Multi-file Decode');
