# Md3eBtnGroup

A wrapper around Quasar's `QBtnGroup` that provides MD3 Expressive defaults and variant shortcuts. In MD3E, the **standard** group (spaced buttons, individual pill shapes) is the primary variant, while the **connected** group (continuous pill shape) is secondary.

Quasar's `QBtnGroup` has the opposite defaults — connected is default, and the `stretch` prop is repurposed by the MD3E theme to mean "standard group." This wrapper inverts that so you don't have to think about the underlying prop mapping.

## Why `stretch` Is Repurposed

Quasar's original `stretch` prop made buttons fill their container's height (`align-self: stretch`). This concept has no place in MD3E's design system, where button sizing follows a strict token-based scale. The MD3E theme repurposes the `stretch` CSS class to trigger the standard button group variant instead. `Md3eBtnGroup` abstracts this away — you just use `connected` or don't.

The MD3E theme changes `QBtnGroup` behavior whether you use this wrapper or not — the `stretch` prop means "standard group" the moment the theme is active. `Md3eBtnGroup` simply gives you a cleaner API that matches what the theme is actually doing, so you don't have to remember that `stretch` no longer means what Quasar's docs say it does.

## Installation

Note: you can import `MBtnGroup` and use `m-btn-group` instead for convenience

```ts
import { Md3eBtnGroup } from '@anoyomoose/q2-fresh-paint-md3e/components'
```

Register globally:

```ts
import { Md3eBtnGroup } from '@anoyomoose/q2-fresh-paint-md3e/components'

app.component('Md3eBtnGroup', Md3eBtnGroup)
```

Or locally:

```ts
import { Md3eBtnGroup } from '@anoyomoose/q2-fresh-paint-md3e/components'

export default {
  components: { Md3eBtnGroup },
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `connected` | Boolean | `false` | Use the connected group variant (continuous pill shape, 2dp gaps, 8dp inner corners). |
| `tonal` | Boolean | `false` | MD3E tonal variant. Maps to `glossy` on QBtnGroup. |
| `text` | Boolean | `false` | MD3E text variant. Maps to `flat` on QBtnGroup. |
| `elevated` | Boolean | `false` | MD3E elevated variant. Maps to `unelevated=false` on QBtnGroup. |
| `noWidening` | Boolean | `false` | Disable padding widening/shrinking on press in standard groups. Can also be applied as a `no-widening` CSS class on any `QBtnGroup`. |

All other QBtnGroup props pass through: `outline`, `unelevated`, `glossy`, `flat`, `push`, `rounded`, `square`, `spread`.

The Quasar props and the MD3E shortcuts can both be used — they're merged, not exclusive. `tonal` and `glossy` are equivalent, as are `text` and `flat`.

## Group Variants

### Standard Group (default)

Buttons are individually shaped as pills with 12dp gaps between them. On press, the active button grows wider while its neighbors shrink. Selected buttons (via `Md3eBtn` toggle) morph to a **square** shape (12dp corners).

Works with both `Md3eBtn` and plain `QBtn`:

```html
<md3e-btn-group>
  <md3e-btn v-model="styles" value="bold"      icon="format_bold"      />
  <md3e-btn v-model="styles" value="italic"    icon="format_italic"    />
  <md3e-btn v-model="styles" value="underline" icon="format_underline" />
</md3e-btn-group>

<!-- Plain QBtn works too -->
<md3e-btn-group>
  <q-btn label="Cut" icon="content_cut" />
  <q-btn label="Copy" icon="content_copy" />
  <q-btn label="Paste" icon="content_paste" />
</md3e-btn-group>
```

### Connected Group

Buttons share a continuous pill shape with 2dp gaps and 8dp inner corners. Selected buttons morph to a **pill** (fully rounded) shape, visually "popping out" from the connected group.

```html
<md3e-btn-group connected>
  <md3e-btn v-model="view" value="day"   label="Day"   />
  <md3e-btn v-model="view" value="week"  label="Week"  />
  <md3e-btn v-model="view" value="month" label="Month" />
</md3e-btn-group>

<!-- Connected group with plain QBtn -->
<md3e-btn-group connected>
  <q-btn label="Left" icon="format_align_left" />
  <q-btn label="Center" icon="format_align_center" />
  <q-btn label="Right" icon="format_align_right" />
</md3e-btn-group>
```

## Variant Shortcuts

The same variant shortcuts available on `Md3eBtn` work on the group level:

```html
<!-- Tonal group -->
<md3e-btn-group tonal>
  <q-btn label="A" />
  <q-btn label="B" />
</md3e-btn-group>

<!-- Text group -->
<md3e-btn-group text>
  <q-btn label="A" />
  <q-btn label="B" />
</md3e-btn-group>

<!-- Outline group (native QBtnGroup prop, no shortcut needed) -->
<md3e-btn-group outline>
  <q-btn label="A" />
  <q-btn label="B" />
</md3e-btn-group>
```

| MD3E Prop | QBtnGroup Equivalent | Notes |
|---|---|---|
| `tonal` | `glossy` | Applies tonal (secondary-container) styling at group level |
| `text` | `flat` | Applies flat/text styling at group level |
| `elevated` | `:unelevated="false"` | See limitation below |

## Shape Morphing

Both group variants use animated shape transitions:

- **Standard group**: pressed button morphs from pill (1.5em) to narrower (1.0em adjacent shrink); selected button morphs to square (12dp)
- **Connected group**: selected button morphs to full pill shape, visually protruding from the connected outline

Transitions use `$md3-shape-morph-duration` (350ms) and `$md3-shape-morph-curve` (spring-based easing).

## Known Limitations

1. **Split buttons (QBtnDropdown)** inside groups render as nested wrapper divs, so they don't participate in the press morph/widen interaction.

2. **Group-level shape props** (`rounded`, `square`) do not propagate to individual buttons — the theme's `!important` border-radius overrides control button shapes. Set shape on individual buttons instead.

3. **`elevated` at group level** only sets a CSS class on the group wrapper. Since `boot.ts` sets `unelevated: true` on QBtn globally, setting `elevated` on the group alone won't make buttons elevated — each button needs its own `elevated` prop (on `Md3eBtn`) or `:unelevated="false"` (on `QBtn`).

4. **Dense** buttons do not participate in the widening transitions

5. **Mixing sizes and dense** does not work 

## Using Plain QBtnGroup

If you prefer not to use this wrapper, you can use `QBtnGroup` directly. The MD3E theme repurposes the `stretch` prop for the standard group variant:

```html
<!-- Standard group via QBtnGroup (stretch = standard in MD3E) -->
<q-btn-group stretch>
  <q-btn label="A" />
  <q-btn label="B" />
</q-btn-group>

<!-- Connected group via QBtnGroup (default) -->
<q-btn-group>
  <q-btn label="A" />
  <q-btn label="B" />
</q-btn-group>
```

## Migration from QBtnGroup

The MD3E theme already changes how `QBtnGroup` behaves — `stretch` becomes "standard group," connected is default, and button shapes/interactions are completely different from stock Quasar. Your existing `QBtnGroup` markup is already affected by the theme. `Md3eBtnGroup` just gives you an API that matches this new reality.

Replace `<q-btn-group>` with `<md3e-btn-group>`. Standard is now the default, so remove `stretch` if you had it. If you had a connected group (no `stretch`), add the `connected` prop. Map design props to MD3E shortcuts where applicable.

```html
<!-- Before: standard group -->
<q-btn-group stretch glossy>
  <q-btn label="A" />
  <q-btn label="B" />
</q-btn-group>

<!-- After: standard tonal group -->
<md3e-btn-group tonal>
  <q-btn label="A" />
  <q-btn label="B" />
</md3e-btn-group>

<!-- Before: connected group -->
<q-btn-group>
  <q-btn label="A" />
  <q-btn label="B" />
</q-btn-group>

<!-- After: connected group -->
<md3e-btn-group connected>
  <q-btn label="A" />
  <q-btn label="B" />
</md3e-btn-group>
```
