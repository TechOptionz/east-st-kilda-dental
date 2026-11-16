import Link from 'next/link'
import JsonLd from './JsonLd'
import { SITE_URL } from '@/lib/business'

export interface Crumb {
  name: string
  /**
   * Site-relative path, e.g. "/learn". Omit on the last crumb: the current page
   * is plain text in the visible trail and carries no `item` in the schema.
   */
  href?: string
}

const HOME: Crumb = { name: 'Home', href: '/' }

/**
 * The Learn section's label, defined once.
 *
 * The hub, every article and both breadcrumb outputs read it from here, so the
 * section can never be "Dental Education" in one place and "Learn" in another.
 */
export const LEARN_SECTION = { name: 'Dental Education', href: '/learn' }

/** Home → Dental Education, where the section itself is the current page. */
export const learnHubTrail: Crumb[] = [HOME, { name: LEARN_SECTION.name }]

/**
 * Home → Dental Education → this page.
 *
 * Used by both articles and topic pages: pass whatever the page's visible H1
 * says, so the trail always matches the heading beneath it.
 */
export const learnChildTrail = (name: string): Crumb[] => [HOME, LEARN_SECTION, { name }]

/**
 * Home → Dental Education → topic → article. Pass the article's visible H1 and
 * its primary topic; an article with no live topic page sits directly under
 * the section instead, so the trail never links to a URL that 404s.
 */
export const learnArticleTrail = (name: string, topic?: { slug: string; label: string }): Crumb[] =>
  topic
    ? [HOME, LEARN_SECTION, { name: topic.label, href: `/learn/${topic.slug}` }, { name }]
    : learnChildTrail(name)

/** The About hub and the team page, defined once for the practitioner trail. */
export const ABOUT_SECTION = { name: 'About', href: '/about' }
export const TEAM_SECTION = { name: 'Our Team', href: '/about/our-team' }

/** Home → About → Our Team → this practitioner. Pass their full name. */
export const practitionerTrail = (name: string): Crumb[] => [HOME, ABOUT_SECTION, TEAM_SECTION, { name }]

/**
 * The locations hub, defined once, for the same reason as LEARN_SECTION.
 *
 * Suburb pages are kept out of the main menu by design, so this trail is the
 * link that puts every one of them one click from the hub — and the hub one
 * click from home — for a crawler as well as a reader.
 */
export const AREAS_SECTION = { name: 'Areas we serve', href: '/areas-we-serve' }

/** Home → Areas we serve → this suburb. Pass the suburb's name. */
export const areasChildTrail = (name: string): Crumb[] => [HOME, AREAS_SECTION, { name }]

/**
 * The services hub, defined once, for the same reason as LEARN_SECTION.
 *
 * Service pages sit under this hub in the breadcrumb trail, giving crawlers and
 * readers a clear path back: Home → Services → this service.
 */
export const SERVICES_SECTION = { name: 'Services', href: '/services' }

/**
 * Home → Services → this service.
 *
 * Pass the service's plain `name` from data/services.ts, never its H1: the H1 is
 * a marketing line and the last crumb has to read as the thing itself.
 */
export const servicesChildTrail = (name: string): Crumb[] => [HOME, SERVICES_SECTION, { name }]

/**
 * Breadcrumb trail, visible and structured.
 *
 * Both outputs are generated from the same `trail`, so the BreadcrumbList and
 * the visible list can never disagree — which Google requires, and which is
 * otherwise the easy thing to get wrong when the two are maintained separately.
 *
 * Pass the trail from the route, not hand-written strings, so a new article
 * gets the correct breadcrumb with no extra edit.
 *
 * `id` is optional: pass "<page url>#breadcrumb" on a page whose own JSON-LD
 * references the list, and leave it off everywhere else.
 */
export default function Breadcrumb({ trail, id }: { trail: Crumb[]; id?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // Given an @id, another node on the page can point at this list rather than
    // restate it — which is how the suburb pages link WebPage to its breadcrumb.
    ...(id ? { '@id': id } : {}),
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      // The current page is deliberately left without an item URL.
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  }

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          {trail.map((crumb) =>
            crumb.href ? (
              <li key={crumb.name}>
                <Link href={crumb.href}>{crumb.name}</Link>
              </li>
            ) : (
              <li key={crumb.name} aria-current="page">
                {crumb.name}
              </li>
            ),
          )}
        </ol>
      </nav>
    </>
  )
}
