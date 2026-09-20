import type { Metadata } from 'next'
import Link from 'next/link'
import BookingFrame from '@/components/BookingFrame'
import CallbackForm from '@/components/CallbackForm'
import GetInTouch from '@/components/GetInTouch'
import MapEmbed from '@/components/MapEmbed'
import { withSocial } from '@/lib/seo'
import { BOOKING_URL, business, fullAddress, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Book an Appointment | East St Kilda Dental',
  description:
    'Book your dental appointment online at East St Kilda Dental. The New Patient Comprehensive Care Visit — exam, x-rays and scale & clean in one visit.',
  alternates: { canonical: `${SITE_URL}/online-booking` },
})

export default function BookingPage() {
  return (
    <main>

      {/* ── BOOK ONLINE ──────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Real-time availability</div>
            <h2>Pick a time that <em>works for you</em></h2>
          </div>
          <div className="embed-card reveal">
            <BookingFrame />
          </div>
          <p className="reveal" style={{ textAlign: 'center', fontSize: '14px', color: 'var(--ink-faint)', marginTop: '16px' }}>
            If the booking form doesn&apos;t appear,{' '}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--clay-deep)', fontWeight: 600 }}
            >
              open it in a new tab
            </a>.
          </p>
        </div>
      </section>

      {/* ── OTHER WAYS TO BOOK ───────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="book-grid">
            <div className="book-col reveal">
              <div className="eyebrow">Prefer to talk?</div>
              <h3>Call our friendly team</h3>
              <p>Happy to help you find a time, answer a question, or sort an urgent appointment. Just say if you&apos;re nervous or it&apos;s been a while.</p>
              <a className="btn" href={telHref}>Call {business.telephoneDisplay}</a>
              <p style={{ fontSize: '14px', color: 'var(--ink-faint)', marginTop: '14px' }}>
                Mon 8.30am&ndash;5.00pm &middot; Tue&ndash;Wed 8.30am&ndash;6.00pm &middot; Thu&ndash;Fri 8.30am&ndash;5.00pm &middot; Sat 9.00am&ndash;4.00pm
              </p>
            </div>
            <div className="book-col reveal">
              <div className="eyebrow">Rather we called you?</div>
              <h3>Ask us to call you back</h3>
              <p>Leave your details and we&apos;ll call to find a time that suits.</p>
              <CallbackForm
                className="book-form"
                namePlaceholder="First name"
                showReason
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Before you book</div>
            <h2>A few quick answers</h2>
          </div>
          <div className="faq reveal">
            <details open>
              <summary>What does my first visit cost?</summary>
              <p>Your first visit is the New Patient Comprehensive Care Visit, one flat price with everything included. We can process eligible health-fund claims on the spot through HICAPS. Your rebate and out-of-pocket cost depend on your fund, policy and level of cover. If you need further treatment, you&apos;ll get a written estimate before anything goes ahead.</p>
            </details>
            <details>
              <summary>I&apos;m nervous about booking. Can I note that?</summary>
              <p>Please do. When you book or call, just say you&apos;re anxious or it&apos;s been a while, and we&apos;ll set aside extra time and take it gently.</p>
            </details>
            <details>
              <summary>Do you have emergency appointments?</summary>
              <p>Yes. If you&apos;re in pain or have had an accident, call us and we&apos;ll do our best to see you quickly, often the same day.</p>
            </details>
            <details>
              <summary>I can&apos;t see a time that suits. What now?</summary>
              <p>Call us or request a callback above. We can often find a time that isn&apos;t shown online, including Saturdays.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ── HOURS & LOCATION ─────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="loc-grid">
            <MapEmbed
              className="reveal"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${business.name}, ${fullAddress}`)}&output=embed`}
              title={`${business.name} — ${fullAddress}`}
              style={{ minHeight: '340px', borderRadius: '18px' }}
            />
            <div className="reveal">
              <p style={{ marginBottom: '6px' }}>
                <b style={{ color: 'var(--ink)' }}>{fullAddress}</b>
              </p>
              <p style={{ fontSize: '14.5px', marginBottom: '18px' }}>
                On the corner of Orrong Road, where St Kilda East, Windsor, Armadale and Caulfield meet. Off-street parking off Orrong Road &middot; Trams 5 &amp; 64 and bus 220 nearby &middot; Armadale station a 10&ndash;15 minute walk.
              </p>
              <ul className="hours">
                <li><span>Monday</span><b>8.30am &ndash; 5.00pm</b></li>
                <li><span>Tuesday &ndash; Wednesday</span><b>8.30am &ndash; 6.00pm</b></li>
                <li><span>Thursday &ndash; Friday</span><b>8.30am &ndash; 5.00pm</b></li>
                <li><span>Saturday</span><b>9.00am &ndash; 4.00pm</b></li>
                <li><span>Sunday</span><b>Closed</b></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
