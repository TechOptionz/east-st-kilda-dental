import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import type { Crumb } from '@/components/Breadcrumb'
import FaqAnswer from '@/components/FaqAnswer'
import FaqHashOpen from '@/components/FaqHashOpen'
import JsonLd from '@/components/JsonLd'
import Ico, { type IconName } from '@/components/LineIcon'
import Photo from '@/components/Photo'
import {
  FAQ_LAST_UPDATED,
  FAQ_REVIEWER,
  faqCategories,
  faqId,
  faqPlainText,
} from '@/data/dental-faqs'
import { personNode, practiceNode } from '@/lib/schema'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, business, clinicians, telHref } from '@/lib/business'

const PAGE_URL = `${SITE_URL}/dental-faqs`

const TITLE = 'Dental FAQs St Kilda East | Common Dental Questions Answered'
const DESCRIPTION =
  'Clear answers to common dental questions about first visits, emergencies, tooth pain, nervous patients, costs, implants, cosmetic dentistry, Invisalign and more.'

export const metadata: Metadata = withSocial({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
})

const HEALTHDIRECT_TOOTHACHE = 'https://www.healthdirect.gov.au/toothache-and-gum-swelling'

const reviewer = FAQ_REVIEWER ? clinicians.find((c) => c.slug === FAQ_REVIEWER) : undefined

/** A short icon per category, for the jump list. */
const categoryIcon: Record<string, IconName> = {
  'first-visits': 'person',
  'tooth-pain-emergencies': 'siren',
  'nervous-patients': 'feather',
  'check-ups-prevention': 'shield',
  'fillings-crowns-root-canal': 'tooth',
  'wisdom-teeth': 'alert',
  'dental-implants': 'steps',
  'cosmetic-dentistry': 'sparkle',
  'clear-aligners': 'options',
  'costs-health-funds': 'list',
  visiting: 'calendar',
}

// ── Visuals ────────────────────────────────────────────────────────────────
// Five across the page, each set above the questions it helps explain rather
// than beside every answer: a triage guide for emergencies, a diagram for
// implants, and real practice photography for anxiety, cosmetic care and
// aligners. The hero and the team photo at the foot make seven.

/** Routine / prompt / emergency, as a reader in pain actually needs it sorted. */
function UrgencyGuide() {
  const tiers = [
    {
      tone: 'routine',
      label: 'Routine',
      action: 'Book a normal appointment',
      items: ['Mild or brief sensitivity', 'A small chip with no pain', 'A check-up or clean that is due'],
    },
    {
      tone: 'prompt',
      label: 'Prompt',
      action: 'Call us the same day',
      items: [
        'Toothache lasting more than 2 days, or not easing with pain relief',
        'Gum or facial swelling, or pain when biting',
        'A broken tooth, lost filling or crown that has come off',
      ],
    },
    {
      tone: 'urgent',
      label: 'Emergency',
      action: 'Get help now',
      items: [
        'A knocked-out adult tooth — call us on the way',
        'Swelling affecting breathing or speaking, or around the eye or neck — call 000 or go to hospital',
      ],
    },
  ]
  return (
    <figure className="faqs-urgency">
      <div className="faqs-urgency-row">
        {tiers.map((t) => (
          <div className={`faqs-tier faqs-tier-${t.tone}`} key={t.tone}>
            <span className="faqs-tier-label">{t.label}</span>
            <b>{t.action}</b>
            <ul>{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
      <figcaption>
        A general guide, not a diagnosis. If you&apos;re unsure, call us on{' '}
        <a href={telHref}>{business.telephoneDisplay}</a>. Guidance on toothache and swelling from{' '}
        <a href={HEALTHDIRECT_TOOTHACHE} target="_blank" rel="noopener noreferrer">healthdirect</a>.
      </figcaption>
    </figure>
  )
}

/** A labelled cross-section: crown, abutment, implant fixture in the jawbone. */
function ImplantDiagram() {
  return (
    <figure className="faqs-diagram">
      <svg viewBox="0 0 400 250" role="img" aria-labelledby="implant-diagram-title">
        <title id="implant-diagram-title">
          Diagram of a dental implant: a crown on top, joined by an abutment to an implant fixture set in the jawbone
        </title>
        {/* bone and gum */}
        <rect className="d-bone" x="20" y="120" width="170" height="120" rx="10" />
        <rect className="d-gum" x="20" y="104" width="170" height="26" rx="10" />
        {/* implant fixture with threads */}
        <path className="d-implant" d="M88 124h34v84l-6 16h-22l-6-16Z" />
        {[140, 156, 172, 188, 204].map((y) => (
          <path key={y} className="d-thread" d={`M84 ${y}h42`} />
        ))}
        {/* abutment */}
        <path className="d-abutment" d="M92 96h26l-3 30h-20Z" />
        {/* crown */}
        <path className="d-crown" d="M70 98c-4-26 0-58 35-58s39 32 35 58c-2 6-8 8-14 8H84c-6 0-12-2-14-8Z" />
        {/* leader lines and labels */}
        <path className="d-leader" d="M142 66h56" />
        <path className="d-leader" d="M120 110h78" />
        <path className="d-leader" d="M128 176h70" />
        <text className="d-label" x="204" y="62">Crown</text>
        <text className="d-sub" x="204" y="78">the visible replacement tooth</text>
        <text className="d-label" x="204" y="106">Abutment</text>
        <text className="d-sub" x="204" y="122">joins the crown to the implant</text>
        <text className="d-label" x="204" y="172">Implant</text>
        <text className="d-sub" x="204" y="188">a fixture set in the jawbone</text>
      </svg>
      <figcaption>
        A simplified single-tooth implant. Read more about <Link href="/services/dental-implants">dental implants</Link>.
      </figcaption>
    </figure>
  )
}

/** `ratio` and `position` let each photograph keep its subject in frame —
    the default 16:7 letterbox suits a wide scene but not a square one. */
function PhotoVisual({ src, alt, caption, ratio, position = 'center' }: {
  src: string
  alt: string
  caption: ReactNode
  ratio?: string
  position?: string
}) {
  return (
    <figure className="faqs-photo">
      <Photo
        src={src}
        alt={alt}
        objectPosition={position}
        style={ratio ? { aspectRatio: ratio } : undefined}
        sizes="(max-width: 900px) 100vw, 760px"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const visuals: Record<string, ReactNode> = {
  'tooth-pain-emergencies': <UrgencyGuide />,
  'nervous-patients': (
    <PhotoVisual
      src="/assets/nervous-patients/comfort-options.webp"
      alt="A dentist reassuring a smiling, relaxed patient in the treatment chair"
      position="center 40%"
      caption={<>Slower pacing, stop signals and happy gas. See how we look after <Link href="/nervous-patients">nervous patients</Link>.</>}
    />
  ),
  'dental-implants': <ImplantDiagram />,
  'cosmetic-dentistry': (
    <PhotoVisual
      src="/assets/services/smile-design-1.webp"
      alt="A dentist showing a patient her digital smile design on a tablet, before-and-after images on the screen behind"
      /* A square source: the screen sits in the top third and the tablet
         in the bottom fifth, so a letterbox cut one or the other. 16:11 at
         45% keeps the screen, both faces and the tablet in frame. */
      ratio="16 / 11"
      position="center 45%"
      caption={<>Cosmetic care starts with your goals. Explore <Link href="/services/smile-design">smile design</Link> and <Link href="/services/veneers">veneers</Link>.</>}
    />
  ),
  'clear-aligners': (
    <PhotoVisual
      src="/assets/services/invisalign.webp"
      alt="A smiling woman holding a clear aligner up in front of her teeth"
      position="center 48%"
      caption={<>Removable trays that move teeth gradually. Read about <Link href="/services/invisalign">clear aligners</Link>.</>}
    />
  ),
}

const breadcrumbTrail: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Dental FAQs' },
]

const allFaqs = faqCategories.flatMap((c) => c.faqs)

/**
 * Structured data: the page, the practice (Dentist, a LocalBusiness subtype)
 * and one FAQPage holding every question — all of which are in the
 * server-rendered HTML, inside the accordions. The BreadcrumbList comes from
 * <BreadcrumbBar>. reviewedBy and lastReviewed are only published once a
 * reviewing clinician is set in data/dental-faqs.ts.
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
      about: { '@id': SCHEMA_ID.practice },
      mainEntity: { '@id': `${PAGE_URL}#faq` },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      dateModified: FAQ_LAST_UPDATED.iso,
      inLanguage: 'en-AU',
      ...(reviewer
        ? { reviewedBy: { '@id': personNode(reviewer)['@id'] }, lastReviewed: FAQ_LAST_UPDATED.iso }
        : {}),
    },
    practiceNode(),
    ...(reviewer ? [personNode(reviewer)] : []),
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: allFaqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: faqPlainText(a) },
      })),
    },
  ],
}

export default function DentalFaqsPage() {
  return (
    <main className="npv faqs">
      <JsonLd data={pageSchema} />
      <FaqHashOpen />
      <BreadcrumbBar trail={breadcrumbTrail} id={`${PAGE_URL}#breadcrumb`} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal hero-fit">
            <div className="eyebrow">Dental questions, answered clearly</div>
            <h1>Dental FAQs: <em>Common Dental Questions Answered</em></h1>
            <p>Looking for straightforward answers about your teeth, dental treatment or what happens when you visit the dentist?</p>
            <p>
              The team at {business.name} in St Kilda East has answered some of the questions patients ask us most often — from toothache and dental anxiety to implants, cosmetic dentistry, health funds and first appointments.
            </p>
            <p className="faqs-disclaimer">
              <Ico name="alert" />
              <span>This information is general and cannot replace an individual dental examination or diagnosis.</span>
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book an appointment</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <p className="faqs-meta">
              {reviewer && (
                <>
                  Reviewed by <Link href={`/about/our-team#${reviewer.slug}`}>{reviewer.name}</Link>
                  <span className="proof-dot" />
                </>
              )}
              Last updated: {FAQ_LAST_UPDATED.label}
            </p>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/dental-faqs/dental-faqs-hero.webp"
            alt="A dentist at East St Kilda Dental explaining brushing technique on a dental model to a seated patient"
            objectPosition="center 42%"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── THE LIBRARY ──────────────────────────────────
          A jump list beside the categories on a wide screen (a scrolling chip
          row on a phone), and every answer in a closed accordion — closed for
          the reader, but present in the HTML for search engines. */}
      <section className="sec faqs-body">
        <div className="container faqs-layout">
          <nav className="faqs-nav" aria-label="FAQ categories">
            <span className="faqs-nav-title">Jump to a topic</span>
            <ul>
              {faqCategories.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`}>
                    <Ico name={categoryIcon[c.id] ?? 'list'} />
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="faqs-main">
            {faqCategories.map((c) => (
              <section className="faqs-cat" id={c.id} key={c.id} aria-labelledby={`${c.id}-title`}>
                <div className="faqs-cat-head">
                  <span className="faqs-cat-ico"><Ico name={categoryIcon[c.id] ?? 'list'} /></span>
                  <h2 id={`${c.id}-title`}>{c.title}</h2>
                  <span className="faqs-cat-count">{c.faqs.length} questions</span>
                </div>
                {visuals[c.id]}
                <div className="faq">
                  {c.faqs.map((f) => (
                    <details key={f.q} id={faqId(f.q)}>
                      <summary>{f.q}</summary>
                      <div className="faqs-answer"><FaqAnswer text={f.a} /></div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ── STILL HAVE A QUESTION ─────────────────────────
          The team photo and the ask together, in the same split card the new
          patient page uses for its first-visit offer. */}
      <section className="sec alt">
        <div className="container reveal">
          <div className="offer-card-v2">
            <div className="body">
              <div className="eyebrow">We&apos;re here to help</div>
              <h2>Still have a <em>question?</em></h2>
              <p>
                If your question isn&apos;t answered here, contact {business.name} and our team can help you work out the appropriate next step.
              </p>
              <div className="offer-actions">
                <Link href="/online-booking" className="btn">Book an appointment</Link>
                <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
              </div>
              <p className="faqs-cta-links">
                New to us? Start with the <Link href="/new-patient-comprehensive-care-visit">New Patient Comprehensive Care Visit</Link>, or see our <Link href="/fees">fees &amp; health funds</Link>.
              </p>
            </div>
            <Photo
              className="offer-photo"
              src="/assets/shared/meet-our-team.webp"
              alt="The East St Kilda Dental team standing together outside the clinic entrance"
              objectPosition="center 60%"
              sizes="(max-width: 820px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
