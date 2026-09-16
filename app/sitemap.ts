import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/business'
import { services } from '@/data/services'
import { publishedArticles } from '@/data/articles'
import { populatedTopics } from '@/data/topics'
import { suburbs, suburbPath } from '@/data/suburbs'
import { CONTENT_UPDATED } from '@/lib/content-dates'
import { STATIC_PAGES } from '@/lib/site-pages'

/**
 * Every indexable route, as an absolute production URL.
 *
 * URLs are always built from SITE_URL, so a preview deployment still lists the
 * production host rather than advertising itself.
 *
 * The fixed pages, and the list of redirect sources that must never appear
 * here, live in lib/site-pages.ts — shared with app/llms.txt/route.ts so the
 * two files can never list different pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PAGES.map((p) => p.path),
    ...services.map((s) => `/services/${s.slug}`),
    // Published guides only — Google is never invited to crawl a draft.
    ...publishedArticles.map((a) => `/learn/${a.slug}`),
    // Topic pages that actually have guides. An empty topic has no page.
    ...populatedTopics.map((t) => `/learn/${t.slug}`),
    // Suburb landing pages. Adding an entry to data/suburbs.ts (and its stub
    // route) is all it takes for a new suburb page to appear here.
    ...suburbs.map((s) => suburbPath(s.slug)),
  ]

  // lastModified only where a page has a real content date (lib/content-dates.ts).
  // Stamping every URL with the build time would tell Google the whole site
  // changed on every deploy.
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    ...(CONTENT_UPDATED[path] ? { lastModified: CONTENT_UPDATED[path].iso } : {}),
  }))
}
