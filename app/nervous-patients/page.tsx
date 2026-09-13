import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import type { Crumb } from '@/components/Breadcrumb'
import CallbackForm from '@/components/CallbackForm'
import CarouselNav from '@/components/CarouselNav'
import JsonLd from '@/components/JsonLd'
import Ico, { type IconName } from '@/components/LineIcon'
import Photo from '@/components/Photo'
import ReviewMarquee from '@/components/ReviewMarquee'
import { faqPageNode, personNode, practiceNode } from '@/lib/schema'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, areasServed, business, clinicians, telHref } from '@/lib/business'

const PAGE_URL = `${SITE_URL}/nervous-patients`

const TITLE = 'Gentle Dentist for Nervous Patients St Kilda East | East St Kilda Dental'
const DESCRIPTION =
  'Nervous about the dentist? East St Kilda Dental offers gentle, no-judgement care, longer appointments, stop signals and happy gas for anxious patients in St Kilda East.'

export const metadata: Metadata = withSocial({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
})

/**
 * The one-paragraph summary of what the practice does for anxious patients,
 * set in the hero under the intro. Written to be lifted whole by a search or AI
 * answer, and reused as the Service node's description so the page and the
 * markup say the same thing.
 */
const summary =
  `${business.name} provides gentle dental care for nervous and anxious patients in St Kilda East, including longer appointments, agreed stop signals, nitrous oxide happy gas, clear explanations and a no-judgement approach.`

const EMERGENCY = '/emergency-dentist'
const NEW_PATIENT = '/new-patient-comprehensive-care-visit'
const CHECK_UPS = '/services/check-ups'
const FEES = '/fees'
const TEAM = '/about/our-team'

// Who gentle dentistry is for. The titles are the situations exactly as people
// describe them; the line underneath says what we do about each, and carries
// the contextual links out to the pages that situation leads to next.
const whoFor: { icon: IconName; title: string; body: ReactNode }[] = [
  {
    icon: 'hourglass',
    title: 'People who have avoided the dentist for years',
    body: <>It&apos;s never too late. Most people restart with a <Link href={NEW_PATIENT}>New Patient Comprehensive Care Visit</Link>: an unhurried look at where things stand, with no lectures.</>,
  },
  {
    icon: 'droplet',
    title: 'People afraid of pain or needles',
    body: <>Numbing applied slowly and gently, with happy gas if it helps. In pain right now? See our <Link href={EMERGENCY}>emergency dentistry</Link> page.</>,
  },
  {
    icon: 'heart',
    title: 'People with dental anxiety or dental phobia',
    body: 'From mild nerves to a full phobia, we treat anxiety as something to plan around, never something to judge.',
  },
  {
    icon: 'shield',
    title: 'People embarrassed about their teeth',
    body: 'We see teeth in every condition, every week. There are no lectures here, only a warm welcome and a way forward.',
  },
  {
    icon: 'chat',
    title: 'People who have had a bad dental experience before',
    body: 'Tell us what happened so we can do the opposite. Our whole approach is built to undo exactly that.',
  },
  {
    icon: 'hand',
    title: 'People who feel anxious when they are not in control',
    body: "We agree a stop signal before we start and explain each step first, so nothing happens that you haven't agreed to.",
  },
]

// How the approach differs, as the same icon-badged cards the new patient page
// uses for its own four reasons.
const pillars: { icon: IconName; title: string; body: ReactNode }[] = [
  {
    icon: 'feather',
    title: 'A coaching-informed approach to fear',
    body: 'Beyond gentle hands, we understand the psychology of dental fear, and we use calm, proven communication to help you feel safe from the moment you arrive.',
  },
  {
    icon: 'hand',
    title: "You're always in control",
    body: "We agree a simple stop signal before we start. Raise your hand and everything pauses, no questions asked. Nothing happens that you haven't agreed to.",
  },
  {
    icon: 'clock',
    title: 'Unhurried time, gentle hands',
    body: "We book longer, so you're never rushed through a chair. Slow, careful, and as comfortable as modern dentistry allows.",
  },
  {
    icon: 'list',
    title: 'No surprises, ever',
    body: <>We explain everything in plain language, show you what we see, and confirm any costs before we begin — see our <Link href={FEES}>fees &amp; health funds</Link>. Certainty is what calms the nerves.</>,
  },
]

// The comfort options, on the green band. The six phrases the page is meant to
// be found for are all here in plain words, and each is also said in a sentence
// in the paragraphs above the chips.
const comfort: { icon: IconName; label: string }[] = [
  { icon: 'cloud', label: 'Happy gas (nitrous oxide)' },
  { icon: 'clock', label: 'Longer dental appointments' },
  { icon: 'hand', label: 'Agreed stop signals' },
  { icon: 'chat', label: 'Gentle explanations' },
  { icon: 'pause', label: 'Breaks during treatment' },
  { icon: 'shield', label: 'No judgement' },
  { icon: 'person', label: 'Bring a support person' },
  { icon: 'headphones', label: 'Headphones and music' },
]

/**
 * The questions nervous patients ask, in the words they ask them.
 *
 * One source for the visible accordion AND the FAQPage schema, so the question
 * a reader sees and the question an engine matches are the same string.
 * Answers stay plain text (no links) for the same reason.
 */
const faq = [
  {
    q: "What if I'm embarrassed about my teeth?",
    a: "Please don't be. Embarrassment is one of the most common reasons people stay away from the dentist, and we see teeth in every condition every week. There are no lectures and no judgement here, only a warm welcome and a gentle, clear way forward that starts with where your teeth are today.",
  },
  {
    q: 'What happens if I panic during treatment?',
    a: "We stop. Before we start, we agree a simple stop signal, usually raising your hand, and the moment you use it everything pauses, no questions asked. We'll give you time to breathe, talk through what you're feeling, and only carry on when you're ready. If you'd rather finish another day, that's completely fine.",
  },
  {
    q: 'Do you offer happy gas for nervous patients?',
    a: "Yes. We offer happy gas (nitrous oxide), which keeps you relaxed but fully awake and in control, and it wears off quickly so you can drive yourself home. Let us know when you book that you'd like it. If you think you need deeper sedation, we'll talk it through honestly and help you find the safest option.",
  },
  {
    q: 'Can I bring someone with me to the dentist?',
    a: "Absolutely. Bring a partner, friend or family member for support. Many nervous patients find it easier with someone familiar nearby, and we're glad to have them there. Just mention it when you book, and let us know if there is anything else that would help you feel more comfortable on the day.",
  },
  {
    q: "What if I've had a bad dental experience before?",
    a: "Many of our most loyal patients did too. Tell us what happened, what hurt or what upset you, so we can do the opposite. We'll take things slowly, explain each step before it happens and agree a stop signal first. A bad past experience is exactly what our approach is built to undo.",
  },
  {
    q: 'Can I stop treatment at any time?',
    a: "Yes. You're in control for the whole appointment. We agree a stop signal before we begin, and you can use it at any point to pause, take a break or stop altogether. Nothing happens that you haven't agreed to, and if you'd prefer to finish another day, we'll simply book you back in.",
  },
  {
    q: "Can I book a longer appointment if I'm nervous?",
    a: "Yes. Tell us you're nervous when you book and we'll allow extra time, so nothing feels rushed. A longer appointment leaves room for explanations, questions and breaks during treatment. If you're new to us, your first visit, the New Patient Comprehensive Care Visit, is already 60 to 75 minutes long.",
  },
  {
    q: 'How does happy gas help with dental anxiety?',
    a: 'Happy gas is a mix of nitrous oxide and oxygen that you breathe through a small mask over your nose. Within a few minutes most people feel calmer and less bothered by the sounds and sensations of treatment, while staying awake and able to talk. It takes the edge off anxiety rather than putting you to sleep, and wears off quickly.',
  },
]

/** Where a portrait needs a crop other than the default — the same override
    the home and new patient pages apply to the same photograph. */
const teamCrop: Record<string, string> = { 'michelle-callaghan': '40% 95%' }

const anbar = clinicians.find((c) => c.slug === 'anbar-ganatra')!

// The other doors out of this page, in one row at the foot.
const otherPaths: { icon: IconName; kicker: string; label: string; href: string }[] = [
  { icon: 'calendar', kicker: 'New to us?', label: 'New patient visit', href: NEW_PATIENT },
  { icon: 'tooth', kicker: 'Due for a visit?', label: 'Check-ups & cleans', href: CHECK_UPS },
  { icon: 'siren', kicker: 'In pain now?', label: 'Emergency dentistry', href: EMERGENCY },
]

const breadcrumbTrail: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Gentle dentistry for nervous patients' },
]

/**
 * Structured data: the page, the practice (Dentist, a LocalBusiness subtype),
 * gentle dentistry as a Service, the dentist named on the page, and the FAQ.
 * The practice and Person nodes share their @id with the home and team pages.
 * The BreadcrumbList is emitted by <BreadcrumbBar> and referenced by @id.
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
    practiceNode(),
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'Gentle dentistry for nervous patients',
      serviceType: 'Dental care for anxious and nervous patients',
      description: summary,
      url: PAGE_URL,
      provider: { '@id': SCHEMA_ID.practice },
      areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
    },
    personNode(anbar),
    faqPageNode(`${PAGE_URL}#faq`, faq),
  ],
}

export default function GentlePage() {
  return (
    /* .npv carries the landing-page design this page shares with
       /new-patient-comprehensive-care-visit — the icon cards, chips, team row,
       booking cards and the phone treatments in globals.css. .gentle holds the
       few rules only this page needs. */
    <main className="npv gentle">
      <JsonLd data={pageSchema} />
      <BreadcrumbBar trail={breadcrumbTrail} id={`${PAGE_URL}#breadcrumb`} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal hero-fit">
            {/* The keyword line sits above the H1 as the eyebrow; the
                emotional line stays the only H1. */}
            <div className="eyebrow">Gentle Dentist for Nervous Patients in St Kilda East</div>
            <h1>Scared of the dentist? You&apos;re exactly who we&apos;re <em>best with.</em></h1>
            <p>If fear has kept you away, you&apos;re in the right place. Looking after anxious patients is one of the things we&apos;re known for. Tell us you&apos;re nervous, and we go entirely at your pace, with no judgement and no pressure.</p>
            <p className="hero-summary">{summary}</p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book a gentle visit</Link>
              <Link href="#book" className="btn btn-ghost">Request a call back</Link>
            </div>
            <div className="hero-proof">
              <span><span className="proof-stars">★★★★★</span> 5.0 on Google</span>
              <span className="proof-dot" />
              <span>Caring locally since 1980</span>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/nervous-patients/how-we-look-after.webp"
            alt="A clinician gently reassuring a relaxed patient in the treatment room"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── WHO IS GENTLE DENTISTRY FOR ───────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Dental fear is normal, and valid</div>
            <h2>Who is <em>gentle dentistry</em> for?</h2>
            <p style={{ marginTop: '16px', maxWidth: '42em', marginLeft: 'auto', marginRight: 'auto' }}>
              Around one in six Australian adults avoids the dentist because of fear, often after one bad experience a long time ago. It says nothing about you, and it&apos;s never too late.
            </p>
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

      {/* ── OUR GENTLE APPROACH ──────────────────────────── */}
      <section className="sec npv-why">
        <div className="container">
          {/* .approach-fit holds the heading to one line — see globals.css. */}
          <div className="sec-head center reveal approach-fit">
            <div className="eyebrow">Why nervous patients trust us</div>
            <h2>A genuinely different way of <em>working with fear</em></h2>
            <p style={{ marginTop: '16px', maxWidth: '42em', marginLeft: 'auto', marginRight: 'auto' }}>
              Our approach combines careful clinical care with a calm, coaching-informed way of communicating, developed specifically for dental anxiety.
            </p>
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
          <p className="responsible reveal">
            Looking after nervous patients in St Kilda East isn&apos;t a sideline for us. It&apos;s one of the things we&apos;re known for.
          </p>
        </div>
      </section>

      {/* ── COMFORT OPTIONS ──────────────────────────────── */}
      <section className="sec sage-bg" id="comfort">
        <div className="container nervous-grid">
          <Photo
            tall
            className="reveal"
            src="/assets/nervous-patients/comfort-options.webp"
            alt="A dentist reassuring a smiling, relaxed patient in the treatment chair"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
          <div className="reveal">
            <div className="eyebrow">Whatever helps you feel safe</div>
            <h2>How we help nervous patients <em>feel comfortable</em></h2>
            <p>Our goal is to help you feel genuinely calm and in control, not to put you to sleep. For most nervous patients, happy gas (nitrous oxide) and a slow, gentle approach is all it takes to feel completely at ease: awake, aware and relaxed.</p>
            <p>We book longer dental appointments so nothing is rushed, set agreed stop signals before we begin, and take breaks during treatment whenever you need one. You&apos;ll get gentle explanations of each step before it happens, and no judgement, ever. Tell us what worries you most, and we&apos;ll build the appointment around it.</p>
            <div className="chips chips-ico">
              {comfort.map(({ icon, label }) => (
                <span className="chip" key={label}><Ico name={icon} />{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ON YOUR TERMS ────────────────────────────────── */}
      <section className="sec">
        <div className="container reveal">
          <div className="sec-head center">
            <div className="eyebrow">You set the pace</div>
            <h2>This is your appointment, <em>on your terms</em></h2>
          </div>
          <div className="terms-band">
            <p>Stop any time. Ask anything. Take it slow. Bring someone. Decide later.</p>
            <span>Nothing happens without your say-so. Tell us what you need, and that&apos;s how we&apos;ll do it.</span>
          </div>
        </div>
      </section>

      {/* ── IN OUR PATIENTS' WORDS ────────────────────────
          The shared review row — real Google reviews only; see
          components/ReviewMarquee.tsx. */}
      <section className="sec sec-reviews">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">In our patients&apos; words</div>
            <h2>Kind, gentle, and <em>never rushed</em></h2>
          </div>
        </div>
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
          The same .team-row as the home and new patient pages. */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal gentle-team-head">
            <div className="eyebrow">The people you&apos;ll meet</div>
            <h2>A calm team that genuinely <em>gets it</em></h2>
            <p>
              <Link href={`${TEAM}#${anbar.slug}`}>{anbar.name}</Link> and the {business.name} team regularly care for patients with dental anxiety and people returning after long gaps between dental visits.
            </p>
          </div>
          <div className="team-row reveal">
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
            <div className="team-row-people" id="gentle-team">
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
          <CarouselNav targetId="gentle-team" count={clinicians.length} itemSelector=".team-member" className="team-nav" />
          <div className="team-row-cta reveal">
            <Link href={TEAM} className="btn">Meet the team</Link>
          </div>
        </div>
      </section>

      {/* ── COSTS ─────────────────────────────────────────── */}
      <section className="sec npv-cost">
        <div className="container">
          <div className="npv-cost-card reveal">
            <div className="eyebrow">No financial surprises</div>
            <h2>Clear costs, <em>decided together</em></h2>
            <p>
              Cost worries can be as stressful as the dentistry itself. You&apos;ll always get a clear written estimate before anything goes ahead, and we offer payment plans for larger treatment. If you&apos;re new to us, your first visit is our <Link href={NEW_PATIENT}>New Patient Comprehensive Care Visit</Link> at one simple price with everything included. After that, regular <Link href={CHECK_UPS}>check-ups &amp; cleans</Link> keep future visits short and predictable.
            </p>
            <div className="offer-actions">
              <Link href={FEES} className="btn btn-ghost">Fees &amp; health funds</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────
          Same array as the FAQPage schema above. */}
      <section className="sec npv-faq" id="faq">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Honest answers</div>
            <h2>Questions nervous patients <em>often ask</em></h2>
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

      {/* ── TAKE THE FIRST STEP ──────────────────────────── */}
      <section className="sec" id="book">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Whatever feels easier</div>
            <h2>Take the first step, <em>gently</em></h2>
          </div>
          <div className="booking-cols reveal">
            <div className="book-card">
              <div className="book-head">
                <span className="book-ico"><Ico name="calendar" /></span>
                <h3>Book online</h3>
              </div>
              <p>Choose a time that suits you. Mention that you&apos;re nervous and we&apos;ll plan a slower, longer visit.</p>
              <Link href="/online-booking" className="btn">Book a gentle visit</Link>
            </div>
            <div className="book-card">
              <div className="book-head">
                <span className="book-ico"><Ico name="phone" /></span>
                <h3>Prefer we call you?</h3>
              </div>
              <p>Leave your details and we&apos;ll call for a relaxed, no-pressure chat about what would help.</p>
              <CallbackForm
                className="form"
                namePlaceholder="First name"
                showEmail
              />
            </div>
          </div>
          <p className="book-fine reveal">
            Prefer to talk it through? Call us on{' '}
            <a href={telHref}>{business.telephoneDisplay}</a>.
          </p>

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
