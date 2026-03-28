/**
 * Md3eBtnGroup — MD3 Expressive Button Group Component
 *
 * A wrapper around Quasar's QBtnGroup with MD3E-appropriate defaults:
 * - Standard group (spaced, individual pill shapes) is the default
 * - Connected group (continuous pill shape) via the `connected` prop
 * - Variant shortcuts: `tonal`, `text`, `elevated` (same as Md3eBtn)
 *
 * This inverts QBtnGroup's defaults where connected is default and
 * `stretch` is repurposed for standard groups.
 *
 * All QBtnGroup props and slots pass through unchanged.
 *
 * @example
 * // Standard group (default)
 * <md3e-btn-group>
 *   <q-btn label="A" />
 *   <q-btn label="B" />
 * </md3e-btn-group>
 *
 * // Connected tonal group
 * <md3e-btn-group connected tonal>
 *   <q-btn label="Day" />
 *   <q-btn label="Week" />
 * </md3e-btn-group>
 *
 * // Disable widening on press
 * <md3e-btn-group no-widening>
 *   <q-btn label="A" />
 *   <q-btn label="B" />
 * </md3e-btn-group>
 */

import { h, defineComponent } from 'vue'
import { QBtnGroup } from 'quasar'

export const Md3eBtnGroup = defineComponent({
  name: 'Md3eBtnGroup',

  inheritAttrs: false,

  props: {
    /** Use connected group variant (continuous pill shape, 2dp gaps) */
    connected: Boolean,

    /** MD3E tonal variant (maps to glossy on QBtnGroup) */
    tonal: Boolean,

    /** MD3E text variant (maps to flat on QBtnGroup) */
    text: Boolean,

    /** MD3E elevated variant (maps to unelevated=false on QBtnGroup) */
    elevated: Boolean,

    /** Disable padding widening/shrinking on press */
    noWidening: Boolean,
  },

  setup(props, { attrs, slots }) {
    return () => {
      const {
        stretch: _stretch,
        glossy: attrGlossy,
        flat: attrFlat,
        unelevated: attrUnelevated,
        class: attrClass,
        ...restAttrs
      } = attrs

      return h(QBtnGroup, {
        ...restAttrs,
        // Standard is default; connected disables stretch
        stretch: props.connected ? undefined : true,
        // Variant shortcuts (attrs are "" for boolean HTML attrs, use != null to detect presence)
        glossy: props.tonal || (attrGlossy != null && attrGlossy !== false) || undefined,
        flat: props.text || (attrFlat != null && attrFlat !== false) || undefined,
        unelevated: props.elevated ? false : (attrUnelevated != null ? attrUnelevated !== false : undefined),
        class: [
          attrClass,
          props.noWidening ? 'no-widening' : null,
        ].filter(Boolean),
      }, slots)
    }
  },
})
