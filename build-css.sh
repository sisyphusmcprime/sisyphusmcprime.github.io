2#!/usr/bin/env bash
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

SCSS_SRC="css-sass/page.scss"
CSS_OUT="page.css"

if [[ ! -f "$SCSS_SRC" ]]; then
    echo "Error: SCSS source not found at $SCSS_SRC" >&2
    exit 1
fi

echo "Compiling $SCSS_SRC -> $CSS_OUT ..."
npx --package sass sass "$SCSS_SRC" "$CSS_OUT" --style expanded --no-source-map

echo "Done."
