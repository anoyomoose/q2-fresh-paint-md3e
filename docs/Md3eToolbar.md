# Md3eToolbar

A wrapper around Quasar's `QToolbar` that provides MD3 Expressive variant shortcuts for docked and floating toolbars.

All styling is handled by CSS classes (`.q-toolbar--floating`, `.q-toolbar--floating--vibrant`, `.q-toolbar--floating--vertical`, `.q-toolbar--no-gap`, `.bg-surface`) defined in the theme's `QToolbar.scss`. The theme also applies `gap: 8px` and `justify-content: space-between` to all toolbars by default. You can apply these classes manually to a plain `QToolbar` without using this wrapper.

## Migration from MD2

MD3E toolbars differ from Quasar's MD2 defaults in several ways:

- **Background**: toolbars use `surface-container` (not `primary`). Remove `bg-primary`, `text-white`, and similar color classes from your toolbars, headers, and footers. The theme manages colors automatically.
- **Height**: toolbars are 64dp (Quasar default is 50dp). Remove `dense` from icon buttons and `stretch` from buttons — these no longer look correct at the larger size.
- **Square**: add `square` to all toolbar buttons
- **Button colors**: `color` should usually not be used on buttons inside toolbars. The theme handles button colors based on variant (`text`, `tonal`, filled). Remove the `color` from the buttons, are restrict to `primary`, `secondary`, `tertiary`, and `error`.
- **Shadows**: no drop shadow at rest. Elevation is communicated via the `surface-container` tonal difference from the page background (`surface`).
- **Gap and justify**: toolbars now have `gap: 8px` and `justify-content: space-between` by default. Remove any `q-mx-*`, `q-px-*`, or manual spacing classes between toolbar items. Use `no-gap` to opt out of the gap.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `floating` | Boolean | `false` | Floating toolbar: auto-sized to content, pill shape, FAB-level elevation (level 3), 16dp margin on all sides, 8dp gap between items. |
| `vibrant` | Boolean | `false` | Vibrant color scheme (`primary-container` background, `on-primary-container` text). Requires `floating`. Overrides `surface`. |
| `vertical` | Boolean | `false` | Vertical (column) layout for icon-only buttons. Requires `floating`. |
| `surface` | Boolean | `false` | Override background to `surface` (instead of the default `surface-container`). Ignored when `vibrant` is set. |
| `noGap` | Boolean | `false` | Remove the default 8dp gap between items. |

All other `QToolbar` props (e.g. `inset`) and slots pass through unchanged.

## Docked Toolbars

Docked toolbars sit inside a `QHeader` or `QFooter` and span the full width.

### App Bar (Header Toolbar)

The most common docked toolbar. Typically placed in a `QHeader`, containing a navigation icon, title, and trailing actions. The `QToolbarTitle` component provides the flex-growing title area, so alignment props are not needed.

```html
<q-header>
  <md3e-toolbar>
    <md3e-btn round square text icon="sym_r_menu" />
    <q-toolbar-title>My App</q-toolbar-title>
    <md3e-btn round square text icon="sym_r_search" />
    <md3e-btn round square text icon="sym_r_more_vert" />
  </md3e-toolbar>
</q-header>
```

Icon buttons use `round square` for the MD3E "rounded square" shape (medium corners, 12dp). `text` (which maps to `flat`) makes them transparent.

Buttons with (icons and) labels use `square` without `round` — same corner shape, but wider to fit the text:

```html
<md3e-toolbar>
  <md3e-btn round square text icon="sym_r_arrow_back" />
  <q-toolbar-title>Details</q-toolbar-title>
  <md3e-btn square text icon="sym_r_share" label="Share" />
  <md3e-btn square icon="sym_r_send" label="Send" />
</md3e-toolbar>
```

Icon-only buttons can also use `square` without `round` for a wider rounded rectangle — it's a stylistic choice.

### Action Toolbar

A toolbar without a title. Buttons are spread evenly by default (`justify-content: space-between` is applied to all toolbars):

```html
<q-footer>
  <md3e-toolbar>
    <md3e-btn round square tonal icon="sym_r_format_bold" v-model="boldActive" />
    <md3e-btn round square tonal icon="sym_r_format_italic" v-model="italicActive" />
    <md3e-btn round square text icon="sym_r_brush" />
    <md3e-btn round square text icon="sym_r_palette" />
    <md3e-btn round square icon="sym_r_send" />
  </md3e-toolbar>
</q-footer>
```

To adjust item alignment, use Quasar's `justify-start`, `justify-end`, and `justify-center` classes.

### Button Conventions for Docked Toolbars

| Props                | Icon | Label | 1:1 |  `v-model`   | Description               |
|:---------------------|:----:|:-----:|:---:|:------------:|:--------------------------|
| `round square text`  |  ✔️  |       | ✔️  |              | Rounded square, flat      |
| `round square`       |  ✔️  |       | ✔️  |              | Rounded square, filled    |
| `round square tonal` |  ✔️  |       | ✔️  | **Required** | Rounded square, toggle    |
| `square text`        |  ✔️  |  ✔️   |     |              | Rounded rectangle, flat   |
| `square`             |  ✔️  |  ✔️   |     |              | Rounded rectangle, filled |
| `square tonal`       |  ✔️  |  ✔️   |     | **Required** | Rounded rectangle, toggle |

Toggle buttons use `tonal` by convention. 

**Don't** set `color` on buttons — the theme manages colors automatically based on the variant.

**Don't** use `dense` or `stretch` — toolbars are larger now (64dp) and these attributes produce incorrect sizing.

## Floating Toolbars

Floating toolbars are free-standing, auto-sized to their content, with pill-shaped corners (fully round ends) and FAB-level elevation (level 3). They have 16dp margin on all sides and 8dp gap between items.

Position them with standard CSS/Quasar layout utilities (e.g. `q-page-sticky`, `q-footer`, absolute positioning, flex).

Buttons should *not* be `square`. It is common to mix `round text` and default buttons for emphasis in horizontal bars. 

```html
<md3e-toolbar floating>
  <md3e-btn round tonal icon="sym_r_format_bold" v-model="boldActive" />
  <md3e-btn icon="sym_r_brush" />
  <md3e-btn round text icon="sym_r_palette" />
</md3e-toolbar>
```

### Vibrant Floating Toolbar

Uses `primary-container` background for higher visual emphasis — draws attention to the toolbar, useful for indicating a temporary mode (e.g. edit mode).

Tonal buttons (`.glossy.bg-secondary`) inside vibrant toolbars automatically use `surface-container` background instead of their default `primary-container`, so they remain visually distinct from the toolbar background.

The `vibrant` prop overrides `surface` if both are set.

```html
<md3e-toolbar floating vibrant>
  <md3e-btn round tonal icon="sym_r_format_bold" v-model="boldActive" />
  <md3e-btn icon="sym_r_brush" />
  <md3e-btn round text icon="sym_r_palette" />
</md3e-toolbar>
```

### Vertical Floating Toolbar

Column layout for icon-only buttons. They have a 24dp horizontal margin and should be positioned opposite the navigation rail.

Don't use labeled buttons in vertical toolbars. Default (not `round`) buttons are supported but not preferred. 

```html
<md3e-toolbar floating vertical>
  <md3e-btn round text icon="sym_r_edit" />
  <md3e-btn round text icon="sym_r_delete" />
  <md3e-btn round text icon="sym_r_share" />
</md3e-toolbar>
```

Variants combine naturally:

```html
<md3e-toolbar floating vertical vibrant>
  <md3e-btn round tonal icon="sym_r_format_bold" v-model="boldActive" />
  <md3e-btn round text icon="sym_r_brush" />
  <md3e-btn round text icon="sym_r_palette" />
</md3e-toolbar>
```

### Button Conventions for Floating Toolbars

| Props         | Icon | Label | 1:1 |  `v-model`   | Description    |
|:--------------|:----:|:-----:|:---:|:------------:|:---------------|
| `round text`  |  ✔️  |       | ✔️  |              | Circle, flat   |
| `round`       |  ✔️  |       | ✔️  |              | Circle, filled |
| `round tonal` |  ✔️  |       | ✔️  | **Required** | Circle, toggle |
| `text`        |  ✔️  | Horz  |     |              | Pill, flat     |
| (default)     |  ✔️  | Horz  |     |              | Pill, filled   |
| `tonal`       |  ✔️  | Horz  |     | **Required** | Pill, toggle   |

Toggle buttons use `tonal` by convention. `round` is the preferred shape, use non-round buttons for emphasis.

**Don't** use `square` on buttons in floating toolbars — the pill-shaped toolbar calls for round buttons.

**Don't** use labels — floating toolbars are icon-only.

**Don't** set `color` on buttons — the theme manages colors automatically based on the variant.

**Don't** use `dense` or `stretch` — toolbars are larger now (64dp) and these attributes produce incorrect sizing.

### Pairing a floating toolbar with a FAB

Use the `.q-toolbar-floating-group` helper class:

```html
<div class="q-toolbar-floating-group">
  <md3e-toolbar floating>
    <!-- ... -->
  </md3e-toolbar>
  <md3e-btn fab icon="..." />
</div>
```

## Surface Override

By default, toolbars use `surface-container` background. Use `surface` to match the page body background instead — useful for app bars that should blend with the content area rather than stand out:

```html
<q-header>
  <md3e-toolbar surface>
    <md3e-btn round square text icon="sym_r_menu" />
    <q-toolbar-title>My App</q-toolbar-title>
  </md3e-toolbar>
</q-header>
```

This can also be useful when embedding a toolbar inside another `surface-container` element (e.g. a card) to avoid identical backgrounds:

```html
<q-card>
  <md3e-toolbar surface>
    <q-toolbar-title>Card toolbar</q-toolbar-title>
  </md3e-toolbar>
  <q-card-section>Content</q-card-section>
</q-card>
```

The `surface` prop is ignored when `vibrant` is set, since vibrant has its own background color.

## Using QToolbar Directly

All styling is CSS-driven. You can use plain `QToolbar` with the corresponding classes:

```html
<!-- Remove default gap -->
<q-toolbar class="q-toolbar--no-gap">...</q-toolbar>

<!-- Surface background -->
<q-toolbar class="bg-surface">...</q-toolbar>

<!-- Floating -->
<q-toolbar class="q-toolbar--floating">...</q-toolbar>

<!-- Floating vibrant -->
<q-toolbar class="q-toolbar--floating q-toolbar--floating--vibrant">...</q-toolbar>

<!-- Floating vertical -->
<q-toolbar class="q-toolbar--floating q-toolbar--floating--vertical">...</q-toolbar>

<!-- Floating vertical vibrant -->
<q-toolbar class="q-toolbar--floating q-toolbar--floating--vertical q-toolbar--floating--vibrant">...</q-toolbar>
```

## CSS Classes Reference

| Class                            | Applied by | Description                                                                     |
|----------------------------------|------------|---------------------------------------------------------------------------------|
| `.q-toolbar--floating`           | `floating` | Auto-width, pill corners, level 3 elevation, 16dp margin, 8dp gap               |
| `.q-toolbar--floating--vibrant`  | `vibrant`  | `primary-container` background, `on-primary-container` text                 |
| `.q-toolbar--floating--vertical` | `vertical` | `flex-direction: column`, swaps min-height to min-width, 24dp horizontal margin |
| `.bg-surface`                    | `surface`  | Overrides background from `surface-container` to `surface`                      |
| `.q-toolbar--no-gap`             | `noGap`    | Removes the default 8dp gap between items                                       |
