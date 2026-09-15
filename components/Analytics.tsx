import Script from 'next/script'
import { siteEnv } from '@/lib/env'

/**
 * The Google Tag Manager container, and the only script that loads it.
 *
 * GTM is the single tag on the site. GA4, Google Ads conversions and anything
 * added later all live inside the container, so a new destination never needs a
 * deploy — which is exactly why the GA4 measurement ID appears nowhere in this
 * repo, and should not be added here.
 *
 * Two deliberate choices:
 *
 *   next/script with strategy="afterInteractive" rather than the raw <script>
 *     this replaced. Next then loads GTM after hydration instead of racing the
 *     page's own JavaScript, and — importantly — reinjects it correctly, where
 *     a hand-written tag in <head> could be dropped on a client-side
 *     navigation.
 *
 *   site_env is pushed before the container loads, so every hit GTM sees is
 *     labelled with the deployment it came from. GTM loads on preview
 *     deployments on purpose, so tags can be tested in Preview mode against a
 *     real staging URL; the container is where staging traffic gets excluded
 *     from GA4 (add "site_env equals production" as a trigger exception), not
 *     here.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-MQ9RNSZP'

export default function Analytics() {
  if (!GTM_ID) return null

  return (
    <>
      {/*
        Seeds the dataLayer before GTM reads it. Anything pushed here — and
        anything track() pushes while the container is still loading — is
        replayed by GTM the moment it boots, so no early event is lost.
      */}
      <Script id="gtm-datalayer" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ site_env: ${JSON.stringify(siteEnv)} });`}
      </Script>

      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`}
      </Script>
    </>
  )
}

/**
 * The no-JavaScript fallback, rendered as the first thing in <body>.
 *
 * It only ever records a page view — no dataLayer means no conversions — but it
 * keeps a visitor with JavaScript disabled from vanishing from the traffic
 * numbers entirely.
 */
export function AnalyticsNoScript() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
