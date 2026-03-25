#!/bin/sh
( cd ~/quasar_theming/quasar_theme/ui/playground && quasar build ) && \
	cp -dpr ~/quasar_theming/quasar_theme/ui/playground/dist/spa/* .
