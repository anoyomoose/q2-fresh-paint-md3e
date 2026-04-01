/**
 * Md3eSlider — MD3 Expressive Slider Component
 *
 * A wrapper around Quasar's QSlider that adds MD3E size presets
 * and an optional icon rendered over the track (below the thumb).
 *
 * The size prop controls track-size, thumb-size, and applies a
 * q-slider--{size} CSS class for matching border-radius.
 *
 * User-provided track-size and thumb-size props take precedence
 * over the size preset values.
 *
 * All QSlider props and slots pass through unchanged.
 *
 * @example
 * <md3e-slider v-model="val" size="md" />
 * <md3e-slider v-model="val" size="lg" icon="sym_r_volume_up" />
 * <md3e-slider v-model="val" size="xl" icon="sym_r_brightness_5" icon-color="primary" />
 */

import { h, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { QSlider, QIcon } from 'quasar'

type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizePresets: Record<SliderSize, { trackSize: string; thumbSize: string }> = {
  xs: { trackSize: '16px', thumbSize: '32px' },
  sm: { trackSize: '24px', thumbSize: '44px' },
  md: { trackSize: '40px', thumbSize: '52px' },
  lg: { trackSize: '56px', thumbSize: '68px' },
  xl: { trackSize: '96px', thumbSize: '108px' },
}

const iconSizeDefaults: Record<SliderSize, string> = {
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '28px',
  xl: '32px',
}

export const Md3eSlider = defineComponent({
  name: 'Md3eSlider',

  inheritAttrs: false,

  props: {
    /** MD3E size preset — controls track-size, thumb-size, and border-radius */
    size: {
      type: String as PropType<SliderSize>,
      default: undefined,
    },

    /** Icon to display on the track (below the thumb) */
    icon: String,

    /** Icon size override (defaults based on slider size) */
    iconSize: String,

    /** Icon color (Quasar color name, defaults to 'on-primary') */
    iconColor: String,
  },

  setup(props, { attrs, slots }) {
    const effectiveSize = computed(() =>
      props.size
      ?? (attrs.trackSize == null && attrs.thumbSize == null ? 'sm' : undefined)
    )

    const effectiveIconSize = computed(() =>
      props.iconSize ?? (effectiveSize.value ? iconSizeDefaults[effectiveSize.value] : '16px')
    )

    const effectiveIconColor = computed(() =>
      props.iconColor ?? 'on-primary'
    )

    return () => {
      const {
        class: attrClass,
        trackSize: attrTrackSize,
        thumbSize: attrThumbSize,
        ...restAttrs
      } = attrs

      const size = effectiveSize.value
      const preset = size ? sizePresets[size] : undefined
      const isVertical = attrs.vertical != null && attrs.vertical !== false
      const isReverse = attrs.reverse != null && attrs.reverse !== false

      if (!props.icon) {
        return h(QSlider, {
          ...restAttrs,
          trackSize: (attrTrackSize as string) ?? preset?.trackSize,
          thumbSize: (attrThumbSize as string) ?? preset?.thumbSize,
          class: [
            attrClass,
            size ? `q-slider--${size}` : null,
          ].filter(Boolean),
        }, slots)
      }

      // Split classes: q-m*/q-p* (margin/padding) go on wrapper, rest on slider
      const wrapperClasses: string[] = ['q-slider__icon-wrapper']
      const sliderClasses: (string | undefined)[] = [size ? `q-slider--${size}` : undefined]

      if (typeof attrClass === 'string') {
        for (const cls of attrClass.split(/\s+/)) {
          if (cls.startsWith('q-m') || cls.startsWith('q-p')) {
            wrapperClasses.push(cls)
          } else if (cls) {
            sliderClasses.push(cls)
          }
        }
      } else if (attrClass) {
        sliderClasses.push(attrClass as unknown as string)
      }

      const sliderNode = h(QSlider, {
        ...restAttrs,
        trackSize: (attrTrackSize as string) ?? preset?.trackSize,
        thumbSize: (attrThumbSize as string) ?? preset?.thumbSize,
        class: sliderClasses.filter(Boolean),
      }, slots)

      const iconNode = h('div', {
        class: [
          'q-slider__icon',
          isVertical ? 'q-slider__icon--v' : 'q-slider__icon--h',
          isVertical
            ? (isReverse ? 'q-slider__icon--v-rtl' : 'q-slider__icon--v-ltr')
            : (isReverse ? 'q-slider__icon--h-rtl' : 'q-slider__icon--h-ltr'),
        ],
      }, [
        h(QIcon, {
          name: props.icon,
          size: effectiveIconSize.value,
          color: effectiveIconColor.value,
        }),
      ])

      return h('div', {
        class: wrapperClasses,
      }, [sliderNode, iconNode])
    }
  },
})

export { Md3eSlider as MSlider }
