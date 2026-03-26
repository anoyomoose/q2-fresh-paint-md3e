// Runtime palette API — browser-only entry point
// Import from '@anoyomoose/q2-fresh-paint-md3e/palette'

import {
  hexFromArgb,
  sourceColorFromImage,
} from '@material/material-color-utilities'
import {
  generatePalette,
} from './palette-generator.js'
import type { PaletteTokens, ColorScheme } from './palette-generator.js'

export type { PaletteTokens, ColorScheme }

// ── Public API ───────────────────────────────────────────────────────────

export interface PaletteOptions {
  /** Color scheme variant. Default: 'tonalSpot' */
  scheme?: ColorScheme
  /** Contrast adjustment from -1 (reduced) to 1 (high). Default: 0 */
  contrastLevel?: number
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
  scheme: ColorScheme
  contrastLevel: number
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
    scheme: (style.getPropertyValue('--md3-palette-scheme').trim() || 'tonalSpot') as ColorScheme,
    contrastLevel: parseFloat(style.getPropertyValue('--md3-palette-contrast-level').trim()) || 0,
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

function buildTokenBlock(tokens: Record<string, string>): string {
  let css = ''
  for (const [name, value] of Object.entries(tokens)) {
    css += `  --md3-${name}: ${value};\n`
  }
  // RGB triplets
  css += `  --md3-primary-rgb: ${hexToRgb(tokens.primary)};\n`
  css += `  --md3-on-surface-rgb: ${hexToRgb(tokens['on-surface'])};\n`
  css += `  --md3-on-primary-rgb: ${hexToRgb(tokens['on-primary'])};\n`
  css += `  --md3-error-rgb: ${hexToRgb(tokens.error)};\n`
  // Quasar brand mappings
  css += `  --q-primary: ${tokens.primary};\n`
  css += `  --q-secondary: ${tokens.secondary};\n`
  css += `  --q-accent: ${tokens.tertiary};\n`
  css += `  --q-negative: ${tokens.error};\n`
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
  css += ':root, body.body--light {\n'
  css += buildTokenBlock(tokens.light)
  css += '}\n\n'

  // Dark mode — matches base.scss `body.body--dark`
  css += 'body.body--dark {\n'
  css += buildTokenBlock(tokens.dark)
  css += '}\n\n'

  // Per-component dark mode fix — matches base.scss rule that re-injects
  // light tokens on children of dark-scoped elements in light mode
  css += 'body.body--light [class*="--dark"]:not(body) > *:not([class*="--dark"]) {\n'
  css += buildTokenBlock(tokens.light)
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
