import type { NextConfig } from 'next'
import { suburbs, suburbPath } from './data/suburbs'

/**
 * Every URL this site has served that no longer exists, and where it goes now.
 *
 * Each one is a route that was live in the repository under an older name and
 * was renamed or removed without a redirect, so any inbound link or indexed
 * result still pointing at it landed on the 404 page — losing both the visitor
 * and whatever ranking the old URL had earned.
 *
 * Two rules held throughout:
 *
 *   Every destination is a final URL, never another redirect. /offer's page was
 *     renamed twice (→ /comprehensive-care-visit → /new-patient-comprehensive-
 *     care-visit) and /booking's twice (→ /book → /online-booking); each is
 *     sent straight to where the content actually lives, so nobody pays for two
 *     round trips and no signal is diluted through a chain.
 *
 *   The destination is the page that replaced the old one, not the home page.
 *     A redirect to "/" reads to Google as a soft 404 and drops the ranking
 *     entirely — /take-care-of-you was the new-patient offer campaign, so it
 *     goes to the page carrying that offer today.
 *
 * A redirect costs nothing until someone requests the URL, so a path that
 * turns out never to have been indexed is simply never asked for. The reverse
 * mistake — a missing redirect — is only discovered from the 404 report weeks
 * later. Anything renamed from here on belongs in this list on the same commit.
 */
const LEGACY_PATHS: Record<string, string> = {
  // Renamed 2026-06-09, "routes fixed" — short names replaced by descriptive,
  // keyword-bearing ones.
  '/emergency': '/emergency-dentist',
  '/gentle': '/nervous-patients',
  '/super': '/using-your-super',
  '/first-visit': '/new-patient-comprehensive-care-visit',
  '/ourwork': '/our-work',
  '/about/story': '/about/our-story',
  '/about/team': '/about/our-team',
  '/about/different': '/about/why-were-different',
  '/booking': '/online-booking',
  '/offer': '/new-patient-comprehensive-care-visit',

  // /home was a second copy of the home page, kept alive as a redirect route
  // that called next/navigation's redirect() — which issues a 307 Temporary.
  // A temporary redirect tells Google the old URL is coming back, so it stays
  // in the index competing with "/". It belongs here, as a permanent one.
  '/home': '/',

  // The new-patient offer campaign page, live and indexable until it was
  // removed on 2026-09-07. The offer itself did not go away — it is the
  // Comprehensive Care Visit — so both of its URLs point at that page.
  '/campaign': '/new-patient-comprehensive-care-visit',
  '/take-care-of-you': '/new-patient-comprehensive-care-visit',

  // /your-first-visit was the walk-through of a first appointment, live and
  // indexable until it was removed on 2026-09-08. The Comprehensive Care Visit
  // page covers the same ground, so it takes both this URL and the older
  // /first-visit that used to redirect here.
  '/your-first-visit': '/new-patient-comprehensive-care-visit',

  // The WordPress site this one replaced. Every URL in its last Yoast sitemap
  // (page-sitemap.xml and post-sitemap.xml, December 2025), plus the older
  // pages still showing up in Google's sitelinks. WordPress served them all
  // with a trailing slash; Next strips that with its own 308 first, so
  // /home/about/ reaches this table as /home/about.
  '/home/about': '/about',
  '/home/how-we-work': '/nervous-patients', // "Gentle dentist in inner Melbourne"
  '/home/foreign-languages': '/about/why-were-different', // the languages the team speaks
  '/home/languages': '/about/why-were-different',
  '/home/services': '/services',
  '/home/services/crowns-bridges': '/services/crowns-and-bridges',
  '/home/services/dental-implant-surgery': '/services/dental-implants',
  '/home/services/emergencies': '/emergency-dentist',
  '/home/services/gentle-dentistry': '/nervous-patients',
  '/home/services/how-we-work': '/nervous-patients',
  '/home/services/invisalign': '/services/invisalign',
  '/home/services/teeth-whitening': '/services/teeth-whitening',
  '/home/services/veneers': '/services/veneers',
  '/home/services/wisdom-teeth-extraction-surgical-extraction': '/services/extractions-wisdom-teeth',
  '/home/services-4': '/learn/prevention', // "How should I look after my teeth?"
  '/home/services-4/faqs': '/dental-faqs',
  '/contact-us': '/contact',
  '/gentle-dentistry': '/nervous-patients',
  '/info-centre': '/learn',
  '/terms-conditions': '/terms',
  '/privacy-policy': '/privacy',
  '/dentist-near-albert-park': '/dentist-albert-park',
  '/dentist-near-balaclava': '/dentist-balaclava',
  '/dentist-near-st-kilda-west': '/dentist-st-kilda-west',
  '/249-clean-up': '/services/cleans-and-hygiene', // a scale-and-clean offer no longer running
  '/blog': '/learn',
  '/blog/back-to-the-dentist-st-kilda': '/learn/havent-been-to-the-dentist-in-years',
  '/blog/dental-cleaning-melbourne-gentle-guide': '/services/cleans-and-hygiene',
  '/blog/emergency-dentist-melbourne-inner-south': '/emergency-dentist', // "Dental Emergency St Kilda"
  '/blog/happy-gas-dental-anxiety-st-kilda': '/nervous-patients',
  '/category/working-with-your-dentist': '/learn',
  '/working-with-your-dentist/questions': '/dental-faqs',
  '/working-with-your-dentist/gum-disease-why-its-more-serious-than-you-think': '/learn/bleeding-gums',
  '/working-with-your-dentist/why-a-6-monthly-dental-cleanup-saves-you-money-and-protects-your-health':
    '/learn/how-often-should-you-see-the-dentist',
  '/working-with-your-dentist/why-living-in-st-kilda-means-regular-dental-check-ups-are-more-important-than-ever':
    '/learn/how-often-should-you-see-the-dentist',
}

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback; browsers get the best format they support
    formats: ['image/avif', 'image/webp'],
  },
  /**
   * The suburb landing pages used to live at two URLs: /areas/<slug> (generated
   * from data/suburbs.ts) and /dentist-<slug> (hand-written). That was duplicate
   * content competing for the same searches. /dentist-<slug> is now the only
   * one, so the old /areas/<slug> URLs redirect permanently rather than 404.
   */
  async redirects() {
    return [
      /*
       * permanent: true is a 308, which is the modern permanent redirect and
       * what Google treats as equivalent to a 301 for ranking purposes. The
       * only difference from a 301 is that 308 preserves the request method,
       * which is irrelevant for page URLs a crawler only ever GETs. Every
       * redirect on this site uses the one status code; switch the whole table
       * together, or not at all.
       */
      ...Object.entries(LEGACY_PATHS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...suburbs.map((s) => ({
        source: `/areas/${s.slug}`,
        destination: suburbPath(s.slug),
        permanent: true,
      })),
      /**
       * The booking page moved from /book to /online-booking. /book was the
       * live URL, so it is linked from outside the site and indexed; this
       * keeps those hits landing on the page rather than a 404.
       */
      {
        source: '/book',
        destination: '/online-booking',
        permanent: true,
      },
      /**
       * /services/check-up-clean was a legacy duplicate of /services/check-ups
       * and /services/cleans-and-hygiene — the same treatment on a third URL,
       * competing with both and linked from nowhere on the site. The page is
       * gone from data/services.ts; this keeps any existing inbound link or
       * indexed result landing on the page that replaced it.
       */
      {
        source: '/services/check-up-clean',
        destination: '/services/check-ups',
        permanent: true,
      },
      /**
       * The first-visit page moved from /comprehensive-care-visit to
       * /new-patient-comprehensive-care-visit when the offer was renamed, so
       * the URL says who the visit is for. The old path was live, linked from
       * the header and the utility bar, and indexed; this keeps those hits and
       * any outside link landing on the page rather than a 404.
       */
      {
        source: '/comprehensive-care-visit',
        destination: '/new-patient-comprehensive-care-visit',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
