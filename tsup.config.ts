import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/palette.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    shims: true,
    noExternal: ['@material/material-color-utilities', 'ok-material-colors'],
    external: ['vue', 'quasar'],
  },
  {
    entry: {
      'components/Md3eBtn': 'src/components/Md3eBtn.ts',
      'components/Md3eBtnGroup': 'src/components/Md3eBtnGroup.ts',
      'components/Md3eFab': 'src/components/Md3eFab.ts',
      'components/Md3eFabAction': 'src/components/Md3eFabAction.ts',
      'components/Md3eToolbar': 'src/components/Md3eToolbar.ts',
      'components/Md3eSlider': 'src/components/Md3eSlider.ts',
    },
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: true,
    sourcemap: true,
    external: ['vue', 'quasar'],
  },
  {
    entry: { 'theme/boot': 'src/theme/boot.ts' },
    format: ['esm', 'cjs'],
    outDir: 'dist',
    dts: false,
    sourcemap: true,
    external: ['vue', 'quasar', 'quasar/wrappers'],
  },
])
