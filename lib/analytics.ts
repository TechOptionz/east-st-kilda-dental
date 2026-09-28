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
 * until the container is updated — treat them as a published contract.
 */
export type AnalyticsEvent =
  /** A client-side route change finished rendering. See components/AnalyticsEvents.tsx. */
  | 'spa_page_view'
  /** Any tel: link, anywhere on the site. `link_location` says which one. */
  | 'call_click'
  /** Any mailto: link. */
  | 'email_click'
  /** The booking iframe on /online-booking scrolled into view. */
  | 'booking_widget_view'
  /** The booking system was opened — the iframe's fallback link, or any link to it. */
  | 'booking_widget_open'
  /** A contact or callback form was accepted by /api/contact. The primary conversion. */
  | 'generate_lead'
  /** A form was submitted but the API rejected it — a conversion we nearly lost. */
  | 'form_error'
  /** A visitor first focused a field in a form. Compare with generate_lead for completion rate. */
  | 'form_start'
  /** A visitor started a form and left the page without it being accepted. */
  | 'form_abandon'
  /** A page view ended. Carries the seconds the page was actually visible. */
  | 'page_engagement'
  /**
   * Legacy. The emergency sticky bar fired only this before there was a
   * site-wide call_click, and a live GTM trigger may still depend on it. It is
   * pushed alongside call_click so an existing container keeps working.
   */
  | 'emergency_call_click'

/**
 * Push an event to the dataLayer.
 *
 * Safe to call from anywhere: on the server, before GTM has loaded, or with
 * GTM blocked entirely. When the dataLayer array exists but GTM has not booted
 * yet the event queues in it and is replayed the moment the container loads,
 * which is why the array is created here rather than waited on.
 */
export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
  } catch {
    // An analytics push must never take a click down with it.
  }

  noteFormProgress(event, params)
  sendToVercel(event, params)
}

/**
 * Forms started on the current page and not yet accepted by the API. Kept here
 * because track() is the one place that sees both form_start and
 * generate_lead, so no form component has to report its own abandonment.
 */
const unfinishedForms = new Set<string>()

function noteFormProgress(event: AnalyticsEvent, params: Record<string, unknown>): void {
  const name = String(params.form_name ?? '')
  if (!name) return
  if (event === 'form_start') unfinishedForms.add(name)
  if (event === 'generate_lead') unfinishedForms.delete(name)
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
 * goes to GTM. Events missing here (spa_page_view, the legacy
 * emergency_call_click) would only duplicate what Vercel already counts.
 *
 * Custom events need a Vercel Pro or Enterprise plan; on Hobby these calls
 * are dropped by Vercel and cost nothing.
 */
const VERCEL_EVENTS: Partial<Record<AnalyticsEvent, readonly [string, string]>> = {
  generate_lead: ['form_name', 'page_path'],
  form_error: ['form_name', 'page_path'],
  form_start: ['form_name', 'page_path'],
  form_abandon: ['form_name', 'page_path'],
  page_engagement: ['page_path', 'time_on_page'],
  call_click: ['link_location', 'page_path'],
  email_click: ['link_location', 'page_path'],
  booking_widget_open: ['link_location', 'page_path'],
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
