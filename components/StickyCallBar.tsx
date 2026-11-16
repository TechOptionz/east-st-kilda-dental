import { business, telHref } from '@/lib/business'

/**
 * Sticky "Call now" bar, fixed to the bottom of the screen on mobile.
 *
 * Emergency traffic is overwhelmingly mobile and urgent, and the number in the
 * hero disappears the moment someone scrolls. This keeps the one action that
 * matters a single tap away at every point on the page.
 *
 * Hidden on desktop, where the header already carries the number. Call-only by
 * design: adding a second button splits the decision at exactly the moment the
 * visitor is least able to make one.
 *
 * The site-wide listener in components/AnalyticsEvents.tsx counts this tap as
 * a phone_click, once, like every other tel: link. The label below is what
 * tells it apart from the header and hero numbers in reports.
 */
export default function StickyCallBar() {
  return (
    <a
      href={telHref}
      className="sticky-call"
      aria-label={`Call ${business.name} now on ${business.telephoneDisplay}`}
      data-analytics-location="sticky-call-bar"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
      </svg>
      <strong>Call now</strong>
      <span>{business.telephoneDisplay}</span>
    </a>
  )
}
