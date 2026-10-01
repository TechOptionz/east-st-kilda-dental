import type { Metadata } from 'next'
import Link from 'next/link'
import Photo from '@/components/Photo'
import JsonLd from '@/components/JsonLd'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import { learnHubTrail } from '@/components/Breadcrumb'
import GuideLibrary from '@/components/GuideLibrary'
import GetInTouch from '@/components/GetInTouch'
import { practitionerPath } from '@/data/practitioners'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, business, telHref } from '@/lib/business'
import { publishedArticles } from '@/data/articles'
import { populatedTopics } from '@/data/topics'

export const metadata: Metadata = withSocial({
  title: 'Dental Education | East St Kilda Dental',
  description:
    'Clear, calm answers to your dental questions. Honest, easy-to-read guides with no jargon, no scare tactics, no selling — from the team at East St Kilda Dental.',
  alternates: { canonical: `${SITE_URL}/learn` },
})

const LEARN_URL = `${SITE_URL}/learn`

/**
 * The guides that are actually live.
 *
 * This is `data/articles.ts` filtered to published — the same source that
 * generates the article routes and the sitemap. The grid, the ItemList and the
 * routes therefore cannot disagree: write a guide, mark it published, and it
 * appears in all three at once with no separate edit.
 */
const publishedGuides = publishedArticles

/**
 * What the grid actually needs, and the chips that filter it.
 *
 * The library filters in the browser, so only the card fields cross into the
 * client bundle — the bodies, FAQs and schema copy stay on the server. Chips
 * come from populatedTopics, so every one of them narrows the grid to at least
 * one guide.
 */
const guideCards = publishedGuides.map(
  ({ slug, title, eyebrow, author, readTime, image, topics, date, video }) => ({
    slug,
    title,
    eyebrow,
    author,
    readTime,
    image,
    topics,
    date,
    video,
  }),
)
const chipTopics = populatedTopics.map(({ slug, label }) => ({ slug, label }))

/**
 * Topics we intend to write, shown as one quiet non-linked line.
 *
 * These are not pages and must never be rendered as cards or links — an empty
 * promise dressed up as content reads as an unfinished site to a crawler, and a
 * placeholder route would be a thin page or a soft 404. Move a title out of
 * here and into data/articles.ts when the guide is actually written.
 */
const upcomingTopics = [
  'Do I really need a crown?',
  'Is teeth whitening safe?',
  'Helping an anxious child at the dentist',
]

/**
 * The clinicians the guides come from.
 *
 * Photos and roles match the team section on the home page — the same four
 * faces, so the library reads as written by the people you will actually sit
 * with rather than by an anonymous content desk.
 */
const writers = [
  {
    name: 'Dr Anbar Ganatra',
    role: 'Cosmetic & General Dentist',
    photo: '/assets/team/anbar-ganatra.webp',
    alt: 'Dr Anbar Ganatra – Cosmetic & General Dentist',
    objectPosition: 'center top',
  },
  {
    name: 'Dr Edmund Goldman',
    role: 'Dentist',
    photo: '/assets/team/edmund-goldman.webp',
    alt: 'Dr Edmund Goldman – Dentist',
    objectPosition: 'center top',
  },
  {
    name: 'Dr Jarrod Dean',
    role: 'Dentist',
    photo: '/assets/team/jarrod-dean.webp',
    alt: 'Dr Jarrod Dean – Dentist',
    objectPosition: 'center top',
  },
  {
    name: 'Michelle Callaghan',
    role: 'Hygienist',
    photo: '/assets/team/michelle-callaghan.webp',
    alt: 'Michelle Callaghan – Hygienist',
    objectPosition: '40% 95%',
  },
]

// Marks the Learn hub as a curated library rather than a page with links, and
// connects it to the WebSite and practice nodes declared on the home page.
const learnSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': SCHEMA_ID.learnCollection,
      url: LEARN_URL,
      name: 'Dental Education',
      description:
        'Clear, calm answers to common dental questions. Honest, easy-to-read guides from East St Kilda Dental.',
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': SCHEMA_ID.practice },
      // The BreadcrumbList is not restated here: <BreadcrumbBar> emits it from
      // the same trail it renders, so the visible trail and the markup cannot
      // disagree. This node just points at it by @id, as the suburb and service
      // pages do.
      breadcrumb: { '@id': `${LEARN_URL}#breadcrumb` },
      mainEntity: { '@id': SCHEMA_ID.learnGuides },
    },
    {
      '@type': 'ItemList',
      '@id': SCHEMA_ID.learnGuides,
      name: 'Guides and articles',
      itemListElement: publishedGuides.map((guide, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${LEARN_URL}/${guide.slug}`,
        name: guide.title,
      })),
    },
  ],
}

export default function LearnIndex() {
  return (
    <main>
      <JsonLd data={learnSchema} />

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <BreadcrumbBar trail={learnHubTrail} id={`${LEARN_URL}#breadcrumb`} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">Learn</div>
            <h1>Dental Education</h1>
            <p className="lead">Explore a wide range of helpful resources to learn more about dental health, treatments, and proper oral care.</p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book a check-up</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
            {/* The third way in, for the question no guide answers. */}
            <p style={{ marginTop: '18px', fontSize: '15px' }}>
              Can&apos;t find your question?{' '}
              <Link href="#contact" style={{ color: 'var(--sage-deep)', fontWeight: 600 }}>
                Ask us directly &rarr;
              </Link>
            </p>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/learn/dental-ed-hero.webp"
            alt="Dentist explaining an X-ray to a smiling patient in the treatment room"
            hint="Warm, calm editorial image. Never stock-clinical."
            sizes="(max-width: 860px) 100vw, 48vw"
            priority
          />
        </div>
      </section>

      {/* ── TOPICS & ARTICLES ────────────────────────────── */}
      <GuideLibrary guides={guideCards} topics={chipTopics} upcoming={upcomingTopics} />

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="ctaband reveal">
            <h3>Still not sure what you need?</h3>
            <p>
              Reading only gets you so far. Come in for a check-up and we&apos;ll show you what we see on the screen, explain it in plain language, and leave you with a clear, prioritised plan. Nothing happens without your say-so.
            </p>
            <div className="ctaband-actions">
              <Link href="/online-booking" className="btn btn-light">Book a check-up</Link>
              <a href={telHref} className="btn btn-ghost ctaband-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WRITES THESE ─────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Who writes these guides</div>
            <h2>Written by the people who&apos;d <em>treat you</em></h2>
            <p style={{ marginTop: '14px', fontSize: '17px' }}>
              Every guide comes from the questions we answer in the chair each week, written and checked by our own clinicians — not bought in, and never written to sell you a treatment.
            </p>
          </div>
          <div className="team-grid-v2">
            {writers.map((writer) => (
              <div className="team-member reveal" key={writer.name}>
                <Photo
                  src={writer.photo}
                  alt={writer.alt}
                  objectPosition={writer.objectPosition}
                  sizes="(max-width: 820px) 50vw, 25vw"
                />
                <h4>{practitionerPath(writer.name) ? <Link className="name-link" href={practitionerPath(writer.name)!}>{writer.name}</Link> : writer.name}</h4>
                <span>{writer.role}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }} className="reveal">
            <Link href="/about/our-team" className="btn btn-ghost">Meet our team</Link>
          </div>
        </div>
      </section>

      {/* ── ASK US ───────────────────────────────────────── */}
      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
