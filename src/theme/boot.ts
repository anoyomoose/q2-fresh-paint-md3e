// MD3 Expressive Boot File — Sets component prop defaults for MD3E styling

import { boot } from 'quasar/wrappers'
import {
  QBtn,
  QBtnDropdown,
  QChip,
  QSlider,
  QTabs,
} from 'quasar'

function setupOutlinedNotch () {
  if (typeof document === 'undefined') return // SSR guard

  function updateNotch (field: Element) {
    const control = field.querySelector('.q-field__control') as HTMLElement
    const label = field.querySelector('.q-field__label') as HTMLElement
    if (!control || !label) return

    // Only process fields with data-notch (set by trackField, excludes no-input-notch)
    if (!(field as HTMLElement).hasAttribute('data-notch')) return

    const container = control.querySelector('.q-field__control-container') as HTMLElement
    if (!container) return

    const isFloat = field.classList.contains('q-field--float')

    if (!isFloat) {
      // Closing: animate notch to center, then clear.
      // Read current values before they disappear.
      const curLeft = parseFloat(control.style.getPropertyValue('--notch-left') || '0')
      const curWidth = parseFloat(control.style.getPropertyValue('--notch-width') || '0')
      if (curWidth > 0) {
        // Set target = center point (notch closes inward)
        const center = curLeft + curWidth / 2
        control.style.setProperty('--notch-left', `${ center }px`)
        control.style.setProperty('--notch-width', '0px')
      }
      // Reset label position
      label.style.removeProperty('left')
      return
    }

    // Opening: calculate final notch position from layout properties.
    // transform-origin: left top → left edge stays pinned during scale(0.75).
    const prepend = control.querySelector('.q-field__prepend') as HTMLElement

    // Label alignment depends on whether there's a prepend icon:
    // - With icon: notch edge aligns with icon start (12px control padding)
    // - Without icon: label TEXT aligns with content start (16px control padding),
    //   so subtract visual padding (4px * 0.75 = 3px) from the element position
    const targetLeft = prepend ? 12 : 16
    const visualPadding = 3 // 4px label padding * 0.75 scale
    const padOffset = prepend ? 0 : visualPadding

    label.style.left = `${ targetLeft - container.offsetLeft - padOffset }px`

    // Notch left is shifted 1px left in the CSS mask to prevent sub-pixel gaps
    // at the left junction. Compensate by starting 1px earlier.
    const notchLeft = targetLeft - padOffset - 1
    // Label gets padding: 0 4px in float state (for notch gap spacing).
    // Since padding now transitions, offsetWidth may not yet include it.
    // Add 8px (4px each side) to ensure the notch accommodates the final width.
    // Add 2px to match the CSS mask bottom strip which is 2px wider (+1px each
    // side) to prevent sub-pixel rounding gaps at strip junctions.
    const currentPadH = parseFloat(getComputedStyle(label).paddingLeft || '0')
      + parseFloat(getComputedStyle(label).paddingRight || '0')
    const targetPadH = 8 // 4px left + 4px right from float CSS
    const notchWidth = (label.offsetWidth + targetPadH - currentPadH) * 0.75 + 2

    // Check if notch is already open (resize vs initial open)
    const existingWidth = parseFloat(control.style.getPropertyValue('--notch-width') || '0')
    if (existingWidth > 0) {
      // Already open — just update values (no animation restart)
      control.style.setProperty('--notch-left', `${ notchLeft }px`)
      control.style.setProperty('--notch-width', `${ notchWidth }px`)
    } else {
      // Initial open — animate from center outward
      const center = notchLeft + notchWidth / 2
      control.style.setProperty('--notch-left', `${ center }px`)
      control.style.setProperty('--notch-width', '0px')
      requestAnimationFrame(() => {
        control.style.setProperty('--notch-left', `${ notchLeft }px`)
        control.style.setProperty('--notch-width', `${ notchWidth }px`)
      })
    }
  }

  // Observe label size changes (content/font changes, resize)
  const resizeObs = new ResizeObserver(entries => {
    for (const entry of entries) {
      const field = (entry.target as HTMLElement).closest('.q-field--outlined')
      if (field) updateNotch(field)
    }
  })

  function untrackField (field: Element) {
    if (!(field as HTMLElement).hasAttribute('data-notch')) return

    (field as HTMLElement).removeAttribute('data-notch')

    // Clear inline notch styles
    const control = field.querySelector('.q-field__control') as HTMLElement
    if (control) {
      control.style.removeProperty('--notch-left')
      control.style.removeProperty('--notch-width')
    }

    // Clear label positioning
    const label = field.querySelector('.q-field__label') as HTMLElement
    if (label) {
      label.style.removeProperty('left')
      resizeObs.unobserve(label)
    }
  }

  function trackField (field: Element) {
    // Only process outlined fields
    if (!field.classList.contains('q-field--outlined')) return

    // Skip fields with .no-input-notch on themselves or any ancestor
    if ((field as HTMLElement).closest('.no-input-notch')) return

    (field as HTMLElement).setAttribute('data-notch', '')

    const label = field.querySelector('.q-field__label')
    if (label) {
      resizeObs.observe(label)
      updateNotch(field)
    }
  }

  // Watch for new fields and float class toggling
  const mutObs = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const el = m.target as HTMLElement
        if (el.classList.contains('q-field') && el.classList.contains('q-field--outlined')) {
          trackField(el)
        } else if (el.classList.contains('q-field') && !el.classList.contains('q-field--outlined')) {
          untrackField(el)
        }
      }
      if (m.type === 'childList') {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return
          if (node.classList.contains('q-field--outlined')) trackField(node)
          node.querySelectorAll?.('.q-field--outlined')?.forEach(trackField)
        })
      }
    }
  })

  mutObs.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  })

  // Initial scan for SSR-hydrated or already-rendered fields
  document.querySelectorAll('.q-field--outlined').forEach(trackField)
}

export default boot(() => {
  // MD3E buttons use sentence case (no uppercase)
  QBtn.props.noCaps = { type: Boolean, default: true }
  QBtnDropdown.props.noCaps = { type: Boolean, default: true }

  // MD3E filled buttons are level0 (no shadow)
  QBtn.props.unelevated = { type: Boolean, default: true }
  QBtnDropdown.props.unelevated = { type: Boolean, default: true }

  // === Chips ===
  // MD3E chips use corner-small (8px), not pill
  // `square` disables the default 16px radius so our CSS override applies 8px
  QChip.props.square = { type: Boolean, default: true }

  // === Tabs ===
  // MD3E tabs use sentence case
  QTabs.props.noCaps = { type: Boolean, default: true }

  // === Outlined text field notch ===
  setupOutlinedNotch()
})
