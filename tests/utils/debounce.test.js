import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../../src/utils/debounce.js';

describe('debounce', () => {
  it('should only call the function once after delay', async () => {
    vi.useFakeTimers();
    
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    
    debounced();
    debounced();
    debounced();
    
    expect(fn).not.toBeCalled();
    
    vi.advanceTimersByTime(100);
    
    expect(fn).toBeCalledTimes(1);
    
    vi.useRealTimers();
  });
});
