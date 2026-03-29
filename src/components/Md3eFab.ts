/**
 * Md3eFab — MD3 Expressive FAB Menu Component
 *
 * Wraps QFab with MD3E defaults:
 * - Color restricted to primary/secondary/tertiary/error (via props or color attr)
 * - Default icon from icon set
 * - `left` prop controls label-position and vertical-actions-align
 * - Propagates `left` to child Md3eFabAction via provide/inject
 *
 * @example
 * <md3e-fab icon="sym_r_edit" label="Create">
 *   <md3e-fab-action icon="sym_r_mail" label="Mail" />
 *   <md3e-fab-action icon="sym_r_alarm" label="Alarm" />
 * </md3e-fab>
 *
 * // Color shortcuts
 * <md3e-fab secondary icon="sym_r_edit" />
 * <md3e-fab color="tertiary" icon="sym_r_edit" />
 *
 * // Left-aligned labels (propagates to children)
 * <md3e-fab left icon="sym_r_edit" label="Create">
 *   <md3e-fab-action icon="sym_r_mail" label="Mail" />
 * </md3e-fab>
 */

import { h, computed, defineComponent, provide } from 'vue'
import { QFab, useQuasar } from 'quasar'

export const Md3eFab = defineComponent({
  name: 'Md3eFab',

  inheritAttrs: false,

  props: {
    /** FAB icon. Defaults to the icon set's fab icon. */
    icon: String,

    /** FAB label (optional — extended FAB when set). */
    label: String,

    /** Place labels on the left side (also aligns actions left). */
    left: Boolean,

    /** Use primary color family */
    primary: Boolean,

    /** Use secondary color family */
    secondary: Boolean,

    /** Use tertiary/accent color family */
    tertiary: Boolean,

    /** Use error/negative color family */
    error: Boolean,

    /** Pass through the color attr as-is, bypassing color resolution. */
    allowColor: Boolean,
  },

  setup (props, { attrs, slots }) {
    const $q = useQuasar()

    provide('md3e-fab-left', computed(() => props.left))

    const computedColor = computed(() => {
      if (props.allowColor) return attrs.color as string | undefined

      // Direct color attr shortcuts
      const c = attrs.color as string | undefined
      if (c === 'primary') return 'primary'
      if (c === 'secondary') return 'secondary'
      if (c === 'tertiary') return 'tertiary'
      if (c === 'accent') return 'tertiary'
      if (c === 'error') return 'error'
      if (c === 'negative') return 'error'

      // Boolean props
      if (props.primary) return 'primary'
      if (props.secondary) return 'secondary'
      if (props.tertiary) return 'tertiary'
      if (props.error) return 'error'

      // Default: primary
      return 'primary'
    })

    const resolvedIcon = computed(() =>
      props.icon || $q.iconSet.fab.icon
    )

    return () => {
      const {
        color: _color,
        class: attrClass,
        ...restAttrs
      } = attrs

      return h(QFab, {
        ...restAttrs,
        class: attrClass,
        color: computedColor.value,
        icon: resolvedIcon.value,
        label: props.label,
        labelPosition: props.left ? 'left' : 'right',
        verticalActionsAlign: props.left ? 'left' : 'right',
        direction: 'up',
      }, slots)
    }
  },
})

export { Md3eFab as MFab }
