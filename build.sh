#!/bin/sh
export PUBLIC_PATH=/q2-fresh-paint-md3e/
( cd ~/quasar_theming/quasar_theme/ui/playground && quasar build ) && \
	cp -dpr ~/quasar_theming/quasar_theme/ui/playground/dist/spa/* .
