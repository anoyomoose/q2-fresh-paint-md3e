import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities'
import type { DynamicScheme } from '@material/material-color-utilities'

export type ColorScheme =
  | 'tonalSpot'
  | 'expressive'
  | 'vibrant'
  | 'fidelity'
  | 'content'
  | 'monochrome'
  | 'neutral'
  | 'rainbow'
  | 'fruitSalad'

export interface GenerateOptions {
  sourceColor?: string
  /** Color scheme variant. Default: 'tonalSpot' */
  scheme?: ColorScheme
}

const schemeConstructors: Record<ColorScheme, new (...args: any[]) => DynamicScheme> = {
  tonalSpot: SchemeTonalSpot,
  expressive: SchemeExpressive,
  vibrant: SchemeVibrant,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  monochrome: SchemeMonochrome,
  neutral: SchemeNeutral,
  rainbow: SchemeRainbow,
  fruitSalad: SchemeFruitSalad,
}

/** All MD3 color tokens to extract via MaterialDynamicColors static properties */
const colorTokens: Array<[string, keyof typeof MaterialDynamicColors]> = [
  ['primary', 'primary'],
  ['on-primary', 'onPrimary'],
  ['primary-container', 'primaryContainer'],
  ['on-primary-container', 'onPrimaryContainer'],
  ['secondary', 'secondary'],
  ['on-secondary', 'onSecondary'],
  ['secondary-container', 'secondaryContainer'],
  ['on-secondary-container', 'onSecondaryContainer'],
  ['tertiary', 'tertiary'],
  ['on-tertiary', 'onTertiary'],
  ['tertiary-container', 'tertiaryContainer'],
  ['on-tertiary-container', 'onTertiaryContainer'],
  ['error', 'error'],
  ['on-error', 'onError'],
  ['error-container', 'errorContainer'],
  ['on-error-container', 'onErrorContainer'],
  ['background', 'background'],
  ['on-background', 'onBackground'],
  ['surface', 'surface'],
  ['on-surface', 'onSurface'],
  ['surface-variant', 'surfaceVariant'],
  ['on-surface-variant', 'onSurfaceVariant'],
  ['outline', 'outline'],
  ['outline-variant', 'outlineVariant'],
  ['shadow', 'shadow'],
  ['scrim', 'scrim'],
  ['inverse-surface', 'inverseSurface'],
  ['inverse-on-surface', 'inverseOnSurface'],
  ['inverse-primary', 'inversePrimary'],
  ['surface-dim', 'surfaceDim'],
  ['surface-bright', 'surfaceBright'],
  ['surface-container-lowest', 'surfaceContainerLowest'],
  ['surface-container-low', 'surfaceContainerLow'],
  ['surface-container', 'surfaceContainer'],
  ['surface-container-high', 'surfaceContainerHigh'],
  ['surface-container-highest', 'surfaceContainerHighest'],
]

/**
 * Extract MD3E color tokens from a DynamicScheme.
 * Uses MaterialDynamicColors static properties + DynamicColor.getArgb().
 */
function extractDynamicScheme(
  sourceColorHct: Hct,
  isDark: boolean,
  schemeName: ColorScheme,
): Record<string, string> {
  const SchemeClass = schemeConstructors[schemeName]
  const scheme = new SchemeClass(sourceColorHct, isDark, 0, '2025')
  const result: Record<string, string> = {}

  for (const [name, prop] of colorTokens) {
    const dynamicColor = (MaterialDynamicColors as any)[prop]
    result[name] = hexFromArgb(dynamicColor.getArgb(scheme))
  }

  return result
}

/**
 * Generate Sass variable content for the MD3 Expressive theme.
 *
 * Uses SchemeExpressive (or other scheme variants) with specVersion '2025'
 * for the updated on-container vibrancy and expressive palette.
 *
 * The output contains:
 * - $md3-<token>: <light-value> !default;    (light scheme)
 * - $md3-dark-<token>: <dark-value> !default; (dark scheme)
 */
export function generateMd3eVariables(options: GenerateOptions): string {
  const sourceColor = options.sourceColor ?? '#6750a4'
  const schemeName = options.scheme ?? 'tonalSpot'
  const sourceHct = Hct.fromInt(argbFromHex(sourceColor))

  const light = extractDynamicScheme(sourceHct, false, schemeName)
  const dark = extractDynamicScheme(sourceHct, true, schemeName)

  const lines: string[] = [
    `// Auto-generated MD3 Expressive palette from source color: ${sourceColor}`,
    `// Scheme: ${schemeName}, specVersion: 2025`,
    '// Do not edit — regenerated on every dev server start.',
    '',
    '// Light scheme',
  ]

  for (const [key, value] of Object.entries(light)) {
    lines.push(`$md3-${key}: ${value} !default;`)
  }

  lines.push('', '// Dark scheme')
  for (const [key, value] of Object.entries(dark)) {
    lines.push(`$md3-dark-${key}: ${value} !default;`)
  }

  return lines.join('\n')
}
