import { expect, afterEach } from 'vitest';

// Clear localStorage after each test
afterEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});
