import type { Metadata } from 'next'
import Link from 'next/link'
import GetInTouch from '@/components/GetInTouch'
import Photo from '@/components/Photo'
import { withSocial } from '@/lib/seo'
import { business, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Our Story | East St Kilda Dental',
  description:
    'East St Kilda Dental began around 1980. Led for over thirty years by Dr Eddie Goldman, and now by Dr Anbar Ganatra — same corner, same heart.',
  alternates: { canonical: `${SITE_URL}/about/our-story` },
})

export default function AboutStoryPage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal">
            <div className="eyebrow">Our story</div>
            <h1>Four decades on the <em>same corner</em></h1>
            <p className="lead">
              Every long-standing practice has a story. Ours began around 1980, on the corner of Dandenong and Orrong Roads, and it&apos;s still being written by the same neighbourhood today.
            </p>
            <div className="hero-cta">
              <Link href="/online-booking" className="btn">Book your visit</Link>
              <a href={telHref} className="btn btn-ghost">Call {business.telephoneDisplay}</a>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            src="/assets/about/our-story-clinic-corner.webp"
            alt="The East St Kilda Dental clinic on the corner of Dandenong Rd, its sign out front beside the street sign"
            objectPosition="48% center"
            hint="Warm, real hero photo of the clinic exterior on the corner, with local character. Never stock."
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── CHAPTER ONE ──────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="band reveal">
            <Photo
              src="/assets/about/our-story-hero2.webp"
              alt="Image of the clinic exterior on the corner"
              hint="Warm, real photo: the building or street today, or an early/archival image if one exists. Never stock."
              sizes="(max-width: 860px) 100vw, 48vw"
              style={{ minHeight: '320px' }}
            />
            <div className="bandtext">
              <div className="eyebrow">Chapter one</div>
              <h2>Where it began</h2>
              <p>
                Around 1980, a small dental practice opened on the corner of Dandenong and Orrong Roads. It set out to do something quietly unfashionable: look after local families properly, and stay long enough to watch them grow up. Decade after decade, that&apos;s exactly what happened.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER TWO ──────────────────────────────────── */}
      <section className="sec alt">
        <div className="container">
          <div className="band rev reveal">
            <Photo
               src="/assets/team/edmund-goldman.webp"
               alt="Dr Edmund Goldman smiling in the clinic"
               hint="Warm, real photo of Dr Eddie Goldman, or a long-standing patient or family. Never stock."
               sizes="(max-width: 860px) 100vw, 48vw"
               style={{ minHeight: '320px' }}
               objectPosition="center 38%"
            />
            <div className="bandtext">
              <div className="eyebrow">Chapter two</div>
              <h2>The Goldman years</h2>
              <p>
                For more than thirty of those years, the practice was cared for by Dr Eddie Goldman. He became the familiar face people trusted, the dentist who had seen their parents, then them, and in time their children. That kind of continuity is almost unheard of, and it&apos;s the reason generations of St Kilda East families still think of this as their dental home.
              </p>
              <p>
                Eddie still sees patients here today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER THREE ────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          <div className="band reveal">
            {/* Hers is a tall portrait (591×842) in a wide band, so cover trims it
                hard vertically and centring cut the top of her head off. 15%
                keeps the whole head in, with a little air above it. */}
            <Photo
               src="/assets/team/anbar-ganatra.webp"
               alt="Dr Anbar Ganatra smiling in the clinic"
               hint="Warm, real photo of Dr Anbar with a patient, gentle and reassuring. Never stock"
               sizes="(max-width: 860px) 100vw, 48vw"
               style={{ minHeight: '320px' }}
               objectPosition="center 15%"
            />
            <div className="bandtext">
              <div className="eyebrow">Chapter three</div>
              <h2>Today, a new chapter</h2>
              <p>
                The practice is now led by Dr Anbar Ganatra, who carries the same warmth forward while raising the standard of care. The shift is gentle but real: away from rushed, patch-it-and-move-on dentistry, and toward calm, comprehensive care planned for the long term, with the time to explain things properly. Same corner, same heart, a higher standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── IN OUR WORDS ─────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal">
          <div className="pqfit">
            <p className="pq">
              <span className="mk">&ldquo;</span>Generations of local families have trusted us. We intend to keep it that way.<span className="mk">&rdquo;</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── BY THE NUMBERS ───────────────────────────────── */}
      <section className="sec">
        <div className="container reveal">
          <div className="stats">
            <div className="st">
              <div className="n">40+</div>
              <div className="l">Years on the same corner</div>
            </div>
            <div className="st">
              <div className="n">1980</div>
              <div className="l">Where our story began</div>
            </div>
            <div className="st">
              <div className="n">Generations</div>
              <div className="l">Of local families cared for</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KEEP EXPLORING ───────────────────────────────── */}
      <section className="sec alt">
        <div className="container reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Keep exploring</div>
          <h2>Get to know us</h2>
          <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/about/our-team" className="btn btn-ghost">Meet our team</Link>
            <Link href="/about/why-were-different" className="btn btn-ghost">Why we&apos;re different</Link>
            <Link href="/nervous-patients" className="btn btn-ghost">Nervous patients</Link>
          </div>
        </div>
      </section>

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
