import Link from 'next/link'
import { requireSuburb, suburbPath } from '@/data/suburbs'
import { business, emailHref, localityLine, streetAddress, telHref } from '@/lib/business'

/**
 * The suburb pages promoted in the footer, by slug.
 *
 * Suburb pages are kept out of the main menu by design, so the footer is one of
 * the site-wide paths into them — every page on the site links to these, and to
 * the hub beneath them, which in turn links to all of the rest.
 *
 * A curated shortlist rather than the whole array: names and paths are read
 * from data/suburbs.ts through requireSuburb, so a renamed suburb follows
 * automatically and a slug that no longer exists fails the build.
 */
const FOOTER_SUBURBS = [
  'st-kilda',
  'balaclava',
  'caulfield',
  'elwood',
  'elsternwick',
  'windsor',
  'prahran',
].map(requireSuburb)

export default function Footer() {
  return (
    <footer className="footer-v2" id="footer">
      <div className="container">
        <div className="foot-grid">

          {/* ── Col 1: Brand + newsletter ─────────────────── */}
          <div>
            <div className="foot-logo">East St Kilda Dental</div>
            <p style={{ fontSize: '14px' }}>
              Gentle, no-judgement dental care for the St Kilda East community since 1980.
            </p>
            {/* <div className="news">
              <input type="email" placeholder="Your email" />
              <button type="button">Sign up</button>
            </div>
            <p style={{ fontSize: '12.5px', marginTop: '10px' }}>Dental tips and clinic news. No spam.</p> */}
          </div>

          {/* ── Col 2: Care ───────────────────────────────── */}
          <div>
            <h4>Care</h4>
            <ul>
              <li><Link href="/services/check-ups">Check-ups &amp; cleans</Link></li>
              <li><Link href="/emergency-dentist">Emergency</Link></li>
              <li><Link href="/nervous-patients">Nervous patients</Link></li>
              <li><Link href="/services/dental-implants">Implants</Link></li>
              <li><Link href="/services/smile-design">Cosmetic</Link></li>
              <li><Link href="/dental-faqs">Dental FAQs</Link></li>
              <li><Link href="/services">All services</Link></li>
              <li><Link href="/using-your-super">Using your super</Link></li>
            </ul>
          </div>

          {/* ── Col 3: Areas ─────────────────────────────── */}
          <div>
            <h4>Areas we serve</h4>
            <ul>
              <li><Link href="/">St Kilda East</Link></li>
              {FOOTER_SUBURBS.map((s) => (
                <li key={s.slug}><Link href={suburbPath(s.slug)}>{s.name}</Link></li>
              ))}
              <li><Link href="/areas-we-serve">All areas we serve</Link></li>
            </ul>
          </div>

          {/* ── Col 4: Contact ───────────────────────────── */}
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li>
                {streetAddress}<br />
                {localityLine}
              </li>
              <li><a href={telHref}>{business.telephoneDisplay}</a></li>
              <li><a href={emailHref}>{business.email}</a></li>
            </ul>
          </div>

        </div>

        <div className="foot-bottom">
          <span>© 2026 East St Kilda Dental. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy</Link>
            {' · '}
            <Link href="/terms">Terms</Link>
            {' · '}
            <Link href="/online-booking">Book online</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
