import type { ReactNode } from 'react'
import JsonLd from '@/components/JsonLd'
import Link from 'next/link'
import CarePoints from '@/components/CarePoints'
import CarouselNav from '@/components/CarouselNav'
import Photo from '@/components/Photo'
import GetInTouch from '@/components/GetInTouch'
import HealthFundLogos from '@/components/HealthFundLogos'
import HeroVideoBg from '@/components/HeroVideoBg'
import HomeOffers from '@/components/HomeOffers'
import MapEmbed from '@/components/MapEmbed'
import ReviewMarquee from '@/components/ReviewMarquee'
import { suburbs, suburbPath } from '@/data/suburbs'
import { SCHEMA_ID, SITE_URL, areasServed, business, clinicianId, clinicians, comprehensiveCareVisit, fullAddress, openingHours, socialProfiles, telHref } from '@/lib/business'
import { withSocial } from '@/lib/seo'

export const metadata = withSocial({
  title: 'East St Kilda Dental | Gentle Family & Emergency Dentist',
  description:
    'Gentle, judgement-free dentist in St Kilda East. Caring for local families since 1980 — check-ups, nervous-patient care, kids and emergencies. Book today.',
  alternates: { canonical: `${SITE_URL}/` },
})

// The five questions in the "Things you might be wondering" section.
//
// That section is commented out further down, so this page publishes no
// FAQPage node: FAQ structured data may only describe questions a reader can
// see on the page. If the section comes back, restore a FAQPage node built
// from this array alongside it. The full question library is /dental-faqs.
const faqs = [
  {
    q: "It's been years since I went. Will you judge me?",
    a: 'Never. A huge number of our patients come to us after a long gap. There are no lectures and no raised eyebrows here, only a warm welcome and a care plan to move forward.',
  },
  {
    q: "I'm really nervous about the dentist. Can you help?",
    a: "Yes, this is one of the things we do best. Tell us you're anxious and we'll slow right down, talk you through everything, and offer happy gas and other comfort options.",
  },
  {
    q: 'How much will it cost?',
    a: "You'll always get a clear written estimate before any treatment begins, and time to think it over. We also offer payment plans for larger treatment.",
  },
  {
    q: 'Do you take my health fund?',
    a: 'We welcome patients from all major Australian health funds. We can process eligible health-fund claims on the spot through HICAPS. Your rebate and out-of-pocket cost depend on your fund, policy and level of cover.',
  },
  {
    q: 'What happens at my first visit?',
    a: "A relaxed chat about your history and concerns, then a gentle, comprehensive check, and finally a clear, prioritised care plan. You're never rushed.",
  },
]

// The three proof points that sit in one panel across the foot of the hero,
// replacing the old glass band. Rendered as a <dl>, so each number is announced
// with the label that gives it meaning.
//
// `short` takes over below 600px, where the three cells sit side by side and
// each is only about 100px wide. Every full label wraps to two or three lines
// at that width, and the longest of them sets the height of the panel — so the
// phone gets one-word labels instead. Same technique as the
// .story-copy-full / .story-copy-short pair further down this page.
//
// `count`, `decimals` and `suffix` drive the count-up: the figure sits in its
// own <span data-count>, which the observer in components/ScrollEffects.tsx
// animates from zero the first time the panel comes into view. Anything that
// must not be counted — the word "years", the stars — goes in `after`, outside
// that span. The server renders the finished figure, so with JS off (or
// reduced motion on) the panel reads exactly as it always has.
const heroStats: {
  id: string
  count: number
  decimals?: number
  suffix?: string
  after?: ReactNode
  label: string
  short: string
}[] = [
  { id: 'patients', count: 10000, suffix: '+', label: 'Patients Cared For', short: 'Patients Treated' },
  { id: 'years', count: 45, suffix: '+', after: ' years', label: 'Caring Locally', short: 'Caring Locally' },
  {
    id: 'rating',
    count: 5,
    decimals: 1,
    after: (
      <>
        {' '}
        <span className="proof-stars">★★★★★</span>
      </>
    ),
    label: 'Google Rating',
    short: 'Google',
  },
]

/** "10000" + "+" → "10,000+" — the same formatting the counter's last frame
    lands on, so the server-rendered figure and the animation agree. */
const statText = (count: number, decimals = 0, suffix = '') =>
  (decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('en-AU')) + suffix

// The six services in the "Care for every stage of life" grid. Each photo is
// the same one the service's own page leads with, so the card and the page it
// opens show the reader the same picture.
const homeServices = [
  {
    href: '/services/check-ups',
    title: 'Check-ups & cleans',
    blurb: 'Gentle, thorough preventive care to keep small things small.',
    src: '/assets/services/check-ups-hero.webp',
    alt: "A dentist checking a smiling young boy's teeth as he hugs a toy bunny in the chair, his X-rays on the screen behind",
  },
  {
    href: '/emergency-dentist',
    title: 'Emergency dentistry',
    blurb: "In pain? We'll see you quickly and get you comfortable.",
    src: '/assets/emergency/emergency-dentistry.webp',
    alt: 'A friendly team member taking a call at the East St Kilda Dental reception',
  },
  {
    href: '/services/fillings',
    title: 'Fillings & restorations',
    blurb: 'Quietly fixing what needs fixing, preserving your natural teeth.',
    src: '/assets/services/fillings.webp',
    alt: 'Two dentists placing a tooth-coloured filling for a patient in the treatment chair',
  },
  {
    href: '/services/crowns-and-bridges',
    title: 'Crowns & root canals',
    blurb: 'Saving teeth and easing pain, explained every step of the way.',
    src: '/assets/services/crowns-bridges.webp',
    alt: 'A smiling patient having their teeth examined with a dental mirror',
  },
  {
    href: '/services/dental-implants',
    title: 'Dental implants',
    blurb: 'Replacing missing teeth so you can eat and smile with ease.',
    src: '/assets/services/single-implant.webp',
    alt: "Close-up of a patient's smile as a dentist matches the shade of a replacement tooth against the front teeth",
  },
  {
    href: '/services/smile-design',
    title: 'Cosmetic dentistry',
    blurb: "Subtle, natural improvements when you're ready, never pushed.",
    src: '/assets/services/smile-design.webp',
    alt: 'A smiling patient having her teeth examined with a dental mirror during a smile design consultation',
  },
]

// One self-contained, factual sentence for AI answer engines and featured
// snippets to quote whole: who we are, what we are, where and since when.
// Assembled from lib/business.ts so it can never contradict the JSON-LD below.
// Kept plain and descriptive — no superlatives or outcome claims, for AHPRA
// safety.
const summarySentence =
  `Gentle, thorough dental care for individuals and families, from regular check-ups to emergencies and comprehensive dental care.`

// One connected JSON-LD @graph for the home page: the practice, the four named
// clinicians and the website. Every fact comes from lib/business.ts.
//
// No Review or aggregateRating markup here, deliberately, per the AHPRA
// advertising guidance.
const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Dentist',
      '@id': SCHEMA_ID.practice,
      name: business.name,
      url: business.url,
      image: `${SITE_URL}/assets/shared/meet-our-team.webp`,
      logo: `${SITE_URL}/assets/brand/eskd-logo.png`,
      telephone: business.telephone,
      email: business.email,
      currenciesAccepted: business.currenciesAccepted,
      address: { '@type': 'PostalAddress', ...business.address },
      geo: { '@type': 'GeoCoordinates', ...business.geo },
      hasMap: business.hasMap,
      openingHoursSpecification: openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...h.days],
        opens: h.opens,
        closes: h.closes,
      })),
      areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
      sameAs: socialProfiles,
      makesOffer: { '@type': 'Offer', ...comprehensiveCareVisit },
      employee: clinicians.map((c) => ({ '@id': clinicianId(c.slug) })),
    },
    ...clinicians.map((c) => ({
      '@type': 'Person',
      '@id': clinicianId(c.slug),
      name: c.name,
      jobTitle: c.jobTitle,
      worksFor: { '@id': SCHEMA_ID.practice },
    })),
    {
      '@type': 'WebSite',
      '@id': SCHEMA_ID.website,
      url: business.url,
      name: business.name,
      publisher: { '@id': SCHEMA_ID.practice },
    },
  ],
}

export default function Home() {
  return (
    /* .home scopes the phone-width overrides at the foot of globals.css. The
       home page's mobile layout was redesigned against docs/Mobile 1-2.jpeg,
       and every rule in that block is inside a media query and prefixed with
       this class, so neither the desktop layout nor any other page moves. */
    <main className="home">
      {/* The hero poster is a CSS background, so it isn't discoverable until the
          stylesheet parses. Preloading it keeps it the LCP candidate. */}
      <link rel="preload" as="image" href="/assets/video/hero-clinic-poster.webp" fetchPriority="high" />
      <JsonLd data={homeSchema} />

      {/* HERO — full-bleed video frame, with the proof points along its foot */}
      <section className="hero-video">
        <HeroVideoBg />
        <div className="hero-video-scrim" aria-hidden="true" />
        <div className="container container-wide hero-video-inner">
          <div className="hero-video-copy">
            <div className="eyebrow">Skilled, heartfelt dentistry</div>
            <h1><span style={{ whiteSpace: 'nowrap' }}>Your local dentist</span> <em style={{ whiteSpace: 'nowrap' }}>in St Kilda East</em></h1>
            <p className="lead">{summarySentence}</p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost-light">Call {business.telephoneDisplay}</a>
            </div>
            <div className="hero-proof">
              <span>Off-street parking</span>
              <span className="proof-dot" />
              <span>HICAPS available</span>
              <span className="proof-dot" />
              <span>Caring locally since 1980</span>
            </div>
            <p className="hero-video-note">
              <Link href="/new-patient-comprehensive-care-visit">
                New patient? See what your first visit includes &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stat panel straddling the foot of the hero. Deliberately a sibling of
          .hero-video rather than a child: that section is overflow:hidden, so
          anything pushed past its bottom edge — the panel and its shadow —
          would be clipped. */}
      <div className="container hero-stats-wrap">
        <dl className="hero-stats">
          {heroStats.map(({ id, count, decimals, suffix, after, label, short }) => (
            <div className="hero-stat" key={id}>
              <dt>
                <span data-count={count} data-decimals={decimals} data-suffix={suffix}>
                  {statText(count, decimals, suffix)}
                </span>
                {after}
              </dt>
              <dd>
                <span className="hero-stat-label-full">{label}</span>
                <span className="hero-stat-label-short">{short}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* CHOOSE YOUR VISIT */}
      <HomeOffers />

      {/* SERVICES OVERVIEW — the "can you help me?" beat, placed directly
          after the visit types so the reader sees the range of care before
          being asked to trust us or to book. */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">How we can help</div>
            {/* A step above `.sec h2` because this is the page's main "can we
                help you?" beat, but brought in from clamp(38px,4.8vw,62px):
                against the new 30–46px H2 scale, and inside the narrower
                container, 62px was a different type system rather than an
                emphasis within one. */}
            <h2 style={{ fontSize: 'clamp(34px, 4.4vw, 52px)' }}>Care for every stage of life</h2>
            <p style={{ marginTop: '18px', fontSize: '17.5px', maxWidth: '42em', marginLeft: 'auto', marginRight: 'auto' }}>
              From routine check-ups and emergency dentistry to fillings, crowns, implants and cosmetic care, here is how we look after St Kilda East and the surrounding suburbs.
            </p>
          </div>
          <div className="svc-grid-v2">
            {homeServices.map(({ href, title, blurb, src, alt }) => (
              <Link href={href} className="svc-item reveal" key={href}>
                <Photo
                  src={src}
                  alt={alt}
                  sizes="(max-width: 820px) 100vw, 33vw"
                />
                <div className="svc-item-body">
                  <h4 style={{ fontWeight: 600 }}>{title}</h4>
                  <p>{blurb}</p>
                  {/* The arrow is drawn by .svc-item-more::after, so it can
                      slide on hover without the label moving with it. */}
                  <span className="svc-item-more">Learn more</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }} className="reveal">
            <Link href="/services" className="btn btn-ghost">See all services</Link>
          </div>
        </div>
      </section>

      {/* REVIEWS — deliberately live. The quotes, and the note on why they are
          shown at all, live in components/ReviewMarquee.tsx.

          .sec-reviews rather than plain .sec: see the note on it in globals.css
          for why this one section carries less padding than its neighbours. */}
      <section className="sec sec-reviews">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">In our patients&apos; words</div>
            <h2>Kind, gentle, and never rushed</h2>
          </div>
        </div>
        {/* Outside the container on purpose — the row runs off both edges. */}
        <ReviewMarquee />
        <div className="container">
          <div className="gscore reveal">
            Rated <b>5.0 on Google</b> by our local patients &middot;{' '}
            <a href="https://share.google/M1ZtOT5z13fj2mhWf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sage-deep)', fontWeight: 600 }}>
              Read all reviews
            </a>
          </div>
        </div>
      </section>


      {/* CTA — the first real ask of the page, made only once the visit types,
          the difference and the reviews are all behind the reader. Reuses
          .ctaband from /fees rather than introducing a second band style. */}
      <section className="sec">
        <div className="container">
          <div className="ctaband reveal">
            <h3>Ready when you are</h3>
            <p>
              Whether you need a new dentist, haven&apos;t been for some time, have something bothering you, or you simply want to take better care of your teeth, we&apos;d be happy to help.
            </p>
            <div className="ctaband-actions">
              <Link href="/online-booking" className="btn">Book an appointment</Link>
              <a href={telHref} className="btn btn-ghost ctaband-ghost">Call {business.telephoneDisplay}</a>
            </div>
            <p style={{ margin: '24px 0 0', fontSize: '15.5px' }}>{fullAddress}</p>
          </div>
        </div>
      </section>


      {/* HOW WE'RE DIFFERENT — the differentiators, kept after the CTA: the
          page makes its ask off the services and the reviews, and this reads
          as supporting argument for anyone still scrolling.

          Deliberately .care-points rather than .pillars: as cards this ran two
          to three screens on a phone before the reader reached anything else.
          .pillars itself is untouched — /nervous-patients and
          /new-patient-comprehensive-care-visit still use it as cards. */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head reveal">
            <div className="eyebrow">The way we care</div>
            <h2>Dentistry that feels <em>safe</em>, not stressful</h2>
            <p style={{ marginTop: '16px', fontSize: '18px' }}>
              However long it&apos;s been, you&apos;re in the right place. No judgement. No pressure.
            </p>
          </div>
          {/* Same four points and the same run-in cards on a wide screen; on a
              phone they become the reference's tappable pills. The words live in
              the component now. */}
          <CarePoints />
        </div>
      </section>


      {/* OFFER CARD */}
      <section className="sec" id="first-visit">
        <div className="container reveal">
          <div className="offer-card-v2">
            <div className="body">
              <div className="eyebrow">Your first visit, in full</div>
              <h2>The <em>New Patient Comprehensive Care</em> Visit</h2>
              <p>A gentle, thorough 60&ndash;75 minute first visit to understand your oral health, what needs attention, and what can wait. You&apos;ll leave with a clear, personalised care plan.</p>
              {/* .tight keeps this list two-up on a phone — see globals.css. The
                  other pages using .offer-includes have longer items and still
                  fall back to one column. */}
              <ul className="offer-includes tight">
                <li>Comprehensive examination</li>
                <li>X-rays &amp; intraoral photos</li>
                <li>Oral cancer screening</li>
                <li>Gum health assessment</li>
                <li>Scale, clean &amp; polish</li>
                <li>Fluoride treatment</li>
                <li>Smile &amp; bite assessment</li>
                <li>Personalised care plan</li>
              </ul>
              <div className="offer-meta">
                <div><b>60&ndash;75 min</b>gentle and thorough</div>
                <div><b>All included</b>in one visit</div>
                <div><b>Clear care plan</b>before you leave</div>
              </div>
              {/* No marginTop: .offer-meta already carries a 28px bottom margin,
                  and an inline-block button does not collapse margins with it —
                  the two stacked to a 48px gap, against the 28px rhythm the rest
                  of the card uses. On a phone .offer-meta is hidden and the
                  button takes its own margin instead — see globals.css. */}
              <Link href="/online-booking" className="btn" style={{ display: 'inline-block' }}>Book your visit</Link>
              <p style={{ fontSize: '13.5px', marginTop: '16px', color: 'var(--ink-soft)' }}>
                Everything included. Eligible health-fund claims can be processed through HICAPS.
              </p>
            </div>
            {/* The frame's overrides are a class, not an inline style: inline
                won the cascade against the stacked mobile rule below 820px, so
                min-height:100% resolved against an auto-height row and the
                photo collapsed to nothing on a phone. */}
            <Photo
              className="offer-photo"
              src="/assets/home/comprehensive2.webp"
              alt="A dentist talking with a seated patient during a comprehensive care consultation"
     
            />
          </div>
        </div>
      </section>



      {/* NERVOUS PATIENTS */}
      <section className="sec sage-bg" id="nervous">
        <div className="container nervous-grid">
          <Photo
            tall
            className="reveal"
            src="/assets/home/nervous-patients-band.webp"
            alt="A relaxed patient smiling warmly in the dental chair"
          />
          <div className="reveal">
            <div className="eyebrow">Nervous and anxious patients</div>
            <h2>Scared of the dentist? You&apos;re exactly who we&apos;re <em>best</em> with.</h2>
            <p style={{ marginTop: '24px', fontSize: '18.5px', maxWidth: '34em' }}>
              We take things slowly, explain everything clearly, and you can stop at any time. No judgement. No pressure.
            </p>
            <div style={{ marginTop: '36px' }}>
              <Link href="/nervous-patients" className="btn btn-clay nervous-cta">See how we help nervous patients</Link>
            </div>
          </div>
        </div>
      </section>


      {/* TEAM */}
      {/* .team-row — the group shot and the four portraits as one row, shared
          with /new-patient-comprehensive-care-visit, which shows the same five
          photographs. The group frame takes whatever width the four pinned
          portraits leave it; see the rules in globals.css. */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">The people who&apos;ll care for you</div>
            <h2>A gentle team you&apos;ll get to <em>know</em></h2>
          </div>
          <div className="team-row reveal">
            {/* The team stands across the lower two thirds of this photograph —
                everything above them is shopfront. 80% pulls the crop down so
                the row of people fills the frame, heads to feet. */}
            <div className="team-row-group">
              <Photo
                src="/assets/shared/meet-our-team.webp"
                alt="The East St Kilda Dental team standing together outside the clinic entrance"
                objectPosition="center 60%"
                sizes="(max-width: 900px) 100vw, 34vw"
              />
              <h4>Our team</h4>
              <span>Caring for St Kilda East since 1980</span>
            </div>
            {/* display:contents above 600px, so these four stay direct grid
                items of .team-row; on a phone the wrapper becomes the snap
                scroller the dots below drive. */}
            <div className="team-row-people" id="home-team">
            <div className="team-member">
              <Photo
                src="/assets/team/anbar-ganatra.webp"
                alt="Dr Anbar Ganatra – Cosmetic & General Dentist"
                objectPosition="center top"
                sizes="(max-width: 900px) 50vw, 198px"
              />
              <h4>Dr Anbar Ganatra</h4>
              <span>Cosmetic &amp; General Dentist</span>
            </div>
            <div className="team-member">
              <Photo
                src="/assets/team/edmund-goldman.webp"
                alt="Dr Edmund Goldman – Dentist"
                objectPosition="center top"
                sizes="(max-width: 900px) 50vw, 198px"
              />
              <h4>Dr Edmund Goldman</h4>
              <span>Dentist</span>
            </div>
            <div className="team-member">
              <Photo
                src="/assets/team/jarrod-dean.webp"
                alt="Dr Jarrod Dean – Dentist"
                objectPosition="center top"
                sizes="(max-width: 900px) 50vw, 198px"
              />
              <h4>Dr Jarrod Dean</h4>
              <span>Dentist</span>
            </div>
            <div className="team-member">
              <Photo
                src="/assets/team/michelle-callaghan.webp"
                alt="Michelle Callaghan – Hygienist"
                objectPosition="40% 95%"
                sizes="(max-width: 900px) 50vw, 198px"
              />
              <h4>Michelle Callaghan</h4>
              <span>Hygienist</span>
            </div>
            </div>
          </div>
          {/* Phone only — display:none from 601px up. */}
          <CarouselNav targetId="home-team" count={4} itemSelector=".team-member" className="team-nav" />
          <div className="team-row-cta reveal">
            <Link href="/about/our-team" className="btn btn-ghost">Meet Our Team</Link>
          </div>
          {/* <div className="lang-band reveal">
            <b>We speak your language.</b> Our team can care for you in English, Mandarin, Hebrew, Russian, Hindi, Tamil and Kannada.
          </div> */}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="sec alt">
        <div className="container story-grid">
          <div className="reveal">
            <div className="eyebrow">Here for the long run</div>
            <h2>Four decades of <em>caring</em> for families</h2>
            {/* Two versions of the same paragraph, one shown per breakpoint:
                the full story reads well beside the photo on a wide screen, but
                costs most of a phone screen on its own. */}
            <p className="story-copy-full">East St Kilda Dental has cared for this neighbourhood since around 1980. We&apos;ve looked after children who now bring their own children, and patients who send us their parents, their partners and their friends. The same families have trusted us for decades, and most of our new patients still arrive because someone told a friend.</p>
            <p className="story-copy-short">East St Kilda Dental has cared for local families since around 1980, with generations of patients continuing to trust us with their care.</p>
            <div className="story-stats">
              <div><b>40+</b><span>years in St Kilda</span></div>
              <div><b>3 gen.</b><span>of local families</span></div>
              <div><b>Decades</b><span>of trust, built through word of mouth</span></div>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/home/heritage.webp"
            alt="Three generations of a family embracing and laughing together"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* INSURANCE */}
      <section className="sec sage-bg" style={{ textAlign: 'center' }}>
        <div className="container reveal">
          <div className="eyebrow">Using your health fund</div>
          <div className="fundfit">
            <h2 style={{ marginTop: '12px' }}>We welcome patients from <em>all</em> major health funds</h2>
          </div>
          <p style={{ maxWidth: '36em', margin: '14px auto 0' }}>
            On-the-spot HICAPS claims for eligible health funds.
          </p>
          <HealthFundLogos />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div className="ins-pill">On-the-spot HICAPS claiming · Medicare CDBS for eligible kids</div>
          </div>
        </div>
      </section>

      {/* FEES */}
      {/* Plain `.sec`, not `.sec.alt`. Education directly below is white, and
          with Fees white as well the page ran as one unbroken white column
          from the health-fund band all the way to the areas grid — the only
          place on the page where two neighbouring sections shared a ground.
          Flipping this one restores the alternation for the whole tail, and it
          is the right one to flip: Fees is an image-led split with nothing on
          it that needs a white ground to lift off, while the white article
          cards below and the white suburb pills further down both do. */}
      <section className="sec">
        <div className="container fees-grid">
          <div className="reveal">
            <div className="eyebrow">Honest about cost</div>
            <h2>Know the cost <em>before</em> you decide</h2>
            <p>One of the most stressful parts of the dentist is not knowing what it&apos;ll cost. We do things differently. You&apos;ll always get a clear written estimate before any treatment, and the time to think it over.</p>
            <ul className="fees-list-v2">
              <li>A clear, written care plan and quote, every time</li>
              <li>Payment plan options to spread larger treatment</li>
              <li>All the time you need to think it over, with no rush</li>
            </ul>
            <div style={{ marginTop: '26px' }}>
              <Link href="/fees" className="btn btn-ghost">See our fees &amp; payment options</Link>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/home/honest-about-cost.webp"
            alt="A friendly receptionist smiling while helping a patient at the front desk"
          />
        </div>
      </section>

      {/* FAQ */}
      {/* <section className="sec" id="faq">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">The quiet questions</div>
            <h2>Things you might be wondering</h2>
          </div>
          <div className="faq-v2 reveal">
            {faqs.map(({ q, a }, i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section> */}

      {/* GALLERY */}
      {/* <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Real smiles</div>
            <h2 style={{ fontSize: 'clamp(38px, 4.8vw, 62px)' }}>Gentle, natural-looking results</h2>
          </div>
          <div className="edu-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="svc reveal">
              <Photo src="/assets/gallery/smile-1.webp" alt="Before and after of a gentle smile refresh at East St Kilda Dental" hint="Before / after (understated)" sizes="(max-width: 820px) 100vw, 50vw" style={{ height: '140px', marginBottom: '12px' }} />
              <h4>Gentle smile refresh</h4>
            </div>
            <div className="svc reveal">
              <Photo src="/assets/gallery/smile-2.webp" alt="Before and after of a damaged tooth restored with a crown" hint="Real smile, real patient" sizes="(max-width: 820px) 100vw, 50vw" style={{ height: '140px', marginBottom: '12px' }} />
              <h4>Restoring a damaged tooth</h4>
            </div>
            <div className="svc reveal">
              <Photo src="/assets/gallery/smile-3.webp" alt="Before and after of a missing tooth replaced with a single implant" hint="Subtle, natural result" sizes="(max-width: 820px) 100vw, 50vw" style={{ height: '140px', marginBottom: '12px' }} />
              <h4>Replacing a missing tooth</h4>
            </div>
            <div className="svc reveal">
              <Photo src="/assets/gallery/smile-4.webp" alt="A once-nervous patient smiling comfortably after treatment" hint="Everyday result" sizes="(max-width: 820px) 100vw, 50vw" style={{ height: '140px', marginBottom: '12px' }} />
              <h4>A nervous patient's journey</h4>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }} className="reveal">
            <Link href="/our-work" className="btn btn-ghost">View more</Link>
          </div>
        </div>
      </section> */}

      {/* EDUCATION */}
      <section className="sec alt" id="education">
        <div className="container">
          <div className="sec-head reveal">
            <div className="eyebrow">Learn at your own pace, no appointment needed</div>
            {/* Same one-line treatment as the Areas heading — see .oneline-head. */}
            <h2 className="oneline-head">Answers to the things you&apos;ve been <em>wondering</em></h2>
            <p style={{ marginTop: '14px', fontSize: '18px' }}>
              Clear, judgement-free guides to the questions we hear most, from bleeding gums to nervous visits. Understanding your mouth is the first step to looking after it.
            </p>
          </div>
          {/* id + .svc are the contract with CarouselNav below: on a phone
              this grid becomes a snap-scrolling row and the dots track it. */}
          <div className="edu-grid" id="home-learn">
            <Link
              href="/learn/havent-been-to-the-dentist-in-years"
              className="svc reveal"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <Photo
                src="/assets/articles/article-1.webp"
                alt="Dentist explaining an X-ray to a patient in the chair"
                hint="Article image"
                sizes="(max-width: 820px) 100vw, 33vw"
                style={{ height: '140px', marginBottom: '12px' }}
              />
              <span style={{ fontSize: '12.5px', color: 'var(--clay-deep)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Nervous patients
              </span>
              <h4>Haven&apos;t been in years? Here&apos;s exactly what to expect.</h4>
              <p>A calm, step-by-step walk-through for an easier return.</p>
              <span style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '15px' }}>
                Read article &rarr;
              </span>
            </Link>
            <Link
              href="/learn/bleeding-gums"
              className="svc reveal"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <Photo
                src="/assets/articles/article-2.webp"
                alt="Dentist using a dental model to explain gum health to a patient"
                hint="Article image"
                sizes="(max-width: 820px) 100vw, 33vw"
                style={{ height: '140px', marginBottom: '12px' }}
              />
              <span style={{ fontSize: '12.5px', color: 'var(--clay-deep)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Gum health
              </span>
              <h4>Why are my gums bleeding?</h4>
              <p>What bleeding gums are trying to tell you, and when to act.</p>
              <span style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '15px' }}>
                Read article &rarr;
              </span>
            </Link>
            <Link
              href="/learn/how-often-should-you-see-the-dentist"
              className="svc reveal"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <Photo
                src="/assets/articles/article-3.webp"
                alt="Patient receiving a dental check-up in the clinic"
                hint="Article image"
                sizes="(max-width: 820px) 100vw, 33vw"
                style={{ height: '140px', marginBottom: '12px' }}
              />
              <span style={{ fontSize: '12.5px', color: 'var(--clay-deep)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Prevention
              </span>
              <h4>How Often Should You Really See the Dentist?</h4>
              <p>What actually determines your ideal check-up schedule.</p>
              <span style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '15px' }}>
                Read article &rarr;
              </span>
            </Link>
          </div>
          {/* Phone only — display:none from 601px up. */}
          <CarouselNav targetId="home-learn" count={3} itemSelector=".svc" className="edu-nav" />
          <div style={{ textAlign: 'center', marginTop: '32px' }} className="reveal">
            <Link href="/learn" className="btn btn-ghost">Browse the full library</Link>
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="sec" id="areas">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Your local dentist in Melbourne&apos;s inner south-east</div>
            {/* nowrap + a purely viewport-derived size: the .sec-head 46em cap
                would otherwise break this over two lines. min() keeps it from
                growing past the 1180px container on wide screens, and
                .oneline-head drops back to a wrapping size below 820px. */}
            <h2 className="oneline-head">Wherever you are, you&apos;re <em>welcome</em> here</h2>
            <p style={{ marginTop: '14px', fontSize: '18px', maxWidth: '40em', margin: '14px auto 0' }}>
              Find your suburb below, or get directions straight to our door in Google or Apple Maps, from wherever you&apos;re starting.
            </p>
          </div>
          {/* Every suburb here has its own page, generated from data/suburbs.ts.
              Add a suburb there and it appears in this grid and the sitemap. */}
          <div className="areas-grid reveal">
            <Link href="/">St Kilda East</Link>
            {suburbs.map((s) => (
              <Link key={s.slug} href={suburbPath(s.slug)}>{s.name}</Link>
            ))}
          </div>
          <p className="areas-wider reveal">
            We also welcome patients from across the wider inner-Melbourne area, from Brighton and Bentleigh to South Melbourne, Richmond and beyond.
          </p>
        </div>
      </section>

      {/* LOCATION */}
      <section className="sec alt" id="location">
        <div className="container">
          <div className="sec-head reveal">
            <div className="eyebrow">Finding us</div>
            <h2>Easy to get to, easy to park</h2>
          </div>
          <div className="loc-grid">
            {/* No inline min-height: the frame is sized by .loc-grid .ph in
                globals.css, which an inline style would pin past every
                breakpoint step-down. */}
            <MapEmbed
              className="ph reveal"
              title={`Map to ${business.name}, ${fullAddress}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${business.name}, ${fullAddress}`)}&output=embed`}
            />
            <div className="reveal">
              <p style={{ marginBottom: '6px' }}><b style={{ color: 'var(--ink)' }}>{fullAddress}</b></p>
              <p style={{ fontSize: '15.5px', marginBottom: '22px' }}>
                Off-street parking off Orrong Road · Trams 5 &amp; 64 and bus 220 nearby · Armadale station a 10–15 min walk · Wheelchair accessible
              </p>
              {/* The same four facts as the line above, cut to a length that
                  fits one line beside the map. Phone only — display:none from
                  601px up, where the sentence above is what shows. Same
                  technique as .story-copy-full / .story-copy-short. */}
              <ul className="loc-points">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 16.5h14M6.5 16.5V19H4.8v-2.5M17.5 16.5V19h1.7v-2.5" />
                    <path d="M4.5 16.5v-4l1.8-4.3A1.6 1.6 0 0 1 7.8 7h8.4a1.6 1.6 0 0 1 1.5 1.2l1.8 4.3v4Z" />
                    <path d="M7 13.6h.01M17 13.6h.01" />
                  </svg>
                  Off-street parking
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="6" y="3.5" width="12" height="13" rx="2.5" />
                    <path d="M6 9.5h12M9.5 3.5V2M14.5 3.5V2M8.5 20l1.8-3.5M15.5 20l-1.8-3.5M7 20h10" />
                    <path d="M9.5 13h.01M14.5 13h.01" />
                  </svg>
                  Trams 5 &amp; 64 nearby
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 4.5c-3.6 0-6.5 1-6.5 3.5v6a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5V8c0-2.5-2.9-3.5-6.5-3.5Z" />
                    <path d="M6.5 10.5h13M10 20l-1.5-3.5M16 20l1.5-3.5M9 20h7" />
                    <path d="M10 13.6h.01M16 13.6h.01" />
                  </svg>
                  Near Armadale station
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="4.5" r="1.8" />
                    <path d="M9 8.2h6M12 8v5.5h4.2l2 5.5M12 13.5H9.2a3.6 3.6 0 1 0 3.4 4.7" />
                  </svg>
                  Wheelchair accessible
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 9.5h18M9.5 3v18" />
                    <path d="M14.5 3v3.5M14.5 14v7M3 14h3.5" />
                  </svg>
                  Cnr Dandenong &amp; Orrong
                </li>
              </ul>
              <p style={{ fontSize: '15.5px', marginBottom: '22px' }}>
                On the corner of Dandenong and Orrong Roads, easy to reach by car, tram or train.
              </p>
              <ul className="hours-list">
                <li><span>Monday</span><b>8.30am – 5.00pm</b></li>
                <li><span>Tuesday – Wednesday</span><b>8.30am – 6.00pm</b></li>
                <li><span>Thursday – Friday</span><b>8.30am – 5.00pm</b></li>
                <li><span>Saturday</span><b>9.00am – 4.00pm</b></li>
                <li><span>Sunday</span><b>Closed</b></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH */}
      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
