'use client'

import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { takeUnfinishedForms, track } from '@/lib/analytics'
import { BOOKING_HOST } from '@/lib/business'

/**
 * Site-wide event tracking. Rendered once, in the root layout.
 *
 * It covers the two things a tag manager cannot see on its own:
 *
 *   1. Client-side navigations. Next only loads the document once, so after
 *      the first page every GA4 page view depends on something announcing the
 *      route change. GTM's History Change trigger reads document.title before
 *      React has updated it, which files the new page view under the previous
 *      page's name; this fires after the paint, with the right title.
 *
 *   2. Every tel: and mailto: link on the site, without touching the ~30 pages
 *      that contain one. A delegated listener on the document catches clicks on
 *      links that do not exist yet as readily as the ones that do, so a new page
 *      is tracked the moment it ships and nobody has to remember an onClick.
 *
 *   3. How long each page is actually looked at, and whether a form that was
 *      started ever got sent. See EngagementTracking below.
 *
 * A phone call is this practice's conversion — most visitors ring rather than
 * fill in a form — so call_click is the number that matters most here.
 */

/** Where on the page a link was, for the link_location parameter. */
function locationOf(el: Element): string {
  const tagged = el.closest<HTMLElement>('[data-analytics-location]')
  if (tagged?.dataset.analyticsLocation) return tagged.dataset.analyticsLocation

  // Failing an explicit label, the nearest landmark or id — "header", "contact",
  // "footer" — which is enough to tell the sticky bar from the hero in reports.
  const region = el.closest<HTMLElement>('[id], header, footer, nav, form, section')
  if (region?.id) return region.id
  if (region) return region.tagName.toLowerCase()
  return 'page'
}

function ClickTracking() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target
      if (!(target instanceof Element)) return

      const link = target.closest<HTMLAnchorElement>('a[href]')
      if (!link) return

      const href = link.getAttribute('href') ?? ''
      const shared = {
        link_url: href,
        link_text: (link.textContent ?? '').trim().slice(0, 80),
        link_location: locationOf(link),
        page_path: window.location.pathname,
      }

      if (href.startsWith('tel:')) {
        track('call_click', shared)
        return
      }

      if (href.startsWith('mailto:')) {
        track('email_click', shared)
        return
      }

      if (href.includes(BOOKING_HOST)) {
        track('booking_widget_open', shared)
      }
    }

    /*
     * Capture phase, so the event is recorded even if something between the
     * link and the document calls stopPropagation — and before the browser
     * starts following a tel: link and tears the page down.
     */
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}

function PageViewTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`

  /*
   * The first page view is GTM's job — the container load already fires it, on
   * the Initialization or All Pages trigger every container has. Firing here as
   * well would count the landing page twice, so the first URL is only recorded,
   * not reported, and spa_page_view covers every navigation after it.
   */
  const lastUrl = useRef<string | null>(null)

  useEffect(() => {
    if (lastUrl.current === null) {
      lastUrl.current = url
      return
    }
    if (lastUrl.current === url) return
    lastUrl.current = url

    // After the paint, by which point React has swapped in the new <title>.
    const frame = requestAnimationFrame(() => {
      track('spa_page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [url])

  return null
}

/**
 * Vercel's dashboard counts property values rather than averaging them, so
 * time on page is reported as a range. The exact seconds go to GTM too.
 */
function timeBucket(seconds: number): string {
  if (seconds < 10) return '0-10s'
  if (seconds < 30) return '10-30s'
  if (seconds < 60) return '30-60s'
  if (seconds < 180) return '1-3m'
  if (seconds < 600) return '3-10m'
  return '10m+'
}

/**
 * One page_engagement per page view, plus form_start and form_abandon.
 *
 * Only visible time counts: a page left open in a background tab is not being
 * read. The page view is reported the first time the visitor leaves it — a
 * route change, or the tab being hidden. Hidden is the last moment a mobile
 * browser reliably lets a page send anything, so a visitor who switches away
 * and comes back is counted up to the switch, never twice.
 *
 * form_abandon is stricter: it waits for a real exit (route change or
 * pagehide), because switching to the calendar mid-form and coming back to
 * finish it is not abandoning it. Where a browser kills the page without a
 * pagehide, the abandon is lost — form_start against generate_lead remains the
 * exact completion rate.
 */
function EngagementTracking() {
  const pathname = usePathname()

  useEffect(() => {
    const path = pathname
    const started = new Set<string>()
    let visibleMs = 0
    let visibleSince: number | null = document.visibilityState === 'visible' ? performance.now() : null
    let reported = false

    function reportEngagement() {
      if (reported) return
      reported = true
      if (visibleSince !== null) visibleMs += performance.now() - visibleSince
      visibleSince = null
      const seconds = Math.round(visibleMs / 1000)
      track('page_engagement', {
        page_path: path,
        engaged_seconds: seconds,
        time_on_page: timeBucket(seconds),
      })
    }

    function reportAbandons() {
      for (const form_name of takeUnfinishedForms()) {
        track('form_abandon', { form_name, page_path: path })
      }
    }

    function onVisibility() {
      if (document.visibilityState === 'hidden') reportEngagement()
      else if (!reported) visibleSince = performance.now()
    }

    function onPageHide() {
      reportEngagement()
      reportAbandons()
    }

    // The first field focused in each form, once per page view.
    function onFocusIn(e: FocusEvent) {
      const target = e.target
      if (!(target instanceof Element)) return
      const form = target.closest<HTMLFormElement>('form')
      if (!form) return
      const form_name = form.dataset.analyticsForm ?? locationOf(form)
      if (started.has(form_name)) return
      started.add(form_name)
      track('form_start', { form_name, page_path: path })
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('focusin', onFocusIn)

    // Runs when the route changes: the page being left is reported under its own path.
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('focusin', onFocusIn)
      reportEngagement()
      reportAbandons()
    }
  }, [pathname])

  return null
}

export default function AnalyticsEvents() {
  return (
    <>
      <ClickTracking />
      <EngagementTracking />
      {/* useSearchParams needs a Suspense boundary, or every page opts out of
          static rendering. */}
      <Suspense fallback={null}>
        <PageViewTracking />
      </Suspense>
    </>
  )
}
