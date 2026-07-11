import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../../../src/features/markdown/parser.js';

describe('MarkdownParser', () => {
  const parser = new MarkdownParser();

  it('should parse basic markdown', () => {
    const html = parser.parse('# Heading');
    expect(html).toContain('<h1>Heading</h1>');
  });

  it('should parse GFM tables', () => {
    const markdown = `
| A | B |
|---|---|
| 1 | 2 |
    `.trim();
    const html = parser.parse(markdown);
    expect(html).toContain('<table>');
    expect(html).toContain('<th>A</th>');
  });

  it('should sanitize HTML', () => {
    const html = parser.parse('<script>alert(1)</script>\n# Safe');
    expect(html).not.toContain('<script>');
    expect(html).toContain('<h1>Safe</h1>');
  });
});
