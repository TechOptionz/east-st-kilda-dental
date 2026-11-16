'use client'

import { useEffect, useRef } from 'react'
import { track, trackBookingStart } from '@/lib/analytics'
import { BOOKING_URL } from '@/lib/business'

/**
 * The embedded booking system on /online-booking.
 *
 * The booking runs on the practice software's own domain inside this iframe, so
 * a completed booking is invisible to us — the browser will not let a parent
 * page see anything that happens inside a cross-origin frame, and no amount of
 * tagging changes that. Completed bookings are counted in the practice software.
 *
 * Two things can honestly be measured from out here:
 *
 *   booking_widget_view — the frame was scrolled into view. Fires once, not on
 *     page load, which would count everyone who bounced off the hero.
 *
 *   booking_start — the visitor began using it. A click, tap or keystroke that
 *     lands inside a cross-origin frame moves the browser's focus into it, and
 *     that the parent can see: the window loses focus and the frame becomes
 *     document.activeElement. It is the deepest point of the booking this page
 *     can observe, and it takes a deliberate act — loading or scrolling past
 *     the widget never fires it.
 *
 * If booking_widget_view is high and booking_start is low, the widget is the
 * problem, not the page.
 */
export default function BookingFrame() {
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let poll: number | undefined

    function check() {
      if (document.activeElement !== el) return
      trackBookingStart('widget')
      stop()
    }

    // The frame takes focus just after the window reports losing it.
    function onBlur() {
      window.setTimeout(check, 0)
    }

    function stop() {
      window.removeEventListener('blur', onBlur)
      window.clearInterval(poll)
    }

    window.addEventListener('blur', onBlur)
    /* Some mobile browsers move focus into the frame without telling the
       window it blurred, so the same check also runs on a slow timer. */
    poll = window.setInterval(check, 1000)

    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            track('booking_widget_view')
            observer?.disconnect() // Once per page view, not once per scroll past.
          }
        },
        { threshold: 0.3 },
      )
      observer.observe(el)
    }

    return () => {
      stop()
      observer?.disconnect()
    }
  }, [])

  return (
    <iframe
      ref={ref}
      className="embed-frame"
      src={BOOKING_URL}
      title="Book an appointment at East St Kilda Dental"
      loading="lazy"
    />
  )
}
