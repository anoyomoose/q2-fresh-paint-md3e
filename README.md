# @anoyomoose/q2-fresh-paint-md3e

Material Design 3 Expressive (MD3E) theme for Quasar Framework v2. Generates a full MD3 color palette from a single source color using `@material/material-color-utilities`, maps it to Quasar's Sass variable system, and provides component style overrides, shape/motion tokens, and MD3E-specific components.

Requires [`@anoyomoose/q2-fresh-paint-core`](https://github.com/anoyomoose/q2-fresh-paint-core) as the theme engine.

## About

This is an attempt to (partially) provide a Material Design 3 Expressive theme to Quasar 2.x, including (but not limited to):

- **Color system**: the complete MD3E color palette, generated from a single source color, adjustable at runtime
- **Spring-based motion**: bouncy overshoot curves on interactive elements, replacing MD2's linear easing
- **Morphing**: extensive morphing animations for specific elements such as buttons
- **5-level shadow scale**: replacing Quasar's variable shadows
- **Tonal elevation**: elevation shifted from shadow-based to tonal - darker surfaces are lower, shadows are secondary cues
- **Typography**: 15-role type scale, no uppercase anywhere, zero letter spacing on most roles, emphasized weight variants
- **Spacing**: all margins, paddings, and other spacings are updated from MD2 to MD3E specification
- **Buttons**: completely redesigned to follow MD3E specification; pill-shaped by default, no shadows at rest, spring-bouncy shape morphing on press, subtle shadow lift on hover, color-based variants (filled, elevated, tonal, outlined, text) that automatically pair background and text colors based on the palette. Toggle buttons morph between pill and square shapes with animated transitions.
- **Button groups**: similarly redesigned, standard and connected variants; gap-based layouts with button morphing per MD3E specification
- **Segmented buttons**: officially deprecated, but QBtnToggle in standard mode has been redesigned to copy MD3 (non-Expressive) behavior. Note that virtually all imaginable cases where you previously used QBtnToggle are better served (both by look and feel and per MD3E specification) with a standard or connected button group utilizing `Md3eBtn`'s toggle modes instead.
- **Toggle switches**: completely redesigned to follow MD3E specification with expanding handles
- **Sliders**: similarly updated - **NOTE**: I am not quite happy with them, might change/revert
- **Outlined inputs**: labels now animated and positioned to intersect the border as per MD3E specification
- **FABs**: TODO needs review
- **Toolbars, headers and footers**: Now use MD3E specification mandated palette entries

30+ Quasar built-in components have received styling changes, so this summary is by no means exhaustive. This is still a work-in-progress and likely several components will need further tweaking.

While the theme is *mostly* drop-in, in an existing project you will no doubt have to adjust many things to make it fit.

## Playground

A version of Quasar's UI Playground with this theme loaded is available [on GitHub pages](https://anoyomoose.github.io/q2-fresh-paint-md3e/), with the default settings as described further below.

Some pages of particular interest:
- [MD3E Palette](https://anoyomoose.github.io/q2-fresh-paint-md3e/components/md3e-palette-test) (interactive, with many component examples)
- [MD3E Buttons](https://anoyomoose.github.io/q2-fresh-paint-md3e/components/md3e-btn-test)
- [Toggles](https://anoyomoose.github.io/q2-fresh-paint-md3e/form/toggle)
- [Cards](https://anoyomoose.github.io/q2-fresh-paint-md3e/components/card)
- [Inputs](https://anoyomoose.github.io/q2-fresh-paint-md3e/form/input) (see the outlined section)

Note that the UI Playground hardcodes colors in many (many!) places, which fights the theme. No effort was taken to counter this, so it may not always be a good representation of how the theme would look when applied properly.

## Installation & Quick Start

```bash
# or equivalent for your package manager
pnpm add @anoyomoose/q2-fresh-paint-core @anoyomoose/q2-fresh-paint-md3e
```

Configure in `quasar.config.js`:

```js
import { freshPaint } from '@anoyomoose/q2-fresh-paint-core'
import { md3eTheme } from '@anoyomoose/q2-fresh-paint-md3e'

export default defineConfig({
  boot: [
    '~@anoyomoose/q2-fresh-paint-md3e/boot'
  ],

  build: {
    vitePlugins: [
      freshPaint({
        themes: [
          md3eTheme({ sourceColor: '#6750a4', scheme: 'tonalSpot', contrastLevel: 0 })
        ],
      })
    ]
  }
})
```

Both entries are required:
- The **boot file** sets runtime component prop defaults and initializes the outlined field notch observer.
- The **Vite plugin** handles Sass variable injection, component style overrides, and base theme loading at build time.

### Important: Check your `quasar.variables.scss`

The md3e theme manages brand colors, border radii, typography, and many other Quasar variables via its own variable system. If your project's `src/css/quasar.variables.scss` (or `.sass`) defines any of these with hard assignments (no `!default`), **those will silently override the theme** - because Quasar loads that file before any theme variables.

At minimum, **remove these brand color definitions** from `quasar.variables.scss` (the theme derives them from your `sourceColor`):

```scss
// REMOVE these - the md3e theme manages them via palette generation:
// $primary   : #1976D2;
// $secondary : #26A69A;
// $accent    : #9C27B0;
// $negative  : #C10015;
// $dark      : #1d1d1d;
// $dark-page : #121212;
```

The theme also overrides shape tokens (`$generic-border-radius`, `$button-border-radius`, `$button-padding`), typography (`$h1`–`$h6`, `$body1`, `$body2`), and component variables (`$separator-color`, `$toolbar-*`, `$tooltip-*`, `$table-*`, `$menu-*`, `$input-*`, `$dialog-*`). If you've customized any of these, they'll take precedence over the theme. Check the theme's [`variables.scss`](src/theme/variables.scss) for the full list of managed variables.

The recommended approach is to start with an empty `quasar.variables.scss`, configure your base color via the `sourceColor` option in the plugin configuration, and then selectively re-add variable overrides one at a time to see their effect. This way you're building on top of the theme rather than fighting it.

### Important: Remove `bg-primary` from toolbars, headers, and footers

MD3E uses `surface`-colored app bars - not `primary`. The theme enforces this by setting `background-color: var(--md3-surface)` on `.q-toolbar`. If your layouts use the common MD2 pattern of `bg-primary text-white` on headers and footers, **remove those classes** - they'll fight the theme and produce incorrect text colors.

```html
<!-- Before (MD2 pattern) -->
<q-header class="bg-primary text-white">
  <q-toolbar>
    <q-toolbar-title>My App</q-toolbar-title>
  </q-toolbar>
</q-header>

<!-- After (MD3E — no color classes needed, theme handles it) -->
<q-header>
  <q-toolbar>
    <q-toolbar-title>My App</q-toolbar-title>
  </q-toolbar>
</q-header>
```

This also applies to `<q-footer>` and any other component where you manually set `bg-primary` on a toolbar or app bar. The theme uses `on-surface` for text and icons, which adapts correctly in both light and dark mode.

## Options

```ts
md3eTheme(options?: Md3eThemeOptions): ThemeDescriptor
```

### `sourceColor`

Hex color string used as the seed for palette generation. All MD3 color roles (primary, secondary, tertiary, error, surface, etc.) are derived from this single color.

Default: `'#6750a4'`

### `scheme`

Controls how the palette is derived from the source color. Each variant produces different relationships between the color roles.

| Variant | Description |
|---|---|
| `'tonalSpot'` | Balanced, stays close to source hue (default) |
| `'expressive'` | Intentionally detached from source, high color variety |
| `'vibrant'` | Maximum colorfulness, stays on source hue |
| `'fidelity'` | High fidelity to source color |
| `'content'` | Based on source color content |
| `'monochrome'` | Grayscale palette |
| `'neutral'` | Subdued, low chroma |
| `'rainbow'` | Full hue range |
| `'fruitSalad'` | Playful, high variety |

Both light and dark scheme tokens are generated from every variant (as `$md3-<token>` and `$md3-dark-<token>` Sass variables). The SCSS layer then maps these to Quasar brand colors and CSS custom properties for light/dark switching.

### `contrastLevel`

Adjusts the contrast of the generated palette. Accepts a number from -1.0 to 1.0.

| Value | Effect |
|---|---|
| `-1.0` | Reduced contrast — lower contrast between foreground and background |
| `0` | Standard contrast (default) |
| `0.5` | Medium-high contrast |
| `1.0` | High contrast — maximum contrast between foreground and background |

Default: `0`

## Colors

The theme generates 30+ MD3 color tokens from your `sourceColor` and makes them available in four ways:

```vue
<!-- Quasar color props - just works, auto text color included -->
<q-btn color="primary-container" label="Container" />
<q-chip color="tertiary-container" text-color="on-tertiary-container" />

<!-- CSS utility classes -->
<div class="bg-surface-container text-on-surface">...</div>

<!-- CSS custom properties (switch automatically in dark mode) -->
<style>
.my-card { background: var(--md3-surface-container-low); }
</style>

<!-- Sass variables (compile-time) -->
<style lang="scss">
.my-card { border-color: $md3-outline-variant; }
</style>
```

Quasar's brand colors (`primary`, `secondary`, `accent`, `negative`) are mapped to MD3 roles and work as usual. The theme also patches Quasar's hardcoded `text-white` fallback so that brand-colored and token-colored elements get the correct `on-*` text color automatically.

For the full token list, dark mode details, and how the system works under the hood, see [docs/colors.md](docs/colors.md).

## Runtime Palette

Change the color palette at runtime - from a color picker, an image, or programmatically.

```ts
import {
  generatePaletteFromHex,
  generatePaletteFromImage,
  getDefaultPaletteConfig,
  applyPalette,
  resetPalette,
} from '@anoyomoose/q2-fresh-paint-md3e/palette'

// Change palette from a hex color
applyPalette(generatePaletteFromHex('#ff0000'))

// With options
applyPalette(generatePaletteFromHex('#ff0000', { scheme: 'vibrant', contrastLevel: 0.5 }))

// From an image (async, image must be same-origin or CORS-enabled)
const img = document.querySelector('img')
applyPalette(await generatePaletteFromImage(img))

// Reset to the build-time palette (also use for cleanup on unmount)
resetPalette()

// Query the build-time config (sourceColor, scheme, contrastLevel)
const config = getDefaultPaletteConfig()
```

For the full token list, all access methods, and how the color system works, see [docs/colors.md](docs/colors.md).

## Components

These are convenience wrappers and not required to be used.

### `Md3eBtn`

A QBtn wrapper that adds MD3E toggle/selection behavior, color family shortcuts, and variant shortcuts.

```ts
import { Md3eBtn } from '@anoyomoose/q2-fresh-paint-md3e/components'
```

```vue
<md3e-btn v-model="isActive" label="Toggle me" />
<md3e-btn elevated label="Elevated" />
<md3e-btn tonal secondary label="Tonal" />
```

Must-know in short:
- the wrapper ignores most coloring settings (unless `allow-color` is set)
- `tonal` maps to `glossy`, which has been repurposed
- `elevated` similarly maps to `:unelevated=false`
- you can use `glossy` and `:unelevated=false` directly on any QBtn for the same effect
- toggle modes are CSS-driven; while a standard QBtn does not have a `v-model`, the same look can be achieved by adding `q-btn--toggle` and `q-btn--selected` classes.

For full documentation including all props, selection modes, color system, variant shortcuts, and migration guide, see [docs/Md3eBtn.md](docs/Md3eBtn.md).

### `Md3eBtnGroup`

A QBtnGroup wrapper that defaults to the MD3E standard group variant (spaced buttons, individual pill shapes). Use `connected` for the connected variant.

```ts
import { Md3eBtnGroup } from '@anoyomoose/q2-fresh-paint-md3e/components'
```

```vue
<md3e-btn-group>
  <md3e-btn v-model="styles" value="bold" icon="format_bold" />
  <md3e-btn v-model="styles" value="italic" icon="format_italic" />
</md3e-btn-group>
```

Must-know in short: 
- Md3eBtnGroup uses the standard group look and behavior by default (which translates to a repurposed `stretch` on the underlying QBtnGroup), use the `connected` attribute to get the connected group look and behavior. This is inverse to QBtnGroup, which is connected by default and standard by attribute.
- You can indeed just use QBtn instead of Md3eBtn
- Shape definitions do not inherit properly (nor do they on QBtnGroup anymore), due to a combination of how Quasar's CSS rules work and the MD3E specification. You should not use them on the group at all; rather you should specify each button's shape and style explicitly if you want to depart from MD3E's default behavior, in so far as the design will actually allow it (some things are just forced by the specification). Particularly in connected groups, look and feel is probably initially different from what you'd expect!
- Transitions do not work on dense buttons
- You should not mix sizes and dense in the same group

For full documentation including group variants, shape morphing, design props, and known limitations, see [docs/Md3eBtnGroup.md](docs/Md3eBtnGroup.md).

## Boot File

The boot file (`~@anoyomoose/q2-fresh-paint-md3e/boot`) must be registered in the `boot` array of `quasar.config.js`. It runs at app startup and does two things:

**1. Component prop defaults** -- patches the following Quasar components to match MD3E conventions:

| Component | Props changed | Reason |
|---|---|---|
| `QBtn` | `noCaps: true`, `unelevated: true` | MD3E uses sentence case and filled (no shadow) as the default button variant |
| `QBtnDropdown` | `noCaps: true`, `unelevated: true` | Same as QBtn |
| `QChip` | `square: true` | MD3E chips use `corner-small` (8px), not pill shape; `square` disables the default radius so the CSS override applies |
| `QTabs` | `noCaps: true` | MD3E tabs use sentence case |

**2. Outlined field notch observer** -- sets up MutationObserver + ResizeObserver watchers that calculate and animate the notch gap in outlined text fields (`q-field--outlined`). The notch animates open/closed as the label floats. Add the `.no-input-notch` class to a field or its ancestor to opt out.

## User Overrides

Simple variable overrides with literal values (e.g., `$button-padding: 8px 24px`) can go in your project's standard `src/css/quasar.variables.scss` - that file has the highest priority since Quasar loads it before everything else.

For overrides that need to reference theme tokens, place files in `src/theme/md3e/`. Three variable override files are available, each at a different point in the import chain:

- **`variables.pre.scss`** - before the generated palette. Override individual palette tokens:
  ```scss
  $md3-primary: #ff0000 !default;  // force primary, let rest of palette generate
  ```

- **`variables.scss`** - after the generated palette, before the package's own variables. Reference palette tokens to remap how they're applied:
  ```scss
  $primary: $md3-tertiary !default;  // swap primary to use tertiary palette
  $button-border-radius: $md3-corner-large !default;  // reference a shape token
  ```

- **`variables.post.scss`** - after everything. Can reference all tokens. Use hard assignments (no `!default`):
  ```scss
  $separator-color: $md3-outline;  // all tokens are available here
  ```

Variable files **extend** the theme (all are imported, yours just has higher priority). Component overrides (`components/QBtn.scss`) and `base.scss` **replace** the theme's files entirely.

See the [core package documentation](https://github.com/anoyomoose/q2-fresh-paint-core/blob/main/README.md#user-overrides) for the full override mechanism, directory layout, and how to extend replaced files.

## Implementation notes

- **Button variant mapping** MD3E button variants are mapped to Quasar props: Filled (default, `unelevated`), Elevated (`:unelevated="false"`), Outlined (`outline`), Text (`flat`), Tonal (`glossy`). The `push` prop is kept as a Quasar-specific variant. The `square` prop is repurposed as MD3E's "square" button shape option, where the default is now "pill" shaped.
- **Button groups** Split QBtnDropdown components inside groups render as nested wrapper divs, so they don't participate in the press morph/widen interaction, and should not be used (they look bad).
- **Split button dropdowns** icon gets filled look in case of Tonal (`glossy`), not fixable without code changes
- **Segmented buttons** MD3E's deprecated "segmented buttons" are implemented via Quasar's QBtnToggle component (themed in QBtnToggle.scss). The default variant (no design prop) is styled as a segmented button with checkmark icon via CSS mask. Consider if you don't mean to use a connected button group instead.
- **text-white/black** to maintain correct contrast in light and dark modes, the basic background colors have their text colors overridden from Quasar's forced `text-white` and `text-black`. This may cause your own usage of these to be blocked in some cases, and you should use the closest grey (or define your CSS class you add) instead
- **Outlined text field notch** the MD3E outlined text field label-on-border notch is implemented using a CSS `mask-image` on the `::before`/`::after` border pseudo-elements, with JS (`boot.ts`) measuring the label width via `ResizeObserver` and `MutationObserver` to set `--notch-left`/`--notch-width` custom properties. Add the `.no-input-notch` class to a `<q-input>` or any ancestor element to disable the notch and revert to standard Quasar outlined behavior (label floats inside the box). 
- **MD3E app bars use `surface`, not `primary`** MD3E top app bars use `surface` background with `on-surface` text/icons, transitioning to `surface-container` on scroll. This is a deliberate departure from MD2 where `bg-primary text-white` was the standard toolbar pattern. Apps migrating from MD2 to MD3E will need to remove `bg-primary`/`text-white` from their headers and footers. Our theme sets `background-color: var(--md3-surface)` unconditionally on `.q-toolbar` per the spec. Components placed on colored surfaces (e.g. via `bg-primary`) will need manual token remapping - the MD3E spec has no auto-adapt mechanism for this; it defines separate token sets per surface color (e.g. "vibrant toolbar" with `primary-container` background has its own child component tokens).
- **Shape morphing** uses CSS `:active` which may not trigger reliably on all mobiles browsers
- **QSlider** handle is approximated with CSS pseudo-element, stop indicators not implemented
- **Surface tint deprecated** we use tone-based surface containers (correct per Feb 2023 spec update)
- **Dense variants** of QToggle and QSlider are proportionally scaled approximations
- **QCarousel** is fundamentally different from MD3E carousel and not themed
- **QToggle three-state animation** When transitioning from indeterminate (middle) to ON, the thumb briefly snaps to the OFF position before animating to ON. This is caused by Quasar's JS removing the `--indet` class (resetting `left` to the base OFF value) before adding `--truthy` in the same frame. The CSS transition then animates from OFF to ON instead of middle to ON. This is a Quasar core behavior that cannot be fixed via CSS theming alone.
- **Per-component dark mode** `body.body--light [class*="--dark"] > *:not([class*="--dark"])` re-injects light tokens on direct children so child components (toggles, checkboxes) keep light-mode appearance. Edge case: non-dark items inside dark lists (`.q-list--dark > .q-item` without `q-item--dark`) may still have sub-element colors resolve incorrectly.
- **Claude** has been a massive help getting all of this done
