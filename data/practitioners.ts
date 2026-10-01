/**
 * Standalone practitioner profiles: /about/<slug>.
 *
 * A profile is built from whatever is filled in below, section by section. A
 * section with no content does not render at all, so the page never shows an
 * empty heading or filler copy.
 *
 * `published` is the one switch for going live. While it is false:
 *   - the page is served but marked noindex, so it can be reviewed in place;
 *   - it is left out of the sitemap and llms.txt;
 *   - no other page links to it (see practitionerPath()), so nothing on the
 *     site leads a visitor or a crawler to an unfinished page.
 * Flipping it to true turns all four on together. Fill in the content first —
 * the brief is no thin or placeholder copy on a live practitioner page.
 */

export interface Qualification {
  /** e.g. "Bachelor of Dental Science" */
  award: string
  /** e.g. "The University of Melbourne" */
  institution?: string
  year?: string
}

export interface CaseLink {
  label: string
  /** Site-relative, e.g. "/our-work". */
  href: string
}

export interface PractitionerProfile {
  /** URL segment under /about, and the key the rest of the site looks it up by. */
  slug: string
  /**
   * Matches `slug` in lib/business.ts `clinicians`, so the Person node on this
   * page is the same entity the home page, team page and article bylines use.
   */
  clinicianSlug: string
  name: string
  /** The professional title shown under the name. */
  jobTitle: string
  /** Search title and meta description, written for this page alone. */
  meta: { title: string; description: string }
  published: boolean

  /** Portrait for the hero, under /public. */
  image: string
  imageAlt: string
  objectPosition?: string

  /** One or two sentences under the H1. */
  intro?: string
  /** Professional biography, one string per paragraph. */
  biography?: string[]
  qualifications?: Qualification[]
  /** AHPRA registration number, if the practice wants it shown. */
  ahpraNumber?: string
  /** Areas of clinical interest, as short labels. Also published as knowsAbout. */
  clinicalInterests?: string[]
  /** Treatment philosophy, one string per paragraph. */
  philosophy?: string[]
  /** Approach to patient care, one string per paragraph. */
  approach?: string[]
  /**
   * Service slugs (data/services.ts) this practitioner is associated with.
   * Drives both the treatments list on the profile and the practitioner link on
   * each of those service pages, so the two always agree.
   */
  services?: string[]
  /**
   * Patient feedback. Leave empty unless the practice has confirmed each quote
   * is usable: AHPRA's advertising guidelines restrict testimonials about
   * clinical aspects of care. Not published as Review markup either way.
   */
  feedback?: { quote: string; attribution?: string }[]
  /** Links to relevant cases or outcomes, e.g. smile gallery entries. */
  cases?: CaseLink[]
}

export const practitioners: PractitionerProfile[] = [
  {
    slug: 'dr-anbar-ganatra',
    clinicianSlug: 'anbar-ganatra',
    name: 'Dr Anbar Ganatra',
    jobTitle: 'Cosmetic & General Dentist',
    meta: {
      // TODO Final title and description to be supplied with the page content.
      title: 'Dr Anbar Ganatra | Cosmetic & General Dentist | East St Kilda Dental',
      description: 'Dr Anbar Ganatra, Cosmetic & General Dentist at East St Kilda Dental.',
    },
    published: false,

    image: '/assets/team/anbar-ganatra.webp',
    imageAlt: 'Dr Anbar Ganatra, Cosmetic & General Dentist at East St Kilda Dental',
    objectPosition: 'center top',

    // Content to be supplied by the practice before publication.
    intro: undefined,
    biography: [],
    qualifications: [],
    clinicalInterests: [],
    philosophy: [],
    approach: [],
    // Proposed associations — to be confirmed by the practice before publishing.
    services: ['smile-design', 'veneers', 'teeth-whitening'],
    feedback: [],
    cases: [],
  },
]

export function getPractitioner(slug: string): PractitionerProfile | undefined {
  return practitioners.find(p => p.slug === slug)
}

export const publishedPractitioners = practitioners.filter(p => p.published)

/**
 * The profile URL for a clinician, only once their profile is published.
 *
 * Every link to a practitioner page goes through this — pass the clinician's
 * display name or their lib/business.ts slug. Until the profile is live it
 * returns undefined and callers render the name as plain text, as before.
 */
export function practitionerPath(nameOrSlug: string | undefined): string | undefined {
  if (!nameOrSlug) return undefined
  const p = publishedPractitioners.find(
    x => x.name === nameOrSlug || x.clinicianSlug === nameOrSlug || x.slug === nameOrSlug,
  )
  return p ? `/about/${p.slug}` : undefined
}

/** Published practitioners associated with a service, for the service page link. */
export function practitionersForService(serviceSlug: string): PractitionerProfile[] {
  return publishedPractitioners.filter(p => p.services?.includes(serviceSlug))
}
