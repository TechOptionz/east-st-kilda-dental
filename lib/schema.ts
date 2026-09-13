import {
  SCHEMA_ID,
  SITE_URL,
  areasServed,
  business,
  clinicianId,
  clinicians,
  openingHours,
  socialProfiles,
} from './business'

/**
 * JSON-LD node builders shared by the landing pages.
 *
 * Every node reuses the @id the home and team pages already declare, so a page
 * that restates the practice or a clinician adds facts to the same entity
 * rather than inventing a second one. Every fact comes from lib/business.ts.
 *
 * No Review or aggregateRating anywhere, per AHPRA advertising guidance.
 */

/** The practice as a Dentist (a LocalBusiness subtype), with its core facts. */
export const practiceNode = () => ({
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
})

/**
 * A clinician as a Person. The full node — photo and bio — lives on the team
 * page; this restates only what lib/business.ts pins.
 */
export const personNode = (c: (typeof clinicians)[number]) => ({
  '@type': 'Person',
  '@id': clinicianId(c.slug),
  name: c.name,
  jobTitle: c.jobTitle,
  url: clinicianId(c.slug),
  worksFor: { '@id': SCHEMA_ID.practice },
})

/** An FAQPage from the same q/a array that renders the visible accordion. */
export const faqPageNode = (id: string, faq: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})
