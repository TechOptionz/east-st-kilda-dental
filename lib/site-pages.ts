import { business, comprehensiveCareVisit, fullAddress } from '@/lib/business'

/**
 * The fixed, hand-built pages of the site — everything that is not generated
 * from a data array (services, suburbs, guides, topics).
 *
 * Read by app/sitemap.ts for the URL list and by app/llms.txt/route.ts for the
 * headings and one-line descriptions, so adding a page here puts it in both.
 *
 * Deliberately excluded, and why each one stays out:
 *   /home                  — redirects permanently to /, so it is not a page
 *   /book                  — redirects to /online-booking
 *   /comprehensive-care-visit — redirects to /new-patient-comprehensive-care-visit
 *   /services/check-up-clean  — redirects to /services/check-ups
 *   /areas/<slug>          — redirect to /dentist-<slug>
 *   /api/*                 — the contact endpoint, not content
 *   /robots.txt, /sitemap.xml, /llms.txt — not content
 *
 * The rule behind that list: a redirect source never belongs in a sitemap.
 * Listing one asks Google to crawl a URL we have already told it has moved,
 * which wastes crawl budget and muddies the canonical signal. Every source in
 * next.config.ts's redirects() must therefore stay out of STATIC_PAGES.
 */
export interface StaticPage {
  path: string
  /** Link text in llms.txt. */
  title: string
  /** One factual line for llms.txt — what an answer engine will find there. */
  description: string
  /** The llms.txt heading the page is listed under. */
  group: 'key' | 'about' | 'hub' | 'legal'
}

export const STATIC_PAGES: StaticPage[] = [
  {
    path: '/',
    title: 'Home',
    description: `Overview of the practice, its services, team, hours and location at ${fullAddress}.`,
    group: 'key',
  },
  {
    path: '/new-patient-comprehensive-care-visit',
    title: comprehensiveCareVisit.name,
    description: comprehensiveCareVisit.description,
    group: 'key',
  },
  {
    path: '/emergency-dentist',
    title: 'Emergency dentist',
    description: `Same-day emergency appointments for toothache, swelling, and broken or knocked-out teeth. Call ${business.telephoneDisplay}.`,
    group: 'key',
  },
  {
    path: '/nervous-patients',
    title: 'Nervous patients',
    description: 'Gentle, no-judgement care for anxious patients: longer appointments, stop signals and happy gas.',
    group: 'key',
  },
  {
    path: '/fees',
    title: 'Fees and health funds',
    description: 'How pricing works: one set price for the first visit, written estimates, all major health funds, payment plans.',
    group: 'key',
  },
  {
    path: '/using-your-super',
    title: 'Using your super for dental treatment',
    description: 'Early release of superannuation on compassionate grounds for dental treatment, and the ATO report the practice prepares.',
    group: 'key',
  },
  {
    path: '/dental-faqs',
    title: 'Dental FAQs',
    description: 'Answers to common questions about first visits, emergencies, tooth pain, costs, implants, cosmetic dentistry and Invisalign.',
    group: 'key',
  },
  {
    path: '/online-booking',
    title: 'Book online',
    description: 'Online appointment booking.',
    group: 'key',
  },
  {
    path: '/contact',
    title: 'Contact',
    description: `Phone ${business.telephoneDisplay}, email ${business.email}, address, opening hours, map and a callback form.`,
    group: 'key',
  },
  {
    path: '/about',
    title: 'About the practice',
    description: `The practice's history, approach and team, caring for the neighbourhood since ${business.foundedYear}.`,
    group: 'about',
  },
  {
    path: '/about/our-story',
    title: 'Our story',
    description: 'How the practice began around 1980, led for over thirty years by Dr Eddie Goldman and now by Dr Anbar Ganatra.',
    group: 'about',
  },
  {
    path: '/about/our-team',
    title: 'Our team',
    description: 'The dentists, hygienist and support team, with each clinician’s role.',
    group: 'about',
  },
  {
    path: '/about/why-were-different',
    title: "Why we're different",
    description: 'Eight reasons families choose the practice: local history, gentle care, no judgement, honest comprehensive treatment.',
    group: 'about',
  },
  {
    path: '/our-work',
    title: 'Our work',
    description: 'Smile gallery of treatment outcomes.',
    group: 'about',
  },
  {
    path: '/services',
    title: 'All services',
    description: 'Index of every treatment offered, from check-ups to implants, cosmetic care and orthodontics.',
    group: 'hub',
  },
  {
    path: '/areas-we-serve',
    title: 'Areas we serve',
    description: `Index of the suburbs across ${business.serviceRegion} that the practice serves.`,
    group: 'hub',
  },
  {
    path: '/learn',
    title: 'Learn',
    description: 'Index of plain-language dental guides written by the practice.',
    group: 'hub',
  },
  {
    path: '/privacy',
    title: 'Privacy policy',
    description: 'How personal information is collected, used and protected.',
    group: 'legal',
  },
  {
    path: '/terms',
    title: 'Terms and conditions',
    description: 'Website use, appointment policy and service terms.',
    group: 'legal',
  },
]
