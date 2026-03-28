/**
 * Md3eBtn — MD3 Expressive Button Component
 *
 * A drop-in replacement for Quasar's QBtn that adds:
 * - Toggle/selection support via v-model (standalone, single-select, multi-select)
 * - Color family shortcuts (primary, secondary, tertiary)
 * - Variant shortcuts (elevated, tonal, text)
 * - Selected icon swapping
 *
 * **Important**: Due to MD3E's design principles, not all variants support
 * arbitrary colors. `elevated` and `tonal` variants, as well as all `toggle`
 * buttons, support only `primary`, `secondary`, `tertiary`, and `error` colors!
 *
 * All styling is handled by CSS classes (.q-btn--toggle, .q-btn--selected)
 * defined in the theme's QBtn.scss. Users can apply these classes manually
 * to a plain QBtn without using this wrapper.
 *
 * @example
 * // Standalone toggle
 * <md3e-btn v-model="isActive" label="Toggle me" />
 *
 * // Single-select group
 * <md3e-btn v-model="choice" value="a" label="A" />
 * <md3e-btn v-model="choice" value="b" label="B" />
 *
 * // Multi-select group
 * <md3e-btn v-model="choices" value="a" label="A" />  // choices is an array
 * <md3e-btn v-model="choices" value="b" label="B" />
 *
 * // Tonal primary button
 * <md3e-btn tonal primary label="Tonal" />
 *
 * // Elevated button
 * <md3e-btn elevated label="Elevated" />
 *
 * // Disable shape morphing on press (button keeps its resting shape)
 * <md3e-btn no-morph label="No morph" />
 */

import { h, computed, defineComponent } from 'vue'
import { QBtn, QTooltip } from 'quasar'

export const Md3eBtn = defineComponent({
  name: 'Md3eBtn',

  inheritAttrs: false,

  props: {
    /**
     * Optional model value. When provided, enables toggle mode.
     * - Boolean: standalone toggle (true/false)
     * - Primitive + value prop: single-select (emits value or null)
     * - Array + value prop: multi-select (adds/removes value)
     * - undefined: normal button (no toggle behavior)
     * - null: toggle mode, nothing selected
     */
    modelValue: { default: undefined },

    /**
     * Value for group selection modes. Button is selected when
     * modelValue === value (single) or modelValue.includes(value) (multi).
     */
    value: { default: undefined },

    /** Use primary color family */
    primary: Boolean,

    /** Use secondary color family */
    secondary: Boolean,

    /** Use tertiary/accent color family */
    tertiary: Boolean,

    /** Use error/negative color family */
    error: Boolean,

    /**
     * Pass through the color attr to QBtn as-is, bypassing color computation.
     * Only needed for non-standard colors (e.g. color="deep-orange").
     * color="primary", "secondary", "tertiary", "accent", "error", "negative",
     * work without this.
     */
    allowColor: Boolean,

    /** MD3E elevated variant (sets unelevated=false on QBtn) */
    elevated: Boolean,

    /** MD3E tonal variant (sets glossy on QBtn) */
    tonal: Boolean,

    /** MD3E text variant (sets flat on QBtn) */
    text: Boolean,

    /** Disable shape morphing on press */
    noMorph: Boolean,

    /** Icon to show when in selected state (swaps the icon prop) */
    selectedIcon: String,
  },

  emits: ['update:modelValue'],

  setup(props, { attrs, emit, slots }) {
    // Whether this button is in toggle mode (modelValue was provided)
    const isToggle = computed(() => props.modelValue !== undefined)

    // Whether this button is currently selected
    const isSelected = computed(() => {
      if (!isToggle.value) return false
      if (props.value !== undefined) {
        // Group mode: compare with value prop
        return Array.isArray(props.modelValue)
          ? (props.modelValue as unknown[]).includes(props.value)
          : props.modelValue === props.value
      }
      // Standalone toggle: truthy check
      return !!props.modelValue
    })

    // Computed color resolution
    const computedColor = computed(() => {
      if (props.allowColor) return attrs.color as string | undefined

      // Direct color attr shortcuts (no allowColor needed)
      const c = attrs.color as string | undefined
      if (c === 'primary') return 'primary'
      if (c === 'secondary') return 'secondary'
      if (c === 'tertiary') return 'accent'
      if (c === 'accent') return 'accent'
      if (c === 'error') return 'negative'
      if (c === 'negative') return 'negative'

      // Boolean props
      if (props.primary) return 'primary'
      if (props.secondary) return 'secondary'
      if (props.tertiary) return 'accent'
      if (props.error) return 'negative'

      // Default: tonal/glossy → secondary, everything else → primary
      return (props.tonal || (attrs.glossy as boolean)) ? 'secondary' : 'primary'
    })

    // Click handler for toggle behavior
    function handleClick(_e: Event) {
      if (!isToggle.value) return

      if (props.value !== undefined) {
        if (Array.isArray(props.modelValue)) {
          // Multi-select: add or remove value from array
          const arr = [...props.modelValue] as unknown[]
          const idx = arr.indexOf(props.value)
          if (idx >= 0) {
            arr.splice(idx, 1)
          } else {
            arr.push(props.value)
          }
          emit('update:modelValue', arr)
        } else {
          // Single-select: set value, or clear if already selected
          emit('update:modelValue',
            props.modelValue === props.value ? null : props.value
          )
        }
      } else {
        // Standalone toggle: flip boolean
        emit('update:modelValue', !props.modelValue)
      }
    }

    return () => {
      // Destructure attrs we need to intercept; rest passes through
      const {
        color: _color,
        flat: attrFlat,
        glossy: attrGlossy,
        unelevated: attrUnelevated,
        icon: attrIcon,
        label: attrLabel,
        class: attrClass,
        onClick: attrOnClick,
        ...restAttrs
      } = attrs

      // FABs: convert label to tooltip (MD3E FABs are icon-only)
      const isFab = restAttrs.fab !== undefined || restAttrs[ 'fab-mini' ] !== undefined
      const hasDefaultSlot = slots.default && slots.default().length > 0
      const labelAsTooltip = isFab && attrLabel && !hasDefaultSlot

      // Build the merged onClick handler array
      const onClickHandlers: Array<(e: Event) => void> = []
      onClickHandlers.push(handleClick)
      if (typeof attrOnClick === 'function') {
        onClickHandlers.push(attrOnClick as (e: Event) => void)
      } else if (Array.isArray(attrOnClick)) {
        onClickHandlers.push(...(attrOnClick as Array<(e: Event) => void>))
      }

      return h(QBtn, {
        ...restAttrs,

        // Color: computed from our logic
        color: computedColor.value,

        // Variant merging
        flat: props.text || attrFlat || undefined,
        glossy: props.tonal || attrGlossy || undefined,
        unelevated: props.elevated ? false : (attrUnelevated ?? undefined),

        // Icon: swap when selected
        icon: (isSelected.value && props.selectedIcon)
          ? props.selectedIcon
          : (attrIcon as string | undefined),

        // Accessibility
        'aria-pressed': isToggle.value ? (isSelected.value ? 'true' : 'false') : undefined,
        'aria-label': labelAsTooltip ? (attrLabel as string) : undefined,

        // Classes: merge user classes with toggle/selected/no-morph
        class: [
          attrClass,
          isToggle.value ? 'q-btn--toggle' : null,
          isSelected.value ? 'q-btn--selected' : null,
          props.noMorph ? 'no-morph' : null,
        ].filter(Boolean),

        // Label: strip for FABs (MD3E FABs are icon-only)
        label: isFab ? undefined : (attrLabel as string | undefined),

        // Click: our handler + user's handler
        onClick: onClickHandlers,
      }, labelAsTooltip
        ? { default: () => [ h(QTooltip, {}, () => attrLabel as string) ] }
        : slots
      )
    }
  },
})
