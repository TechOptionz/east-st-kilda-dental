'use client'

import { useState, type ReactNode } from 'react'
import { business, telHref } from '@/lib/business'
import { track } from '@/lib/analytics'

/**
 * The "leave your details and we'll call you back" form.
 *
 * Three pages ask for a callback — /contact, /online-booking and
 * /new-patient-comprehensive-care-visit — each with its own copy, field set and layout.
 * They all posted nowhere until now, so this is the one place that talks to
 * /api/contact and the pages keep their existing wrapper class, which is what
 * gives each one its layout.
 *
 * It posts the same payload shape as GetInTouch, with intent 'book', so a
 * callback lands in the front desk's inbox looking like every other enquiry.
 */
interface CallbackFormProps {
  /** Wrapper class, so each page keeps the layout its CSS already defines. */
  className?: string
  /** "Your name" where one field takes the lot, "First name" where it doesn't. */
  namePlaceholder?: string
  showBestTime?: boolean
  showEmail?: boolean
  showMessage?: boolean
  /** The "I'd like to…" select on /online-booking. */
  showReason?: boolean
  submitLabel?: string
  /** Fine print rendered under the button, inside the form. */
  note?: ReactNode
}

const REASONS = [
  'Book a New Patient Comprehensive Care Visit',
  'Book an emergency visit',
  'Book for a dental consultation',
]

export default function CallbackForm({
  className = 'callback-form',
  namePlaceholder = 'Your name',
  showBestTime = false,
  showEmail = false,
  showMessage = false,
  showReason = false,
  submitLabel = 'Request my callback',
  note,
}: CallbackFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return

    const form = e.currentTarget
    const fd = new FormData(form)
    setSending(true)
    setError(null)

    /*
     * One visible name field, split on the first space. The API takes a first
     * name and an optional last name, so "Jane Smith" arrives in two parts and
     * a bare "Jane" is still valid.
     */
    const whole = String(fd.get('name') ?? '').trim()
    const [firstName, ...rest] = whole.split(/\s+/)

    /* The extras have no field of their own in the email, so they go in the
       message where the front desk will actually read them. */
    const extras = [
      showReason && fd.get('reason') ? `Reason: ${fd.get('reason')}` : '',
      showBestTime && fd.get('besttime') ? `Best time to call: ${fd.get('besttime')}` : '',
      showMessage ? String(fd.get('message') ?? '').trim() : '',
    ].filter(Boolean)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patienttype: 'new',
          intent: 'book',
          treatments: [],
          firstName,
          lastName: rest.join(' '),
          email: fd.get('email') ?? '',
          phone: fd.get('phone'),
          message: extras.join('\n'),
          company: fd.get('company'),
          source: `Callback request — ${window.location.pathname}`,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        track('form_error', { form_name: 'callback', page_path: window.location.pathname })
        setError(data?.error ?? 'We could not send your request. Please try again, or call us.')
        return
      }

      /* Fired only once the API has accepted it, so the conversion count is
         enquiries that actually reached the front desk — not submit clicks. */
      track('generate_lead', {
        form_name: 'callback',
        form_intent: 'book',
        page_path: window.location.pathname,
      })

      form.reset()
      setSubmitted(true)
    } catch {
      setError('Something went wrong sending your request. Please check your connection, or call us.')
    } finally {
      setSending(false)
    }
  }

  /* role="status" so a screen reader announces this — the form it replaced is
     gone from the page, so nothing else would say it. */
  if (submitted) {
    return (
      <div
        role="status"
        style={{ maxWidth: '30em', margin: '0 auto', textAlign: 'center', padding: '32px 0' }}
      >
        <h3 style={{ color: 'var(--sage-deep)', fontFamily: 'var(--display)' }}>
          Thanks &mdash; we&apos;ll call you back
        </h3>
        <p>
          We&apos;ll be in touch during opening hours. For a dental emergency call us directly on{' '}
          <a href={telHref} style={{ color: 'var(--sage-deep)', fontWeight: 600 }}>
            {business.telephoneDisplay}
          </a>.
        </p>
      </div>
    )
  }

  return (
    <form className={className} onSubmit={handleSubmit} data-analytics-form="callback">
      <input
        type="text"
        name="name"
        placeholder={namePlaceholder}
        aria-label={namePlaceholder}
        autoComplete="name"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone number"
        aria-label="Phone number"
        autoComplete="tel"
        required
      />

      {showEmail && (
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          aria-label="Email (optional)"
          autoComplete="email"
          className="full"
          style={{ width: '100%' }}
        />
      )}

      {showBestTime && (
        <input
          type="text"
          name="besttime"
          placeholder="Best time to call"
          aria-label="Best time to call"
        />
      )}

      {showReason && (
        <select name="reason" className="full" aria-label="What you'd like to book" defaultValue="">
          <option value="" disabled>I&apos;d like to&hellip;</option>
          {REASONS.map(r => <option key={r}>{r}</option>)}
        </select>
      )}

      {showMessage && (
        <textarea
          name="message"
          placeholder="Anything you'd like us to know (optional)"
          aria-label="Message"
        />
      )}

      {/* Honeypot: hidden from people, catnip for bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        className="btn"
        type="submit"
        disabled={sending}
        aria-busy={sending}
        style={{ justifyContent: 'center' }}
      >
        {sending ? 'Sending…' : submitLabel}
      </button>

      {error && (
        <p role="alert" className="full" style={{ color: '#b3261e', fontSize: '14px', textAlign: 'center', margin: 0 }}>
          {error}
        </p>
      )}

      {note}
    </form>
  )
}
