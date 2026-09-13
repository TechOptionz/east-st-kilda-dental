'use client'

import { useEffect, useState } from 'react'
import { getInTouchCopy, type GetInTouchVariant } from '@/data/getintouch'
import { business, emailHref, fullAddress, telHref } from '@/lib/business'
import { track } from '@/lib/analytics'
import { TREATMENTS } from '@/lib/enquiry'

interface GetInTouchProps {
  variant?: GetInTouchVariant
  id?: string
  /**
   * Overrides the heading above the contact details.
   *
   * Suburb pages pass "Make us your [suburb] dentist" so the one section of
   * shared furniture that should name the reader's suburb does.
   */
  heading?: string
}

export default function GetInTouch({
  variant = 'default',
  id = 'contact',
  heading = 'We’re here whenever you’re ready',
}: GetInTouchProps) {
  const copy = getInTouchCopy[variant]
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Kept so the confirmation can greet them by name. */
  const [sentName, setSentName] = useState('')
  /* "I'm interested in" collapses to a dropdown on a phone — nine full-width
     chips was most of a screen before the reader reached the name fields. The
     checkboxes themselves are untouched and uncontrolled; these two only drive
     the toggle and its summary line, so the posted data is identical at every
     width. */
  const [treatOpen, setTreatOpen] = useState(false)
  const [treatSel, setTreatSel] = useState<string[]>([])
  /* At phone width the three choice fields collapse into native dropdowns and
     the CSS hides the field headings — two segmented radio pairs and a panel of
     nine checkboxes cost most of a screen there. Matches the 600px breakpoint
     the phone rules in globals.css use. Before hydration this is false, so a
     phone briefly gets the chips behind the disclosure toggle below. */
  const [isPhone, setIsPhone] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width:600px)')
    const sync = () => setIsPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  const compact = isPhone

  /* Read back off the DOM rather than controlling nine checkboxes: change
     events bubble, so one handler on the panel keeps the summary in step. */
  function syncTreatments(e: React.FormEvent<HTMLDivElement>) {
    const inputs = e.currentTarget.querySelectorAll<HTMLInputElement>('input[name="treat"]')
    setTreatSel(Array.from(inputs).filter(i => i.checked).map(i => i.value))
  }

  const treatSummary =
    treatSel.length === 0
      ? 'Choose what you need'
      : treatSel.length === 1
        ? TREATMENTS.find(t => t.value === treatSel[0])?.label ?? '1 selected'
        : `${treatSel.length} selected`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return

    const form = e.currentTarget
    const fd = new FormData(form)
    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patienttype: fd.get('patienttype'),
          intent: fd.get('intent'),
          treatments: fd.getAll('treat').filter(Boolean),
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          message: fd.get('message'),
          company: fd.get('company'),
          source: window.location.pathname,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        track('form_error', { form_name: 'get-in-touch', page_path: window.location.pathname })
        setError(data?.error ?? 'We could not send your message. Please try again, or call us.')
        return
      }

      /* Only after the API accepts it — see the same note in CallbackForm.
         patient_type and form_intent ride along so GA4 can separate a new
         patient's enquiry from an existing one's admin question. */
      track('generate_lead', {
        form_name: 'get-in-touch',
        form_intent: String(fd.get('intent') ?? ''),
        patient_type: String(fd.get('patienttype') ?? ''),
        page_path: window.location.pathname,
      })

      setSentName(String(fd.get('firstName') ?? '').trim())
      form.reset()
      /* form.reset() clears the checkboxes but not the summary derived from
         them, so the dropdown is put back by hand. */
      setTreatSel([])
      setTreatOpen(false)
      setSubmitted(true)
    } catch {
      setError('Something went wrong sending your message. Please check your connection, or call us.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="getintouch" id={id}>
      <div className="gt-grid">

        {/* ── LEFT: contact info ─────────────────────────── */}
        <div className="gt-info">
          <div className="gt-eyebrow">Get in touch</div>
          <h2>{heading}</h2>
          <p className="gt-sub">{copy.sub}</p>

          <div className="gt-detail">
            <span className="ic">&#9742;</span>
            <a href={telHref}>{business.telephoneDisplay}</a>
          </div>
          <div className="gt-detail">
            <span className="ic">&#9678;</span>
            <span>
              <strong className="gt-name">{business.name}</strong><br />
              {fullAddress}
            </span>
          </div>
          <div className="gt-detail">
            <span className="ic">&#9993;</span>
            <a href={emailHref}>{business.email}</a>
          </div>

          <div className="gt-hours">
            <h4>Opening hours</h4>
            <ul>
              <li><span>Monday</span><b>8.30am &ndash; 5.00pm</b></li>
              <li><span>Tue &ndash; Wed</span><b>8.30am &ndash; 6.00pm</b></li>
              <li><span>Thu &ndash; Fri</span><b>8.30am &ndash; 5.00pm</b></li>
              <li><span>Saturday</span><b>9.00am &ndash; 4.00pm</b></li>
              <li><span>Sunday</span><b>Closed</b></li>
            </ul>
          </div>

          <p className="gt-area">
            Caring for families on the corner of Dandenong Road since 1980, across Melbourne&apos;s inner south-east.
          </p>
        </div>

        {/* ── RIGHT: form ────────────────────────────────── */}
        <div className="gt-form">
          <div className="gt-eyebrow">Send us a message</div>
          <h2>{copy.cta}</h2>

          {submitted ? (
            /* role="status" so a screen reader announces the confirmation —
               the form it replaced is gone, so nothing else would say it. */
            <div className="gt-done" role="status">
              <div className="gt-done-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>

              <h3>Message sent</h3>
              <p>
                {sentName ? `Thanks ${sentName} — your` : 'Thanks — your'} message is with our
                front desk, and one of the team will get back to you personally.
              </p>

              <ul className="gt-done-next">
                <li>
                  <span className="ic" aria-hidden="true">&#9678;</span>
                  <span>We reply to every enquiry within one business day, usually sooner.</span>
                </li>
                <li>
                  <span className="ic" aria-hidden="true">&#9993;</span>
                  <span>Our reply comes from {business.email} &mdash; worth a look in junk if it hasn&apos;t landed.</span>
                </li>
                <li>
                  <span className="ic" aria-hidden="true">&#9742;</span>
                  <span>In pain or it&apos;s urgent? Call us and we&apos;ll do our best to see you today.</span>
                </li>
              </ul>

              <div className="gt-done-actions">
                <a href={telHref} className="gt-done-call">
                  Call {business.telephoneDisplay}
                </a>
                <button
                  type="button"
                  className="gt-done-again"
                  onClick={() => { setSubmitted(false); setSentName('') }}
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="gt-row2">
                <div>
                  <span className="gt-label">I&apos;m a&hellip;</span>
                  {compact ? (
                    <select className="gt-select" name="patienttype" defaultValue="new" aria-label="I'm a…">
                      <option value="new">New patient</option>
                      <option value="returning">Returning patient</option>
                    </select>
                  ) : (
                    <div className="gt-seg">
                      <label><input type="radio" name="patienttype" value="new" defaultChecked /> New patient</label>
                      <label><input type="radio" name="patienttype" value="returning" /> Returning</label>
                    </div>
                  )}
                </div>
                <div>
                  <span className="gt-label">I&apos;d like to&hellip;</span>
                  {compact ? (
                    <select className="gt-select" name="intent" defaultValue="enquire" aria-label="I'd like to…">
                      <option value="enquire">Make an enquiry</option>
                      <option value="book">Book a visit</option>
                    </select>
                  ) : (
                    <div className="gt-seg">
                      <label><input type="radio" name="intent" value="enquire" defaultChecked /> Make an enquiry</label>
                      <label><input type="radio" name="intent" value="book" /> Book a visit</label>
                    </div>
                  )}
                </div>
              </div>

              <div className="gt-field">
                <span className="gt-label" id="gt-treat-label">I&apos;m interested in&hellip;</span>
                {compact ? (
                  <select className="gt-select" name="treat" defaultValue="" aria-label="I'm interested in…">
                    <option value="">Choose what you need</option>
                    {TREATMENTS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                ) : (
                <div className={`gt-treat-wrap${treatOpen ? ' is-open' : ''}`}>
                  {/* Phone only — CSS hides this and shows the panel outright
                      from 601px up, so a desktop reader sees the chips as
                      before and never meets the toggle. */}
                  <button
                    type="button"
                    className="gt-treat-toggle"
                    aria-expanded={treatOpen}
                    aria-controls="gt-treat-panel"
                    onClick={() => setTreatOpen(o => !o)}
                  >
                    <span>{treatSummary}</span>
                    <svg className="gt-treat-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className="gt-treat"
                    id="gt-treat-panel"
                    role="group"
                    aria-labelledby="gt-treat-label"
                    onChange={syncTreatments}
                  >
                    {TREATMENTS.map(t => (
                      <label key={t.value}>
                        <input type="checkbox" name="treat" value={t.value} /> {t.label}
                      </label>
                    ))}
                  </div>
                </div>
                )}
              </div>

              <div className="gt-row2">
                <div>
                  <label className="gt-label" htmlFor="gt-fn">First name</label>
                  <input id="gt-fn" name="firstName" type="text" autoComplete="given-name" placeholder="First name" required />
                </div>
                <div>
                  <label className="gt-label" htmlFor="gt-ln">Last name</label>
                  <input id="gt-ln" name="lastName" type="text" autoComplete="family-name" placeholder="Last name" required />
                </div>
              </div>

              <div className="gt-row2">
                <div>
                  <label className="gt-label" htmlFor="gt-em">Email</label>
                  <input id="gt-em" name="email" type="email" autoComplete="email" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="gt-label" htmlFor="gt-ph">Phone</label>
                  <input id="gt-ph" name="phone" type="tel" autoComplete="tel" placeholder="(03) 9527 3678" />
                </div>
              </div>

              <div>
                <label className="gt-label" htmlFor="gt-msg">How can we help?</label>
                <textarea id="gt-msg" name="message" rows={4} placeholder="Tell us a little about what you need." />
              </div>

              {/* Honeypot: hidden from people, catnip for bots. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="gt-company">Company</label>
                <input id="gt-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {error && (
                <p role="alert" style={{ color: '#ffb4a2', fontSize: '14px', marginTop: '14px' }}>
                  {error}
                </p>
              )}

              <p className="gt-finehint">
                We respond to all enquiries within one business day. Prefer to call?{' '}
                <a href={telHref}>{business.telephoneDisplay}</a>
              </p>

              <button type="submit" className="gt-btn" disabled={sending} aria-busy={sending}>
                {sending ? 'Sending…' : 'Send my message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
