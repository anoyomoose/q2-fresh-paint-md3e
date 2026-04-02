import {
  argbFromHex,
  hexFromArgb,
  Blend,
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
  TonalPalette,
} from '@material/material-color-utilities'
import type { DynamicScheme } from '@material/material-color-utilities'
import {
  generatePalette as okGeneratePalette,
  harmonize as okHarmonize,
  presets as okPresets,
} from 'ok-material-colors'
import type { SchemeConfig, RelativeSaturation } from 'ok-material-colors'
export type { SchemeConfig, RelativeSaturation } from 'ok-material-colors'
export { presets as okPresets } from 'ok-material-colors'

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
  /** Color scheme variant or custom OkLAB SchemeConfig. Default: 'tonalSpot' */
  scheme?: ColorScheme | SchemeConfig
  /** Contrast adjustment from -1 (reduced) to 1 (high). Default: 0 */
  contrastLevel?: number
  /** Use OkLCH/OkHSL-based palette generation instead of Google's HCT. Default: false */
  oklab?: boolean
  /** Seed color for harmonized "positive" role. Default: '#21BA45' */
  positiveColor?: string
  /** Seed color for harmonized "info" role. Default: '#31CCEC' */
  infoColor?: string
  /** Seed color for harmonized "warning" role. Default: '#F2C037' */
  warningColor?: string
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

/** Default seed colors for harmonization (Quasar's originals) */
const DEFAULT_POSITIVE = '#21BA45'
const DEFAULT_INFO = '#31CCEC'
const DEFAULT_WARNING = '#F2C037'

/**
 * Generate harmonized custom color tokens from a design color and source color.
 * Uses Blend.harmonize to shift the hue, then extracts tones from a TonalPalette
 * at standard MD3 tone levels.
 */
function generateHarmonizedTokens(
  designColorArgb: number,
  sourceColorArgb: number,
  isDark: boolean,
): Record<string, string> {
  const harmonized = Blend.harmonize(designColorArgb, sourceColorArgb)
  const hct = Hct.fromInt(harmonized)
  const palette = TonalPalette.fromHueAndChroma(hct.hue, hct.chroma)

  // Standard MD3 tone mappings
  const color = isDark ? palette.tone(80) : palette.tone(40)
  const onColor = isDark ? palette.tone(20) : palette.tone(100)
  const container = isDark ? palette.tone(30) : palette.tone(90)
  const onContainer = isDark ? palette.tone(90) : palette.tone(10)

  return {
    color: hexFromArgb(color),
    onColor: hexFromArgb(onColor),
    container: hexFromArgb(container),
    onContainer: hexFromArgb(onContainer),
  }
}

/**
 * Add harmonized custom color tokens (positive, info, warning) to a result map.
 */
function addHarmonizedColors(
  result: Record<string, string>,
  sourceColorArgb: number,
  isDark: boolean,
  positiveHex: string,
  infoHex: string,
  warningHex: string,
): void {
  const positive = generateHarmonizedTokens(argbFromHex(positiveHex), sourceColorArgb, isDark)
  result['positive'] = positive.color
  result['on-positive'] = positive.onColor
  result['positive-container'] = positive.container
  result['on-positive-container'] = positive.onContainer

  const info = generateHarmonizedTokens(argbFromHex(infoHex), sourceColorArgb, isDark)
  result['info'] = info.color
  result['on-info'] = info.onColor
  result['info-container'] = info.container
  result['on-info-container'] = info.onContainer

  const warning = generateHarmonizedTokens(argbFromHex(warningHex), sourceColorArgb, isDark)
  result['warning'] = warning.color
  result['on-warning'] = warning.onColor
  result['warning-container'] = warning.container
  result['on-warning-container'] = warning.onContainer
}

/**
 * Extract MD3E color tokens from a DynamicScheme.
 * Uses MaterialDynamicColors instance methods (new API).
 * Tokens that return undefined (e.g. *Dim on older specs) are skipped.
 * Also generates harmonized positive/info/warning tokens.
 */
function extractDynamicScheme(
  sourceColorHct: Hct,
  isDark: boolean,
  schemeName: ColorScheme,
  contrastLevel: number,
  positiveHex: string,
  infoHex: string,
  warningHex: string,
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

  // Harmonized custom colors (positive/info/warning)
  addHarmonizedColors(result, sourceColorHct.toInt(), isDark, positiveHex, infoHex, warningHex)

  return result
}

/**
 * Generate harmonized tokens using ok-material-colors' harmonize function.
 * Produces 4 tokens (color, onColor, container, onContainer) for one role.
 */
function generateOklabHarmonizedTokens(
  designColorHex: string,
  sourceColorHex: string,
  isDark: boolean,
): Record<string, string> {
  const harmonized = okHarmonize(designColorHex, sourceColorHex)
  // Use ok-material-colors to generate a mini palette from the harmonized color,
  // then extract the standard tone levels for color roles.
  // We generate a fidelity palette from the harmonized color to get its tonal ramp.
  const miniPalette = okGeneratePalette(harmonized, { scheme: 'fidelity' })
  const tokens = isDark ? miniPalette.dark : miniPalette.light
  return {
    color: tokens.primary,
    onColor: tokens['on-primary'],
    container: tokens['primary-container'],
    onContainer: tokens['on-primary-container'],
  }
}

/**
 * Add harmonized custom color tokens using ok-material-colors backend.
 */
function addOklabHarmonizedColors(
  result: Record<string, string>,
  sourceColorHex: string,
  isDark: boolean,
  positiveHex: string,
  infoHex: string,
  warningHex: string,
): void {
  const positive = generateOklabHarmonizedTokens(positiveHex, sourceColorHex, isDark)
  result['positive'] = positive.color
  result['on-positive'] = positive.onColor
  result['positive-container'] = positive.container
  result['on-positive-container'] = positive.onContainer

  const info = generateOklabHarmonizedTokens(infoHex, sourceColorHex, isDark)
  result['info'] = info.color
  result['on-info'] = info.onColor
  result['info-container'] = info.container
  result['on-info-container'] = info.onContainer

  const warning = generateOklabHarmonizedTokens(warningHex, sourceColorHex, isDark)
  result['warning'] = warning.color
  result['on-warning'] = warning.onColor
  result['warning-container'] = warning.container
  result['on-warning-container'] = warning.onContainer
}

/**
 * Generate a full palette using the ok-material-colors (OkLCH/OkHSL) backend.
 */
function generatePaletteOklab(
  sourceColor: string,
  schemeName: ColorScheme,
  contrastLevel: number,
  positiveHex: string,
  infoHex: string,
  warningHex: string,
  rawConfig?: SchemeConfig,
): PaletteTokens {
  const base = okGeneratePalette(sourceColor, {
    scheme: rawConfig ?? schemeName,
    contrastLevel,
  })

  // Add harmonized custom colors
  addOklabHarmonizedColors(base.light, sourceColor, false, positiveHex, infoHex, warningHex)
  addOklabHarmonizedColors(base.dark, sourceColor, true, positiveHex, infoHex, warningHex)

  return base
}

/**
 * Generate a full light+dark palette from a hex color.
 * Pure function — no DOM access.
 */
export function generatePalette(
  hex: string,
  options?: {
    scheme?: ColorScheme | SchemeConfig
    contrastLevel?: number
    oklab?: boolean
    positiveColor?: string
    infoColor?: string
    warningColor?: string
  },
): PaletteTokens {
  const sourceColor = hex.startsWith('#') ? hex : `#${hex}`
  const scheme = options?.scheme ?? 'tonalSpot'
  const schemeName: ColorScheme = (typeof scheme === 'string' && scheme in schemeConstructors) ? scheme : 'tonalSpot'
  const contrastLevel = options?.contrastLevel ?? 0
  const positiveHex = options?.positiveColor ?? DEFAULT_POSITIVE
  const infoHex = options?.infoColor ?? DEFAULT_INFO
  const warningHex = options?.warningColor ?? DEFAULT_WARNING

  if (options?.oklab) {
    const rawConfig = typeof scheme === 'object' ? scheme : undefined
    return generatePaletteOklab(sourceColor, schemeName, contrastLevel, positiveHex, infoHex, warningHex, rawConfig)
  } else {
    const sourceHct = Hct.fromInt(argbFromHex(sourceColor))
    return {
      light: extractDynamicScheme(sourceHct, false, schemeName, contrastLevel, positiveHex, infoHex, warningHex),
      dark: extractDynamicScheme(sourceHct, true, schemeName, contrastLevel, positiveHex, infoHex, warningHex),
    }
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
  const scheme = options.scheme ?? 'tonalSpot'
  const contrastLevel = options.contrastLevel ?? 0
  const oklab = options.oklab ?? false
  const positiveColor = options.positiveColor ?? DEFAULT_POSITIVE
  const infoColor = options.infoColor ?? DEFAULT_INFO
  const warningColor = options.warningColor ?? DEFAULT_WARNING
  const specVersion = oklab ? 'oklab' : '2026'

  // Serialize scheme as JSON string — Sass needs it quoted to avoid parsing { as a block
  // For strings: bare value (tonalSpot). For objects: quoted JSON string for Sass.
  const schemeJson = typeof scheme === 'string' ? scheme : `'${JSON.stringify(scheme).replace(/'/g, "\\'")}'`
  const schemeLabel = typeof scheme === 'string' ? scheme : (scheme.name ?? 'custom')

  const { light, dark } = generatePalette(sourceColor, {
    scheme,
    contrastLevel,
    oklab,
    positiveColor,
    infoColor,
    warningColor,
  })

  const lines: string[] = [
    `// Auto-generated MD3 Expressive palette from source color: ${sourceColor}`,
    `// Scheme: ${schemeLabel}, contrastLevel: ${contrastLevel}, specVersion: ${specVersion}`,
    '// Do not edit — regenerated on every dev server start.',
    '',
    '// Palette metadata',
    `$md3-palette-source-color: ${sourceColor} !default;`,
    `$md3-palette-scheme: ${schemeJson} !default;`,
    `$md3-palette-contrast-level: ${contrastLevel} !default;`,
    `$md3-palette-spec-version: ${specVersion} !default;`,
    `$md3-palette-oklab: ${oklab} !default;`,
    `$md3-palette-positive-seed: ${positiveColor} !default;`,
    `$md3-palette-info-seed: ${infoColor} !default;`,
    `$md3-palette-warning-seed: ${warningColor} !default;`,
    '',
    '// Light scheme',
  ]

  for (const [key, value] of Object.entries(light)) {
    lines.push(`$md3-${key}--light: ${value} !default;`)
  }

  lines.push('', '// Dark scheme')
  for (const [key, value] of Object.entries(dark)) {
    lines.push(`$md3-${key}--dark: ${value} !default;`)
  }

  return lines.join('\n')
}
