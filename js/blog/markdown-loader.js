// Markdown Loader
// Fetches a .md file from test-markdown/, converts it to HTML via marked.js,
// and returns the HTML string (optionally inserting it into the page).

/**
 * Convert a markdown string to HTML.
 * @param {string} md - Raw markdown text
 * @returns {string} HTML string
 */
function markdownToHtml(md) {
  if (typeof marked === 'undefined') {
    throw new Error('marked.js is not loaded. Include <script src="/js/marked.js"></script> before this script.');
  }
  return marked.parse(md);
}

/**
 * Load a markdown file from test-markdown/, convert to HTML, and optionally insert it.
 * @param {string} mdPath - Path to the markdown file (e.g. 'test-markdown/sample.md')
 * @param {string|Element|null} target - CSS selector string, DOM element, or null to just return HTML
 * @returns {Promise<string>} Resolves with the HTML string
 */
async function loadMarkdown(mdPath, target = null) {
  const response = await fetch(mdPath);
  if (!response.ok) {
    throw new Error(`Failed to load ${mdPath}: ${response.status} ${response.statusText}`);
  }
  const mdText = await response.text();
  const html = markdownToHtml(mdText);

  if (target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.innerHTML = html;
    }
  }

  return html;
}

// Expose on window for use in HTML
window.markdownLoader = {
  markdownToHtml,
  loadMarkdown
};
