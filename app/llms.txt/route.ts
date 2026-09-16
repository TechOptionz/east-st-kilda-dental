import { SITE_URL, business, fullAddress, openingHours } from '@/lib/business'
import { STATIC_PAGES, type StaticPage } from '@/lib/site-pages'
import { services } from '@/data/services'
import { publishedArticles } from '@/data/articles'
import { populatedTopics } from '@/data/topics'
import { suburbs, suburbPath } from '@/data/suburbs'

/**
 * /llms.txt — a plain-Markdown map of the site for AI answer engines
 * (https://llmstxt.org).
 *
 * Built from the same sources as app/sitemap.ts, so every service, suburb page
 * and published guide appears here the moment it appears there, each with a
 * one-line description taken from the page's own data. Nothing in this file is
 * maintained by hand except the fixed pages in lib/site-pages.ts.
 *
 * Rendered once at build time; it only changes when the data does.
 */
export const dynamic = 'force-static'

type Link = { title: string; path: string; description: string }

// Meta descriptions are written for a search result and often close on a call
// to action ("Book today."). That tells an answer engine nothing, so it goes.
const clean = (text: string) =>
  text.replace(/\s+/g, ' ').trim().replace(/\s*Book [^.]*\.$/, '')

const line = ({ title, path, description }: Link) =>
  `- [${title}](${SITE_URL}${path}): ${clean(description)}`

const section = (heading: string, links: Link[]) =>
  links.length ? [`## ${heading}`, '', ...links.map(line), ''] : []

const pagesIn = (group: StaticPage['group']) => STATIC_PAGES.filter((p) => p.group === group)

const hours = openingHours
  .map((h) => `${h.days.join(', ')} ${h.opens}–${h.closes}`)
  .join('; ')

export function GET() {
  const body = [
    `# ${business.name}`,
    '',
    `> Gentle family and emergency dentist at ${fullAddress}, caring for ${business.serviceRegion} since ${business.foundedYear}.`,
    '',
    `- Phone: ${business.telephoneDisplay}`,
    `- Email: ${business.email}`,
    `- Hours: ${hours}; closed other days`,
    '',
    ...section('Key pages', pagesIn('key')),
    ...section(
      'Services',
      services.map((s) => ({ title: s.name, path: `/services/${s.slug}`, description: s.meta.description })),
    ),
    ...section(
      'Suburbs we serve',
      suburbs.map((s) => ({ title: `Dentist in ${s.name}`, path: suburbPath(s.slug), description: s.meta.description })),
    ),
    ...section(
      'Guides',
      publishedArticles.map((a) => ({ title: a.title, path: `/learn/${a.slug}`, description: a.excerpt })),
    ),
    ...section(
      'Guide topics',
      populatedTopics.map((t) => ({ title: t.label, path: `/learn/${t.slug}`, description: t.intro })),
    ),
    ...section('About the practice', pagesIn('about')),
    ...section('Indexes', pagesIn('hub')),
    // "Optional" is the llms.txt convention for links a reader can skip.
    ...section('Optional', pagesIn('legal')),
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
