# MD3E Color System

The MD3E theme generates a full Material Design 3 color palette from a single `sourceColor` and makes it available through four access methods, depending on context.

## Quick Reference

| Context | Syntax | Example |
|---|---|---|
| Vue template (Quasar props) | `color="token"` / `text-color="token"` | `<q-btn color="primary-container" />` |
| Vue template (classes) | `class="bg-token text-token"` | `<div class="bg-surface-container text-on-surface">` |
| CSS / `<style>` blocks | `var(--md3-token)` | `background: var(--md3-primary-container);` |
| Sass / SCSS | `$md3-token` | `background: $md3-primary-container;` |

## Available Tokens

All tokens are generated in both light and dark variants. The CSS custom properties (`var(--md3-*)`) switch automatically between light and dark based on Quasar's `body.body--light` / `body.body--dark` classes. The Sass variables (`$md3-*`) are compile-time values for the light scheme; dark variants are available as `$md3-dark-*`.

### Token List

**Primary:** `primary`, `on-primary`, `primary-container`, `on-primary-container`

**Secondary:** `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`

**Tertiary:** `tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`

**Error:** `error`, `on-error`, `error-container`, `on-error-container`

**Surface:** `surface`, `on-surface`, `surface-variant`, `on-surface-variant`

**Surface containers:** `surface-dim`, `surface-bright`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`

**Background:** `background`, `on-background`

**Outline:** `outline`, `outline-variant`

**Inverse:** `inverse-surface`, `inverse-on-surface`, `inverse-primary`

**Utility:** `shadow`, `scrim`

## Using Colors in Vue Templates

### Quasar `color` and `text-color` Props

Most Quasar components accept `color` and `text-color` props. The MD3E theme registers CSS classes for all tokens, so they work directly:

```vue
<q-btn color="primary-container" label="Container Button" />
<q-chip color="tertiary-container" text-color="on-tertiary-container" label="Chip" />
<q-card color="surface-container-high">...</q-card>
```

### Automatic Text Color

Every `bg-*` class sets both a background color AND the correct `on-*` text color automatically. This means `color="primary-container"` gives you the right text contrast without needing to specify `text-color`:

```vue
<!-- These are equivalent: -->
<q-btn color="primary-container" label="Auto text" />
<q-btn color="primary-container" text-color="on-primary-container" label="Explicit text" />
```

If you want a different text color, set `text-color` explicitly — it overrides the automatic pairing:

```vue
<q-btn color="primary-container" text-color="on-surface" label="Custom text" />
```

### Brand Color Mapping

Quasar's brand colors are mapped to MD3 roles by the theme:

| Quasar brand | MD3 role | Notes |
|---|---|---|
| `primary` | primary | |
| `secondary` | secondary | |
| `accent` | tertiary | `tertiary` also works as an alias |
| `negative` | error | |

These work with all Quasar components that accept a color prop. The theme also patches Quasar's automatic `text-white` / `text-black` on brand-colored elements to use the correct MD3 `on-*` token instead, so dark mode works correctly.

### CSS Utility Classes

All tokens are available as utility classes for direct use in templates:

```vue
<div class="bg-surface-container text-on-surface">
  Content on a surface container
</div>

<span class="text-primary">Primary colored text</span>

<div class="bg-error-container text-on-error-container">
  Error message
</div>
```

## Using Colors in CSS

### CSS Custom Properties

All tokens are available as CSS custom properties that switch automatically between light and dark mode:

```css
.my-component {
  background: var(--md3-surface-container);
  color: var(--md3-on-surface);
  border: 1px solid var(--md3-outline-variant);
}

.my-highlight {
  background: var(--md3-primary-container);
  color: var(--md3-on-primary-container);
}
```

RGB triplets are available for use with `rgba()`:

```css
.my-overlay {
  background: rgba(var(--md3-primary-rgb), 0.12);
}
```

Available RGB triplets: `--md3-primary-rgb`, `--md3-on-surface-rgb`, `--md3-on-primary-rgb`, `--md3-error-rgb`.

### Sass Variables

In SCSS/Sass files and `<style lang="scss">` blocks, use the `$md3-*` variables directly. These are compile-time values resolved from the generated palette:

```scss
.my-component {
  background: $md3-surface-container;
  color: $md3-on-surface;
  border-radius: $md3-corner-medium;
}
```

Note: Sass variables are compile-time constants for the light scheme. For runtime light/dark switching, use CSS custom properties (`var(--md3-*)`) instead. The theme's `base.scss` sets up the `var(--md3-*)` properties with both light and dark values.

## How It Works

The color system has three layers:

### 1. Palette Generation (build time)

The `sourceColor` option is fed to `@material/material-color-utilities` which generates the full MD3 palette — all 30+ tokens in both light and dark variants. These are written as Sass variables (`$md3-primary`, `$md3-dark-primary`, etc.) to `.quasar/theme.md3e.scss` on every dev server start or build.

### 2. Variable Mapping (Sass compilation)

The theme's `variables.scss` maps generated palette tokens to Quasar's variable system:

```scss
$primary: $md3-primary !default;
$secondary: $md3-secondary !default;
$accent: $md3-tertiary !default;
```

This is where Quasar brand colors, shape tokens, typography, and component variables are all connected to the MD3 palette.

### 3. CSS Custom Properties (runtime)

The theme's `base.scss` creates CSS custom properties for all tokens, with light values on `:root` / `body.body--light` and dark values on `body.body--dark`:

```scss
:root, body.body--light {
  --md3-primary: #{$md3-primary};
  --md3-on-primary: #{$md3-on-primary};
  // ...
}

body.body--dark {
  --md3-primary: #{$md3-dark-primary};
  --md3-on-primary: #{$md3-dark-on-primary};
  // ...
}
```

This same file defines the `bg-*` and `text-*` utility classes that enable Quasar's `color` prop to work with MD3 tokens.

### Auto Text Color Pairing

Each `bg-*` class sets both `background-color` and `color` (the matching `on-*` token). This serves two purposes:

1. When used as CSS utility classes (`class="bg-primary-container"`), the text color is correct automatically.
2. When used via Quasar's `color` prop (`color="primary-container"`), it overrides Quasar's default `text-white` — which would otherwise be applied as a hardcoded fallback for any color Quasar doesn't recognize.

The `text-*` classes are defined after the `bg-*` classes in source order, so an explicit `text-color` prop always wins over the automatic pairing.

### Brand Color Text Fix

For Quasar's own brand colors (`primary`, `secondary`, `accent`/`tertiary`, `negative`), Quasar adds `text-white` or `text-black`. This doesn't adapt to dark mode or MD3E's token pairing. The theme overrides this:

```scss
.bg-primary.text-white:not(.q-btn--standard):not(.glossy):not(.disabled) {
  color: var(--md3-on-primary) !important;
}
```

The `:not()` exclusions preserve text color handling for elevated buttons (`.q-btn--standard`), tonal buttons (`.glossy`), and disabled buttons, which each have their own color logic.

## Runtime Palette

The theme provides functions to change the color palette at runtime. Import from the `/palette` entry point:

```ts
import {
  generatePaletteFromHex,
  generatePaletteFromImage,
  getDefaultPalette,
  applyPalette,
  resetPalette,
} from '@anoyomoose/q2-fresh-paint-md3e/palette'
```

All palette functions work with the `PaletteTokens` type:

```ts
interface PaletteTokens {
  light: Record<string, string>  // { 'primary': '#655789', ... }
  dark: Record<string, string>
}
```

### Changing the Palette

Generate a palette from a hex color and apply it:

```ts
const palette = generatePaletteFromHex('#ff0000')
applyPalette(palette)
```

With scheme and contrast options:

```ts
applyPalette(generatePaletteFromHex('#ff0000', {
  scheme: 'vibrant',
  contrastLevel: 0.5,
}))
```

### Palette from an Image

Extract a dominant color from an image and generate a palette:

```ts
const img = document.querySelector('img')
const palette = await generatePaletteFromImage(img)
applyPalette(palette)
```

The image must be same-origin or served with CORS headers (`Access-Control-Allow-Origin`). Cross-origin images without CORS will throw a tainted canvas error.

### Resetting to Default

Reset to the build-time palette:

```ts
resetPalette()
```

This removes the injected `<style>` element, restoring the original build-time palette via CSS cascade. Also use this for cleanup on component unmount:

```ts
onBeforeUnmount(() => {
  resetPalette()
})
```

### Querying Build-Time Config

`getDefaultPaletteConfig()` returns the build-time source color, scheme, and contrast level:

```ts
import { getDefaultPaletteConfig } from '@anoyomoose/q2-fresh-paint-md3e/palette'

const config = getDefaultPaletteConfig()
// { sourceColor: '#6750a4', scheme: 'tonalSpot', contrastLevel: 0 }
```

`getDefaultPalette()` returns the full `PaletteTokens` for the build-time config (cached on first call).

### Contrast Level

The `contrastLevel` option adjusts contrast between foreground and background tokens:

| Value | Effect |
|---|---|
| `-1.0` | Reduced contrast |
| `0` | Standard (default) |
| `0.5` | Medium-high contrast |
| `1.0` | High contrast |

Values are clamped to the [-1, 1] range.

### How It Works

`applyPalette()` injects a single `<style>` element that overrides the CSS custom properties from `base.scss`. It targets three selectors:

1. `:root, body.body--light` — light mode tokens
2. `body.body--dark` — dark mode tokens
3. `body.body--light [class*="--dark"]:not(body) > *:not([class*="--dark"])` — per-component dark mode fix

Each call replaces the style element content (constant memory). `resetPalette()` removes the element entirely, reverting to build-time CSS.

`getDefaultPaletteConfig()` reads `--md3-palette-source-color`, `--md3-palette-scheme`, and `--md3-palette-contrast-level` from the DOM. `getDefaultPalette()` uses these to generate and cache the full token set.

### Browser Only

All palette functions are browser-only. `getDefaultPalette()` throws in SSR. `applyPalette()` and `resetPalette()` silently no-op in SSR.
