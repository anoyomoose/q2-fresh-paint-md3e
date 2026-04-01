// Runtime palette API — browser-only entry point
// Import from '@anoyomoose/q2-fresh-paint-md3e/palette'

import {
  hexFromArgb,
  sourceColorFromImage,
} from '@material/material-color-utilities'
import {
  generatePalette,
} from './palette-generator.js'
import type { PaletteTokens, ColorScheme, SchemeConfig, RelativeSaturation } from './palette-generator.js'

export type { PaletteTokens, ColorScheme, SchemeConfig, RelativeSaturation }
export { okPresets } from './palette-generator.js'

// ── Public API ───────────────────────────────────────────────────────────

export interface PaletteOptions {
  /** Color scheme variant — string for preset name, SchemeConfig for custom (OkLAB only). Default: 'tonalSpot' */
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

/**
 * Generate a full light+dark palette from a hex color.
 * Pure function — defaults are constants, not DOM reads.
 */
export function generatePaletteFromHex(
  hex: string,
  options?: PaletteOptions,
): PaletteTokens {
  return generatePalette(hex, {
    scheme: options?.scheme ?? 'tonalSpot',
    contrastLevel: options?.contrastLevel ?? 0,
    oklab: options?.oklab,
    positiveColor: options?.positiveColor,
    infoColor: options?.infoColor,
    warningColor: options?.warningColor,
  })
}

/**
 * Extract dominant color from an image and generate a palette.
 * Image must be same-origin or CORS-enabled.
 */
export async function generatePaletteFromImage(
  img: HTMLImageElement,
  options?: PaletteOptions,
): Promise<PaletteTokens> {
  const argb = await sourceColorFromImage(img)
  const hex = hexFromArgb(argb)
  return generatePaletteFromHex(hex, options)
}

// ── Default palette config & generation (lazy, cached) ───────────────────

export interface PaletteConfig {
  sourceColor: string
  scheme: ColorScheme | SchemeConfig
  contrastLevel: number
  oklab: boolean
  positiveColor: string
  infoColor: string
  warningColor: string
}

function parseSchemeValue(raw: string): ColorScheme | SchemeConfig {
  if (!raw) return 'tonalSpot'
  // Strip surrounding quotes from Sass string values
  const trimmed = raw.replace(/^['"]|['"]$/g, '')
  if (!trimmed) return 'tonalSpot'
  // Try JSON parse — handles both object and plain string
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed) as SchemeConfig
    } catch {
      return 'tonalSpot'
    }
  }
  return trimmed as ColorScheme
}

/**
 * Returns the build-time palette configuration.
 * Reads --md3-palette-source-color, --md3-palette-scheme, and
 * --md3-palette-contrast-level from the DOM's computed style.
 * Browser-only — throws in SSR.
 */
export function getDefaultPaletteConfig(): PaletteConfig {
  if (typeof document === 'undefined') {
    throw new Error('getDefaultPaletteConfig() is browser-only')
  }

  const style = getComputedStyle(document.documentElement)
  return {
    sourceColor: style.getPropertyValue('--md3-palette-source-color').trim() || '#6750a4',
    scheme: parseSchemeValue(style.getPropertyValue('--md3-palette-scheme').trim()),
    contrastLevel: parseFloat(style.getPropertyValue('--md3-palette-contrast-level').trim()) || 0,
    oklab: style.getPropertyValue('--md3-palette-oklab').trim() === 'true',
    positiveColor: style.getPropertyValue('--md3-palette-positive-seed').trim() || '#21BA45',
    infoColor: style.getPropertyValue('--md3-palette-info-seed').trim() || '#31CCEC',
    warningColor: style.getPropertyValue('--md3-palette-warning-seed').trim() || '#F2C037',
  }
}

let cachedDefault: PaletteTokens | null = null

/**
 * Returns the build-time default palette.
 * Uses getDefaultPaletteConfig() on first call, caches result.
 * Always returns the original build-time palette regardless of applyPalette() calls.
 * Browser-only — throws in SSR.
 */
export function getDefaultPalette(): PaletteTokens {
  if (cachedDefault) return cachedDefault

  const config = getDefaultPaletteConfig()
  cachedDefault = generatePaletteFromHex(config.sourceColor, {
    scheme: config.scheme,
    contrastLevel: config.contrastLevel,
    oklab: config.oklab,
    positiveColor: config.positiveColor,
    infoColor: config.infoColor,
    warningColor: config.warningColor,
  })
  return cachedDefault
}

// ── Apply / remove ───────────────────────────────────────────────────────

const STYLE_ID = 'md3e-palette-overrides'

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function buildTokenBlock(tokens: Record<string, string>, inverseTokens?: Record<string, string>): string {
  let css = ''
  for (const [name, value] of Object.entries(tokens)) {
    css += `  --md3-${name}: ${value};\n`
  }
  // RGB triplets
  css += `  --md3-primary-rgb: ${hexToRgb(tokens.primary)};\n`
  css += `  --md3-on-surface-rgb: ${hexToRgb(tokens['on-surface'])};\n`
  css += `  --md3-on-primary-rgb: ${hexToRgb(tokens['on-primary'])};\n`
  css += `  --md3-error-rgb: ${hexToRgb(tokens.error)};\n`
  css += `  --md3-shadow-rgb: ${hexToRgb(tokens.shadow)};\n`
  // Inverse brand colors (opposite mode's values for use on inverse-surface)
  if (inverseTokens) {
    css += `  --md3-inverse-secondary: ${inverseTokens.secondary};\n`
    css += `  --md3-inverse-tertiary: ${inverseTokens.tertiary};\n`
    css += `  --md3-inverse-error: ${inverseTokens.error};\n`
    css += `  --md3-inverse-positive: ${inverseTokens.positive};\n`
    css += `  --md3-inverse-info: ${inverseTokens.info};\n`
    css += `  --md3-inverse-warning: ${inverseTokens.warning};\n`
  }
  // Quasar brand mappings
  css += `  --q-primary: ${tokens.primary};\n`
  css += `  --q-secondary: ${tokens.secondary};\n`
  css += `  --q-accent: ${tokens.tertiary};\n`
  css += `  --q-negative: ${tokens.error};\n`
  css += `  --q-positive: ${tokens.positive};\n`
  css += `  --q-info: ${tokens.info};\n`
  css += `  --q-warning: ${tokens.warning};\n`
  css += `  --q-dark-page: ${tokens.background};\n`
  css += `  --q-dark: ${tokens['surface-container']};\n`
  return css
}

/**
 * Apply a palette by injecting/replacing a <style> element.
 * Overrides both light and dark mode tokens, plus the per-component dark fix rule.
 * Constant memory — replaces content, does not append.
 */
export function applyPalette(tokens: PaletteTokens): void {
  if (typeof document === 'undefined') return // SSR guard

  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_ID
    document.head.appendChild(styleEl)
  }

  let css = ''

  // Light mode — matches base.scss `:root, body.body--light`
  // Inverse tokens use dark mode values (for readability on inverse-surface)
  css += ':root, body.body--light {\n'
  css += buildTokenBlock(tokens.light, tokens.dark)
  css += '}\n\n'

  // Dark mode (global + per-component) — merged selector, same dark tokens
  css += 'body.body--light .q-dark,\nbody.body--dark {\n'
  css += buildTokenBlock(tokens.dark, tokens.light)
  css += '}\n\n'

  // Per-component dark mode: fallback background/color for unthemed components
  css += 'body.body--light .q-dark {\n'
  css += '  background: var(--md3-surface);\n'
  css += '  color: var(--md3-on-surface);\n'
  css += '}\n'

  styleEl.textContent = css
}

/**
 * Reset to the build-time palette by removing the injected style element.
 * The original palette is restored via CSS cascade (does not regenerate).
 * Also useful for cleanup on component unmount.
 */
export function resetPalette(): void {
  if (typeof document === 'undefined') return
  document.getElementById(STYLE_ID)?.remove()
}

// ── Scoped palettes ──────────────────────────────────────────────────────

const SCOPE_CLASS_PREFIX = 'md3e-palette-'
let scopeCounter = 0

export interface PaletteScope {
  /** The generated CSS class name for this scope. */
  readonly className: string
  /** Apply or update the palette for this scope. Can be called multiple times. */
  applyPalette(tokens: PaletteTokens): void
  /** Add the scope class to an element. With track=true (default), remove() will auto-detach. */
  attach(element: Element, track?: boolean): void
  /** Remove the scope class from an element. */
  detach(element: Element): void
  /** Remove the style element and detach from all tracked elements. */
  remove(): void
}

function buildScopedCss(className: string, tokens: PaletteTokens): string {
  const sel = `.${className}`
  let css = ''

  // Light mode
  css += `${sel} {\n`
  css += buildTokenBlock(tokens.light, tokens.dark)
  css += '}\n\n'

  // Dark mode (global + per-component) within scope
  css += `body.body--light ${sel} .q-dark,\nbody.body--dark ${sel} {\n`
  css += buildTokenBlock(tokens.dark, tokens.light)
  css += '}\n\n'

  // Per-component dark mode: fallback background/color for unthemed components
  css += `body.body--light ${sel} .q-dark {\n`
  css += '  background: var(--md3-surface);\n'
  css += '  color: var(--md3-on-surface);\n'
  css += '}\n'

  return css
}

/**
 * Create a scoped palette that can be attached to specific elements.
 * Each scope gets a unique CSS class and its own <style> element.
 * Multiple elements can share a scope; updating the palette updates all of them.
 * Dark mode switching works automatically via CSS selectors.
 *
 * @example
 * const scope = createPaletteScope()
 * scope.applyPalette(generatePaletteFromHex('#ff0000'))
 * scope.attach(document.getElementById('sidebar'))
 * // Later: scope.remove()
 */
export function createPaletteScope(): PaletteScope {
  if (typeof document === 'undefined') {
    throw new Error('createPaletteScope() is browser-only')
  }

  const className = `${SCOPE_CLASS_PREFIX}${++scopeCounter}`
  const tracked = new Set<Element>()

  const styleEl = document.createElement('style')
  styleEl.id = className
  document.head.appendChild(styleEl)

  return {
    get className() { return className },

    applyPalette(tokens: PaletteTokens) {
      styleEl.textContent = buildScopedCss(className, tokens)
    },

    attach(element: Element, track = true) {
      element.classList.add(className)
      if (track) tracked.add(element)
    },

    detach(element: Element) {
      element.classList.remove(className)
      tracked.delete(element)
    },

    remove() {
      for (const el of tracked) {
        el.classList.remove(className)
      }
      tracked.clear()
      styleEl.remove()
    },
  }
}

/**
 * Remove all palette scope classes from an element.
 * Useful for cleanup when you don't have references to the individual scopes.
 */
export function detachAllScopes(element: Element): void {
  const toRemove = Array.from(element.classList).filter(c => c.startsWith(SCOPE_CLASS_PREFIX))
  for (const cls of toRemove) {
    element.classList.remove(cls)
  }
}
