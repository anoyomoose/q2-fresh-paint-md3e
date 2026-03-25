import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/components/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    shims: true,
    noExternal: ['@material/material-color-utilities'],
    external: ['vue', 'quasar'],
  },
  {
    entry: { 'theme/boot': 'src/theme/boot.ts' },
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: false,
    sourcemap: true,
    external: ['quasar', 'quasar/wrappers'],
  },
])
