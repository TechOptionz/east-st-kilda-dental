import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/business'

/**
 * AI answer engines can only cite a site their crawlers are allowed to read.
 *
 * The wildcard rule below already permits these, but they are also named
 * explicitly so that allowing them is a visible, deliberate decision rather
 * than an accident of defaults — and so nobody later adds a blanket block
 * without seeing exactly what it would cost.
 */
const AI_CRAWLERS = [
  'GPTBot', // OpenAI — index and training
  'OAI-SearchBot', // OpenAI — ChatGPT Search
  'ChatGPT-User', // OpenAI — live fetch on a user's behalf
  'ClaudeBot', // Anthropic — index
  'Claude-User', // Anthropic — live fetch on a user's behalf
  'Claude-SearchBot', // Anthropic — search
  'PerplexityBot', // Perplexity — index
  'Perplexity-User', // Perplexity — live fetch
  'Google-Extended', // Google — Gemini and AI Overviews grounding
  'Applebot-Extended', // Apple Intelligence
  'Amazonbot',
  'meta-externalagent', // Meta AI
  'DuckAssistBot', // DuckDuckGo AI
  'CCBot', // Common Crawl — feeds many models
]

/**
 * /api/* is the only path anything is kept out of. It is the contact form's
 * POST endpoint — there is nothing there to read, a crawler's GET only earns a
 * 405, and it should never surface as a result. Everything else is content and
 * is open to every crawler named above.
 */
const DISALLOW = ['/api/']

/**
 * The same rules on every deployment, on every branch — nothing is gated on the
 * environment. Canonical URLs and the sitemap always point at SITE_URL, so a
 * branch or preview deploy that gets crawled consolidates onto production
 * rather than competing with it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
