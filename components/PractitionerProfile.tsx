import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import { practitionerTrail } from '@/components/Breadcrumb'
import GetInTouch from '@/components/GetInTouch'
import GuideGrid from '@/components/GuideGrid'
import JsonLd from '@/components/JsonLd'
import Ico from '@/components/LineIcon'
import Photo from '@/components/Photo'
import QAReveal from '@/components/QAReveal'
import ReviewMarquee from '@/components/ReviewMarquee'
import { publishedArticles } from '@/data/articles'
import { getPractitioner, type Answer, type PractitionerProfile } from '@/data/practitioners'
import { withSocial } from '@/lib/seo'
import {
  SCHEMA_ID,
  SITE_URL,
  business,
  clinicianId,
  localityLine,
  streetAddress,
  telHref,
} from '@/lib/business'
import styles from './PractitionerProfile.module.css'

function requirePractitioner(slug: string): PractitionerProfile {
  const p = getPractitioner(slug)
  if (!p) throw new Error(`No practitioner profile for "${slug}" in data/practitioners.ts`)
  return p
}

const profileUrl = (p: PractitionerProfile) => `${SITE_URL}/about/${p.slug}`

/** The practice's Google reviews — the same link the home page's row uses. */
const GOOGLE_REVIEWS = 'https://share.google/M1ZtOT5z13fj2mhWf'

/**
 * Title, description, self-referencing canonical and share card, from the
 * profile's own entry. Indexable only once the profile is published — until
 * then the page can be reviewed at its URL but asks search engines not to
 * index it.
 */
export function practitionerMetadata(slug: string): Metadata {
  const p = requirePractitioner(slug)
  const ogTitle = p.meta.ogTitle ?? p.meta.title
  const share = p.shareImage
    ? { url: p.shareImage, width: 1200, height: 630, alt: `${p.name}, ${p.jobTitle} at ${business.name}` }
    : undefined
  return withSocial({
    title: p.meta.title,
    description: p.meta.description,
    alternates: { canonical: profileUrl(p) },
    robots: p.published ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: 'website',
      siteName: business.name,
      locale: 'en_AU',
      url: profileUrl(p),
      title: ogTitle,
      description: p.meta.description,
      ...(share ? { images: [share] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: p.meta.description,
      ...(share ? { images: [share.url] } : {}),
    },
  })
}

const has = <T,>(list: T[] | undefined): list is T[] => Boolean(list && list.length > 0)

/**
 * A paragraph with its [anchor](/path) links made real. Nothing else in the
 * string is touched — the answers are the practitioner's own words.
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\))/)
  return (
    <p>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        return link ? (
          <Link key={i} href={link[2]}>
            {link[1]}
          </Link>
        ) : (
          part
        )
      })}
    </p>
  )
}

/** The follow-on link set under an answer, e.g. to a related service. */
function More({ more }: { more: NonNullable<Answer['more']> }) {
  return (
    <p className="pathlink">
      {more.lead && <>{more.lead} </>}
      <Link href={more.href}>{more.label}</Link> &rarr;
    </p>
  )
}

/** A question as an H3 and the whole answer beneath it, always open. */
function QA({ item }: { item: Answer }) {
  return (
    <div className={styles.qa}>
      <h3>{item.question}</h3>
      <div className={styles.answer}>
        {item.answer.map((text, i) => (
          <Rich key={i} text={text} />
        ))}
      </div>
      {item.more && <More more={item.more} />}
    </div>
  )
}

/**
 * An interview question: the question alone until hovered, then the whole
 * answer (see QAReveal). Rendered here, so the full answer is in the server
 * HTML whether or not it has been opened.
 */
function InterviewQA({ item, number, className }: { item: Answer; number?: string; className?: string }) {
  return (
    <QAReveal question={item.question} number={number} className={className}>
      {item.answer.map((text, i) => (
        <Rich key={i} text={text} />
      ))}
      {item.more && <More more={item.more} />}
    </QAReveal>
  )
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/** "October 2026", from an ISO date, independent of the server's time zone. */
const monthYear = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-AU', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/**
 * A standalone practitioner page: /about/<slug>.
 *
 * Every section after the hero is optional and renders only when its content
 * exists in data/practitioners.ts, so the page grows as content is supplied
 * and never shows an empty heading. Everything is server-rendered: the answers
 * are in the HTML, not behind accordions or client-side fetches.
 */
export default function PractitionerProfilePage({ slug }: { slug: string }) {
  const p = requirePractitioner(slug)
  const url = profileUrl(p)
  const personId = clinicianId(p.clinicianSlug)

  // Only guides the practice has approved as written or reviewed by this
  // practitioner — never inferred from a byline.
  const guides = (p.articles ?? [])
    .map(a => publishedArticles.find(g => g.slug === a.slug))
    .filter((g): g is (typeof publishedArticles)[number] => Boolean(g))

  const quals = p.qualifications ?? []

  // ProfilePage about one Person. The Person's @id is the one every other page
  // uses for this clinician (see clinicianId), so this page is where the
  // entity is described in full rather than a second copy of it. Only facts
  // present on the page, and verified, are published. No FAQPage or QAPage:
  // the questions are an interview, not a Q&A forum.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        name: p.meta.title,
        description: p.meta.description,
        isPartOf: { '@id': SCHEMA_ID.website },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': personId },
        publisher: { '@id': SCHEMA_ID.practice },
        primaryImageOfPage: `${SITE_URL}${p.image}`,
        datePublished: p.datePublished,
        dateModified: p.dateModified,
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: p.name,
        url,
        image: `${SITE_URL}${p.image}`,
        jobTitle: p.roles.length > 1 ? p.roles : p.jobTitle,
        ...(p.intro ? { description: p.intro } : {}),
        hasOccupation: { '@type': 'Occupation', name: 'Dentist' },
        worksFor: { '@id': SCHEMA_ID.practice },
        mainEntityOfPage: { '@id': `${url}#webpage` },
        ...(has(p.knowsAbout) ? { knowsAbout: p.knowsAbout } : {}),
        ...(has(quals)
          ? {
              hasCredential: quals.map(q => ({
                '@type': 'EducationalOccupationalCredential',
                name: q.award,
                credentialCategory: 'degree',
                ...(q.institution
                  ? { recognizedBy: { '@type': 'CollegeOrUniversity', name: q.institution } }
                  : {}),
              })),
              ...(quals.some(q => q.institution)
                ? {
                    alumniOf: [...new Set(quals.map(q => q.institution).filter(Boolean))].map(name => ({
                      '@type': 'CollegeOrUniversity',
                      name,
                    })),
                  }
                : {}),
            }
          : {}),
        ...(has(p.sameAs) ? { sameAs: p.sameAs } : {}),
      },
      // A reference to the practice, not a second copy: the full Dentist node
      // lives on the home page under the same @id.
      {
        '@type': 'Dentist',
        '@id': SCHEMA_ID.practice,
        name: business.name,
        url: business.url,
      },
    ],
  }

  return (
    <main className={styles.profile}>
      <JsonLd data={schema} />

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <BreadcrumbBar trail={practitionerTrail(p.name)} id={`${url}#breadcrumb`} />

      {/* ── HERO: name, role, portrait ───────────────────── */}
      <section className={`hero-v2 ${styles.hero}`}>
        <div className="container hero-v2-grid">
          <div className={`reveal ${styles.heroCopy}`}>
            {p.eyebrow && <div className="eyebrow">{p.eyebrow}</div>}
            <h1>{p.name}</h1>
            <p className="hero-keyline">{p.roles.join(' · ')}</p>
            {p.intro && <p className="lead">{p.intro}</p>}
            {p.ahpraNumber && <p className={styles.ahpra}>AHPRA registration {p.ahpraNumber}</p>}
            <div className="hero-cta" data-analytics-location="practitioner-hero" style={p.intro ? undefined : { marginTop: '28px' }}>
              <Link href="/online-booking" className="btn">Book with {p.shortName}</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
          {/* The portrait on an offset tint, with a line of theirs floated
              over its corner. */}
          <div className={`reveal ${styles.portraitWrap}`}>
            <Photo
              tall
              className={styles.portrait}
              priority
              src={p.image}
              alt={p.imageAlt}
              objectPosition={p.objectPosition}
              sizes="(max-width: 860px) 100vw, 480px"
            />
            {p.heroQuote && (
              <figure className={styles.heroQuote}>
                <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                <blockquote>{p.heroQuote}</blockquote>
                <figcaption>{p.name}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ── AT A GLANCE ──────────────────────────────────── */}
      {/* One panel: the short facts in a row of cells split by hairlines, the
          long one (areas of care) as a tinted strip along its foot. */}
      {has(p.facts) && (
        <section className={`sec ${styles.factsSec}`} aria-labelledby="at-a-glance">
          <div className="container">
            <div className="reveal">
              <h2 id="at-a-glance" className={styles.glanceHead}>{p.shortName} at a glance</h2>
              <dl className={styles.facts}>
                {p.facts.map(f => (
                  <div key={f.label} className={f.value.length > 60 ? `${styles.fact} ${styles.factWide}` : styles.fact}>
                    <span className={styles.ico}><Ico name={f.icon} /></span>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* ── IN THEIR OWN WORDS ───────────────────────────── */}
      {/* The first group as a feature on the deep green band — their pull
          quote beside its questions — and every group after it as numbered
          cards, two across, as the wireframe lays them out. */}
      {has(p.interview) && (
        <section className={`sec sage-bg ${styles.featureSec}`}>
          <div className={`container ${styles.feature}`}>
            <div className="reveal">
              <div className="eyebrow">In {p.shortName}&apos;s own words</div>
              <h2>{p.interview[0].heading}</h2>
              {p.interview[0].quote && (
                <figure className={styles.pull}>
                  <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                  <blockquote>{p.interview[0].quote}</blockquote>
                </figure>
              )}
              <div className={styles.byline}>
                <Image src={p.image} alt="" width={56} height={56} style={{ objectPosition: p.objectPosition }} />
                <span>
                  <b>{p.name}</b>
                  {p.roles.join(' · ')}
                </span>
              </div>
            </div>
            <div className={`${styles.qaStack} reveal`}>
              {p.interview[0].items.map(item => (
                <InterviewQA key={item.question} item={item} className={styles.qaGlass} />
              ))}
            </div>
          </div>
        </section>
      )}
      {p.interview?.slice(1).map(group => (
        <section key={group.heading} className={`sec ${styles.qaSec}`}>
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">In {p.shortName}&apos;s own words</div>
              <h2>{group.heading}</h2>
            </div>
            <div className={`${styles.qaGrid} reveal`}>
              {group.items.map((item, i) => (
                <InterviewQA
                  key={item.question}
                  item={item}
                  number={String(i + 1).padStart(2, '0')}
                  className={styles.qaCard}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── WHAT AN APPOINTMENT IS LIKE ──────────────────── */}
      {has(p.appointment) && (
        <section className="sec alt">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Your visit</div>
              <h2>What an appointment with {p.shortName} is <em>like</em></h2>
            </div>
            <ol className={`${styles.steps} reveal`}>
              {p.appointment.map((s, i) => (
                <li key={s.title}>
                  <span className={styles.stepIco}>
                    <Ico name={s.icon} />
                    <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── AREAS OF CARE ────────────────────────────────── */}
      {has(p.areasOfCare) && (
        <section className="sec">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Treatments</div>
              <h2>Areas of <em>care</em></h2>
            </div>
            <ul className={`${styles.areas} reveal`}>
              {p.areasOfCare.map(a => (
                <li key={a.title}>
                  <Link href={a.href} className={styles.area}>
                    <span className={styles.areaIco}><Ico name={a.icon} /></span>
                    <div className={styles.areaBody}>
                      <h3>{a.title}</h3>
                      <p>{a.text}</p>
                    </div>
                    <span className={styles.areaGo}><Arrow /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── WHY THIS PRACTICE / QUALIFICATIONS ───────────── */}
      {(p.practice || has(quals)) && (
        <section className="sec alt">
          <div className={`container ${styles.practice}`}>
            {p.practice && (
              <div className="reveal">
                <div className="eyebrow">{business.name}</div>
                <h2>{p.practice.heading}</h2>
                <QA item={p.practice} />
                {has(p.practice.links) && (
                  <p className="pathlink">
                    Learn more about{' '}
                    {p.practice.links.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && (i === p.practice!.links!.length - 1 ? ' and ' : ', ')}
                        <Link href={l.href}>{l.label}</Link>
                      </span>
                    ))}{' '}
                    &rarr;
                  </p>
                )}
              </div>
            )}
            {/* Qualifications take this column once verified ones are
                supplied; until then the practice itself does. */}
            {has(quals) ? (
              <div className={`${styles.quals} reveal`}>
                <h2>Qualifications &amp; professional background</h2>
                <ul className="check-list">
                  {quals.map(q => (
                    <li key={q.award}>
                      <span>
                        <strong>{q.award}</strong>
                        {q.institution && <>, {q.institution}</>}
                        {q.year && <> ({q.year})</>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className={`reveal ${styles.clinicWrap}`}>
                <Photo
                  tall
                  src="/assets/about/our-story-clinic-corner.webp"
                  alt="The East St Kilda Dental clinic on the corner of Dandenong Rd, its sign out front beside the street sign"
                  objectPosition="48% center"
                  sizes="(max-width: 860px) 100vw, 45vw"
                />
                <div className={styles.since}>
                  <span>Caring locally since</span>
                  <b>{business.foundedYear}</b>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── OUTSIDE THE PRACTICE ─────────────────────────── */}
      {p.outside && (
        <section className={`sec ${styles.outsideSec}`}>
          <div className="container">
            <div className={`${styles.outside} reveal`}>
              <Image
                className={styles.outsideAvatar}
                src={p.image}
                alt=""
                width={120}
                height={120}
                style={{ objectPosition: p.objectPosition }}
              />
              <div>
                <h2>{p.outside.heading}</h2>
                <h3>{p.outside.question}</h3>
                {p.outside.answer.map((text, i) => (
                  <Rich key={i} text={text} />
                ))}
                {has(p.outside.tags) && (
                  <ul className={styles.tags}>
                    {p.outside.tags.map(t => (
                      <li key={t.label}>
                        <Ico name={t.icon} />
                        {t.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PATIENT FEEDBACK ─────────────────────────────── */}
      {/* The home page's drifting row, with this practitioner's reviews. The
          longest are held to a few lines in the card; the full text is still
          in the page, and on Google. */}
      {has(p.reviews) && (
        <section className={`sec sec-reviews ${styles.reviewsSec}`}>
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Google reviews</div>
              <h2>What patients <em>say</em> about {p.shortName}</h2>
            </div>
          </div>
          {/* Outside the container on purpose — the row runs off both edges. */}
          <ReviewMarquee reviews={p.reviews} id={`${p.slug}-reviews`} label={`Reviews of ${p.name}`} />
          <div className="container">
            <div className="gscore reveal">
              Rated <b>5.0 on Google</b> by our local patients &middot;{' '}
              <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
                Read all reviews
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── DENTAL EDUCATION (approved attributions only) ── */}
      {has(guides) && (
        <section className="sec">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Dental education</div>
              <h2>Dental education with {p.shortName}</h2>
            </div>
            <GuideGrid guides={guides} />
          </div>
        </section>
      )}

      {/* ── CASES (consented, approved cases only) ───────── */}
      {has(p.cases) && (
        <section className="sec">
          <div className="container reveal" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Our work</div>
            <h2>How {p.shortName} approaches real treatment decisions</h2>
            <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {p.cases.map(c => (
                <Link key={c.href} href={c.href} className="btn btn-ghost">{c.label}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BOOK ─────────────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className={`ctaband ${styles.cta} reveal`} data-analytics-location="practitioner-cta">
            <Image
              className={styles.ctaAvatar}
              src={p.image}
              alt=""
              width={84}
              height={84}
              style={{ objectPosition: p.objectPosition }}
            />
            <h2>{p.cta?.heading ?? `Book with ${p.name}`}</h2>
            {p.cta?.text && <p>{p.cta.text}</p>}
            <div className="ctaband-actions">
              <Link href="/online-booking" className="btn">Book with {p.shortName}</Link>
              <a href={telHref} className="btn btn-ghost ctaband-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <address className={styles.address}>
              <Ico name="pin" />
              <span>
                <b>{business.name}</b> {streetAddress}, {localityLine}
              </span>
            </address>
          </div>
          <p className={styles.updated}>
            Profile updated: <time dateTime={p.dateModified}>{monthYear(p.dateModified)}</time>
          </p>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
