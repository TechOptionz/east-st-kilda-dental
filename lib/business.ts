/**
 * Single source of truth for East St Kilda Dental's name, address, phone and
 * other hard facts.
 *
 * Anything a search engine or AI answer engine could quote about the practice
 * lives here so it can never drift between pages, or between the visible copy
 * and the JSON-LD structured data.
 *
 * Always use the production domain in @id and url values, even on staging, so
 * they match the canonical URL.
 */

/**
 * The production origin, and the bare domain rather than www on purpose.
 *
 * The host serves the site on eaststkildadental.com.au and 301s
 * www.eaststkildadental.com.au to it, and every URL Google has indexed is the
 * bare form. A canonical, an og:url or a schema @id on the www host would
 * therefore name a URL that immediately redirects — pointing the strongest
 * signal a page has at an address that does not serve it.
 *
 * If the practice ever moves to www as the primary host, this is the one line
 * to change, but it is not a free swap: the redirect at the host has to be
 * reversed and the Search Console property re-pointed on the same day, or the
 * canonical and the redirect will contradict each other. Domain-level DNS
 * verification already covers both hosts, so that part needs nothing.
 */
export const SITE_URL = 'https://eaststkildadental.com.au'

/** Stable @id values for the nodes in the site-wide entity graph. */
export const SCHEMA_ID = {
  practice: `${SITE_URL}/#practice`,
  website: `${SITE_URL}/#website`,
  faq: `${SITE_URL}/#faq`,
  /** The Learn hub as a collection, and the list of guides it contains. */
  learnCollection: `${SITE_URL}/learn#collection`,
  learnGuides: `${SITE_URL}/learn#guides`,
  /** Emergency dental care as a service, and that page's questions. */
  emergencyService: `${SITE_URL}/emergency-dentist#service`,
  emergencyFaq: `${SITE_URL}/emergency-dentist#faq`,
  /** The locations hub as a collection, and the list of suburbs it contains. */
  areasCollection: `${SITE_URL}/areas-we-serve#collection`,
  areasSuburbs: `${SITE_URL}/areas-we-serve#suburbs`,
  /** The team page itself. The Person nodes it anchors use clinicianId(). */
  teamPage: `${SITE_URL}/about/our-team#webpage`,
} as const

/**
 * A topic listing page's own two nodes: /learn/<topic-slug>.
 *
 * The Learn hub's equivalents are fixed strings above; a topic's are built per
 * slug, the way the suburb and service pages build theirs.
 */
export const topicCollectionId = (slug: string) => `${SITE_URL}/learn/${slug}#collection`
export const topicGuidesId = (slug: string) => `${SITE_URL}/learn/${slug}#guides`

export const business = {
  name: 'East St Kilda Dental',
  url: `${SITE_URL}/`,
  /** E.164, for structured data and tel: links. */
  telephone: '+61395273678',
  /** Human-readable, for visible copy. */
  telephoneDisplay: '(03) 9527 3678',
  email: 'reception@eaststkildadental.com.au',
  currenciesAccepted: 'AUD',
  /** The practice has cared for the neighbourhood since around 1980. */
  foundedYear: 1980,
  /** The catchment, as we describe it in prose. */
  serviceRegion: "Melbourne's inner south-east",
  address: {
    streetAddress: '364 Dandenong Rd',
    addressLocality: 'St Kilda East',
    addressRegion: 'VIC',
    postalCode: '3183',
    addressCountry: 'AU',
  },
  /**
   * TODO Confirm against the Google Business Profile listing before sign-off.
   * These are the coordinates supplied in the SEO recommendation, not verified
   * from the live GBP entry.
   */
  geo: {
    latitude: '-37.8684',
    longitude: '145.0060',
  },
  hasMap:
    'https://www.google.com/maps?q=East+St+Kilda+Dental,+364+Dandenong+Rd,+St+Kilda+East+VIC+3183',
} as const

/**
 * Ready-made strings for visible copy and href attributes.
 *
 * Import these rather than retyping the address or phone number. A stray
 * "Dandenong Road" where the rest of the web says "Dandenong Rd" is exactly the
 * kind of drift that costs an entity its knowledge panel.
 */
export const telHref = `tel:${business.telephone}`
export const emailHref = `mailto:${business.email}`

/**
 * The practice management system's public booking page, embedded on
 * /online-booking and linked as its fallback.
 *
 * It is a different domain, so nothing after the click is visible to our
 * analytics — a completed booking is counted in the practice software, not
 * here. BOOKING_HOST exists so the click itself can be recognised as an
 * outbound conversion wherever it appears; see components/AnalyticsEvents.tsx.
 */
export const BOOKING_HOST = 'centaurportal.com'
export const BOOKING_URL = `https://www.${BOOKING_HOST}/d4w/org-1240/extended_search`

/** "364 Dandenong Rd" */
export const streetAddress = business.address.streetAddress
/** "St Kilda East VIC 3183" */
export const localityLine = `${business.address.addressLocality} ${business.address.addressRegion} ${business.address.postalCode}`
/** "364 Dandenong Rd, St Kilda East VIC 3183" */
export const fullAddress = `${streetAddress}, ${localityLine}`

/**
 * Weekly opening hours, as the OpeningHoursSpecification in the LocalBusiness
 * JSON-LD. The visible hours lists are still written out by hand in app/page.tsx,
 * app/contact/page.tsx, app/online-booking/page.tsx and components/GetInTouch.tsx
 * — change those alongside this, or the markup and the page disagree.
 */
export const openingHours = [
  { days: ['Monday'], opens: '08:30', closes: '17:00' },
  { days: ['Tuesday', 'Wednesday'], opens: '08:30', closes: '18:00' },
  { days: ['Thursday', 'Friday'], opens: '08:30', closes: '17:00' },
  { days: ['Saturday'], opens: '09:00', closes: '16:00' },
] as const

export const areasServed = [
  'St Kilda East',
  'St Kilda',
  'Balaclava',
  'Elwood',
  'Elsternwick',
  'Caulfield',
  'Ripponlea',
] as const

/**
 * External profiles, published as `sameAs` in the structured data.
 *
 * These are what let a search or AI engine tie the website, the Google Business
 * Profile and the social accounts together into one entity. Only add a URL here
 * once it has been opened and confirmed to resolve to a live profile whose
 * name, address and phone match this file exactly — an unverified or redirecting
 * URL weakens the entity rather than strengthening it.
 *
 * TODO Add, once the practice supplies and someone has opened each one:
 *   - Facebook page URL
 *   - Instagram profile URL
 *   - HealthEngine listing URL
 * Placeholders are deliberately not shipped as dummy strings.
 */
export const socialProfiles: string[] = [
  // Google Business Profile share link (same link used in ContactSection).
  'https://maps.app.goo.gl/7e4dRpEyETE8K18s5',
]

/**
 * Named clinicians, in the order they appear on the home page.
 *
 * Dr Goldman is titled "Dentist" here and on the site. Do not restore
 * "Prosthodontist" in either place unless AHPRA specialist registration in
 * prosthodontics is confirmed.
 */
export const clinicians = [
  { slug: 'anbar-ganatra', name: 'Dr Anbar Ganatra', jobTitle: 'Cosmetic & General Dentist' },
  { slug: 'edmund-goldman', name: 'Dr Edmund Goldman', jobTitle: 'Dentist' },
  { slug: 'jarrod-dean', name: 'Dr Jarrod Dean', jobTitle: 'Dentist' },
  { slug: 'michelle-callaghan', name: 'Michelle Callaghan', jobTitle: 'Dental Hygienist' },
] as const

export const clinicianId = (slug: string) => `${SITE_URL}/about/our-team#${slug}`

/**
 * The jobTitle to publish for a clinician, where the entity graph pins one.
 *
 * The team page shows each person's role in its own words; where that person is
 * one of the four named above, the structured data uses the title from this
 * file instead, so a warmer visible card can never drift from the title the
 * graph publishes.
 */
export const clinicianJobTitle = (slug: string): string | undefined =>
  clinicians.find(c => c.slug === slug)?.jobTitle

export const comprehensiveCareVisit = {
  name: 'The New Patient Comprehensive Care Visit',
  description:
    'A 60 to 75 minute comprehensive first-visit dental appointment including examination, digital X-rays, oral cancer screening, scale and clean, and a personalised care plan.',
} as const
