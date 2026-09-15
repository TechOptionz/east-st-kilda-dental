/**
 * Which deployment this is, as a plain string: "production", "preview" or
 * "development".
 *
 * Analytics is the one consumer. GTM loads on every environment so a tag can
 * be tested on a preview before it goes live, and every dataLayer push carries
 * this value — so the container can hold a single "site_env equals production"
 * exception and keep staging traffic out of GA4 without a code change.
 *
 * It deliberately has no say over indexing. Every deployment, on every branch,
 * is crawlable and indexable (see app/robots.ts, lib/seo.ts); canonical URLs
 * always point at SITE_URL, so a branch deploy never competes with production.
 *
 * Netlify sets CONTEXT automatically:
 *   "production"                      → the production branch
 *   "deploy-preview" / "branch-deploy" → pull request and branch deploys
 *   "dev"                             → netlify dev
 * VERCEL_ENV and NEXT_PUBLIC_SITE_ENV are honoured too, for any other host.
 */
const context =
  process.env.NEXT_PUBLIC_SITE_ENV ?? process.env.CONTEXT ?? process.env.VERCEL_ENV

export const siteEnv: 'production' | 'preview' | 'development' =
  context === 'production'
    ? 'production'
    : context === 'preview' || context === 'deploy-preview' || context === 'branch-deploy'
      ? 'preview'
      : 'development'
