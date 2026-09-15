import type { Metadata } from 'next'
import { business } from './business'

/**
 * The share card every page falls back to.
 *
 * Open Graph requires an absolute URL; Next.js resolves this relative path
 * against `metadataBase` in the root layout, so it only needs writing once.
 */
export const SHARE_IMAGE = {
  url: '/assets/social/share-1200x630.jpg',
  width: 1200,
  height: 630,
  alt: `${business.name} — gentle family and emergency dentist in St Kilda East`,
} as const

/** Pull a plain URL string out of the several shapes `alternates.canonical` allows. */
function canonicalUrl(meta: Metadata): string | undefined {
  const c = meta.alternates?.canonical
  if (!c) return undefined
  if (typeof c === 'string') return c
  if (c instanceof URL) return c.toString()
  return typeof c.url === 'string' ? c.url : c.url.toString()
}

/**
 * Adds Open Graph and Twitter Card tags to a page's metadata, derived from the
 * title, description and canonical URL that page already declares.
 *
 * Wrap every page's metadata object in this so shared links carry a correct,
 * per-page preview card instead of inheriting the site-wide default. Anything
 * the page sets explicitly under `openGraph` or `twitter` wins.
 *
 * The title is passed through as `absolute` because our page titles already end
 * in "| East St Kilda Dental"; without this the root layout's title template
 * appends the brand a second time.
 */
export function withSocial(meta: Metadata): Metadata {
  const title = typeof meta.title === 'string' ? meta.title : undefined
  const description = typeof meta.description === 'string' ? meta.description : undefined
  const url = canonicalUrl(meta)

  // Every page is indexable on every deployment and branch. A page may still
  // opt itself out by passing its own `robots`.
  const robots: Metadata['robots'] = meta.robots ?? { index: true, follow: true }

  return {
    ...meta,
    robots,
    title: title ? { absolute: title } : meta.title,
    openGraph: {
      type: 'website',
      siteName: business.name,
      locale: 'en_AU',
      ...(url ? { url } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [SHARE_IMAGE],
      ...meta.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [SHARE_IMAGE.url],
      ...meta.twitter,
    },
  }
}
