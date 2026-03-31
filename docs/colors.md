# MD3E Color System

The MD3E theme generates a full Material Design 3 color palette from a single `sourceColor` and makes it available through four access methods, depending on context.

## Quick Reference

| Context | Syntax | Example |
|---|---|---|
| Vue template (Quasar props) | `color="token"` / `text-color="token"` | `<q-btn color="primary-container" />` |
| Vue template (classes) | `class="bg-token text-token"` | `<div class="bg-surface-container text-on-surface">` |
| CSS / `<style>` blocks | `var(--md3-token)` | `background: var(--md3-primary-container);` |
| Sass / SCSS | `var(--md3-token)` | `background: var(--md3-primary-container);` |

## Available Tokens

All tokens are generated in both light and dark variants. The CSS custom properties (`var(--md3-*)`) switch automatically between light and dark based on Quasar's `body.body--light` / `body.body--dark` classes. Use `var(--md3-*)` in both CSS and Sass for runtime-correct values.

Sass variables `$md3-<token>` and `$md3-dark-<token>` exist as compile-time hex values for the generated palette. These are used internally by `base.scss` to set the initial CSS custom property values. **Do not use `$md3-*` or `$md3-dark-*` directly in your component styles** — they are static values that don't respond to runtime palette changes or light/dark switching. Use `var(--md3-*)` instead.

### Token List

**Primary:** `primary`, `on-primary`, `primary-container`, `on-primary-container`

**Secondary:** `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`

**Tertiary:** `tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`

**Error:** `error`, `on-error`, `error-container`, `on-error-container`

**Surface:** `surface`, `on-surface`, `surface-variant`, `on-surface-variant`

**Surface containers:** `surface-dim`, `surface-bright`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`

**Background:** `background`, `on-background`

**Outline:** `outline`, `outline-variant`

**Inverse:** `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `inverse-secondary`, `inverse-tertiary`, `inverse-error`

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

| Quasar brand | MD3 role  | Notes                             |
|--------------|-----------|-----------------------------------|
| `primary`    | primary   |                                   |
| `secondary`  | secondary |                                   |
| `accent`     | tertiary  | `tertiary` also works as an alias |
| `negative`   | error     | `error` also works as an alias    |

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

## Using Colors in CSS and Sass

### CSS Custom Properties (recommended)

All tokens are available as CSS custom properties that switch automatically between light and dark mode. **This is the recommended way to use colors in both CSS and Sass/SCSS:**

```scss
// Works in CSS, SCSS, and Sass — all produce runtime-correct values
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

Available RGB triplets: `--md3-primary-rgb`, `--md3-on-surface-rgb`, `--md3-on-primary-rgb`, `--md3-error-rgb`, `--md3-shadow-rgb`.

### Sass Variables (compile-time only)

The theme generates `$md3-<token>` (light) and `$md3-dark-<token>` (dark) Sass variables as static hex values. These exist primarily for the theme's internal use — `base.scss` uses them to set the initial CSS custom property values.

**Do not use `$md3-primary`, `$md3-dark-primary`, etc. directly in your component styles.** They are compile-time constants that:
- Don't switch between light and dark mode
- Don't respond to runtime palette changes via `applyPalette()`
- Will silently show the wrong color in dark mode

Use `var(--md3-primary)` instead — it resolves correctly in all contexts.

The Sass variables are useful for non-color tokens that don't change at runtime:

```scss
.my-component {
  border-radius: $md3-corner-medium;        // shape tokens — safe
  transition: all $md3-spring-effects-default-duration $md3-spring-expressive-effects-default;  // motion — safe
  background: var(--md3-surface-container);  // colors — use var()
}
```

## How It Works

The color system has three layers:

### 1. Palette Generation (build time)

The `sourceColor` option is fed to `@material/material-color-utilities` which generates the full MD3 palette — all 30+ tokens in both light and dark variants. These are written as Sass variables (`$md3-primary`, `$md3-dark-primary`, etc.) to `.quasar/theme.md3e.scss` on every dev server start or build.

### 2. Variable Mapping (Sass compilation)

The theme's `variables.scss` maps palette tokens to Quasar's variable system using `var()` references so that runtime palette switching works:

```scss
$primary: var(--md3-primary) !default;
$secondary: var(--md3-secondary) !default;
$accent: var(--md3-tertiary) !default;
$separator-color: var(--md3-outline-variant) !default;
// etc.
```

When Quasar's Sass compiles, these `var()` strings are passed through to CSS as-is. This means Quasar's own component rules (separators, borders, tooltips, etc.) produce CSS that references the theme's custom properties, so they respond to runtime palette changes.

**Important:** If you override a Quasar variable like `$primary` directly (e.g., `$primary: #ff0000` in `quasar.variables.scss`), you break the `var()` chain and that variable becomes a static value that doesn't respond to palette changes. Override `$md3-primary` in `src/theme/md3e/variables.pre.scss` instead — see [User Overrides](#user-overrides) below.

### 3. CSS Custom Properties (runtime)

The theme's `base.scss` creates CSS custom properties for all tokens, with light values on `:root` / `body.body--light` and dark values on `body.body--dark`:

```scss
:root, body.body--light {
  --md3-primary: #{$md3-primary};       // hex value from generated palette
  --md3-on-primary: #{$md3-on-primary};
  // ...all 30+ tokens
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

## User Overrides

### Override palette tokens, not Quasar variables

When customizing colors, override the `$md3-*` palette tokens rather than Quasar's own variables (`$primary`, `$separator-color`, etc.). The theme maps Quasar variables to `var(--md3-*)` references — overriding them directly breaks the runtime palette chain.

**Correct** — override the palette token in `variables.pre.scss`:
```scss
$md3-primary: #ff0000 !default;  // changes the build-time primary color
```

**Wrong** — overriding the Quasar variable breaks runtime switching:
```scss
$primary: #ff0000 !default;  // static hex — palette changes won't affect this
```

### Override points

Three user override files are available (place in `src/theme/md3e/`):

- **`variables.pre.scss`** — before the generated palette. Override individual palette tokens:
  ```scss
  $md3-primary: #ff0000 !default;  // force primary, rest generates normally
  ```

- **`variables.scss`** — after the palette, before theme variables. Reference palette tokens:
  ```scss
  // Remap primary to use the tertiary palette color
  $md3-primary: $md3-tertiary !default;
  ```

- **`variables.post.scss`** — after everything. Hard assignments (no `!default`):
  ```scss
  // Force a specific shape token
  $generic-border-radius: 16px;
  ```

### About `quasar.variables.scss`

Quasar's standard user variable file (`src/css/quasar.variables.scss`) loads **before** all theme variables and typically uses hard assignments (no `!default`). Any color variable defined there (e.g., `$primary: #ff0000`) will override the theme's `var()` mapping and break runtime palette switching.

**Remove all color definitions** from `quasar.variables.scss` — the theme manages them. This file is still safe for non-color overrides like sizing, spacing, or other Quasar variables that aren't part of the color system:

```scss
// Safe in quasar.variables.scss:
$toolbar-min-height: 72px;
$input-font-size: 18px;

// NOT safe — remove these:
// $primary: #1976D2;
// $secondary: #26A69A;
// $accent: #9C27B0;
// $negative: #C10015;
// $dark: #1d1d1d;
// $dark-page: #121212;
// $separator-color: rgba(0, 0, 0, .12);
```

For color customization, override the `$md3-*` palette tokens in `src/theme/md3e/variables.pre.scss` — not Quasar's own variables like `$primary`.

### What's safe to override

| Variable type | Override where | Runtime-safe? |
|---|---|---|
| `$md3-<token>` palette colors | `variables.pre.scss` | Yes — changes build-time default, `var()` chain intact |
| `$md3-corner-*` shape tokens | `variables.scss` or `quasar.variables.scss` | N/A — shape doesn't change at runtime |
| `$md3-type-*` typography | `variables.scss` or `quasar.variables.scss` | N/A — typography doesn't change at runtime |
| `$md3-spring-*` motion | `variables.scss` or `quasar.variables.scss` | N/A — motion doesn't change at runtime |
| Non-color Quasar vars (sizing, etc.) | `quasar.variables.scss` | N/A — not palette-dependent |
| `$primary`, `$separator-color`, etc. | Avoid | No — breaks `var()` chain |

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
3. `body.body--light .q-dark` — per-component dark mode (dark tokens + fallback background/color)

It also updates Quasar's `--q-*` brand variables and `--q-dark` / `--q-dark-page` to match the new palette.

Each call replaces the style element content (constant memory). `resetPalette()` removes the element entirely, reverting to build-time CSS.

`getDefaultPaletteConfig()` reads `--md3-palette-source-color`, `--md3-palette-scheme`, and `--md3-palette-contrast-level` from the DOM. `getDefaultPalette()` uses these to generate and cache the full token set.

### Scoped Palettes

Apply a different palette to a specific container instead of the entire page. All components inside the container inherit the scoped tokens via CSS cascade. Dark mode switching works automatically.

```ts
import { createPaletteScope, generatePaletteFromHex, detachAllScopes } from '@anoyomoose/q2-fresh-paint-md3e/palette'

// Create a scope (generates a unique CSS class and <style> element)
const scope = createPaletteScope()

// Apply a palette to the scope
scope.applyPalette(generatePaletteFromHex('#ff0000'))

// Attach to one or more elements
scope.attach(document.getElementById('sidebar'))
scope.attach(document.getElementById('dialog'))

// Update the palette — all attached elements update instantly
scope.applyPalette(generatePaletteFromHex('#00ff00', { scheme: 'vibrant' }))

// Detach from a specific element
scope.detach(document.getElementById('dialog'))

// Clean up: removes the style element and detaches from all tracked elements
scope.remove()
```

**Tracking:** By default, `attach(el)` tracks the element so `remove()` can auto-detach. Pass `attach(el, false)` to skip tracking — useful for dynamic elements (e.g., list items) where holding references could cause memory leaks.

**Cleanup without scope references:** `detachAllScopes(element)` removes all palette scope classes from an element:

```ts
detachAllScopes(myElement)
```

### Browser Only

All palette functions are browser-only. `getDefaultPalette()` and `createPaletteScope()` throw in SSR. `applyPalette()` and `resetPalette()` silently no-op in SSR.
