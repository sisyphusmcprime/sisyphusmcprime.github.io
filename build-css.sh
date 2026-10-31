#!/usr/bin/env bash
#
# build-css.sh
# Compiles the SCSS source (css-sass/page.scss) into vanilla CSS (page.css)
# using Dart Sass. Uses `npx` so no local/global Sass install is required.
#
# Usage:
#   ./build-css.sh        # compile once
#   npm run build:css     # same via npm script
#

set -euo pipefail

# Compile page.scss -> page.css
SCSS_SRC="css-sass/page.scss"
CSS_OUT="page.css"

if [[ ! -f "$SCSS_SRC" ]]; then
    echo "Error: SCSS source not found at $SCSS_SRC" >&2
    exit 1
fi

echo "Compiling $SCSS_SRC -> $CSS_OUT ..."
npx --package sass sass "$SCSS_SRC" "$CSS_OUT" --style expanded --no-source-map

# Compile index.scss -> index.css
SCSS_SRC2="css-sass/index.scss"
CSS_OUT2="index.css"

if [[ -f "$SCSS_SRC2" ]]; then
    echo "Compiling $SCSS_SRC2 -> $CSS_OUT2 ..."
    npx --package sass sass "$SCSS_SRC2" "$CSS_OUT2" --style expanded --no-source-map
fi

echo "Done."
