#!/bin/sh
export PUBLIC_PATH=/q2-fresh-paint-md3e/
rm -rf assets 2>/dev/null
( cd ~/quasar_theming/quasar_theme/ui/playground && quasar build ) && \
	cp -dpr ~/quasar_theming/quasar_theme/ui/playground/dist/spa/* .
cp -f index.html 404.html
