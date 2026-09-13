import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import type { Crumb } from '@/components/Breadcrumb'
import CallbackForm from '@/components/CallbackForm'
import CarouselNav from '@/components/CarouselNav'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import ReviewMarquee from '@/components/ReviewMarquee'
import { withSocial } from '@/lib/seo'
import {
  SCHEMA_ID,
  SITE_URL,
  areasServed,
  business,
  clinicianId,
  clinicians,
  comprehensiveCareVisit,
  openingHours,
  socialProfiles,
  telHref,
} from '@/lib/business'

const PAGE_URL = `${SITE_URL}/new-patient-comprehensive-care-visit`

const TITLE = 'New Patient Dentist Visit St Kilda East | East St Kilda Dental'
const DESCRIPTION =
  'Book a thorough 60–75 minute new patient dental visit in St Kilda East. Understand what needs attention, what can wait and your options, without pressure or judgement.'

export const metadata: Metadata = withSocial({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
})

/**
 * The one-sentence definition of the visit, set directly under the hero.
 *
 * Written to be quoted whole by a featured snippet or an AI answer, so it
 * names the practice, the length and the outcome in a single sentence. The
 * Service node in the schema below uses the same string as its description,
 * so the markup and the page can never describe the visit differently.
 */
const directAnswer =
  `A New Patient Comprehensive Care Visit at ${business.name} is a 60–75 minute first appointment designed to assess your teeth, gums and overall oral health, discuss any concerns, and give you a clear prioritised care plan.`

/**
 * The line icons used across this page — the pillars, the "leave knowing"
 * list, the reassurance chips, the two booking cards and the alternate paths
 * at the foot.
 *
 * Kept as one map rather than eighteen inline <svg> blocks so the sections
 * below stay readable, and so every mark is drawn on the same 24px grid at the
 * same 1.5 stroke. Colour and size come from CSS — each path uses
 * currentColor, so a badge only has to set `color`.
 */
const icons: Record<string, ReactNode> = {
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></>,
  list: <><path d="M9 5.5h7.5a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18V7a1.5 1.5 0 0 1 1.5-1.5H9Z" /><path d="M9 4.5h4v2H9zM9.5 11h5M9.5 14.5h3.5" /></>,
  person: <><circle cx="12" cy="8.5" r="3.2" /><path d="M5.8 19.2a6.6 6.6 0 0 1 12.4 0" /></>,
  heart: <path d="M12 19s-6.5-3.9-6.5-8.3A3.7 3.7 0 0 1 12 8.4a3.7 3.7 0 0 1 6.5 2.3C18.5 15.1 12 19 12 19Z" />,
  tooth: <path d="M8.2 4.6C6 4.6 5 6.3 5 8.4c0 3 1.3 4.2 1.8 7 .3 1.9.7 3.6 1.8 3.6 1.4 0 1.2-3.4 3.4-3.4s2 3.4 3.4 3.4c1.1 0 1.5-1.7 1.8-3.6.5-2.8 1.8-4 1.8-7 0-2.1-1-3.8-3.2-3.8-1.6 0-2.3.8-3.8.8s-2.2-.8-3.8-.8Z" />,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.8v5M12 15.8h.01" /></>,
  hourglass: <><path d="M7 4.5h10M7 19.5h10" /><path d="M8 4.5c0 4 4 4.6 4 7.5 0 2.9-4 3.5-4 7.5M16 4.5c0 4-4 4.6-4 7.5 0 2.9 4 3.5 4 7.5" /></>,
  options: <><path d="M5 8h9M5 16h6" /><circle cx="17" cy="8" r="2.2" /><circle cx="14" cy="16" r="2.2" /></>,
  steps: <><path d="M4.5 18.5h4v-4h4v-4h4v-4" /><path d="M4.5 18.5v-2" /></>,
  shield: <><path d="M12 4.2 18 6.4v4.9c0 3.6-2.4 6.6-6 7.6-3.6-1-6-4-6-7.6V6.4Z" /><path d="M9.4 11.9 11.3 14l3.4-3.7" /></>,
  cloud: <path d="M7.6 17.5h8.9a3.4 3.4 0 0 0 .4-6.8 5 5 0 0 0-9.6-1.1 3.5 3.5 0 0 0 .3 7Z" />,
  feather: <><path d="M18.5 5.5c-6 0-9.6 3.2-10.6 7.1L6 18.5" /><path d="M8 15.5h4.4c3.2 0 6.1-2.6 6.1-6" /></>,
  hand: <><path d="M9.5 12V6.6a1.4 1.4 0 0 1 2.8 0V12" /><path d="M12.3 11V5.6a1.4 1.4 0 0 1 2.8 0V12" /><path d="M15.1 11.8V8.4a1.4 1.4 0 0 1 2.8 0v6.1c0 3-2.2 5-5.2 5s-4-1.2-5-2.8l-1.9-3a1.4 1.4 0 0 1 2.3-1.6l1.2 1.5" /></>,
  calendar: <><rect x="4.5" y="5.8" width="15" height="13.7" rx="2" /><path d="M4.5 10h15M9 4.2v3M15 4.2v3" /></>,
  phone: <path d="M8.4 4.8 10 8.1l-1.7 1.6a11 11 0 0 0 5 5l1.6-1.7 3.3 1.6v3a1.6 1.6 0 0 1-1.8 1.6C10.6 18.6 5.4 13.4 4.8 6.6A1.6 1.6 0 0 1 6.4 4.8Z" />,
  siren: <><path d="M6 17.5a6 6 0 0 1 12 0Z" /><path d="M4.5 20h15M12 5.5V3.5M6.6 7.3 5.2 5.9M17.4 7.3l1.4-1.4" /></>,
  sparkle: <path d="M12 4.5 13.6 9l4.5 1.6-4.5 1.6L12 16.7l-1.6-4.5L5.9 10.6 10.4 9Z" />,
  search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4.3 4.3" /></>,
  chat: <><path d="M5 5.5h9.5A1.5 1.5 0 0 1 16 7v5.5a1.5 1.5 0 0 1-1.5 1.5H9.8L6.5 16.8V14H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z" /><path d="M16 9h3a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5h-1.5v2.7l-3.3-2.7H11" /></>,
}

const Ico = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icons[name]}
  </svg>
)

// The four things a first-time patient actually arrives worried about, in the
// order they arrive in.
const pillars = [
  {
    icon: 'clock',
    title: "You won't be rushed",
    body: 'We allow time to properly understand your teeth, gums, concerns and goals — not squeeze you through a quick examination.',
  },
  {
    icon: 'list',
    title: "You'll know what actually needs attention",
    body: "We'll separate what is urgent, what should be monitored, and what is optional — so everything doesn't feel like it needs to be done at once.",
  },
  {
    icon: 'person',
    title: 'You stay in control',
    body: 'We explain what we see, your options and our recommendations. Then you decide what happens next.',
  },
  {
    icon: 'heart',
    title: "Haven't been in years?",
    body: "You won't be judged. Many of our patients come to us after avoiding the dentist for a long time. We simply start with where you are today.",
  },
]

// Who the visit is for, in the words people use when they search for it. Each
// is a door in: the title is the situation, the line under it is what we do
// about it.
const whoFor = [
  { icon: 'search', title: 'Looking for a new dentist', body: "New to the area, or ready for a practice that takes the time to get to know you." },
  { icon: 'hourglass', title: "Haven't been in years", body: "No lectures and no judgement. We simply start with where your teeth are today." },
  { icon: 'tooth', title: 'Concerned about your teeth or gums', body: "Sensitivity, bleeding gums, a chipped tooth, or something that just doesn't feel right." },
  { icon: 'chat', title: 'Want a second opinion', body: "Been given a treatment plan elsewhere? We'll take an independent look and explain your options." },
  { icon: 'feather', title: 'Nervous about the dentist', body: 'We go at your pace, explain each step before we do it, and you can stop at any time.' },
  { icon: 'list', title: 'Want a thorough baseline', body: 'A complete picture of your oral health today, to measure every future check-up against.' },
]

// What the visit leaves you holding, rather than what happens during it. Each
// label is split so the first line carries the point and the second qualifies
// it — see .know-list in globals.css. "Urgent, can wait, optional" is the
// distinction the rest of the page promises, so all three are named here.
const leaveKnowing = [
  { icon: 'tooth', lead: 'A clear picture', rest: 'of your oral health' },
  { icon: 'alert', lead: 'What needs', rest: 'attention now' },
  { icon: 'hourglass', lead: 'What can wait', rest: '(without worry)' },
  { icon: 'sparkle', lead: 'What is optional', rest: 'and entirely your choice' },
  { icon: 'options', lead: 'Which options', rest: 'are available' },
  { icon: 'steps', lead: 'Your prioritised next steps', rest: 'and costs where relevant' },
]

/**
 * New patient questions, phrased the way people type them into a search box.
 *
 * One source for the visible accordion AND the FAQPage schema, so the
 * question a reader sees and the question an engine matches are the same
 * string. Answers are kept to roughly 40–80 words: long enough to stand alone
 * when quoted, short enough to be quoted whole.
 *
 * No dollar figure is given for the visit. The fees page does not publish one
 * either; if the practice decides to, it belongs in the cost answer here and on
 * /fees on the same day.
 */
const faq = [
  {
    q: 'What happens at a new patient dental appointment?',
    a: "Your dentist starts by talking with you about your dental history, any pain or concerns, and what you'd like for your teeth. Next comes a thorough examination of your teeth, gums and mouth, with X-rays and a clean where clinically appropriate. We finish by explaining what we found, what needs attention, what can wait and what your options are, and give you a clear, prioritised care plan.",
  },
  {
    q: 'How long does a first dental visit take?',
    a: 'Allow 60 to 75 minutes. That is longer than a standard check-up on purpose: it gives your dentist time to assess your teeth and gums properly, answer your questions and talk a plan through with you, rather than rushing through a quick examination. If you would like breaks along the way, just let us know.',
  },
  {
    q: 'Does a new patient visit include X-rays?',
    a: "Usually, yes. Most new patients need diagnostic X-rays so your dentist can see between the teeth, below the gumline and into the bone, where problems often begin without any symptoms. We only take the X-rays that are clinically necessary for you. If you've had X-rays taken recently at another practice, mention it when you book.",
  },
  {
    q: 'Does a new patient visit include a clean?',
    a: "A professional clean is included where it is clinically appropriate, and for most new patients that means a scale and clean on the day. If there is a lot of build-up or your gums need more care, your dentist may recommend completing the clean over a separate appointment so it can be done thoroughly and comfortably. We'll always explain why.",
  },
  {
    q: "What if I haven't been to the dentist in years?",
    a: "You're very welcome, and you won't be judged. Many of our patients come to us after avoiding the dentist for a long time. We start with where you are today, go at your pace and explain everything as we go. If you're anxious, tell us when you book: happy gas is available and you can stop at any time.",
  },
  {
    q: 'How much does a new patient dental visit cost?',
    a: "The New Patient Comprehensive Care Visit is one flat price with everything included, and we'll confirm it with you before you book. If you have eligible extras cover, we can process your claim on the day through HICAPS. Your out-of-pocket amount depends on your fund and level of cover. Any further treatment comes with a written estimate first.",
  },
  {
    q: 'Can I use my health fund for a new patient visit?',
    a: "Yes. We welcome patients from all major Australian health funds. Bring your health fund card and we can process eligible claims on the spot through HICAPS. Your rebate depends on your fund, policy and level of extras cover, so it's worth checking with your fund beforehand. Payment plans are also available for any larger treatment you choose to go ahead with.",
  },
]

/** The cost question gets its own H2 as well as a place in the FAQ. Both read
    this one entry, so the two answers cannot drift apart. */
const costFaq = faq.find((f) => f.q.startsWith('How much'))!

/** The dentists a new patient may see — the hygienist is left out because the
    sentence is about who carries out the assessment. */
const dentists = clinicians.filter((c) => c.jobTitle.includes('Dentist'))

const chips = [
  { icon: 'shield', label: 'No judgement, ever' },
  { icon: 'cloud', label: 'Happy gas available' },
  { icon: 'feather', label: 'Calm, unhurried pacing' },
  { icon: 'hand', label: 'Stop any time' },
]

/** Where a portrait needs a crop other than the default — the same override
    the home page's team row applies to the same photograph. */
const teamCrop: Record<string, string> = { 'michelle-callaghan': '40% 95%' }

// The three other doors out of this page, gathered into one row at the foot
// rather than left as asides inside the sections above.
const otherPaths = [
  { icon: 'siren', kicker: 'Need urgent care?', label: 'Emergency dentistry', href: '/emergency-dentist' },
  { icon: 'calendar', kicker: 'Already a patient?', label: 'Check-ups & cleans', href: '/services/check-ups' },
  { icon: 'sparkle', kicker: 'Feeling anxious?', label: 'Gentle dentistry', href: '/nervous-patients' },
]

const breadcrumbTrail: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'New Patient Comprehensive Care Visit' },
]

/**
 * Structured data for this page: the page itself, the practice, the visit as a
 * Service, the clinicians, and the FAQ.
 *
 * The Dentist node reuses SCHEMA_ID.practice, so it is the same entity the home
 * page declares rather than a second practice — restated here with its core
 * facts so this page stands on its own for a crawler that lands on it first.
 * Every fact comes from lib/business.ts. The Person nodes likewise share their
 * @id with the team page, which carries their full bios.
 *
 * The BreadcrumbList is emitted by <BreadcrumbBar> from the same trail it
 * renders, and the WebPage node points at it by @id.
 *
 * No Review or aggregateRating, per AHPRA advertising guidance.
 */
const pageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': `${PAGE_URL}#service` },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      inLanguage: 'en-AU',
    },
    {
      '@type': 'Dentist',
      '@id': SCHEMA_ID.practice,
      name: business.name,
      url: business.url,
      image: `${SITE_URL}/assets/shared/meet-our-team.webp`,
      telephone: business.telephone,
      email: business.email,
      currenciesAccepted: business.currenciesAccepted,
      address: { '@type': 'PostalAddress', ...business.address },
      geo: { '@type': 'GeoCoordinates', ...business.geo },
      hasMap: business.hasMap,
      openingHoursSpecification: openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...h.days],
        opens: h.opens,
        closes: h.closes,
      })),
      areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
      sameAs: socialProfiles,
      employee: clinicians.map((c) => ({ '@id': clinicianId(c.slug) })),
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: comprehensiveCareVisit.name.replace(/^The /, ''),
      serviceType: 'New patient dental examination',
      description: directAnswer,
      url: PAGE_URL,
      provider: { '@id': SCHEMA_ID.practice },
      areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
    },
    ...clinicians.map((c) => ({
      '@type': 'Person',
      '@id': clinicianId(c.slug),
      name: c.name,
      jobTitle: c.jobTitle,
      url: clinicianId(c.slug),
      worksFor: { '@id': SCHEMA_ID.practice },
    })),
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

export default function OfferPage() {
  return (
    /* .npv scopes every rule this page adds to globals.css. Nothing below is
       shared, so no other page can be moved by them. */
    <main className="npv">
      <JsonLd data={pageSchema} />
      <BreadcrumbBar trail={breadcrumbTrail} id={`${PAGE_URL}#breadcrumb`} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal hero-fit">
            <div className="eyebrow">New Patient Comprehensive Care Visit</div>
            <h1>What if you could leave the dentist feeling <em>relieved</em> instead of worried?</h1>
            <p>Most first dental visits are built around finding problems. Ours is designed to help you understand what matters, what can wait, what your options are, and what you actually want to do next.</p>
            <p>You&apos;ll have 60&ndash;75 minutes with your dentist for a thorough assessment, discussion and personalised plan — so you leave knowing where your teeth stand and what makes sense from here.</p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your new patient visit</Link>
              <Link href="#offer-callback" className="btn btn-ghost">Request a call back</Link>
            </div>
            <div className="hero-proof">
              <span><span className="proof-stars">★★★★★</span> 5.0 on Google</span>
              <span className="proof-dot" />
              <span>Caring for St Kilda East and suburbs since 1980</span>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/comprehensive-care-visit/comprehensive-care-1.webp"
            alt="A smiling clinician demonstrating brushing on a dental model for a seated patient"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── THE DIRECT ANSWER ─────────────────────────────
          Straight under the hero, before any persuasion: what the visit is, in
          one sentence a search engine or AI answer can lift whole. */}
      <section className="sec npv-answer">
        <div className="container reveal">
          <div className="npv-answer-card">
            <h2>What is a New Patient Comprehensive Care Visit?</h2>
            <p>{directAnswer}</p>
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS VISIT FOR ─────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Is this visit right for you?</div>
            <h2>Who is <em>this visit</em> for?</h2>
          </div>
          <ul className="npv-who reveal">
            {whoFor.map(({ icon, title, body }) => (
              <li key={title}>
                <span className="npv-who-ico"><Ico name={icon} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── WHY START HERE ────────────────────────
          Reuses .pillars rather than introducing another card style; the
          .pillars-ico modifier is what adds the badge and moves the number
          up beside it. */}
      <section className="sec npv-why">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Why this visit is different</div>
            <h2>Why patients choose to <em>start here</em></h2>
          </div>
          <div className="pillars pillars-ico">
            {pillars.map(({ icon, title, body }, i) => (
              <div className="pillar reveal" key={title}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <span className="pillar-ico"><Ico name={icon} /></span>
                <div className="pillar-body">
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="pathlink reveal" style={{ textAlign: 'center' }}>
            Feeling anxious?{' '}
            <Link href="/nervous-patients">Learn more about our gentle dentistry for nervous patients</Link>.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEAVE KNOWING ─────────────────────
          The outcome of the visit rather than its contents — deliberately
          placed before the "may include" list, so the reader knows what the
          appointment is for before being shown what is in it. */}
      <section className="sec sage-bg">
        <div className="container know-grid">
          <div className="reveal">
            <div className="eyebrow">A clearer, brighter path forward</div>
            <h2>What you&apos;ll know <em>after your first visit</em></h2>
            <p className="know-lead">
              You&apos;ll walk out with a clear understanding of your oral health and a plan that makes sense for you.
            </p>
            <ul className="know-list">
              {leaveKnowing.map(({ icon, lead, rest }) => (
                <li key={lead}>
                  <span className="know-ico"><Ico name={icon} /></span>
                  <span><b>{lead}</b><br />{rest}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* objectPosition drops the frame past the poster on the back wall —
              it carries garbled placeholder lettering that reads as a mistake
              at this size. Everything that matters is in the lower half. */}
          <Photo
            tall
            className="reveal"
            src="/assets/unused/comprehensive-care-visit.webp"
            alt="A patient and a team member going through her chart together at the practice desk"
            objectPosition="center 35%"
            sizes="(max-width: 860px) 100vw, 46vw"
          />
        </div>
      </section>

      {/* ── ONE COMPREHENSIVE FIRST VISIT ────────────── */}
      <section className="sec alt">
        <div className="container reveal">
          <div className="offer-card-v2">
            <div className="body">
              <div className="eyebrow">Comprehensive, personalised care</div>
              {/* One of the page's location-bearing H2s. Keep the suburb to
                  this heading and the direct answer — not every heading. */}
              <h2>What to expect at your first dental visit <em>in St Kilda East</em></h2>
              {/* "May include", not "includes": what actually happens on the
                  day is a clinical judgement, and this list is written to say
                  so. Do not tighten it back into a promise. */}
              <p className="offer-lead">Your first visit may include:</p>
              <ul className="offer-includes">
                <li>Comprehensive dental examination</li>
                <li>Necessary diagnostic X-rays</li>
                <li>Gum and periodontal assessment</li>
                <li>Oral cancer screening</li>
                <li>Professional clean where clinically appropriate</li>
                <li>Discussion of any pain, concerns or cosmetic goals</li>
                <li>A clear, prioritised care plan</li>
                <li>Time to ask questions and understand your options</li>
              </ul>
              {/* Ruled off from the list above, as drawn: the promise is not
                  another item in it. */}
              <p className="offer-nopressure">No pressure to commit to treatment on the day.</p>
              <div className="offer-actions">
                <Link href="/online-booking" className="btn">Book your new patient visit</Link>
                <Link href="#cost" className="offer-actions-link">What does it cost? &rarr;</Link>
              </div>
            </div>
            <Photo
              src="/assets/comprehensive-care-visit/comprehensive-care-2.webp"
              alt="A dentist and patient reviewing a dental X-ray together on screen during a consultation"
              sizes="(max-width: 820px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── COST AND HEALTH FUNDS ─────────────────────────
          The cost question as its own heading, answered in the first
          sentence, then the door to the full fees page. The answer is the
          FAQ's entry, read from the same array. */}
      <section className="sec npv-cost" id="cost">
        <div className="container">
          <div className="npv-cost-card reveal">
            <div className="eyebrow">Fees &amp; health funds</div>
            <h2>{costFaq.q}</h2>
            <p>{costFaq.a}</p>
            <div className="offer-actions">
              <Link href="/fees" className="btn btn-ghost">Fees &amp; payment options</Link>
              <Link href="/fees#funds" className="offer-actions-link">Health funds and HICAPS &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── YOU'RE WELCOME HERE ───────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container">
          <div className="sec-head center reveal welcome-fit">
            <div className="eyebrow">Feeling nervous or haven&apos;t been in years?</div>
            <h2>Put it off for years? You&apos;re exactly who we&apos;re <em>best</em> with</h2>
            <p style={{ marginTop: '16px', fontSize: '18px' }}>
              No lectures, no judgement. Tell us you&apos;re anxious and we go entirely at your pace, with happy gas and gentle, unhurried care. You can stop any time.
            </p>
          </div>
          <div className="chips chips-ico reveal" style={{ justifyContent: 'center' }}>
            {chips.map(({ icon, label }) => (
              <span className="chip" key={label}><Ico name={icon} />{label}</span>
            ))}
          </div>
          <p className="pathlink reveal" style={{ textAlign: 'center' }}>
            <Link href="/nervous-patients">Learn more about our approach for nervous patients &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ── IN OUR PATIENTS' WORDS ────────────────────────
          The same block as the home page: .sec-reviews for the tighter padding
          either side of the row, and the quotes themselves in
          components/ReviewMarquee.tsx — which is also where the note on why
          testimonials appear at all lives. Only the heading above it is this
          page's own.

          The phone treatment of the row (drift off, snap scrolling, dots) is
          shared with the home page through the :is(.home,.npv) prefix in
          globals.css. */}
      <section className="sec sec-reviews">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Real experiences, real people</div>
            <h2>What your first visit <em>feels like</em></h2>
          </div>
        </div>
        {/* Outside the container on purpose — the row runs off both edges. */}
        <ReviewMarquee />
        <div className="container">
          <div className="gscore reveal">
            Rated <b>5.0 on Google</b> by our local patients &middot;{' '}
            <a href="https://share.google/M1ZtOT5z13fj2mhWf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sage-deep)', fontWeight: 600 }}>
              Read all reviews
            </a>
          </div>
        </div>
      </section>

      {/* ── THE TEAM ──────────────────────────────────────
          Names and titles come from lib/business.ts, so this row can never
          drift from the four in the JSON-LD or from the home page. */}
      <section className="sec alt">
        <div className="container npv-team">
          {/* .sec-head center — the same centred head every other section on
              this page uses, so this one is not the odd one out. */}
          <div className="sec-head center reveal">
            <div className="eyebrow">Experienced, friendly, local</div>
            <h2>You&apos;ll be looked after by a team that explains things properly.</h2>
            {/* Names the dentists as linked entities, each pointing at the
                anchor that carries their Person node on the team page. */}
            <p className="npv-clinicians">
              Your visit may be with{' '}
              {dentists.map((d, i) => (
                <span key={d.slug}>
                  {i > 0 && (i === dentists.length - 1 ? ' or ' : ', ')}
                  <Link href={`/about/our-team#${d.slug}`}>{d.name}</Link>
                </span>
              ))}
              . Each takes the time to explain what they see and talk you through your options before anything goes ahead.
            </p>
          </div>
          {/* .team-member, not a class of this page's own: that is the home
              page's card, so the frame, its 3:4 crop, the 20px gap under it and
              the name and role beneath come out identical here by construction
              rather than by two sets of numbers agreeing. */}
          <div className="team-row reveal">
            {/* The team stands across the lower two thirds of this photograph —
                everything above them is shopfront. "center top" was giving a
                landscape frame a third of a wall; 80% pulls the crop down so the
                row of people fills it, heads to feet. */}
            <div className="team-row-group">
              <Photo
                src="/assets/shared/meet-our-team.webp"
                alt="The East St Kilda Dental team standing together outside the clinic entrance"
                objectPosition="center 60%"
                sizes="(max-width: 900px) 100vw, 34vw"
              />
              <h4>Our team</h4>
              <span>Caring for St Kilda East since 1980</span>
            </div>
            {/* display:contents above 600px, so these four stay direct grid
                items of .team-row; on a phone the wrapper becomes the snap
                scroller the dots below drive. */}
            <div className="team-row-people" id="npv-team">
            {clinicians.map((c) => (
              <div className="team-member" key={c.slug}>
                <Photo
                  src={`/assets/team/${c.slug}.webp`}
                  alt={`${c.name} – ${c.jobTitle}`}
                  objectPosition={teamCrop[c.slug] ?? 'center top'}
                  sizes="(max-width: 900px) 50vw, 198px"
                />
                <h4>{c.name}</h4>
                <span>{c.jobTitle}</span>
              </div>
            ))}
            </div>
          </div>
          {/* Phone only — display:none from 601px up. */}
          <CarouselNav targetId="npv-team" count={clinicians.length} itemSelector=".team-member" className="team-nav" />
          <div className="team-row-cta reveal">
            <Link href="/about/our-team" className="btn">Meet the team</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────
          Before the booking section, so the last doubts are answered just
          ahead of the ask. Same array as the FAQPage schema above. */}
      <section className="sec npv-faq" id="faq">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Quick answers</div>
            <h2>New patient <em>questions</em></h2>
          </div>
          <div className="faq reveal">
            {faq.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO WAYS TO BOOK ─────────────────────────────── */}
      <section className="sec" id="offer-callback">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Whatever feels easier</div>
            <h2>Two easy ways to book your visit</h2>
          </div>
          <div className="booking-cols reveal">
            <div className="book-card">
              <div className="book-head">
                <span className="book-ico"><Ico name="calendar" /></span>
                <h3>Book online</h3>
              </div>
              <p>Choose a time that works for you. Our online booking system is quick, easy and available 24/7.</p>
              <Link href="/online-booking" className="btn">Book online now</Link>
            </div>
            <div className="book-card">
              <div className="book-head">
                <span className="book-ico"><Ico name="phone" /></span>
                <h3>Prefer we call you?</h3>
              </div>
              <p>Leave your details and we&apos;ll give you a call to find a time that suits you.</p>
              <CallbackForm
                className="form"
                namePlaceholder="First name"
                showEmail
              />
            </div>
          </div>
          {/* Under both cards rather than inside the second: calling applies to
              either route, and as the last line of the callback card it was
              height that only deepened the gap the first card had to sit
              through. */}
          <p className="book-fine reveal">
            Prefer to talk it through? Call us on{' '}
            <a href={telHref}>{business.telephoneDisplay}</a>.
          </p>

          {/* The other doors out of this page, in one row rather than as
              asides inside the sections above. */}
          <div className="altpaths reveal">
            <span className="altpaths-label">Looking for something else?</span>
            <div className="altpaths-row">
              {otherPaths.map(({ icon, kicker, label, href }) => (
                <Link href={href} className="altpath" key={href}>
                  <span className="altpath-ico"><Ico name={icon} /></span>
                  <span>
                    <span className="altpath-kicker">{kicker}</span>
                    <span className="altpath-label">{label} &rarr;</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
