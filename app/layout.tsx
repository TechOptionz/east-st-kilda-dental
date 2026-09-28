import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import ScrollEffects from '@/components/ScrollEffects'
import UtilityBar from '@/components/UtilityBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics, { AnalyticsNoScript } from '@/components/Analytics'
import AnalyticsEvents from '@/components/AnalyticsEvents'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SITE_URL, business } from '@/lib/business'
import { SHARE_IMAGE } from '@/lib/seo'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const SITE_TITLE = 'East St Kilda Dental | gentle family and emergency dentist'
const SITE_DESCRIPTION =
  'Gentle, judgement-free dentist in St Kilda East, caring for local families since 1980. Comprehensive check-ups, nervous-patient care, kids and emergencies.'
const SOCIAL_DESCRIPTION = 'Gentle, judgement-free dentist in St Kilda East since 1980.'

// Site-wide defaults. Every page overrides the title, description, canonical
// and share-card text via withSocial() in lib/seo.ts — these are the fallback
// for anything that does not.
//
// metadataBase must be the production domain, even on staging, so the relative
// og:image path resolves to the absolute URL that Open Graph requires.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | East St Kilda Dental',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  /*
   * favicon.ico holds 16/32/48px for browser tabs, history and bookmarks; the
   * PNG is the high-resolution version modern browsers prefer, and doubles as
   * the Apple touch icon. Both are declared here rather than relying on the
   * app/favicon.ico file convention, which takes precedence over this block and
   * would silently drop the PNG.
   */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/assets/favicon.png', type: 'image/png' },
    ],
    apple: '/assets/favicon.png',
  },
  /*
   * Search Console ownership.
   *
   * Verification is per-property and the token is public by design — it only
   * proves control of this domain to Google. It reads from the environment so
   * the property can be re-verified, or a second property added, without a code
   * change; set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel. Leaving it
   * unset emits no tag at all, which is correct if the property was verified by
   * DNS record instead — that method survives a redeploy on its own and needs
   * nothing here.
   */
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: 'website',
    siteName: business.name,
    locale: 'en_AU',
    url: '/',
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [SHARE_IMAGE.url],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${hanken.variable}`}>
      <head>
        <Analytics />
        {/*
          No hand-written hero preload here. The one that used to live on this
          line pointed at /assets/Hero Eddy  white.webp, which does not exist —
          so every page fired a high-priority request that 404'd and competed
          with the real LCP image for bandwidth. Each page's above-the-fold
          hero uses <Photo priority>, and next/image emits the correct preload
          with the optimised srcset for us.
        */}
      </head>
      <body>
        <AnalyticsNoScript />
        <AnalyticsEvents />
        <ScrollEffects />
        <UtilityBar />
        <Header />
        {children}
        <Footer />
        <VercelAnalytics />
      </body>
    </html>
  )
}
