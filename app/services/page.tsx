import type { Metadata } from 'next'
import Link from 'next/link'
import GetInTouch from '@/components/GetInTouch'
import Photo from '@/components/Photo'
import { withSocial } from '@/lib/seo'
import { business, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'All Dental Services | East St Kilda Dental',
  description:
    'From everyday check-ups and cleans to implants, cosmetic care and orthodontics — all in one gentle, no-judgement practice in St Kilda East.',
  alternates: { canonical: `${SITE_URL}/services` },
})

const general = [
  { h4: 'Check-ups & Exams',      p: 'Gentle, comprehensive examinations',          href: '/services/check-ups' },
  { h4: 'Cleans & Hygiene',       p: 'Professional cleans and gum care',            href: '/services/cleans-and-hygiene' },
  { h4: "Children's Dentistry",   p: 'Friendly dentistry for children',             href: '/services/childrens-dentistry' },
  { h4: 'Mouthguards',            p: 'Custom-fitted sports mouthguards',            href: '/services/mouthguards' },
  { h4: 'TMJ & Jaw Pain',         p: 'Help for jaw pain and grinding',              href: '/services/tmj-jaw-pain' },
  { h4: 'Myofunctional Therapy',  p: 'Retraining breathing and oral habits',        href: '/services/myofunctional-therapy' },
  { h4: 'Gentle / Anxiety Dentistry', p: 'Calm care for nervous patients',         href: '/nervous-patients' },
]

const restorative = [
  { h4: 'Fillings & Restorations',      p: 'Natural-looking tooth-coloured fillings',  href: '/services/fillings' },
  { h4: 'Crowns & Bridges',             p: 'Strong crowns and bridges',                href: '/services/crowns-and-bridges' },
  { h4: 'Root Canal Therapy',           p: 'Gentle, tooth-saving treatment',           href: '/services/root-canal' },
  { h4: 'Onlays & Inlays',              p: 'A conservative step before a crown',       href: '/services/onlays-and-inlays' },
  { h4: 'Dentures',                     p: 'Comfortable, natural-looking dentures',    href: '/services/dentures' },
  { h4: 'Extractions & Wisdom Teeth',   p: 'Gentle removals when needed',             href: '/services/extractions-wisdom-teeth' },
]

const cosmetic = [
  { h4: 'Smile Design',    p: 'A planned, natural smile refresh',          href: '/services/smile-design' },
  { h4: 'Veneers',         p: 'Custom, natural-looking veneers',           href: '/services/veneers' },
  { h4: 'Teeth Whitening', p: 'Safe, dentist-supervised whitening',        href: '/services/teeth-whitening' },
]

const orthodontics = [
  { h4: 'Invisalign / Clear Aligners', p: 'Discreet clear-aligner straightening', href: '/services/invisalign' },
  { h4: 'Braces',                      p: 'Effective braces for all ages',         href: '/services/braces' },
]

const implants = [
  { h4: 'Single Implants',      p: 'Replace one tooth naturally',       href: '/services/dental-implants' },
  { h4: 'All-on-4 / Full Arch', p: 'A fixed full-arch solution',        href: '/services/all-on-4-implants' },
  { h4: 'Bone Grafting',        p: 'A strong base for implants',        href: '/services/bone-grafting' },
]

function ServiceGrid({ items }: { items: { h4: string; p: string; href: string }[] }) {
  return (
    <div className="svc-grid">
      {items.map(item => (
        <Link key={item.href} href={item.href} className="svc" style={{ textDecoration: 'none' }}>
          <h4>{item.h4}</h4>
          <p>{item.p}</p>
          <span style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '14px' }}>Learn more &rarr;</span>
        </Link>
      ))}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">Our services</div>
            <h1>Comprehensive, gentle dentistry, <em>all in one place</em></h1>
            <p className="lead">
              From everyday check-ups and cleans to implants and cosmetic care, here&apos;s everything we offer, with calm, no-judgement care at the centre of all of it.
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <div className="hero-proof">
              <span>Nervous patients welcome</span>
              <span className="proof-dot" />
              <span>Clear, no-surprise fees</span>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/services/services-hero.webp"
            alt="A dentist speaking with a smiling patient in the treatment room"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── GENERAL & PREVENTIVE ────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">General &amp; Preventive</div>
            <h2>General &amp; Preventive</h2>
          </div>
          <div className="reveal" style={{ transitionDelay: '.08s' }}>
            <ServiceGrid items={general} />
          </div>
        </div>
      </section>

      {/* ── RESTORATIVE ─────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Restorative</div>
            <h2>Restorative</h2>
          </div>
          <div className="reveal" style={{ transitionDelay: '.08s' }}>
            <ServiceGrid items={restorative} />
          </div>
        </div>
      </section>

      {/* ── COSMETIC ────────────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Cosmetic</div>
            <h2>Cosmetic</h2>
          </div>
          <div className="reveal" style={{ transitionDelay: '.08s' }}>
            <ServiceGrid items={cosmetic} />
          </div>
        </div>
      </section>

      {/* ── ORTHODONTICS ────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Orthodontics</div>
            <h2>Orthodontics</h2>
          </div>
          <div className="reveal" style={{ transitionDelay: '.08s' }}>
            <ServiceGrid items={orthodontics} />
          </div>
        </div>
      </section>

      {/* ── IMPLANTS ────────────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Implants</div>
            <h2>Implants</h2>
          </div>
          <div className="reveal" style={{ transitionDelay: '.08s' }}>
            <ServiceGrid items={implants} />
          </div>
        </div>
      </section>

      {/* ── EMERGENCY ───────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Emergency</div>
            <h2>Emergency</h2>
          </div>
          <div className="svc-grid reveal" style={{ transitionDelay: '.08s' }}>
            <Link href="/emergency-dentist" className="svc" style={{ textDecoration: 'none' }}>
              <h4>Emergency Dentistry</h4>
              <p>Same-day help when it hurts</p>
              <span style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '14px' }}>Learn more &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOT SURE? ───────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal" style={{ textAlign: 'center', maxWidth: '46em', marginLeft: 'auto', marginRight: 'auto' }}>
          <p style={{ fontSize: '20px', fontFamily: 'var(--display)', color: 'var(--cream)', lineHeight: 1.45 }}>
            Not sure what you need? That&apos;s what your first visit is for, <em>we&apos;ll help you work it out.</em>
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/new-patient-comprehensive-care-visit" className="btn btn-ghost">Your first visit</Link>
            <Link href="/nervous-patients" className="btn btn-ghost">Nervous patients</Link>
            <Link href="/fees" className="btn btn-ghost">Fees &amp; health funds</Link>
          </div>
        </div>
      </section>

      {/* ── GET IN TOUCH ────────────────────────────────── */}
      <GetInTouch />

    </main>
  )
}
