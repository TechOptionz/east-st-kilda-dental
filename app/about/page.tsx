import type { Metadata } from 'next'
import Link from 'next/link'
import GetInTouch from '@/components/GetInTouch'
import Photo from '@/components/Photo'
import { withSocial } from '@/lib/seo'
import { business, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'About Us | East St Kilda Dental — Gentle Care Since 1980',
  description:
    'East St Kilda Dental has looked after this neighbourhood for over 40 years. Our story, why we\'re different, and the team who\'ll care for you.',
  alternates: { canonical: `${SITE_URL}/about` },
})

/** The About sub-pages, one card each. */
const explore = [
  { href: '/about/our-story', title: 'Our Story', text: 'Four decades on the same corner, and the family behind it today.' },
  { href: '/about/why-were-different', title: "Why We're Different", text: 'No judgement, comprehensive care, and a gentle, female-led team.' },
  { href: '/about/our-team', title: 'Meet Our Team', text: "The dentists and people who'll look after you." },
  { href: '/our-work', title: 'Our Work', text: 'Real, natural-looking results, shared with consent.' },
]

export default function AboutPage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">About us</div>
            <h1>Gentle, local care <em>since 1980</em></h1>
            <p className="lead">
              East St Kilda Dental has looked after this neighbourhood for over 40 years. Here&apos;s our story, what makes us different, and the people who&apos;ll care for you.
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <div className="hero-proof">
              <span>Since ~1980</span>
              <span className="proof-dot" />
              <span>Generations of local families</span>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/gallery/smile-5.webp"
            alt="A smiling patient checking her teeth in a hand mirror while her dentist looks on"
            objectPosition="32% center"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── EXPLORE GRID ─────────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Get to know us</div>
            <h2>A little more about East St Kilda Dental</h2>
          </div>
          <div className="svc-grid reveal" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
            {explore.map(item => (
              <Link key={item.href} href={item.href} className="svc" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span style={{ color: 'var(--clay-deep)', fontWeight: 600, fontSize: '14px' }}>Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR APPROACH ─────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="band rev reveal">
            <Photo
              src="/assets/gallery/smile-6.webp"
              alt="A dentist using a model of the teeth to explain treatment to a patient in the chair"
              objectPosition="center 30%"
              sizes="(max-width: 860px) 100vw, 48vw"
              style={{ minHeight: '320px' }}
            />
            <div className="bandtext">
              <div className="eyebrow">Responsible dentistry</div>
              <h2>Not the cheapest, not the pushiest, the most honest</h2>
              <p>
                We believe clear guidance is a form of care. We&apos;ll always explain what we see, why it matters, and what your options are, then let you decide in your own time. No fear, no pressure, no surprises on cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── IN OUR WORDS ─────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal" style={{ textAlign: 'center' }}>
          <div className="pqfit">
            <p className="pq">
              <span className="mk">&ldquo;</span>Generations of local families have trusted us. We intend to keep it that way.<span className="mk">&rdquo;</span>
            </p>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/about/our-story" className="btn btn-ghost">Our story</Link>
            <Link href="/about/our-team" className="btn btn-ghost">Meet our team</Link>
            <Link href="/online-booking" className="btn">Book your visit</Link>
          </div>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
