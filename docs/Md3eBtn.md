# Md3eBtn

A drop-in replacement for Quasar's `QBtn` that adds MD3 Expressive toggle/selection support, color family shortcuts, and variant shortcuts. All toggle styling is handled by CSS classes (`.q-btn--toggle`, `.q-btn--selected`) defined in the theme's `QBtn.scss`, so the visual behavior works with or without this wrapper component.

## Component Overview

`Md3eBtn` wraps `QBtn` and adds:

- **Toggle/selection** — standalone toggle, single-select, and multi-select via `v-model`
- **Color family shortcuts** — `primary`, `secondary`, `tertiary`, `error` boolean props
- **Variant shortcuts** — `elevated`, `tonal`, `text` props that map to the underlying Quasar props
- **Selected icon** — swap the button icon when selected

All QBtn props and attributes pass through unchanged. The CSS classes that drive the toggle appearance can also be applied manually to a plain `QBtn` without using this wrapper at all.

**Important**: Due to MD3E's design principles, not all variants support arbitrary colors. `elevated` and `tonal` variants, as well as all `toggle` buttons, support only `primary`, `secondary`, `tertiary`, and `error` colors! 

## Installation

```ts
import { Md3eBtn } from '@anoyomoose/q2-fresh-paint-md3e/components'
```

Register globally in your app entry point:

```ts
import { Md3eBtn } from '@anoyomoose/q2-fresh-paint-md3e/components'

app.component('Md3eBtn', Md3eBtn)
```

Or register locally in a component:

```ts
import { Md3eBtn } from '@anoyomoose/q2-fresh-paint-md3e/components'

export default {
  components: { Md3eBtn },
}
```

In templates, use the kebab-case name:

```html
<md3e-btn label="Click me" />
```

## Props Reference

All `QBtn` props pass through to the underlying button. The following props are added by `Md3eBtn`:

| Prop           | Type | Default | Description                                                                                                                                                                                 |
|----------------|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `modelValue`   | any | `undefined` | Enables toggle mode. `Boolean` = standalone toggle; primitive + `value` = single-select; array + `value` = multi-select. `undefined` = not a toggle. `null` = toggle with nothing selected. |
| `value`        | any | `undefined` | The value this button represents in a group. Used for single-select and multi-select modes.                                                                                                 |
| `primary`      | Boolean | `false` | Use the primary color family.                                                                                                                                                               |
| `secondary`    | Boolean | `false` | Use the secondary color family.                                                                                                                                                             |
| `tertiary`     | Boolean | `false` | Use the tertiary/accent color family.                                                                                                                                                       |
| `error`        | Boolean | `false` | Use the error/negative color family.                                                                                                                                                         |
| `allowColor`   | Boolean | `false` | Pass the `color` attribute through to `QBtn` as-is, bypassing color resolution. Needed for non-standard Quasar colors like `"deep-orange"`.                                                 |
| `elevated`     | Boolean | `false` | MD3E elevated variant. Sets `:unelevated="false"` on the underlying `QBtn`.                                                                                                                 |
| `tonal`        | Boolean | `false` | MD3E tonal variant. Sets `glossy` on the underlying `QBtn` (remapped to container colors by CSS).                                                                                           |
| `text`         | Boolean | `false` | MD3E text variant. Sets `flat` on the underlying `QBtn`.                                                                                                                                    |
| `selectedIcon` | String | `undefined` | Icon to display when the button is in the selected state. Replaces the `icon` prop when selected.                                                                                           |

## Selection Modes

The `modelValue` prop drives all toggle behavior. There are four modes depending on the value types involved.

### 1. Normal Button (no v-model)

When `modelValue` is `undefined` (i.e., no `v-model` binding), the button behaves as a plain `QBtn` with no toggle behavior. Click handlers from attrs pass through normally.

```html
<md3e-btn label="Save" @click="onSave" />
```

### 2. Standalone Toggle

Bind a boolean `v-model`. The button toggles between `true` and `false` on each click. The `.q-btn--toggle` class is applied when in toggle mode, and `.q-btn--selected` is applied when the value is truthy.

```html
<script setup>
import { ref } from 'vue'
const isActive = ref(false)
</script>

<template>
  <md3e-btn v-model="isActive" label="Bold" icon="format_bold" />
</template>
```

### 3. Single-Select Group

Bind a shared primitive `v-model` and give each button a distinct `value` prop. Clicking an unselected button sets the model to that button's value. Clicking an already-selected button clears the selection to `null` (clearable).

```html
<script setup>
import { ref } from 'vue'
// null = toggle mode with nothing selected; undefined would disable toggle entirely
const alignment = ref(null)
</script>

<template>
  <md3e-btn v-model="alignment" value="left"   icon="format_align_left"   />
  <md3e-btn v-model="alignment" value="center" icon="format_align_center" />
  <md3e-btn v-model="alignment" value="right"  icon="format_align_right"  />
</template>
```

### 4. Multi-Select Group

Bind an array `v-model` and give each button a distinct `value` prop. Clicking a button adds its value to the array; clicking again removes it. Any number of buttons can be selected simultaneously.

```html
<script setup>
import { ref } from 'vue'
const styles = ref([])
</script>

<template>
  <md3e-btn v-model="styles" value="bold"      icon="format_bold"      />
  <md3e-btn v-model="styles" value="italic"    icon="format_italic"    />
  <md3e-btn v-model="styles" value="underline" icon="format_underline" />
</template>
```

### Note on undefined vs null

- `modelValue === undefined`: no `v-model` bound — button is a normal button, no toggle classes applied
- `modelValue === null`: toggle mode is active, but nothing is currently selected — unselected styling is applied

Initialize a single-select model with `null` (not `undefined`) if you want the buttons to display their unselected toggle appearance before any selection is made.

## Color System

### Default Color Resolution

The component resolves colors in this order of priority:

1. `allowColor` is set → passes the `color` attr through as-is (use for Quasar color names like `"deep-orange"`)
2. `color="primary"`, `color="secondary"`, or `color="tertiary"` attr → resolved directly (`tertiary` maps to `"accent"`)
3. `primary`, `secondary`, or `tertiary` boolean prop → sets corresponding color
4. Default fallback: `tonal` (or `glossy`) buttons get `"secondary"`; all others get `"primary"`

### Using Color Props

```html
<!-- Primary (default for filled/elevated/text/outlined) -->
<md3e-btn label="Primary" />
<md3e-btn primary label="Primary explicit" />

<!-- Secondary -->
<md3e-btn secondary label="Secondary" />
<md3e-btn color="secondary" label="Secondary via attr" />

<!-- Tertiary (maps to accent internally) -->
<md3e-btn tertiary label="Tertiary" />
<md3e-btn color="tertiary" label="Tertiary via attr" />

<!-- Tonal defaults to secondary color family -->
<md3e-btn tonal label="Tonal (secondary)" />
<md3e-btn tonal primary label="Tonal primary" />
<md3e-btn tonal tertiary label="Tonal tertiary" />
```

### Custom Colors

For non-standard Quasar colors, set `allowColor` to bypass the color resolution logic:

```html
<!-- Without allowColor, "deep-orange" would be ignored and primary used instead -->
<md3e-btn allow-color color="deep-orange" label="Deep Orange" />
```

## Variant Shortcuts

`Md3eBtn` provides MD3E-named props that map to the underlying Quasar button props. Both the shortcut and the underlying Quasar prop work — they are merged, not exclusive.

| MD3E Prop | Quasar Equivalent | Notes |
|---|---|---|
| `elevated` | `:unelevated="false"` | The boot file sets `unelevated=true` globally; `elevated` overrides it to `false` |
| `tonal` | `glossy` | CSS remaps glossy to MD3E tonal container colors |
| `text` | `flat` | Standard Quasar flat button |

```html
<!-- Filled (default — unelevated via boot.ts) -->
<md3e-btn label="Filled" />

<!-- Elevated -->
<md3e-btn elevated label="Elevated" />
<!-- Equivalent: -->
<md3e-btn :unelevated="false" label="Elevated" />

<!-- Tonal -->
<md3e-btn tonal label="Tonal" />
<!-- Equivalent: -->
<md3e-btn glossy label="Tonal" />

<!-- Text -->
<md3e-btn text label="Text" />
<!-- Equivalent: -->
<md3e-btn flat label="Text" />

<!-- Outlined (no shortcut needed — Quasar prop works as-is) -->
<md3e-btn outline label="Outlined" />
```

## Selected Icon

Use `selectedIcon` to swap the button's icon when it enters the selected state. This is useful for toggle buttons where the icon communicates the current state.

```html
<script setup>
import { ref } from 'vue'
const bookmarked = ref(false)
</script>

<template>
  <md3e-btn
    v-model="bookmarked"
    icon="bookmark_border"
    selected-icon="bookmark"
    label="Bookmark"
  />
</template>
```

When `bookmarked` is `true`, the icon switches from `bookmark_border` to `bookmark`.

## Button Groups

`Md3eBtn` works inside both MD3E button group variants (standard and connected), using either `Md3eBtnGroup` or a plain `QBtnGroup` — `Md3eBtnGroup` is just a convenience wrapper with MD3E-friendly defaults.

```html
<!-- Using Md3eBtnGroup (standard is default) -->
<md3e-btn-group>
  <md3e-btn v-model="styles" value="bold"   icon="format_bold"   />
  <md3e-btn v-model="styles" value="italic" icon="format_italic" />
</md3e-btn-group>

<!-- Using plain QBtnGroup (stretch = standard in MD3E theme) -->
<q-btn-group stretch>
  <md3e-btn v-model="styles" value="bold"   icon="format_bold"   />
  <md3e-btn v-model="styles" value="italic" icon="format_italic" />
</q-btn-group>
```

See [Md3eBtnGroup documentation](Md3eBtnGroup.md) for full details on group variants, shape morphing, design props, and known limitations.

## CSS Class Reference (Manual Use)

The toggle appearance is entirely CSS-driven. If you want to use plain `QBtn` without the `Md3eBtn` wrapper, apply these classes manually:

- `.q-btn--toggle` — marks the button as being in toggle mode; enables subdued unselected styling
- `.q-btn--selected` — marks the button as currently selected

```html
<!-- Manual toggle classes on a plain QBtn -->
<q-btn
  :class="['q-btn--toggle', isSelected && 'q-btn--selected']"
  label="Toggle"
  @click="isSelected = !isSelected"
/>
```

### Selected State Colors by Variant

The following color tokens apply when `.q-btn--selected` is present:

| Variant | Unselected (toggle mode) | Selected |
|---|---|---|
| Filled (unelevated) | `surface-container` bg, `on-surface-variant` text | `primary` bg, `on-primary` text |
| Elevated (standard) | `surface-container-low` bg, `primary` text | `primary` bg, `on-primary` text |
| Tonal (glossy) | `secondary-container` bg, `on-secondary-container` text | `secondary` bg, `on-secondary` text |
| Outlined | `outline-variant` border, `on-surface-variant` text | `inverse-surface` bg, `inverse-on-surface` text, no border |

For tonal buttons with explicit color props, the container pair follows the color family:

| Color | Unselected (tonal) | Selected (tonal) |
|---|---|---|
| Primary | `primary-container` / `on-primary-container` | `primary` / `on-primary` |
| Secondary | `secondary-container` / `on-secondary-container` | `secondary` / `on-secondary` |
| Tertiary/Accent | `tertiary-container` / `on-tertiary-container` | `tertiary` / `on-tertiary` |

### Shape Morphing

Toggle buttons also animate shape:

- **Unselected**: pill shape (border-radius: ~1.5em)
- **Selected (standalone)**: square shape (12dp corners)
- **Selected inside a group**: shape depends on group variant — see [Md3eBtnGroup](Md3eBtnGroup.md#shape-morphing)

## Migration from QBtn

Switching from `QBtn` to `Md3eBtn` is a minimal change. All existing `QBtn` props continue to work unchanged.

**Step 1**: Replace the element name in your template.

```html
<!-- Before -->
<q-btn label="Submit" color="primary" @click="onSubmit" />

<!-- After -->
<md3e-btn label="Submit" color="primary" @click="onSubmit" />
```

**Step 2**: Add `v-model` if you want toggle behavior.

```html
<!-- Before: manual active class management -->
<q-btn
  label="Bold"
  :class="isBold ? 'bg-primary text-white' : ''"
  @click="isBold = !isBold"
/>

<!-- After: declarative toggle -->
<md3e-btn v-model="isBold" label="Bold" />
```

**Step 3** (optional): Switch from Quasar variant props to MD3E shorthand props where preferred.

```html
<!-- Both of these are equivalent: -->
<md3e-btn glossy label="Tonal" />
<md3e-btn tonal label="Tonal" />

<!-- Both of these are equivalent: -->
<md3e-btn flat label="Text" />
<md3e-btn text label="Text" />

<!-- Both of these are equivalent: -->
<md3e-btn :unelevated="false" label="Elevated" />
<md3e-btn elevated label="Elevated" />
```

The Quasar props (`flat`, `glossy`, `:unelevated="false"`) continue to work — the MD3E shorthand props are purely additive convenience aliases.
