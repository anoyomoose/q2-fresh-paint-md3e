/**
 * Md3eToolbar — MD3 Expressive Toolbar Component
 *
 * A wrapper around Quasar's QToolbar with MD3E variant shortcuts:
 * - Floating toolbar (auto-sized, elevated, pill-shaped)
 * - Vibrant color scheme (secondary-container background)
 * - Vertical layout (column of icon buttons)
 * - Surface override
 *
 * All QToolbar props and slots pass through unchanged.
 *
 * All styling is handled by CSS classes (.q-toolbar--floating,
 * .q-toolbar--floating--vibrant, .q-toolbar--floating--vertical,
 * .q-toolbar--no-gap) defined in the theme's
 * QToolbar.scss. Users can apply these classes manually to a plain
 * QToolbar without using
 * this wrapper.
 *
 * @example
 * // Docked toolbar (default) — buttons should be round+square
 * <md3e-toolbar>
 *   <md3e-btn round square text icon="sym_r_menu" />
 *   <q-toolbar-title>My App</q-toolbar-title>
 *   <md3e-btn round square text icon="sym_r_search" />
 * </md3e-toolbar>
 *
 * // Floating toolbar — icon-only buttons
 * <md3e-toolbar floating>
 *   <md3e-btn text round icon="sym_r_edit" />
 *   <md3e-btn text round icon="sym_r_delete" />
 * </md3e-toolbar>
 *
 * // Floating vibrant toolbar
 * <md3e-toolbar floating vibrant>
 *   <md3e-btn text round icon="sym_r_edit" />
 *   <md3e-btn text round icon="sym_r_share" />
 * </md3e-toolbar>
 *
 * // Floating vertical toolbar
 * <md3e-toolbar floating vertical>
 *   <md3e-btn text round icon="sym_r_edit" />
 *   <md3e-btn text round icon="sym_r_delete" />
 * </md3e-toolbar>
 *
 * // Surface background override
 * <md3e-toolbar surface>
 *   <q-toolbar-title>On surface</q-toolbar-title>
 * </md3e-toolbar>
 */

import { h, defineComponent } from 'vue'
import { QToolbar } from 'quasar'

export const Md3eToolbar = defineComponent({
  name: 'Md3eToolbar',

  inheritAttrs: false,

  props: {
    /** Floating toolbar variant (auto-sized, pill shape, FAB-level elevation) */
    floating: Boolean,

    /** Vibrant color scheme (secondary-container background). Requires floating. */
    vibrant: Boolean,

    /** Vertical layout (column of icon buttons). Requires floating. */
    vertical: Boolean,

    /** Override background to surface (instead of default surface-container) */
    surface: Boolean,

    /** Remove the default gap between items */
    noGap: Boolean,
  },

  setup(props, { attrs, slots }) {
    return () => {
      const {
        class: attrClass,
        ...restAttrs
      } = attrs

      return h(QToolbar, {
        ...restAttrs,
        class: [
          attrClass,
          props.floating ? 'q-toolbar--floating' : null,
          props.floating && props.vibrant ? 'q-toolbar--floating--vibrant' : null,
          props.floating && props.vertical ? 'q-toolbar--floating--vertical' : null,
          props.surface && !props.vibrant ? 'bg-surface' : null,
          props.noGap ? 'q-toolbar--no-gap' : null,
        ].filter(Boolean),
      }, slots)
    }
  },
})

export { Md3eToolbar as MToolbar }
