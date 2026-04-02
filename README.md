# @anoyomoose/q2-fresh-paint-md3e

Material Design 3 Expressive (MD3E) theme for Quasar Framework v2. Generates a full MD3 color palette from a single source color using `@material/material-color-utilities`, maps it to Quasar's Sass variable system, and provides component style overrides, shape/motion tokens, and MD3E-specific components.

Requires [`@anoyomoose/q2-fresh-paint-core`](https://github.com/anoyomoose/q2-fresh-paint-core) as the theme engine.

## About

This is an attempt to (partially) provide a Material Design 3 Expressive theme to Quasar 2.x, including (but not limited to):

- **Color system**: the complete MD3E color palette, generated from a single source color, adjustable at runtime, targetable to specific containers 
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
- **Sliders**: updated as best as possible, uses MD2 sizes by default, see `Md3eSlider`
- **Outlined inputs**: labels now animated and positioned to intersect the border as per MD3E specification
- **FABs**: adjusted to MD3E standards, see the `Md3eBtn` section for (extended) FABs, and `Md3eFab` section for FAB menus
- **Toolbars, headers and footers**: Now use MD3E specification mandated palette entries

30+ Quasar built-in components have received styling changes, so this summary is by no means exhaustive. This is still a work-in-progress and likely several components will need further tweaking.

While the theme is *mostly* drop-in, in an existing project you will no doubt have to adjust many things to make it fit.

## Playground

A version of Quasar's UI Playground with this theme loaded is available [on GitHub pages](https://anoyomoose.github.io/q2-fresh-paint-md3e/), with the default settings as described further below.

Some pages of particular interest (not mobile friendly):
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

The md3e theme manages brand colors, border radii, typography, and many other Quasar variables via its own variable system. Quasar loads `quasar.variables.scss` **before** any theme variables, and it typically uses hard assignments (no `!default`). Any color variable defined there (e.g., `$primary: #1976D2`) will override the theme's `var()` mapping and **break runtime palette switching**.

**Remove all color definitions** from `quasar.variables.scss`:

```scss
// REMOVE these - the md3e theme manages them via palette generation:
// $primary   : #1976D2;
// $secondary : #26A69A;
// $accent    : #9C27B0;
// $negative  : #C10015;
// $dark      : #1d1d1d;
// $dark-page : #121212;
// $separator-color: rgba(0, 0, 0, .12);
```

Non-color variables (sizing, spacing, etc.) are still safe in `quasar.variables.scss`. The theme also manages shape tokens (`$generic-border-radius`, `$button-border-radius`, `$button-padding`), typography (`$h1`–`$h6`, `$body1`, `$body2`), and component variables (`$toolbar-*`, `$tooltip-*`, `$table-*`, `$menu-*`, `$input-*`, `$dialog-*`). If you've customized any of these, they'll take precedence over the theme. Check the theme's [`variables.scss`](src/theme/variables.scss) for the full list of managed variables.

The recommended approach is to start with an empty `quasar.variables.scss`, configure your base color via the `sourceColor` option in the plugin configuration, and then selectively re-add non-color variable overrides one at a time to see their effect. For color customization, override `$md3-*` palette tokens in `src/theme/md3e/variables.pre.scss` in your local tree instead, i.e. instead of `$primary` modify `$md3-primary` there. 

### Important: Remove `bg-primary` from toolbars, headers, and footers

MD3E uses `surface-container`-colored app bars - not `primary`. The theme enforces this by setting `background-color: var(--md3-surface-container)` on `.q-toolbar` and `.q-layout__section--marginal`. If your layouts use the common MD2 pattern of `bg-primary text-white` on headers and footers, **remove those classes** - they'll fight the theme and produce incorrect text colors.

```html
<!-- Before (MD2 pattern) -->
<q-header class="bg-primary text-white">
  <q-toolbar>
    <q-toolbar-title>My App</q-toolbar-title>
  </q-toolbar>
</q-header>

<!-- After (MD3E default colors) -->
<q-header>
  <q-toolbar>
    <q-toolbar-title>My App</q-toolbar-title>
  </q-toolbar>
</q-header>

<!-- After (force your primary, counter defaults) -->
<!-- Using the --light variant usually looks better in dark mode -->
<q-header class="bg-primary--light text-on-primary--light">
  <q-toolbar class="bg-primary--light text-on-primary--light">
    <q-toolbar-title>My App</q-toolbar-title>
  </q-toolbar>
</q-header>
```

This also applies to `<q-footer>` and any other component where you manually set `bg-primary` on a toolbar or app bar. The theme uses `on-surface` for text and icons, which adapts correctly in both light and dark mode.

Be sure to read the `Md3eToolbar` section below, it also applies to `QToolbar`.

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
| `'cmf'` | Color, Material, Finish — hardware-oriented, uses 2026 spec exclusively |

Both light and dark scheme tokens are generated from every variant (as `$md3-<token>--light` and `$md3-<token>--dark` Sass variables). The SCSS layer then maps these to CSS custom properties with `--light`/`--dark` constants and switching aliases for light/dark mode.

When `oklab` is enabled, `scheme` can also be a `SchemeConfig` object for full control over palette generation — see below.

### `oklab`

Use OkLCH/OkHSL-based palette generation instead of Google's HCT color space. OkLAB produces perceptually more uniform palettes with better saturation control, and is fully tweakable.

Default: `false`

When enabled, the `scheme` option accepts either a preset name (same list as above) or a custom `SchemeConfig` object for fine-grained control over hue offsets and saturation for each palette role. 

See [docs/colors.md](docs/colors.md) for more information.

The [Palette Demonstration](https://anoyomoose.github.io/q2-fresh-paint-md3e/components/md3e-palette-test) page includes an interactive OkLAB scheme editor with a copy button that exports your chosen configuration to the clipboard.

### `contrastLevel`

Adjusts the contrast of the generated palette. Accepts a number from -1.0 to 1.0.

| Value | Effect |
|---|---|
| `-1.0` | Reduced contrast — lower contrast between foreground and background |
| `0` | Standard contrast (default) |
| `0.5` | Medium-high contrast |
| `1.0` | High contrast — maximum contrast between foreground and background |

Default: `0`

### `positiveColor`, `infoColor`, `warningColor`

Seed colors for the harmonized custom color roles. These are blended toward the `sourceColor` to produce palette-cohesive variants of Quasar's positive/info/warning colors. When `oklab` is enabled, harmonization uses OkLCH hue blending instead of HCT.

| Option | Default | Quasar equivalent |
|---|---|---|
| `positiveColor` | `'#21BA45'` | `$positive` (green) |
| `infoColor` | `'#31CCEC'` | `$info` (cyan) |
| `warningColor` | `'#F2C037'` | `$warning` (yellow) |

Each produces four tokens: `<role>`, `on-<role>`, `<role>-container`, `on-<role>-container`. To customize, pass seed colors to `md3eTheme()` — do **not** override `$positive`/`$info`/`$warning` in Sass, as that breaks the `var()` chain.

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

Generally speaking, you can just search your code-base for `text-white` and `text-black` and either remove those classes or use the correct `on-*` variant.

For the full token list, dark mode details, and how the system works under the hood, see [docs/colors.md](docs/colors.md).

Likely, none of this makes sense until you read the [Color Roles](https://m3.material.io/styles/color/roles) section of the Material Design 3 specification.

## Runtime Palette

Change the color palette at runtime - from a color picker, an image, or programmatically - for the entire page, or targeted elements.

See [docs/colors.md](docs/colors.md) for details.

## Components

These are convenience wrappers and not required to be used.

### Importing

All `Md3e...` components have an `M...` alias for easier typing! The full name is always used in other examples. Both
are shown in this section, though you would pick one to use.

The import path is always `@anoyomoose/q2-fresh-paint-md3e/components/<fullname>`

```ts
import { Md3eBtn, MBtn } from '@anoyomoose/q2-fresh-paint-md3e/components/Md3eBtn'
```

Or register locally in a component:

```ts
import { Md3eBtn, MBtn } from '@anoyomoose/q2-fresh-paint-md3e/components/Md3eBtn'

export default {
  components: { Md3eBtn, MBtn },
}
```

Register globally in your app entry point:

```ts
import { Md3eBtn, MBtn } from '@anoyomoose/q2-fresh-paint-md3e/components/Md3eBtn'

app.component('Md3eBtn', Md3eBtn)
app.component('MBtn', MBtn)
```

In templates, use the kebab-case name:

```html
<md3e-btn label="Click me" />
```

For tree-shaking purposes, you should import and/or register only what you use! 

### `Md3eBtn`

A `QBtn` wrapper that adds MD3E toggle/selection behavior, color family shortcuts, and variant shortcuts.

```vue
<md3e-btn v-model="isActive" label="Toggle me" />
<md3e-btn elevated label="Elevated" />
<md3e-btn tonal secondary label="Tonal" />
```

Must-know in short:
- The wrapper ignores most coloring settings (unless `allow-color` is set); you should generally only use `primary` (mostly), and `secondary`, `tertiary` and `error` (scarcely), as these move with the theme. Per the spec, if no color is specified for a `tonal` button, it uses `secondary` rather than `primary`. Only default, `rounded`, `square`, and `text` buttons support other colors in practise.
- `tonal` maps to `glossy`, which has been repurposed
- `text` maps to `flat`, they're the same thing, the MD3E spec just calls them `text`
- `elevated` similarly maps to `:unelevated=false`
- You can use `glossy` and `:unelevated=false` directly on any QBtn for the same effect
- Toggle modes are CSS-driven; while a standard QBtn does not have a `v-model`, the same look can be achieved by adding `q-btn--toggle` and `q-btn--selected` classes.
- Morph transition can be disabled with `no-morph` attribute or class
- FABs: `fab-mini` = `md`, `fab` = `lg` in `size`; shape is `square`; only default and `tonal` variants should be used

For full documentation including all props, selection modes, color system, variant shortcuts, and migration guide, see [docs/Md3eBtn.md](docs/Md3eBtn.md).

### `Md3eBtnGroup`

A `QBtnGroup` wrapper that defaults to the MD3E standard group variant (spaced buttons, individual pill shapes). Use `connected` for the connected variant.

```vue
<md3e-btn-group>
  <md3e-btn v-model="styles" value="bold" icon="format_bold" />
  <md3e-btn v-model="styles" value="italic" icon="format_italic" />
</md3e-btn-group>
```

Must-know in short: 
- `Md3eBtnGroup` uses the standard group look and behavior by default (which translates to a repurposed `stretch` on the underlying `QBtnGroup`), use the `connected` attribute to get the connected group look and behavior. This is inverse to `QBtnGroup`, which is connected by default and standard by attribute.
- You can indeed just use `QBtn` instead of `Md3eBtn`
- Shape definitions do not inherit properly (nor do they on `QBtnGroup` anymore), due to a combination of how Quasar's CSS rules work and the MD3E specification. You should not use them on the group at all; rather you should specify each button's shape and style explicitly if you want to depart from MD3E's default behavior, in so far as the design will actually allow it (some things are just forced by the specification). Particularly in connected groups, look and feel is probably initially different from what you'd expect!
- Transitions do not work on dense buttons
- You should not mix sizes and dense in the same group
- Widening transition can be disabled with `no-widening` attribute or class

For full documentation including group variants, shape morphing, design props, and known limitations, see [docs/Md3eBtnGroup.md](docs/Md3eBtnGroup.md).

### `Md3eToolbar`

A `QToolbar` wrapper with MD3E variant shortcuts for docked and floating toolbars.

```vue
<!-- use tonal for toggle buttons! -->

<!-- AppBar (docked toolbar) -->
<md3e-toolbar>
  <!-- buttons SHOULD be (round) square, and SHOULD NOT be either dense nor stretch -->
  <md3e-btn round square text icon="sym_r_menu" />
  <q-toolbar-title>My App</q-toolbar-title>
  <md3e-btn square text icon="sym_r_search" />
</md3e-toolbar>

<!-- Docked toolbar -->
<md3e-toolbar between><!-- between: spreads buttons evenly -->
  <!-- buttons SHOULD be (round) square, and SHOULD NOT be either dense nor stretch -->
  <md3e-btn round square tonal icon="sym_r_format_bold" v-model="myToggle" />
  <md3e-btn square text icon="sym_r_brush" />
  <md3e-btn round square icon="sym_r_palette" />
</md3e-toolbar>

<!-- Floating toolbar -->
<md3e-toolbar floating>
  <!-- buttons MAY NOT be square when floating, PREFER round, NO label -->
  <md3e-btn round tonal icon="sym_r_format_bold" v-model="myToggle" />
  <md3e-btn round text icon="sym_r_brush" />
  <md3e-btn round icon="sym_r_palette" />
</md3e-toolbar>

<!-- Floating vertical vibrant toolbar -->
<md3e-toolbar floating vertical vibrant>
  <!-- buttons MAY NOT be square when floating, PREFER round, NO label -->
  <md3e-btn round tonal icon="sym_r_format_bold" v-model="myToggle" />
  <md3e-btn round text icon="sym_r_brush" />
  <md3e-btn round icon="sym_r_palette" />
</md3e-toolbar>
```

Must-know in short:
- Toolbars are slightly larger now: Quasar's examples use `dense` icons and `stretch` buttons - remove both attributes from your existing code for a better look
- Your toolbar probably uses something like `class="bg-primary text-white"` - for MD3E look remove them, or change to `class="bg-primary text-on-primary"` to force your primary
- Avoid setting toolbar color and/or button colors
- Toolbars now use `gap` (8px), so all your `q-m...` classes inside it are wrong, and should probably just be removed. Use `no-gap` to disable.
- For docked toolbars (including the app bar), buttons should be `round square` or `square`, and optionally `flat`, or `tonal` for toggle buttons
- For floating toolbars, buttons should be icon-only, `round square` (preferred) or `square`, and optionally `flat`, or `tonal` for toggle buttons
- `floating` makes the toolbar auto-sized, pill-shaped, with FAB-level elevation and 16dp margin (`.q-toolbar--floating`)
- `vibrant` (requires `floating`) uses `primary-container` background for higher emphasis (`.q-toolbar--floating--vibrant`)
- `vertical` (requires `floating`) switches to column layout (`.q-toolbar--floating--vertical`)
- `surface` overrides the background to `surface`, if you want the toolbar (usually the app bar) to have the same color as the body (`.bg-surface`)

For full documentation, see [docs/Md3eToolbar.md](docs/Md3eToolbar.md).

### `Md3eFab` / `Md3eFabAction`

`QFab` / `QFabAction` wrappers that default to MD3E FAB menus.

MD3E FAB Menus are much more restricted than all the options Quasar provides. Implementation and testing has been limited to the spec:
- Only `primary`, `secondary`, `tertiary` and `error` colors are supported. Others at your own risk
- The menu button itself uses the `tonal` color scheme when closed, and the `filled` scheme when open and showing a close icon
- An icon is required, a label is optional and not recommended
- Only `direction="up"` is supported
- Menus on the left side of the screen should use `label-position="left" vertical-align="left"` on the `QFab`, and `label-position="left"` on the `QFabAction`; menus on the right side of the screen can omit these attributes as they default to `right`.
- A `QFabAction` corresponds to a `<q-btn size="lg" />`
- `QFabAction`s **require** *both* an icon *and* a label
- `QFabAction` automatically use the right `tonal` color (supported colors only)
- The spec removes shadows from the popups, but that just looks bad, so they're kept

Using `QFab`:

```vue
<q-fab secondary icon="sym_r_edit" label="Edit" label-position="left" vertical-actions-align="left" direction="up">
  <q-fab-action icon="sym_r_mail" label="Mail" label-position="left" />
  <q-fab-action icon="sym_r_alarm" label="Alarm" label-position="left"/>
</q-fab>
```

Using `Md3eFab` / `Md3eFabAction`:
- Supports `primary` (default), `secondary`, `tertiary`, `error` attributes as well as `allow-color` (at your own risk), like `Md3eBtn` does
- `label-position`, `vertical-actions-align`, `direction` automatically set if `left` attribute is used
- `left` attribute automatically propagates to children
- `mini` supported (`q-fab--mini`) - note this only changes the size of the FAB, not of the popups

```vue
<md3e-fab secondary left icon="sym_r_edit" label="Edit">
  <md3e-fab-action icon="sym_r_mail" label="Mail" />
  <md3e-fab-action icon="sym_r_alarm" label="Alarm" />
</md3e-fab>
```

### `Md3eSlider`

A `QSlider` wrapper with MD3E `size` shortcuts and `icon` capability.

These sizes correspond to the MD3E specification, not to Quasar sizes of the same name. `sm` is the default. Mappings:

| size | track-size | thumb-size | icon-size | corner size |
|:----:|:----------:|:----------:|:---------:|:-----------:|
|  xs  |    16px    |    32px    |   12px    |     8px     |
|  sm  |    24px    |    44px    |   16px    |     8px     |
|  md  |    40px    |    52px    |   24px    |    12px     |
|  lg  |    56px    |    68px    |   28px    |    16px     |
|  xl  |    96px    |   108px    |   32px    |    28px     |

Implemented as a wrapper as the MD2 slider default sizes are quite different, and `icon` support had to be bolted on. 
Using a `QSlider` with this theme gives you the same style but a thin track. You can replicate `Md3eSlider` behavior
with a `QSlider` by passing the `track-size` and `thumb-size` values from this map, and setting the `q-slider--{size}`
class.

`icon-size` (CSS units) and `icon-color` (palette) attributes are also available.

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

Non-color variable overrides (e.g., `$button-padding: 8px 24px`) can go in `src/css/quasar.variables.scss` — that file has the highest priority since Quasar loads it before any theme variables. **Do not put color overrides there** — they break runtime palette switching. See [the colors documentation](docs/colors.md#user-overrides) for details.

For color and theme token overrides, place files in `src/theme/md3e/`. Three variable override files are available, each at a different point in the import chain:

- **`variables.pre.scss`** - before the generated palette. Override individual `$md3-*` palette tokens:
  ```scss
  $md3-primary: #ff0000 !default;  // force primary, let rest of palette generate
  ```

- **`variables.scss`** - after the generated palette, before the package's own variables. Remap palette tokens or override non-color theme variables:
  ```scss
  $md3-primary: $md3-tertiary !default;  // remap primary to tertiary palette
  $button-border-radius: $md3-corner-large !default;  // reference a shape token
  ```

- **`variables.post.scss`** - after everything. Can reference all tokens. Use hard assignments (no `!default`):
  ```scss
  $generic-border-radius: 16px;  // force a specific shape
  ```

Variable files **extend** the theme (all are imported, yours just has higher priority). Component overrides (`components/QBtn.scss`) and `base.scss` **replace** the theme's files entirely.

See the [core package documentation](https://github.com/anoyomoose/q2-fresh-paint-core/blob/main/README.md#user-overrides) for the full override mechanism, directory layout, and how to extend replaced files.

## Implementation notes

- **Button variant mapping** MD3E button variants are mapped to Quasar props: Filled (default, `unelevated`), Elevated (`:unelevated="false"`), Outlined (`outline`), Text (`flat`), Tonal (`glossy`). The `push` prop is kept as a Quasar-specific variant. The `square` prop is repurposed as MD3E's "square" button shape option, where the default is now "pill" shaped. Arbitrary colors (not `primary` / `secondary` / `teriary` / `error` or an alias) are *not* supported on `elevated`, `total` or `toggle` buttons!
- **Button groups** Split QBtnDropdown components inside groups render as nested wrapper divs, so they don't participate in the press morph/widen interaction, and should not be used (they look bad).
- **Split button dropdowns** icon gets filled look in case of Tonal (`glossy`), not fixable without code changes
- **Segmented buttons** MD3E's deprecated "segmented buttons" are implemented via Quasar's QBtnToggle component (themed in QBtnToggle.scss). The default variant (no design prop) is styled as a segmented button with checkmark icon via CSS mask. Consider if you don't mean to use a connected button group instead.
- **text-white/black** to maintain correct contrast in light and dark modes, the basic background colors have their text colors overridden from Quasar's forced `text-white` and `text-black`. This may cause your own usage of these to be blocked in some cases, and you should use the closest grey (or define your CSS class you add) instead
- **Outlined text field notch** the MD3E outlined text field label-on-border notch is implemented using a CSS `mask-image` on the `::before`/`::after` border pseudo-elements, with JS (`boot.ts`) measuring the label width via `ResizeObserver` and `MutationObserver` to set `--notch-left`/`--notch-width` custom properties. Add the `.no-input-notch` class to a `<q-input>` or any ancestor element to disable the notch and revert to standard Quasar outlined behavior (label floats inside the box). 
- **MD3E app bars use `surface-container`, not `primary`** MD3E toolbars, headers, and footers use `surface-container` background with `on-surface` text/icons. This is a deliberate departure from MD2 where `bg-primary text-white` was the standard toolbar pattern. Apps migrating from MD2 to MD3E will need to remove `bg-primary`/`text-white` from their headers and footers. Floating toolbars support a `vibrant` variant with `secondary-container` background and its own child component token remapping. The vertical floating toolbar overrides QToolbar's hardcoded `flex-direction: row` with `!important`.
- **Shape morphing** uses CSS `:active` which may not trigger reliably on all mobiles browsers
- **QSlider** handle is approximated with CSS pseudo-element, stop indicators not implemented
- **Surface tint deprecated** we use tone-based surface containers (correct per Feb 2023 spec update)
- **Dense variants** of QToggle and QSlider are proportionally scaled approximations
- **QCarousel** is fundamentally different from MD3E carousel and not themed
- **QToggle three-state animation** When transitioning from indeterminate (middle) to ON, the thumb briefly snaps to the OFF position before animating to ON. This is caused by Quasar's JS removing the `--indet` class (resetting `left` to the base OFF value) before adding `--truthy` in the same frame. The CSS transition then animates from OFF to ON instead of middle to ON. This is a Quasar core behavior that cannot be fixed via CSS theming alone.
- **Per-component dark mode** Quasar's base `.q-dark` rule is stripped via `stripRules`. The theme replaces it with `body.body--light .q-dark` which flips all `--md3-*` aliases to their `--dark` constants, plus a fallback `background: var(--md3-surface)` and `color: var(--md3-on-surface)` for unthemed components. Themed components override the fallback background via source order. A corresponding `body.body--dark .q-light` rule flips aliases back to `--light` constants for light-mode overrides within a dark page.
- **Claude** has been a massive help getting all of this done
