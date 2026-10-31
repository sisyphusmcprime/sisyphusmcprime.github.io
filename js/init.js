// Auto-loader for all JS files in the js/ folder
// Dynamically adds each file as a <script> tag so they run as if
// referenced directly in the HTML, from any page on the site.
(function() {
  var jsFiles = [
    '/js/blog/marked.js',
    '/js/home/matrix.js',
    '/js/blog/markdown-loader.js',
    // Add more files here as you create them under js/
  ];

  var loaded = 0;
  jsFiles.forEach(function(src) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      loaded++;
      console.log('[init.js] Loaded:', src);
      if (loaded === jsFiles.length) {
        window.dispatchEvent(new Event('init:loaded'));
      }
    };
    script.onerror = function() { console.error('[init.js] Failed to load:', src); };
    document.head.appendChild(script);
  });
})();
