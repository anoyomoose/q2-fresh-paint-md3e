import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ThemeDescriptor } from '@anoyomoose/q2-fresh-paint-core'
import { generateMd3eVariables } from './palette-generator.js'

export type ColorScheme =
  | 'tonalSpot' | 'expressive' | 'vibrant' | 'fidelity'
  | 'content' | 'monochrome' | 'neutral' | 'rainbow' | 'fruitSalad'

export interface Md3eThemeOptions {
  /** Source color for palette generation. Default: '#6750a4' */
  sourceColor?: string
  /** Color scheme variant. Default: 'tonalSpot' */
  scheme?: ColorScheme
}

export function md3eTheme(options?: Md3eThemeOptions): ThemeDescriptor {
  const pkgDir = dirname(fileURLToPath(import.meta.url))
  return {
    name: 'md3e',
    dir: resolve(pkgDir, 'theme'),
    generateVariables: () => generateMd3eVariables(options ?? {}),
  }
}
