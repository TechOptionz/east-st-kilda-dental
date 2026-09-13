import type { Metadata } from 'next'
import Link from 'next/link'
import GetInTouch from '@/components/GetInTouch'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import { withSocial } from '@/lib/seo'
import {
  SCHEMA_ID,
  SITE_URL,
  business,
  clinicianId,
  clinicianJobTitle,
  telHref,
} from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Meet Our Team | East St Kilda Dental',
  description:
    'A warm, experienced team who genuinely care, and who\'ll remember you next time. Meet the dentists and support team at East St Kilda Dental.',
  alternates: { canonical: `${SITE_URL}/about/our-team` },
})

/**
 * The clinical team, in the order shown on the page.
 *
 * `slug` is not decoration: it is the fragment in each person's @id, so the
 * four clinicians who also appear on the home page must keep the slugs
 * lib/business.ts uses, or their two nodes stop being the same entity.
 */
const clinicians = [
  {
    slug: 'anbar-ganatra',
    name: 'Dr Anbar Ganatra',
    role: 'Cosmetic & General Dentist',
    bio: 'Anbar leads the practice with a calm, gentle, no-judgement approach, and is known for putting nervous patients at ease.',
    image: '/assets/team/anbar-ganatra.webp',
  },
  {
    slug: 'edmund-goldman',
    name: 'Dr Edmund Goldman',
    role: 'Dentist',
    bio: 'Edmund has cared for local families on this corner for decades, with a focus on rebuilding and replacing teeth.',
    image: '/assets/team/edmund-goldman.webp',
  },
  {
    slug: 'jarrod-dean',
    name: 'Dr Jarrod Dean',
    role: 'Dentist',
    bio: 'Jarrod provides gentle, thorough general and family dentistry across the practice.',
    image: '/assets/team/jarrod-dean.webp',
  },
  {
    slug: 'marina-bekheet',
    name: 'Dr Marina Bekheet',
    role: 'General Dentist',
    bio: 'Marina offers warm, careful general dentistry and takes the time to explain every step.',
    image: '/assets/team/marina-bakheet.webp',
  },
  {
    slug: 'michelle-callaghan',
    name: 'Michelle Callaghan',
    role: 'Hygienist',
    bio: 'Michelle looks after gum health and preventive care with a light, reassuring touch.',
    image: '/assets/team/michelle-callaghan.webp',
  },
  {
    slug: 'beverly-spector',
    name: 'Beverly Spector',
    role: 'Hygienist',
    bio: 'Beverly helps keep your teeth and gums healthy with gentle, attentive cleans.',
    image: '/assets/team/beverly-spector.webp',
  },
]

const practiceTeam = [
  {
    name: 'Daniel Loh',
    role: 'Practice Manager',
    bio: 'Daniel keeps the practice running smoothly and looks after your experience from first call to follow-up.',
    image: '/assets/team/daniel-loh2.webp',
  },
  {
    name: 'Michelle Mirjam',
    role: 'Dental Assistant & Receptionist',
    bio: 'Michelle welcomes you at reception and supports your care chairside.',
    image: '/assets/team/michelle-mirjam.webp',
  },
  {
    name: "Indiana O'Connor",
    role: 'Dental Assistant & Receptionist',
    bio: 'Indiana helps every visit run smoothly, from the front desk to the chair.',
    image: '/assets/team/indiana-oconnor.webp',
  },
  {
    name: 'Maddy Coventry',
    role: 'Dental Assistant & Receptionist',
    bio: "Maddy is one of the friendly faces who'll greet you and assist during your visit.",
    image: '/assets/team/maddy-coventry.webp',
  },
]

const TEAM_URL = `${SITE_URL}/about/our-team`

// This page holds the @id anchors for the clinician nodes the home page graph
// references, so it is the natural place to describe them properly: the four on
// the home page are the same nodes, restated here with a photo, a bio and a
// URL, and the two who are not on the home page are declared here for the first
// time.
//
// jobTitle comes from lib/business.ts wherever that file pins one, so the
// markup keeps the cautious title even where the visible card is warmer — see
// the note on Dr Goldman there.
//
// The practice team below is deliberately left out of the markup: the graph
// names the people whose professional identity is part of the entity, and
// reception and assisting roles are not that.
const teamSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': SCHEMA_ID.teamPage,
      url: TEAM_URL,
      name: 'Meet Our Team',
      description:
        `The dentists, hygienists and practice team at ${business.name} in ` +
        `${business.address.addressLocality}.`,
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': SCHEMA_ID.practice },
      inLanguage: 'en-AU',
    },
    // A reference to the practice node, not a second copy of it: this page is
    // where the full clinical roster is listed, so it is where employee belongs.
    {
      '@type': 'Dentist',
      '@id': SCHEMA_ID.practice,
      name: business.name,
      employee: clinicians.map(c => ({ '@id': clinicianId(c.slug) })),
    },
    ...clinicians.map(c => ({
      '@type': 'Person',
      '@id': clinicianId(c.slug),
      name: c.name,
      jobTitle: clinicianJobTitle(c.slug) ?? c.role,
      description: c.bio,
      image: `${SITE_URL}${c.image}`,
      url: clinicianId(c.slug),
      worksFor: { '@id': SCHEMA_ID.practice },
    })),
  ],
}

export default function AboutTeamPage() {
  return (
    <main>
      <JsonLd data={teamSchema} />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">Meet our team</div>
            <h1>The people who&apos;ll <em>look after you</em></h1>
            <p className="lead">
              A warm, experienced team who genuinely care, and who&apos;ll remember you next time. Here&apos;s who you&apos;ll meet.
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/shared/meet-our-team.webp"
            alt="Group photo of the team"
            hint="Warm, real group photo of the team. Never stock."
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── DENTISTS & CLINICIANS ─────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Your clinical care</div>
            <h2>Dentists &amp; clinicians</h2>
          </div>
          <div className="team-grid reveal">
            {/* 280px, not the 150px these cards used to use. At 150 the frame is
                a ~2.5:1 letterbox, and anbar-ganatra's portrait-orientation
                source (0.70:1) renders her head about 207px tall at the card's
                width — taller than the frame itself, so it cropped to her
                forehead. Raising the height for the whole row fixes that
                without leaving one card taller than the two beside it. */}
            {clinicians.map((member, i) => (
              // id matches the fragment in clinicianId(), so a link to
              // /about/our-team#<slug> lands on the card its Person node names.
              <div key={i} id={member.slug} className="svc" style={{ scrollMarginTop: '110px' }}>
                <Photo
                  src={'image' in member ? (member.image as string) : undefined}
                  hint={`Warm, real photo of ${member.name}. Never stock.`}
                  alt={`Photo of ${member.name}`}
                  sizes="(max-width: 768px) 100vw, 300px"
                  objectPosition="center top"
                  style={{ height: '280px', marginBottom: '12px' }}
                />
                <h4 style={{ marginBottom: '2px' }}>{member.name}</h4>
                <p style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '14px', margin: '2px 0 8px' }}>{member.role}</p>
                <p style={{ fontSize: '15px', margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICE TEAM ─────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Behind the scenes</div>
            <h2>Our practice team</h2>
          </div>
          <div className="team-grid reveal">
            {practiceTeam.map((member, i) => (
              <div key={i} className="svc">
                <Photo
                  src={'image' in member ? (member.image as string) : undefined}
                  hint={`Warm, real photo of ${member.name}. Never stock.`}
                  alt={`Photo of ${member.name}`}
                  sizes="(max-width: 768px) 100vw, 300px"
                  objectPosition="center top"
                  style={{ height: '150px', marginBottom: '12px' }}
                />
                <h4 style={{ marginBottom: '2px' }}>{member.name}</h4>
                <p style={{ color: 'var(--clay)', fontWeight: 600, fontSize: '14px', margin: '2px 0 8px' }}>{member.role}</p>
                <p style={{ fontSize: '15px', margin: 0 }}>{member.bio}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── KEEP EXPLORING ───────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow">More about us</div>
          <h2>Get to know us</h2>
          <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/about/our-story" className="btn btn-ghost">Our story</Link>
            <Link href="/about/why-were-different" className="btn btn-ghost">Why we&apos;re different</Link>
            <Link href="/online-booking" className="btn">Book your visit</Link>
          </div>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
