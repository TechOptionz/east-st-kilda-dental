import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb, { servicesChildTrail } from '@/components/Breadcrumb'
import GetInTouch from '@/components/GetInTouch'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import ServicePractitioners from '@/components/ServicePractitioners'
import ServiceEducation from '@/components/ServiceEducation'
import { services, getService, relatedSub, type ServiceData } from '@/data/services'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, business, comprehensiveCareVisit, telHref } from '@/lib/business'
import s from '../service.module.css'

/**
 * Every service page.
 *
 * The layout started life as a bespoke redesign of /services/check-ups, which
 * lived in its own static segment. It now renders all twenty services from the
 * shared `services` array, so the copy still has a single source of truth and
 * nothing can drift between pages.
 *
 * What the redesign added on top of the original copy — the scope strip, the
 * stats band, the related-card subtitles, the hero badge — is declared per
 * service in data/services.ts, with the fallbacks below covering the parts that
 * are the same on every page.
 */

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * The three supporting photos below the hero. A service that has been
 * photographed supplies its own in data/services.ts; these are the fallbacks
 * for the ones that haven't, so no page is ever left with an empty frame.
 */
interface SupportPhoto {
  src: string
  alt: string
  objectPosition?: string
  scale?: number
}

const DETAIL_PHOTO: SupportPhoto = {
  src: '/assets/home/comprehensive2.webp',
  alt: 'A dentist talking with a seated patient during a comprehensive care consultation',
}

const WHO_PHOTO: SupportPhoto = {
  src: '/assets/home/nervous-patients.webp',
  alt: 'A relaxed patient smiling warmly in the dental chair',
  // Crop tuned to this shot alone; a service's own photo gets the default.
  objectPosition: '0% 40%',
  scale: 1.1,
}

const QUOTE_PHOTO: SupportPhoto = {
  src: '/assets/nervous-patients/how-we-look-after.webp',
  alt: 'A clinician gently reassuring a relaxed patient in the treatment room',
}

/** The first two figures in the stats band are the same on every service page. */
const SHARED_STATS = [
  { count: 40, suffix: '+', label: `Years caring for ${business.address.addressLocality}` },
  { count: 10000, suffix: '+', label: 'Patients looked after' },
]

/** Used as the third figure when a service has no meaningful number of its own. */
const FALLBACK_STAT = { count: 15, suffix: '', label: 'Suburbs we care for' }

/** "10000" + "+" → "10,000+". The count-up observer reads the raw number. */
const statDisplay = (stat: { count: number; suffix: string }) =>
  `${stat.count.toLocaleString('en-AU')}${stat.suffix}`

/**
 * The floating hero badge. Services covered by the flat New Patient
 * Comprehensive Care Visit lead
 * with that; the rest lead with how they're paid for, since nothing is quoted
 * before we've seen you.
 */
function heroBadge(service: ServiceData) {
  switch (service.pricing) {
    case 'flat':
      return {
        figure: 'All included',
        note: `${comprehensiveCareVisit.name}, everything in one visit`,
        isWord: true,
      }
    case 'cdbs':
      return {
        figure: 'CDBS',
        note: 'Eligible children may be fully covered under Medicare',
        isWord: true,
      }
    default:
      return {
        figure: 'HICAPS',
        note: 'Claimed on the spot, so most funds leave only a gap to pay',
        isWord: true,
      }
  }
}

/** A service's own supporting photo where it has one, otherwise the shared shot. */
function supportPhoto(
  src: string | undefined,
  alt: string | undefined,
  fallback: SupportPhoto,
): SupportPhoto {
  return src ? { src, alt: alt ?? fallback.alt } : fallback
}

export async function generateStaticParams() {
  return services.map(service => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return withSocial({
    title: service.meta.title,
    description: service.meta.description,
    alternates: { canonical: `${SITE_URL}/services/${slug}` },
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const badge = heroBadge(service)
  const stats = [...SHARED_STATS, service.stat ?? FALLBACK_STAT]
  const subject = service.shortName ?? service.h1em
  const detailPhoto = supportPhoto(service.detailImage, service.detailAlt, DETAIL_PHOTO)
  const whoPhoto = supportPhoto(service.whoImage, service.whoAlt, WHO_PHOTO)
  const quotePhoto = supportPhoto(service.quoteImage, service.quoteAlt, QUOTE_PHOTO)

  // ── STRUCTURED DATA ─────────────────────────────────────
  //
  // The same graph shape as the suburb pages: WebPage, Service and FAQPage,
  // each referencing the practice and website entities declared on the home page
  // rather than redeclaring them. This gives search engines a Service node for
  // every treatment the practice offers, with its FAQ questions quoted verbatim
  // from the visible page — the requirement for FAQ rich results.
  //
  // The BreadcrumbList is emitted separately by the <Breadcrumb> component and
  // referenced by @id from the WebPage node, so the visible trail and the
  // markup can never disagree.
  //
  // No Review or aggregateRating, per AHPRA advertising guidance.
  const url = `${SITE_URL}/services/${slug}`

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: service.meta.title,
        description: service.meta.description,
        isPartOf: { '@id': SCHEMA_ID.website },
        about: { '@id': SCHEMA_ID.practice },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        serviceType: service.eyebrow,
        name: service.meta.title.replace(/ \| .+$/, ''),
        description: service.meta.description,
        provider: { '@id': SCHEMA_ID.practice },
        areaServed: {
          '@type': 'City',
          name: `${business.address.addressLocality}, Victoria, Australia`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: service.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }

  return (
    <main className={s.wrap}>
      <JsonLd data={serviceSchema} />

      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <div className={s.inner} style={{ paddingTop: '18px' }}>
        <Breadcrumb trail={servicesChildTrail(service.name)} id={`${url}#breadcrumb`} />
      </div>

      {/* ── 1. HERO ──────────────────────────────────────── */}
      <section className={`${s.hero} hero-reveal`} id="top">
        <div className={s.heroBlobClay} aria-hidden="true" />
        <div className={s.heroBlobSage} aria-hidden="true" />
        <div className={`${s.inner} ${s.innerWide} ${s.heroGrid}`}>
          <div>
            <p className={`${s.kicker} reveal`}>{service.eyebrow}</p>
            {/* Several services lead with the italic phrase and have no h1pre,
                so the line break only goes in when there's a line above it. */}
            <h1 className={`${s.h1} reveal`} style={{ transitionDelay: '.08s', animationDelay: '.08s' }}>
              {service.h1pre && <>{service.h1pre} <br /></>}
              <em>{service.h1em}</em>
            </h1>
            <p className={`${s.heroLead} reveal`} style={{ transitionDelay: '.16s', animationDelay: '.16s' }}>
              {service.heroLead}
            </p>
            <div className={`${s.heroCta} reveal`} style={{ transitionDelay: '.24s', animationDelay: '.24s' }}>
              <Link href="/online-booking" className={s.btnSolid}>Book your visit</Link>
              <a href={telHref} className={s.btnOutline}>Call {business.telephoneDisplay}</a>
            </div>
            <div className={`${s.heroProof} reveal`} style={{ transitionDelay: '.3s', animationDelay: '.3s' }}>
              <span>Gentle, no-judgement care</span>
              <span className={s.proofDot} aria-hidden="true" />
              <span>40+ years local</span>
            </div>
          </div>

          <div className={`${s.heroMedia} reveal`} style={{ transitionDelay: '.12s', animationDelay: '.12s' }}>
            <div className={s.heroFrame}>
              <Photo
                priority
                src={service.heroImage}
                alt={service.heroAlt}
                hint={`Service image: ${service.h1em}`}
                sizes="(max-width: 1040px) 100vw, 48vw"
              />
            </div>
            <div className={s.priceBadge}>
              <div className={`${s.priceBadgeFigure} ${badge.isWord ? s.priceBadgeWord : ''}`}>
                {badge.figure}
              </div>
              <div className={s.priceBadgeNote}>{badge.note}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT IT IS ────────────────────────────────── */}
      <section className={`${s.bgPaper} ${s.lineTop}`}>
        <div className={`${s.inner} ${s.innerWide} ${s.sectionPad}`}>
          {/* Photo leads on the left, copy follows on the right — and because
              the photo is first in the markup, it stays on top when the grid
              stacks, without needing an order swap at the breakpoint. */}
          <div className={s.introGrid}>
            <div className={`${s.frame} ${s.frameTall} reveal`} style={{ transitionDelay: '.16s' }}>
              <Photo
                src={detailPhoto.src}
                alt={detailPhoto.alt}
                objectPosition={detailPhoto.objectPosition}
                scale={detailPhoto.scale}
                sizes="(max-width: 1040px) 100vw, 46vw"
              />
            </div>
            <div>
              <p className={`${s.kicker} reveal`}>In plain language</p>
              <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
                {service.whatItIsH2}
              </h2>
              <div className={s.splitCopy}>
                {service.whatItIs.map((para, i) => (
                  <p
                    key={i}
                    className={`${i === 0 ? s.leadPara : s.bodyPara} reveal`}
                    style={{ transitionDelay: `${0.12 + i * 0.08}s` }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className={`${s.scopeRow} reveal`} style={{ transitionDelay: '.28s' }}>
            {service.scope.map(item => (
              <div key={item.term} className={s.scopeItem}>
                <div className={s.scopeTerm}>{item.term}</div>
                <div className={s.scopeDef}>{item.def}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHY IT MATTERS ────────────────────────────── */}
      <section className={s.dark}>
        <div className={s.darkBlob} aria-hidden="true" />
        <div className={`${s.inner} ${s.sectionPad} ${s.darkInner}`}>
          <div className={s.darkHead}>
            <p className={`${s.kicker} ${s.kickerLight} reveal`}>Worth the visit</p>
            <h2 className={`${s.h2} ${s.h2Light} reveal`} style={{ transitionDelay: '.08s' }}>
              {service.whyH2}
            </h2>
            <p className={`${s.darkIntro} reveal`} style={{ transitionDelay: '.16s' }}>
              {service.whyIntro}
            </p>
          </div>

          <div className={s.whyGrid}>
            {service.whyCards.map((card, i) => (
              <div
                key={i}
                className={`${s.whyCard} reveal`}
                style={{ transitionDelay: `${0.12 + i * 0.08}s` }}
              >
                <div className={s.whyNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className={s.whyTitle}>{card.h4}</h3>
                <p className={s.whyBody}>{card.p}</p>
              </div>
            ))}
          </div>

          {/* data-count is picked up by the same observer that drives the
              figures on the home page, so these count up on scroll. */}
          <div className={s.statsRow}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`${s.stat} reveal`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={s.statNum} data-count={stat.count} data-suffix={stat.suffix}>
                  {statDisplay(stat)}
                </div>
                <div className={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHO IT'S FOR ──────────────────────────────── */}
      <section className={s.bgPaper}>
        <div className={`${s.inner} ${s.sectionPad}`}>
          <div className={s.whoGrid}>
            <div className={`${s.frame} ${s.framePortrait} ${s.whoMedia} reveal`}>
              <Photo
                src={whoPhoto.src}
                alt={whoPhoto.alt}
                objectPosition={whoPhoto.objectPosition}
                scale={whoPhoto.scale}
                sizes="(max-width: 1040px) 100vw, 40vw"
              />
            </div>
            <div>
              <p className={`${s.kicker} reveal`}>Is this right for you?</p>
              <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
                {service.whoH2}
              </h2>
              <ul className={s.whoList}>
                {service.whoItems.map((item, i) => (
                  <li
                    key={i}
                    className={`${s.whoRow} reveal`}
                    style={{ transitionDelay: `${0.12 + i * 0.06}s` }}
                  >
                    <span className={s.whoDot} aria-hidden="true" />
                    <span className={s.whoText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT'S DONE ─────────────────────────────── */}
      <section className={`${s.bgCream2} ${s.lineTop} ${s.lineBottom}`}>
        <div className={`${s.inner} ${s.innerWide} ${s.sectionPad}`}>
          <div className={s.stepsHead}>
            <p className={`${s.kicker} reveal`}>A calm, step-by-step process</p>
            <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
              {service.howH2}
            </h2>
          </div>

          <div className={s.stepsWrap}>
            <div className={s.stepsTrack} aria-hidden="true" />
            {/* Draws left-to-right once scrolled into view — .visible comes from
                the site-wide reveal observer in ScrollEffects. */}
            <div className={`${s.stepsTrackFill} reveal`} aria-hidden="true" />
            <ol className={s.stepsGrid}>
              {service.steps.map((step, i) => (
                <li
                  key={i}
                  className={`${s.step} reveal`}
                  style={{ transitionDelay: `${0.12 + i * 0.1}s` }}
                >
                  <div className={s.stepNum}>{i + 1}</div>
                  <h3 className={s.stepTitle}>{step.h4}</h3>
                  <p className={s.stepBody}>{step.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 6. AFTERCARE ─────────────────────────────────── */}
      <section className={s.bgPaper}>
        <div className={`${s.inner} ${s.sectionPad}`}>
          <div className={s.innerNarrow} style={{ margin: '0 auto', padding: 0 }}>
            <p className={`${s.kicker} reveal`}>Honest about what to expect</p>
            <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
              {service.aftercareH2}
            </h2>
            <p className={`${s.aftercarePara} reveal`} style={{ transitionDelay: '.16s' }}>
              {service.aftercare}
            </p>
          </div>
        </div>
      </section>

      {/* ── 6b. YOUR DENTIST ─────────────────────────────
          Only on the treatments a published practitioner profile lists. */}
      <ServicePractitioners serviceSlug={service.slug} />

      {/* ── 7. CTA BAND ──────────────────────────────────── */}
      <section className={s.ctaSection}>
        <div className={`${s.inner} ${s.innerWide}`}>
          <div className={`${s.ctaCard} reveal`}>
            <div className={s.ctaBlob} aria-hidden="true" />
            <div className={s.ctaInner}>
              <h3 className={s.ctaTitle}>{service.ctaH3}</h3>
              <div className={s.ctaActions}>
                <Link href="/online-booking" className={s.btnCream}>Book a visit</Link>
                <Link href="#contact" className={s.btnOutlineLight}>Request a callback</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. NERVOUS PATIENTS ──────────────────────────── */}
      <section className={`${s.bgCream2} ${s.lineTop}`}>
        <div className={`${s.inner} ${s.sectionPad} ${s.quoteSection}`}>
          <div className={s.quoteGrid}>
            <div className={`${s.frame} ${s.framePortrait} ${s.quoteMedia} reveal`}>
              <Photo
                src={quotePhoto.src}
                alt={quotePhoto.alt}
                objectPosition={quotePhoto.objectPosition}
                scale={quotePhoto.scale}
                sizes="(max-width: 1040px) 100vw, 38vw"
              />
            </div>
            <div>
              <div className={`${s.quoteMark} reveal`} aria-hidden="true">&ldquo;</div>
              <blockquote className={`${s.quote} reveal`} style={{ transitionDelay: '.1s' }}>
                I haven&rsquo;t been to the dentist in years. I was embarrassed and anxious. The
                team here made me feel completely at ease &mdash; no judgement, just kindness.
              </blockquote>
              <Link href="/nervous-patients" className={`${s.quoteLink} reveal`} style={{ transitionDelay: '.18s' }}>
                How we look after nervous patients &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. COST & PAYMENT ────────────────────────────── */}
      <section className={`${s.bgPaper} ${s.lineTop}`} id="cost">
        <div className={`${s.inner} ${s.sectionPad}`}>
          <div style={{ textAlign: 'center' }}>
            <p className={`${s.kicker} reveal`}>No surprises</p>
            <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
              Clear on cost, before anything begins
            </h2>
          </div>

          {/* Nothing is quoted before we've seen you, so the card carries the
              written-estimate promise rather than a figure column. */}
          <div
            className={`${s.costCard} ${s.costCardPlain} reveal`}
            style={{ transitionDelay: '.16s' }}
          >
            <div>
              <p className={s.costPara}>{service.costPara}</p>
              <Link href="/fees" className={s.inlineLink}>
                See our fees &amp; health fund information &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ──────────────────────────────────────── */}
      <section className={`${s.bgCream2} ${s.lineTop}`}>
        <div className={`${s.inner} ${s.innerNarrow} ${s.sectionPad}`}>
          <div style={{ textAlign: 'center' }}>
            <p className={`${s.kicker} reveal`}>Common questions</p>
            <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>
              Questions about {subject}
            </h2>
          </div>

          {/* <details> rather than a scripted accordion: it opens without JS,
              and screen readers get the expand/collapse state for free. */}
          <div className={`${s.faqList} reveal`} style={{ transitionDelay: '.14s' }}>
            {service.faq.map((item, i) => (
              <details key={i} className={s.faqItem}>
                <summary className={s.faqSummary}>
                  {item.q}
                  <span className={s.faqIcon} aria-hidden="true">+</span>
                </summary>
                <p className={s.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. RELATED CARE ─────────────────────────────── */}
      <section className={`${s.bgPaper} ${s.lineTop}`}>
        <div className={`${s.inner} ${s.sectionPad}`}>
          <div style={{ textAlign: 'center' }}>
            <p className={`${s.kicker} reveal`}>Explore more</p>
            <h2 className={`${s.h2} reveal`} style={{ transitionDelay: '.08s' }}>Related care</h2>
          </div>

          <div className={s.relatedGrid}>
            {service.related.map((rel, i) => (
              <Link
                key={rel.href}
                href={rel.href}
                className={`${s.relatedCard} reveal`}
                style={{ transitionDelay: `${0.12 + i * 0.08}s` }}
              >
                <div className={s.relatedTitle}>{rel.label}</div>
                <div className={s.relatedSub}>{relatedSub(rel.href)}</div>
                <div className={s.relatedMore}>Learn more &rarr;</div>
              </Link>
            ))}
          </div>

          {/* Treatment → location. Suburb pages are out of the main menu, so
              this is the contextual path into them from the service they are
              most often searched alongside. */}
          <p className={`${s.areasNote} reveal`} style={{ transitionDelay: '.34s' }}>
            Caring for {business.address.addressLocality} and the surrounding suburbs.{' '}
            <Link href="/areas-we-serve">See the areas we serve &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ── 12. GET IN TOUCH ─────────────────────────────── */}
      <GetInTouch variant="default" id="contact" />

      {/* ── 13. DENTAL EDUCATION ─────────────────────────── */}
      <ServiceEducation slug={slug} />
    </main>
  )
}
