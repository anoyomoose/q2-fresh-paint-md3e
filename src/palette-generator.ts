import {
  argbFromHex,
  hexFromArgb,
  Hct,
  MaterialDynamicColors,
  SchemeCmf,
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
  | 'cmf'

export interface PaletteTokens {
  light: Record<string, string>
  dark: Record<string, string>
}

export interface GenerateOptions {
  sourceColor?: string
  /** Color scheme variant. Default: 'tonalSpot' */
  scheme?: ColorScheme
  /** Contrast adjustment from -1 (reduced) to 1 (high). Default: 0 */
  contrastLevel?: number
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
  cmf: SchemeCmf,
}

/**
 * Token extraction definitions.
 * Each entry maps a CSS token name to an instance method on MaterialDynamicColors.
 * Methods that return undefined (e.g. *Dim on older specs) are skipped.
 */
const tokenMethods: Array<[string, string]> = [
  // Primary
  ['primary', 'primary'],
  ['primary-dim', 'primaryDim'],
  ['on-primary', 'onPrimary'],
  ['primary-container', 'primaryContainer'],
  ['on-primary-container', 'onPrimaryContainer'],
  ['primary-fixed', 'primaryFixed'],
  ['primary-fixed-dim', 'primaryFixedDim'],
  ['on-primary-fixed', 'onPrimaryFixed'],
  ['on-primary-fixed-variant', 'onPrimaryFixedVariant'],
  ['inverse-primary', 'inversePrimary'],

  // Secondary
  ['secondary', 'secondary'],
  ['secondary-dim', 'secondaryDim'],
  ['on-secondary', 'onSecondary'],
  ['secondary-container', 'secondaryContainer'],
  ['on-secondary-container', 'onSecondaryContainer'],
  ['secondary-fixed', 'secondaryFixed'],
  ['secondary-fixed-dim', 'secondaryFixedDim'],
  ['on-secondary-fixed', 'onSecondaryFixed'],
  ['on-secondary-fixed-variant', 'onSecondaryFixedVariant'],

  // Tertiary
  ['tertiary', 'tertiary'],
  ['tertiary-dim', 'tertiaryDim'],
  ['on-tertiary', 'onTertiary'],
  ['tertiary-container', 'tertiaryContainer'],
  ['on-tertiary-container', 'onTertiaryContainer'],
  ['tertiary-fixed', 'tertiaryFixed'],
  ['tertiary-fixed-dim', 'tertiaryFixedDim'],
  ['on-tertiary-fixed', 'onTertiaryFixed'],
  ['on-tertiary-fixed-variant', 'onTertiaryFixedVariant'],

  // Error
  ['error', 'error'],
  ['error-dim', 'errorDim'],
  ['on-error', 'onError'],
  ['error-container', 'errorContainer'],
  ['on-error-container', 'onErrorContainer'],

  // Background
  ['background', 'background'],
  ['on-background', 'onBackground'],

  // Surface
  ['surface', 'surface'],
  ['on-surface', 'onSurface'],
  ['surface-variant', 'surfaceVariant'],
  ['on-surface-variant', 'onSurfaceVariant'],
  ['surface-dim', 'surfaceDim'],
  ['surface-bright', 'surfaceBright'],
  ['surface-container-lowest', 'surfaceContainerLowest'],
  ['surface-container-low', 'surfaceContainerLow'],
  ['surface-container', 'surfaceContainer'],
  ['surface-container-high', 'surfaceContainerHigh'],
  ['surface-container-highest', 'surfaceContainerHighest'],
  ['surface-tint', 'surfaceTint'],

  // Outline
  ['outline', 'outline'],
  ['outline-variant', 'outlineVariant'],

  // Inverse
  ['inverse-surface', 'inverseSurface'],
  ['inverse-on-surface', 'inverseOnSurface'],

  // Utility
  ['shadow', 'shadow'],
  ['scrim', 'scrim'],
]

// Exported for use by palette test page and docs
export { tokenMethods as colorTokens }

/**
 * Extract MD3E color tokens from a DynamicScheme.
 * Uses MaterialDynamicColors instance methods (new API).
 * Tokens that return undefined (e.g. *Dim on older specs) are skipped.
 */
function extractDynamicScheme(
  sourceColorHct: Hct,
  isDark: boolean,
  schemeName: ColorScheme,
  contrastLevel: number,
): Record<string, string> {
  const SchemeClass = schemeConstructors[schemeName]
  const contrast = Math.max(-1, Math.min(1, contrastLevel))
  const scheme = new SchemeClass(sourceColorHct, isDark, contrast, '2026')
  const colors = new MaterialDynamicColors()
  const result: Record<string, string> = {}

  for (const [name, method] of tokenMethods) {
    const dynamicColor = (colors as any)[method]?.()
    if (dynamicColor) {
      result[name] = hexFromArgb(dynamicColor.getArgb(scheme))
    }
  }

  return result
}

/**
 * Generate a full light+dark palette from a hex color.
 * Pure function — no DOM access.
 */
export function generatePalette(
  hex: string,
  options?: { scheme?: ColorScheme; contrastLevel?: number },
): PaletteTokens {
  const sourceColor = hex.startsWith('#') ? hex : `#${hex}`
  const schemeName = options?.scheme ?? 'tonalSpot'
  const contrastLevel = options?.contrastLevel ?? 0
  const sourceHct = Hct.fromInt(argbFromHex(sourceColor))
  return {
    light: extractDynamicScheme(sourceHct, false, schemeName, contrastLevel),
    dark: extractDynamicScheme(sourceHct, true, schemeName, contrastLevel),
  }
}

/**
 * Generate Sass variable content for the MD3 Expressive theme.
 *
 * Uses specVersion '2026' — non-CMF variants fall back to '2025' internally
 * which is handled by the library's maybeFallbackSpecVersion.
 *
 * The output contains:
 * - $md3-<token>: <light-value> !default;    (light scheme)
 * - $md3-dark-<token>: <dark-value> !default; (dark scheme)
 * - $md3-palette-source-color / scheme / contrast-level / spec-version metadata
 */
export function generateMd3eVariables(options: GenerateOptions): string {
  const sourceColor = options.sourceColor ?? '#6750a4'
  const schemeName = options.scheme ?? 'tonalSpot'
  const contrastLevel = options.contrastLevel ?? 0

  const { light, dark } = generatePalette(sourceColor, { scheme: schemeName, contrastLevel })

  const lines: string[] = [
    `// Auto-generated MD3 Expressive palette from source color: ${sourceColor}`,
    `// Scheme: ${schemeName}, contrastLevel: ${contrastLevel}, specVersion: 2026`,
    '// Do not edit — regenerated on every dev server start.',
    '',
    '// Palette metadata',
    `$md3-palette-source-color: ${sourceColor} !default;`,
    `$md3-palette-scheme: ${schemeName} !default;`,
    `$md3-palette-contrast-level: ${contrastLevel} !default;`,
    `$md3-palette-spec-version: 2026 !default;`,
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
