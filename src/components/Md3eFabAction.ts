/**
 * Md3eFabAction — MD3 Expressive FAB Menu Action Component
 *
 * Wraps QFabAction with MD3E defaults:
 * - Default icon from icon set, default label "Label"
 * - `left` prop controls label-position (inherits from parent Md3eFab if not set)
 *
 * @example
 * <md3e-fab-action icon="sym_r_mail" label="Mail" />
 *
 * // Inside Md3eFab, inherits left from parent:
 * <md3e-fab left>
 *   <md3e-fab-action icon="sym_r_mail" label="Mail" />
 * </md3e-fab>
 */

import { h, computed, defineComponent, inject, ref } from 'vue'
import { QFabAction } from 'quasar'
import { useQuasar } from 'quasar'

export const Md3eFabAction = defineComponent({
  name: 'Md3eFabAction',

  inheritAttrs: false,

  props: {
    /** Action icon. Defaults to the icon set's fab icon. */
    icon: String,

    /** Action label. Defaults to "Label". */
    label: {
      type: String,
      default: 'Label',
    },

    /** Place label on the left. If not set, inherits from parent Md3eFab. */
    left: {
      type: Boolean,
      default: undefined,
    },
  },

  setup (props, { attrs, slots }) {
    const $q = useQuasar()
    const parentLeft = inject('md3e-fab-left', ref(false))

    const resolvedIcon = computed(() =>
      props.icon || $q.iconSet.fab.icon
    )

    const resolvedLeft = computed(() =>
      props.left !== undefined ? props.left : parentLeft.value
    )

    return () => {
      const { class: attrClass, ...restAttrs } = attrs

      return h(QFabAction, {
        ...restAttrs,
        class: attrClass,
        icon: resolvedIcon.value,
        label: props.label,
        labelPosition: resolvedLeft.value ? 'left' : 'right',
      }, slots)
    }
  },
})
