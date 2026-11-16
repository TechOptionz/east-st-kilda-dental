import { track as vercelTrack } from '@vercel/analytics'

/**
 * The one way anything on this site talks to analytics.
 *
 * Everything goes through Google Tag Manager's dataLayer. Nothing here knows
 * about GA4, Google Ads or any other destination — a tag in the GTM container
 * decides what to do with each event. That is the whole point: adding a
 * conversion destination later is a change in GTM, not a deploy.
 *
 * Every push is wrapped so it can never break a click. Analytics failing is an
 * inconvenience; a patient's "Call now" tap failing is a lost appointment.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * The complete list of events this site fires. GTM triggers are configured
 * against these exact strings, so renaming one silently breaks a conversion
 * until the container is updated — treat them as a published contract. The
 * container that matches is docs/gtm-container-import.json, and every trigger
 * is written out in docs/conversion-tracking.md.
 *
 * The funnel, weakest signal to strongest:
 *   booking_click → booking_start → appointment_booked
 * appointment_booked is not in this list because this site cannot see it: the
 * booking is completed on the practice software's domain. See the doc.
 */
export type AnalyticsEvent =
  /** A client-side route change finished rendering. See components/AnalyticsEvents.tsx. */
  | 'spa_page_view'
  /** Any tel: link, anywhere on the site. `link_location` says which one. */
  | 'phone_click'
  /** Any mailto: link. */
  | 'email_click'
  /** Any link to /online-booking — the visitor asked to book. */
  | 'booking_click'
  /**
   * The visitor entered the booking system itself: their first click, tap or
   * keystroke inside the embedded widget, or the link that opens it in a new
   * tab. At most once per page view. `booking_method` says which.
   */
  | 'booking_start'
  /** A link to a third-party booking platform such as HealthEngine. `provider` names it. */
  | 'external_booking_click'
  /** The booking iframe scrolled into view. A diagnostic, not a conversion. */
  | 'booking_widget_view'
  /** A contact or callback form was accepted by /api/contact. The primary conversion. */
  | 'form_submit'
  /** A form was submitted but the API rejected it — a conversion we nearly lost. */
  | 'form_error'
  /** A visitor first focused a field in a form. Compare with form_submit for completion rate. */
  | 'form_start'
  /** A visitor started a form and left the page without it being accepted. */
  | 'form_abandon'
  /** A page view ended. Carries the seconds the page was actually visible. */
  | 'page_engagement'

/**
 * Every parameter any event carries. GTM's dataLayer remembers a key until it
 * is overwritten, so without this an email_click would go out wearing the
 * form_name of the form submitted before it. Each push sets the whole list,
 * with undefined for whatever the event does not use, which clears it.
 *
 * None of these may ever hold something a patient typed or chose. Events say
 * what happened and where — never who, and never why they need a dentist.
 */
const PARAM_KEYS = [
  'page_path',
  'page_location',
  'page_title',
  'landing_page',
  'link_url',
  'link_text',
  'link_location',
  'form_name',
  'booking_method',
  'provider',
  'engaged_seconds',
  'time_on_page',
] as const

const CLEARED: Record<string, undefined> = Object.fromEntries(PARAM_KEYS.map(k => [k, undefined]))

/**
 * The page this visit started on, so a phone_click on /contact can still be
 * credited to the /dentist-elwood page that brought the visitor in.
 *
 * GA4 has its own Landing page dimension and that remains the one to report
 * on; this travels on each event as a second copy that does not depend on GA4
 * stitching the session together. It is a path only — no query string — and
 * lives in sessionStorage, so it is per tab and gone when the tab closes. A
 * gap of 30 minutes starts a new visit, matching GA4's session timeout.
 */
const LANDING_KEY = 'eskd_landing'
const VISIT_TIMEOUT_MS = 30 * 60 * 1000

export function landingPage(): string {
  const here = window.location.pathname
  try {
    const now = Date.now()
    const saved = JSON.parse(window.sessionStorage.getItem(LANDING_KEY) ?? 'null') as
      | { path: string; seen: number }
      | null
    const path = saved && now - saved.seen < VISIT_TIMEOUT_MS ? saved.path : here
    window.sessionStorage.setItem(LANDING_KEY, JSON.stringify({ path, seen: now }))
    return path
  } catch {
    // Storage blocked (private mode, strict settings): GA4's own dimension still works.
    return here
  }
}

/**
 * Push an event to the dataLayer.
 *
 * Safe to call from anywhere: on the server, before GTM has loaded, or with
 * GTM blocked entirely. When the dataLayer array exists but GTM has not booted
 * yet the event queues in it and is replayed the moment the container loads,
 * which is why the array is created here rather than waited on.
 *
 * Every event says which page it happened on and which page the visit began
 * on, unless the caller knows better — page_engagement reports the page being
 * left, by which time the address bar has already moved on.
 */
export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  const page_path = params.page_path ?? window.location.pathname
  const full: Record<string, unknown> = {
    ...CLEARED,
    page_location: `${window.location.origin}${page_path}`,
    landing_page: landingPage(),
    ...params,
    page_path,
  }

  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...full })
  } catch {
    // An analytics push must never take a click down with it.
  }

  noteFormProgress(event, full)
  sendToVercel(event, full)
}

/**
 * booking_start, at most once per page view however the visitor got in —
 * working the embedded widget and then opening it in a new tab is one start.
 */
let bookingStartedOn: string | null = null

export function trackBookingStart(
  booking_method: 'widget' | 'new_tab',
  params: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined') return
  if (bookingStartedOn === window.location.pathname) return
  bookingStartedOn = window.location.pathname
  track('booking_start', { booking_method, ...params })
}

/** Called on every route change, so a later visit to the same page can count again. */
export function resetBookingStart(): void {
  bookingStartedOn = null
}

/**
 * Forms started on the current page and not yet accepted by the API. Kept here
 * because track() is the one place that sees both form_start and
 * form_submit, so no form component has to report its own abandonment.
 */
const unfinishedForms = new Set<string>()

function noteFormProgress(event: AnalyticsEvent, params: Record<string, unknown>): void {
  const name = String(params.form_name ?? '')
  if (!name) return
  if (event === 'form_start') unfinishedForms.add(name)
  if (event === 'form_submit') unfinishedForms.delete(name)
}

/** Hands back the forms left unfinished on the page being left, and forgets them. */
export function takeUnfinishedForms(): string[] {
  const names = [...unfinishedForms]
  unfinishedForms.clear()
  return names
}

/**
 * The events mirrored to Vercel Web Analytics, and the properties each one
 * keeps. Vercel caps how many properties a custom event may carry, so each
 * gets the two that answer "what happened, and where" — the full set still
 * goes to GTM. spa_page_view is missing because it would only duplicate what
 * Vercel already counts.
 *
 * Custom events need a Vercel Pro or Enterprise plan; on Hobby these calls
 * are dropped by Vercel and cost nothing.
 */
const VERCEL_EVENTS: Partial<Record<AnalyticsEvent, readonly [string, string]>> = {
  form_submit: ['form_name', 'page_path'],
  form_error: ['form_name', 'page_path'],
  form_start: ['form_name', 'page_path'],
  form_abandon: ['form_name', 'page_path'],
  page_engagement: ['page_path', 'time_on_page'],
  phone_click: ['link_location', 'page_path'],
  email_click: ['link_location', 'page_path'],
  booking_click: ['link_location', 'page_path'],
  booking_start: ['booking_method', 'page_path'],
  external_booking_click: ['provider', 'page_path'],
}

function sendToVercel(event: AnalyticsEvent, params: Record<string, unknown>): void {
  const keys = VERCEL_EVENTS[event]
  if (!keys) return

  const props: Record<string, string | number | boolean | null> = {}
  for (const key of keys) {
    const value = params[key]
    if (value === undefined) continue
    props[key] =
      typeof value === 'number' || typeof value === 'boolean' || value === null
        ? value
        : String(value)
  }

  try {
    vercelTrack(event, props)
  } catch {
    // Same rule as the dataLayer push above.
  }
}
