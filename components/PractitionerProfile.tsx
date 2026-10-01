import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import { practitionerTrail } from '@/components/Breadcrumb'
import GetInTouch from '@/components/GetInTouch'
import GuideGrid from '@/components/GuideGrid'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import { publishedArticles } from '@/data/articles'
import { getPractitioner, type PractitionerProfile } from '@/data/practitioners'
import { services } from '@/data/services'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, business, clinicianId, telHref } from '@/lib/business'

function requirePractitioner(slug: string): PractitionerProfile {
  const p = getPractitioner(slug)
  if (!p) throw new Error(`No practitioner profile for "${slug}" in data/practitioners.ts`)
  return p
}

const profileUrl = (p: PractitionerProfile) => `${SITE_URL}/about/${p.slug}`

/**
 * Title, description and self-referencing canonical, from the profile's own
 * entry. Indexable only once the profile is published — until then the page
 * can be reviewed at its URL but asks search engines not to index it.
 */
export function practitionerMetadata(slug: string): Metadata {
  const p = requirePractitioner(slug)
  return withSocial({
    title: p.meta.title,
    description: p.meta.description,
    alternates: { canonical: profileUrl(p) },
    robots: p.published ? { index: true, follow: true } : { index: false, follow: true },
  })
}

const has = <T,>(list: T[] | undefined): list is T[] => Boolean(list && list.length > 0)

/** Paragraphs as a simple prose block. */
function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </>
  )
}

/**
 * A standalone practitioner page: /about/<slug>.
 *
 * Every section after the hero is optional and renders only when its content
 * exists in data/practitioners.ts, so the page grows as content is supplied
 * and never shows an empty heading. The guides list is derived, not entered:
 * any published guide whose byline names this practitioner appears here.
 */
export default function PractitionerProfilePage({ slug }: { slug: string }) {
  const p = requirePractitioner(slug)
  const url = profileUrl(p)
  const personId = clinicianId(p.clinicianSlug)

  const treatments = services.filter(s => p.services?.includes(s.slug))
  const guides = publishedArticles.filter(a => a.author === p.name)

  // ProfilePage about one Person. The Person keeps the @id the rest of the site
  // graph already uses for this clinician (home page, team page, article
  // bylines), so this page enriches that one entity rather than declaring a
  // second. Only facts present on the page are published.
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
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: p.name,
        jobTitle: p.jobTitle,
        url,
        image: `${SITE_URL}${p.image}`,
        ...(p.intro ? { description: p.intro } : {}),
        hasOccupation: { '@type': 'Occupation', name: 'Dentist' },
        worksFor: { '@id': SCHEMA_ID.practice },
        ...(has(p.clinicalInterests) ? { knowsAbout: p.clinicalInterests } : {}),
        ...(has(p.qualifications)
          ? {
              hasCredential: p.qualifications.map(q => ({
                '@type': 'EducationalOccupationalCredential',
                name: q.award,
                credentialCategory: 'degree',
                ...(q.institution
                  ? { recognizedBy: { '@type': 'CollegeOrUniversity', name: q.institution } }
                  : {}),
              })),
              alumniOf: [...new Set(p.qualifications.map(q => q.institution).filter(Boolean))].map(
                name => ({ '@type': 'CollegeOrUniversity', name }),
              ),
            }
          : {}),
      },
    ],
  }

  return (
    <main>
      <JsonLd data={schema} />

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <BreadcrumbBar trail={practitionerTrail(p.name)} id={`${url}#breadcrumb`} />

      {/* ── HERO: name, title, portrait ──────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">{p.jobTitle}</div>
            <h1>{p.name}</h1>
            {p.intro && <p className="lead">{p.intro}</p>}
            {p.ahpraNumber && (
              <p style={{ fontSize: '14px', marginTop: '10px' }}>AHPRA registration {p.ahpraNumber}</p>
            )}
            <div className="hero-cta" style={p.intro ? undefined : { marginTop: '28px' }}>
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src={p.image}
            alt={p.imageAlt}
            objectPosition={p.objectPosition}
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── BIOGRAPHY ────────────────────────────────────── */}
      {has(p.biography) && (
        <section className="sec">
          <div className="container prose reveal" style={{ maxWidth: '46em' }}>
            <h2>About {p.name}</h2>
            <Paragraphs items={p.biography} />
          </div>
        </section>
      )}

      {/* ── QUALIFICATIONS & CLINICAL INTERESTS ──────────── */}
      {(has(p.qualifications) || has(p.clinicalInterests)) && (
        <section className="sec alt">
          <div className="container">
            <div className="pillars reveal">
              {has(p.qualifications) && (
                <div className="pillar">
                  <h2 style={{ fontSize: '28px', marginBottom: '14px' }}>Education &amp; qualifications</h2>
                  <ul className="check-list">
                    {p.qualifications.map(q => (
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
              )}
              {has(p.clinicalInterests) && (
                <div className="pillar">
                  <h2 style={{ fontSize: '28px', marginBottom: '14px' }}>Areas of clinical interest</h2>
                  <ul className="check-list">
                    {p.clinicalInterests.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── PHILOSOPHY & APPROACH ────────────────────────── */}
      {(has(p.philosophy) || has(p.approach)) && (
        <section className="sec">
          <div className="container prose reveal" style={{ maxWidth: '46em' }}>
            {has(p.philosophy) && (
              <>
                <h2>Treatment philosophy</h2>
                <Paragraphs items={p.philosophy} />
              </>
            )}
            {has(p.approach) && (
              <>
                <h2>Approach to patient care</h2>
                <Paragraphs items={p.approach} />
              </>
            )}
          </div>
        </section>
      )}

      {/* ── TREATMENTS ───────────────────────────────────── */}
      {treatments.length > 0 && (
        <section className="sec alt">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Treatments</div>
              <h2>Care {p.name} provides</h2>
            </div>
            <div className="svc-grid reveal">
              {treatments.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="svc" style={{ textDecoration: 'none' }}>
                  <h3>{s.name}</h3>
                  <p>{s.cardSub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GUIDES WRITTEN OR REVIEWED ───────────────────── */}
      {guides.length > 0 && (
        <section className="sec">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Dental education</div>
              <h2>Guides by {p.name}</h2>
            </div>
            <GuideGrid guides={guides} />
          </div>
        </section>
      )}

      {/* ── PATIENT FEEDBACK (only where cleared for use) ── */}
      {has(p.feedback) && (
        <section className="sec sage-bg">
          <div className="container reveal">
            {p.feedback.map((f, i) => (
              <figure key={i} style={{ margin: '0 auto 28px', maxWidth: '44em', textAlign: 'center' }}>
                <blockquote className="pq" style={{ margin: 0 }}>{f.quote}</blockquote>
                {f.attribution && <figcaption style={{ marginTop: '10px' }}>{f.attribution}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── CASES & OUTCOMES ─────────────────────────────── */}
      {has(p.cases) && (
        <section className="sec">
          <div className="container reveal" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Our work</div>
            <h2>Cases and outcomes</h2>
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
          <div className="ctaband reveal">
            <h2 style={{ fontSize: 'clamp(28px,3.2vw,38px)', color: 'var(--cream)', margin: '0 0 16px' }}>
              Book with {p.name}
            </h2>
            <div className="ctaband-actions">
              <Link href="/online-booking" className="btn btn-light">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost ctaband-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <p style={{ marginTop: '18px' }}>
              <Link href="/about/our-team" style={{ color: 'var(--clay-soft)', fontWeight: 600 }}>
                Meet the rest of our team &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
