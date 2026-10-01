import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import { practitionerPath } from '@/data/practitioners'
import { areasChildTrail } from '@/components/Breadcrumb'
import GetInTouch from '@/components/GetInTouch'
import HealthFundLogos from '@/components/HealthFundLogos'
import JsonLd from '@/components/JsonLd'
import MapEmbed from '@/components/MapEmbed'
import StickyCallBar from '@/components/StickyCallBar'
import { requireSuburb, suburbPath, type SuburbData, type SuburbHeading } from '@/data/suburbs'
import { SCHEMA_ID, SITE_URL, business, fullAddress, telHref } from '@/lib/business'
import { withSocial } from '@/lib/seo'
import styles from './SuburbPage.module.css'

/**
 * The one template every /dentist-<suburb> page renders.
 *
 * Built to the suburb-page spec, section for section: breadcrumb, hero and
 * quick-facts card, About [suburb], Getting here, Good to know, services, the
 * first visit, why choose, the team, health funds, the questions, get in touch.
 *
 * The questions run straight into the enquiry form: nothing sits between the
 * last answer and the place to act on it.
 *
 * The split matters more than the order. Everything in this file is SHARED —
 * identical on all twenty pages, which is boilerplate a search engine expects
 * and ignores. Everything a page says about its own suburb comes from that
 * suburb's entry in data/suburbs.ts and appears on no other page, which is the
 * part that has to be unique and is what keeps these off the doorway pile.
 *
 * Each route is a four-line file that names its slug, so a page cannot drift
 * from its own metadata, its FAQ schema or the sitemap.
 */

/** Origin for a directions link: "South Yarra VIC 3141". */
const origin = (s: SuburbData) => `${s.name} VIC ${s.postcode}`
const destination = `${business.name}, ${fullAddress}`

function googleDirections(s: SuburbData) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin(s))}&destination=${encodeURIComponent(destination)}`
}

function appleDirections(s: SuburbData) {
  return `https://maps.apple.com/?saddr=${encodeURIComponent(origin(s))}&daddr=${encodeURIComponent(destination)}&dirflg=d`
}

/** Embedded map of the clinic itself, not of the suburb. */
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`

/**
 * A heading with its `em` run in italic clay.
 *
 * The data carries plain strings and the substring to lift, rather than markup,
 * so the same copy can be reused in metadata and structured data untouched.
 */
function Heading({ h }: { h: SuburbHeading }) {
  const at = h.text.indexOf(h.em)
  if (at < 0) return <>{h.text}</>
  return (
    <>
      {h.text.slice(0, at)}
      <em>{h.em}</em>
      {h.text.slice(at + h.em.length)}
    </>
  )
}

/* ── SHARED CONTENT ───────────────────────────────────────
   The furniture, written once. Deliberately identical on every suburb page. */

const SERVICES = [
  { title: 'Check-ups & cleans', href: '/services/check-ups', copy: 'Thorough, gentle examinations and professional cleans to keep small things small.' },
  { title: 'Cosmetic dentistry', href: '/services/smile-design', copy: 'Natural-looking improvements, from reshaping to veneers, weighed honestly.' },
  { title: 'Teeth whitening', href: '/services/teeth-whitening', copy: 'Professionally supervised whitening that protects your enamel and gums.' },
  { title: 'Crowns & bridges', href: '/services/crowns-and-bridges', copy: 'Restoring strength and appearance to worn, broken or missing teeth.' },
  { title: 'Children’s dentistry', href: '/services/childrens-dentistry', copy: 'Calm, friendly care for the whole family, with the child Medicare scheme where eligible.' },
  { title: 'Emergency care', href: '/emergency-dentist', copy: 'Same-day help when something goes wrong, with time kept aside each day.' },
]

const OFFER_INCLUDES = [
  'Comprehensive examination',
  'Digital X-rays & photos',
  'Oral cancer screening',
  'Gum health assessment',
  'Scale, clean & polish',
  '3D digital scan',
  'Smile & bite check',
  'Personalised care plan',
]

const WHY = [
  { n: '01', h: 'No judgement, ever', p: 'Nervous, or been away a while? You’ll get a calm welcome and a plan, never a lecture.' },
  { n: '02', h: 'Honest advice', p: 'We tell you when the simplest option is the right one, and when something isn’t worth doing.' },
  { n: '03', h: 'Here since 1980', p: 'Four decades caring for families across Melbourne’s inner south-east, on the same corner.' },
]

/** The four dentists, as named on /about/our-team. Bios stay on that page. */
const TEAM = [
  { name: 'Dr Anbar Ganatra', role: 'Cosmetic & General Dentist', image: '/assets/team/anbar-ganatra.webp' },
  { name: 'Dr Edmund Goldman', role: 'Dentist', image: '/assets/team/edmund-goldman.webp' },
  { name: 'Dr Jarrod Dean', role: 'Dentist', image: '/assets/team/jarrod-dean.webp' },
  { name: 'Dr Marina Bekheet', role: 'General Dentist', image: '/assets/team/marina-bakheet.webp' },
]

/**
 * The page's search title, description and canonical URL, all read from the
 * suburb's own entry so no two suburb pages can share them.
 *
 * Called at module scope by each route, so an unknown slug throws at build time.
 */
export function suburbMetadata(slug: string): Metadata {
  const s = requireSuburb(slug)
  return withSocial({
    title: s.meta.title,
    description: s.meta.description,
    alternates: { canonical: `${SITE_URL}${suburbPath(s.slug)}` },
  })
}

export default function SuburbPage({ slug }: { slug: string }) {
  const s = requireSuburb(slug)
  const url = `${SITE_URL}${suburbPath(s.slug)}`

  // The practice is referenced by its site-wide @id rather than redefined, so
  // this page attaches a Service to the existing entity instead of creating a
  // competing one. The FAQ node is page-scoped and quotes the visible questions
  // verbatim, which is what FAQ rich results require.
  //
  // No Review or aggregateRating anywhere, on any page: AHPRA's advertising
  // guidelines put testimonials about clinical care off limits, and marking up
  // a star rating is exactly that in machine-readable form.
  //
  // The BreadcrumbList itself is not restated here: <BreadcrumbBar> below emits it
  // from the same trail it renders, so the visible trail and the markup cannot
  // disagree. The WebPage node just points at it by @id.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: s.meta.title,
        description: s.meta.description,
        isPartOf: { '@id': SCHEMA_ID.website },
        about: { '@id': SCHEMA_ID.practice },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        serviceType: 'Dental care',
        name: `Dentist in ${s.name}`,
        provider: { '@id': SCHEMA_ID.practice },
        areaServed: { '@type': 'City', name: `${s.name}, Victoria, Australia` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: s.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }

  return (
    <main>
      <JsonLd data={schema} />

      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <BreadcrumbBar trail={areasChildTrail(s.name)} id={`${url}#breadcrumb`} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className="reveal">
            <div className="eyebrow">{s.eyebrow}</div>
            <h1><Heading h={s.h1} /></h1>
            <p className={styles.lead}>{s.lead}</p>
            <div className={styles.heroCta}>
              <Link href="/online-booking" className="btn">Book online</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
            {/* Plain facts only. No rating number, no review count. */}
            <div className={styles.heroProof}>
              <span className={styles.stars} aria-hidden="true">★★★★★</span>
              <span>Rated on Google</span>
              <span className={styles.dot} />
              <span>Caring for the area since 1980</span>
              <span className={styles.dot} />
              {/* <span>Onsite parking</span> */}
            </div>
          </div>

          <div className={`${styles.qcard} reveal`} style={{ transitionDelay: '.08s' }}>
            <div className={styles.qhead}>{s.name} at a glance</div>
            <div className={styles.qsub}>The essentials for getting to us</div>
            <div className={styles.qrow}>
              <span className={styles.qi} aria-hidden="true">●</span>
              <span><b>{s.drive.time}</b> off-peak, {s.drive.via}</span>
            </div>
            <div className={styles.qrow}>
              <span className={styles.qi} aria-hidden="true">●</span>
              <span><b>Onsite parking</b>, no circling for a spot</span>
            </div>
            <div className={styles.qrow}>
              <span className={styles.qi} aria-hidden="true">●</span>
              <span><b>All major health funds</b>, claimed on the day</span>
            </div>
            <div className={styles.qrow}>
              <span className={styles.qi} aria-hidden="true">●</span>
              <span><b>One price, first visit</b> — the New Patient Comprehensive Care Visit</span>
            </div>
            <div className={styles.dirbtns}>
              <a className={styles.dirbtn} href={googleDirections(s)} target="_blank" rel="noopener noreferrer">
                Google directions
              </a>
              <a className={styles.dirbtn} href={appleDirections(s)} target="_blank" rel="noopener noreferrer">
                Apple directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THE SUBURB ──────────────────────────────── */}
      <section className={styles.sec}>
        <div className="container">
          <div className={`${styles.secHead} ${styles.center} reveal`}>
            <div className="eyebrow">Your part of town</div>
            <h2><Heading h={s.about.heading} /></h2>
          </div>
          <p className={`${styles.bodyLg} reveal`}>{s.about.body}</p>
        </div>
      </section>

      {/* ── GETTING HERE ──────────────────────────────────── */}
      <section className={`${styles.sec} ${styles.alt}`}>
        <div className={styles.ghGrid}>
          <div className="reveal">
            <div className="eyebrow">Getting to us from {s.name}</div>
            <h2><Heading h={s.route.heading} /></h2>
            <p>
              {s.route.body} We’re on the corner of Dandenong and Orrong Roads, with onsite parking
              so you can pull in and park when you arrive.
            </p>
            <div className={styles.ghDir}>
              <a className="btn" href={googleDirections(s)} target="_blank" rel="noopener noreferrer">Get directions</a>
              <a className="btn btn-ghost" href={telHref}>Call us</a>
            </div>
          </div>
          <MapEmbed
            className={`${styles.ghMap} reveal`}
            title={`Map to ${business.name}, ${fullAddress}`}
            src={MAP_SRC}
          />
        </div>
      </section>

      {/* ── GOOD TO KNOW ──────────────────────────────────── */}
      <section className={styles.sec}>
        <div className="container">
          <div className={`${styles.secHead} ${styles.center} reveal`}>
            <div className="eyebrow">Good to know</div>
            <h2><Heading h={s.goodToKnow.heading} /></h2>
          </div>
          <p className={`${styles.bodyLg} reveal`}>{s.goodToKnow.body}</p>
        </div>
      </section>

      {/* ── SERVICES (shared) ─────────────────────────────── */}
      <section className={`${styles.sec} ${styles.alt}`} id="services">
        <div className="container">
          <div className={`${styles.secHead} reveal`}>
            <div className="eyebrow">Everything under one roof</div>
            <h2>How we can <em>help</em></h2>
          </div>
          <div className={`${styles.svcGrid} reveal`}>
            {SERVICES.map((svc) => (
              <Link key={svc.title} href={svc.href} className={styles.svc}>
                <h3>{svc.title}</h3>
                <p>{svc.copy}</p>
                {/* The whole card is the link, so this is an affordance rather
                    than a second target — hidden from screen readers, which
                    already announce the card's own text as the link. */}
                <span className={styles.svcMore} aria-hidden="true">Learn more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FIRST VISIT (shared) ──────────────────────── */}
      <section className={styles.sec} id="fees">
        <div className="container">
          <div className={`${styles.offerCard} reveal`}>
            <div>
              <div className="eyebrow">New patients</div>
              <h2>The New Patient Comprehensive Care Visit</h2>
              <p>
                A thorough, unhurried first appointment where we get to know you and your mouth, and
                leave you with a clear, honest plan.
              </p>
              <div className={styles.offerMeta}>
                <div><span className={styles.k}>Your price</span><b>One simple price</b></div>
                <div><span className={styles.k}>Includes</span><b>Everything</b></div>
                <div><span className={styles.k}>Length</span><b>60–75 min</b></div>
              </div>
              <Link href="/new-patient-comprehensive-care-visit" className="btn">Book your first visit</Link>
            </div>
            <ul className={styles.offerIncludes}>
              {OFFER_INCLUDES.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE (shared) ───────────────────────────── */}
      <section className={`${styles.sec} ${styles.sageBg}`}>
        <div className="container">
          <div className={`${styles.secHead} reveal`}>
            <div className="eyebrow">Why {s.name} patients choose us</div>
            <h2>Care that earns its <em>keep</em></h2>
          </div>
          <div className={`${styles.whyGrid} reveal`}>
            {WHY.map((w) => (
              <div key={w.n} className={styles.why}>
                <div className={styles.wn}>{w.n}</div>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM (shared) ─────────────────────────────────── */}
      <section className={`${styles.sec} ${styles.alt}`}>
        <div className="container">
          <div className={`${styles.secHead} ${styles.center} reveal`} style={{ maxWidth: '38em' }}>
            <div className="eyebrow">Your dentists</div>
            <h2>The people you’ll <em>see</em></h2>
          </div>
          <div className={`${styles.teamGrid} reveal`}>
            {TEAM.map((m) => (
              <div key={m.name} className={styles.member}>
                <div className={styles.avatar}>
                  <Image src={m.image} alt={`${m.name}, ${m.role} at ${business.name}`} width={96} height={96} />
                </div>
                {/* A dentist with a published profile page links to it. */}
                <h3>{practitionerPath(m.name) ? <Link className="name-link" href={practitionerPath(m.name)!}>{m.name}</Link> : m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
          <p className={styles.hubLink}>
            <Link href="/about/our-team">Meet the whole team &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ── HEALTH FUNDS (shared) ─────────────────────────
          The same logo row as the home page and /fees, from the one list in
          data/healthFunds.ts, so a fund can never be shown on one page and
          missing from another. */}
      <section className={styles.sec} style={{ paddingTop: '56px', paddingBottom: '56px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Claim on the spot</div>
          <HealthFundLogos className="reveal" />
        </div>
      </section>

      {/* ── QUESTIONS ─────────────────────────────────────── */}
      <section className={`${styles.sec} ${styles.alt}`} id="faq">
        <div className="container">
          <div className={`${styles.secHead} ${styles.center} reveal`} style={{ maxWidth: '36em' }}>
            <div className="eyebrow">{s.name} questions</div>
            <h2>Good to <em>ask</em></h2>
          </div>
          <div className={`${styles.faq} reveal`}>
            {s.faqs.map(({ q, a }, i) => (
              <details key={q} className={styles.qa} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GetInTouch heading={`Make us your ${s.name} dentist`} />

      <StickyCallBar />
    </main>
  )
}
