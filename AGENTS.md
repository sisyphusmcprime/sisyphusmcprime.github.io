# sisyphusmcprime.github.io

GitHub Pages site (Sass + Bootstrap + vanilla JS). No test suite, no deploy step — GitHub Pages serves `main`.

## Build CSS

```
npm run build:css
# or: ./build-css.sh
```

Compiles `css/sass/**/*.scss` → `css/pages/*.css` (Dart Sass). The build script **does not** clean `css/pages/*.css` (its `rm -rf css/*.css` glob doesn't match subdirectories), so stale CSS can linger.

**Critical:** HTML files link to `/css/home.css`, `/css/blog.css`, `/css/page.css` (root `css/`), but Sass compiles `css/sass/pages/home.scss` → `css/pages/home.css`. After building, copy compiled files up:
```
cp css/pages/home.css css/home.css
cp css/pages/blog.css css/blog.css
cp css/pages/home.css css/page.css   # page.css aliases home.css
```

## SCSS gotchas

- `@use` paths are **relative to the importing file**, not project root. From `css/sass/pages/home.scss`, use `@use "../styling/src.scss"`; from `css/sass/styling/src.scss`, use `@use "utilities"`. Never use `/`-prefixed absolute paths.
- `@use` does **not** re-export. `src.scss` must use `@forward "utilities"` (not `@use`) so `pages/*` can access `src.$color-accent`.
- Variable names that don't exist cause compile errors (e.g. `$container-padding-img` → should be `$container-padding`).

## SCSS file layout

- `css/sass/pages/home.scss` — homepage styles
- `css/sass/pages/blog.scss` — blog styles
- `css/sass/styling/src.scss` — barrel: `@forward "utilities"; @use "list"; @use "containers";`
- `css/sass/styling/utilities.scss` — color variables (`$color-accent: #B17457`, `$color-bg-light: #FAF7F0`, `$matrix-bg-alpha: 0.15`, `$container-padding: 5px 16px`)

## JS architecture

- `js/init.js` auto-loads `js/home/matrix.js`, `js/blog/markdown-loader.js`, `js/blog/marked.js`, then dispatches `window` event `init:loaded`.
- HTML pages reference `/js/init.js` (defer/async). Pages needing matrix (home) need `canvas#canvas`; pages needing markdown (blog) need `#MD_BLOG` and call `window.markdownLoader.loadMarkdown(...)` inside `init:loaded`.
- `pages/blog/index.html` has `<script src="">` — empty `src`, broken. Do not copy that pattern.

## HTML conventions

- `index.html` is a meta-refresh redirect to `pages/home/index.html`.
- All pages under `pages/` load `/css/bootstrap.min.css` (CDN) + `/css/page.css` (compiled) + `/js/init.js`.
- Bootstrap classes: `container container-lg`, `row`, `col-4`/`col-8`, `col`, `gx-*` (horizontal gutter only — `gy-*`/`g-*` push content into the navbar above).
- `<canvas id="canvas">` must exist on home page for matrix animation; `#header-bar` uses `align-items: stretch` so profile and canvas match height.
- Profile image must keep `aspect-ratio: 1` (square) — do not set `width: 100%` alone.

## Things that broke before (don't repeat)

- `width: 100%` on flex children breaks flex distribution; use `flex: 1` / `flex: 2`.
- `justify-content: center` on `body` pushes tall content above viewport; use `flex-start`.
- `html { width: 100vw }` + padding causes horizontal overflow; prefer `box-sizing: border-box`.
- `fetch()` on `file:///` is blocked; test markdown loading over HTTP, not `file://`.
- `width: 100%` on a flex child prevents flex shrinking; use `flex: 1`/`flex: 2`.
- `min-height: auto` on flex items blocks shrinking; use `min-width: 0` / `min-height: 0`.