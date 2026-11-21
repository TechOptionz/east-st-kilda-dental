import type { Metadata } from 'next'
import Link from 'next/link'
import CardMore from '@/components/CardMore'
import GetInTouch from '@/components/GetInTouch'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import { withSocial } from '@/lib/seo'
import { suburbs, suburbPath } from '@/data/suburbs'
import { SCHEMA_ID, SITE_URL, business, streetAddress, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Areas We Serve | East St Kilda Dental',
  description:
    'East St Kilda Dental — a trusted local dentist for the inner south-east. Serving St Kilda, Balaclava, Caulfield, Elsternwick, Elwood and surrounding suburbs.',
  alternates: { canonical: `${SITE_URL}/areas-we-serve` },
})

/**
 * Every suburb we publish a page for, plus St Kilda East itself, which is the
 * home page rather than a landing page. The list is generated from
 * data/suburbs.ts so this hub can never fall behind the pages themselves.
 */
const areaCards = [
  {
    href: '/',
    name: 'St Kilda East',
    blurb: `Our home. We're at ${streetAddress}, ${business.address.addressLocality} (corner Orrong Road).`,
    cta: 'Our clinic',
  },
  ...suburbs.map((s) => ({
    href: suburbPath(s.slug),
    name: s.name,
    blurb: s.about.heading.text,
    cta: `View ${s.name}`,
  })),
]

const AREAS_URL = `${SITE_URL}/areas-we-serve`

// Marks the locations hub as a collection rather than a page that happens to
// carry twenty links, and connects it to the website and practice nodes
// declared on the home page. The ItemList is built from the same areaCards
// array the grid renders, so a new suburb page enters the markup with no extra
// edit — and each entry's URL matches the suburb page whose WebPage node names
// this hub in its breadcrumb.
const areasSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': SCHEMA_ID.areasCollection,
      url: AREAS_URL,
      name: 'Areas we serve',
      description:
        `Suburbs cared for by ${business.name}, a family and emergency dentist in ` +
        `${business.address.addressLocality} serving ${business.serviceRegion}.`,
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': SCHEMA_ID.practice },
      mainEntity: { '@id': SCHEMA_ID.areasSuburbs },
    },
    {
      '@type': 'ItemList',
      '@id': SCHEMA_ID.areasSuburbs,
      name: 'Suburbs we serve',
      itemListElement: areaCards.map((area, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}${area.href}`,
        name: area.name,
      })),
    },
  ],
}

export default function AreasWeServePage() {
  return (
    <main>
      <JsonLd data={areasSchema} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">Areas we serve</div>
            <h1>A trusted local dentist for <em>St Kilda East</em> and the inner south-east</h1>
            <p className="lead">
              We&apos;ve cared for families across the neighbourhood for over 40 years, from our home on Dandenong Road, on the corner of Orrong Road. Today we welcome patients from right across Melbourne, and from regional Victoria too.
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/shared/hero.webp"
            alt="A dentist chatting with a smiling patient during a check-up at our St Kilda East clinic"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── NEIGHBOURHOODS ────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Find your suburb</div>
            <h2>Caring for families across the neighbourhood</h2>
          </div>
          <div className="svc-grid reveal" style={{ transitionDelay: '.08s' }}>
            {areaCards.map(a => (
              <Link key={a.href} href={a.href} className="svc" style={{ textDecoration: 'none' }}>
                <h4>{a.name}</h4>
                <p>{a.blurb}</p>
                <CardMore>{a.cta}</CardMore>
              </Link>
            ))}
          </div>
          <p className="reveal" style={{ textAlign: 'center', marginTop: '22px', maxWidth: '46em', marginLeft: 'auto', marginRight: 'auto', color: 'var(--ink)', opacity: 0.8 }}>
            We also warmly welcome patients from Caulfield South, Brighton, Bentleigh, South Melbourne, Richmond and the surrounding suburbs.
          </p>
        </div>
      </section>

      {/* ── EASY TO REACH ─────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal" style={{ maxWidth: '48em', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="eyebrow">Getting here</div>
          <h2>Simple to reach, easy to park</h2>
          <p style={{ fontSize: '18px', marginTop: '14px' }}>
            We&apos;re on Dandenong Road at the corner of Orrong Road, with free off-street parking off Orrong Road. Trams 5 and 64 run along Dandenong Road, and Balaclava Station on the Sandringham line is close by.
          </p>
        </div>
      </section>

      <GetInTouch />

    </main>
  )
}
