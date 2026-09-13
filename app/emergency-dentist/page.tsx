import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import type { Crumb } from '@/components/Breadcrumb'
import FaqAnswer from '@/components/FaqAnswer'
import GetInTouch from '@/components/GetInTouch'
import Ico, { type IconName } from '@/components/LineIcon'
import JsonLd from '@/components/JsonLd'
import Photo from '@/components/Photo'
import StickyCallBar from '@/components/StickyCallBar'
import { faqPlainText } from '@/data/dental-faqs'
import { personNode, practiceNode } from '@/lib/schema'
import { withSocial } from '@/lib/seo'
import {
  SCHEMA_ID,
  SITE_URL,
  areasServed,
  business,
  clinicians,
  openingHours,
  streetAddress,
  telHref,
} from '@/lib/business'

const PAGE_URL = `${SITE_URL}/emergency-dentist`

const TITLE = 'Emergency Dentist St Kilda East | Same-Day Dental Care'
const DESCRIPTION =
  `Dental emergency in St Kilda East? Call ${business.telephoneDisplay} for same-day emergency appointments. Toothache, swelling, broken or knocked-out teeth — we're here for you.`

export const metadata: Metadata = withSocial({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
})

/**
 * Clinical review.
 *
 * `reviewer` is a clinician slug from lib/business.ts, or null until the
 * practice confirms which dentist has read and signed off this page. Until then
 * the page shows only when it was last updated: "Clinically reviewed by" is a
 * professional claim and is not published on a guess. Setting it adds the
 * byline, switches the label to "Last reviewed", and adds reviewedBy and
 * lastReviewed to the MedicalWebPage node.
 */
const REVIEW: { reviewer: string | null; label: string; iso: string } = {
  reviewer: null,
  label: 'September 2026',
  iso: '2026-09-13',
}
const reviewer = REVIEW.reviewer ? clinicians.find((c) => c.slug === REVIEW.reviewer) : undefined

/** The authorities the first-aid and urgency guidance on this page follows. */
const SOURCES = [
  { label: 'Australian Dental Association (teeth.org.au): Dental trauma', href: 'https://www.teeth.org.au/dental-trauma' },
  { label: 'Healthdirect Australia: Dental injury', href: 'https://www.healthdirect.gov.au/dental-injury' },
  { label: 'Healthdirect Australia: Toothache and gum swelling', href: 'https://www.healthdirect.gov.au/toothache-and-gum-swelling' },
]

const saturday = openingHours.find((h) => (h.days as readonly string[]).includes('Saturday'))
/** "09:00" → "9am", "16:30" → "4:30pm" */
const clock = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''}${suffix}`
}

/**
 * The one paragraph an answer engine should lift whole: what, which conditions,
 * when and where. The address comes from lib/business.ts; the Service node
 * below uses the same sentence as its description.
 */
const directAnswer =
  `${business.name} provides urgent dental appointments for toothache, swelling, broken or knocked-out teeth, lost fillings or crowns and dental trauma. We keep emergency appointments available Monday to Saturday and offer same-day care where possible at ${streetAddress}, ${business.address.addressLocality}.`

/**
 * "Is this a dental emergency?" — symptom against action, most to least
 * routine. A real <table>, because a table is what this is: the pairing of each
 * row is the information.
 */
const urgency: { level: 'routine' | 'prompt' | 'urgent' | 'hospital'; symptoms: string; action: string }[] = [
  { level: 'routine', symptoms: 'Mild sensitivity or a small chip without pain', action: 'Book an assessment' },
  { level: 'prompt', symptoms: 'Persistent toothache, pain when biting, or a lost filling or crown', action: 'Contact a dentist promptly' },
  { level: 'urgent', symptoms: 'Severe pain, facial or gum swelling, or a knocked-out adult tooth', action: 'Seek urgent dental care' },
  { level: 'hospital', symptoms: 'Trouble breathing or swallowing, uncontrolled bleeding, or a major facial injury', action: 'Call 000 or go to a hospital emergency department' },
]

/**
 * First aid, as question-and-answer pairs.
 *
 * One source for the visible cards AND the FAQ schema. Answers use the
 * [text](href) link markup from data/dental-faqs.ts, so the treatment links sit
 * inside the sentence that mentions the treatment, and the schema gets the same
 * words with the link syntax stripped.
 */
const firstAid: { q: string; a: string }[] = [
  {
    q: 'What should I do if a tooth is knocked out?',
    a: "If an adult tooth is knocked out, act immediately. Hold it by the crown, not the root. If dirty, gently rinse it in milk or saline — don't scrub it. If possible, place it back into the socket. Otherwise keep it in milk and see a dentist as quickly as possible, ideally within 30 minutes.",
  },
  {
    q: 'What should I do for a bad toothache?',
    a: 'Rinse with warm, salty water and take your usual pain relief. Avoid very hot, cold or sweet food. Then call us. A toothache that keeps coming back can mean the nerve is inflamed or infected, which may need [root canal treatment](/services/root-canal).',
  },
  {
    q: 'What should I do for a broken or chipped tooth?',
    a: 'Save any pieces, rinse your mouth with warm water, and press clean gauze on any bleeding. Call us to be seen. Depending on the damage, a broken tooth may be repaired with a [filling](/services/fillings) or protected with a [crown](/services/crowns-and-bridges).',
  },
  {
    q: 'What should I do about facial or gum swelling?',
    a: 'Swelling of the gum, jaw or face can be a sign of infection. Call us the same day so we can act quickly. If swelling is affecting breathing or swallowing, spreading towards the eye or neck, or you feel seriously unwell, call 000 or seek emergency medical care.',
  },
  {
    q: 'What should I do if I lose a filling or crown?',
    a: "Keep the crown if you have it, and avoid chewing on that side. Call us and we'll check whether it can be re-secured or needs replacing. Our [crowns & bridges](/services/crowns-and-bridges) page explains the options.",
  },
  {
    q: 'What should I do if a baby tooth is knocked out?',
    a: 'Do not put a baby tooth back in. Keep your child calm, bring the tooth with you, and call us for advice.',
  },
]

/**
 * Emergency questions, each rendered as its own H3 with the answer directly
 * beneath it. Same markup as firstAid; same array feeds the FAQPage node.
 */
const faq: { q: string; a: string }[] = [
  {
    q: 'What counts as a dental emergency?',
    a: 'A dental emergency is a problem that needs prompt care to relieve severe pain, control infection or bleeding, or save a tooth. Common examples are severe or persistent toothache, facial or gum swelling, a knocked-out or broken adult tooth, a lost filling or crown causing pain, and injuries to the mouth. If swelling affects your breathing or swallowing, call 000.',
  },
  {
    q: 'Can an emergency dentist see me today?',
    a: `Often, yes. We keep emergency appointments available Monday to Saturday and offer same-day care where possible. Call us as early in the day as you can on ${business.telephoneDisplay} and describe your symptoms, so the team can work out how urgently you need to be seen and find the soonest suitable time.`,
  },
  {
    q: 'Should I go to a dentist or hospital for a dental emergency?',
    a: "Most dental emergencies, such as toothache, a broken tooth or a lost crown, are best treated by a dentist. Call 000 or go to a hospital emergency department if you have trouble breathing or swallowing, bleeding that won't stop, a major facial injury, or swelling spreading towards your eye or neck, or if you feel seriously unwell.",
  },
  {
    q: 'What happens at an emergency dental appointment?',
    a: "Your dentist will find the source of the problem by examining the tooth and surrounding tissues, with an X-ray where needed. The first priority is to relieve pain, control infection or stabilise the tooth. We'll explain what we found, your treatment options and the costs before anything goes ahead, and plan any follow-up care with you.",
  },
  {
    q: 'Can an emergency dentist remove a tooth on the same day?',
    a: "Sometimes. If [removing the tooth](/services/extractions-wisdom-teeth) is the most appropriate treatment and it can be done safely, it may be possible at the same appointment. In other cases your dentist may first relieve the pain or treat infection, then remove or save the tooth at a follow-up visit. Where a tooth can be saved, we'll explain that option too.",
  },
  {
    q: 'What should I do if my face is swollen from a tooth?',
    a: 'Call us the same day. Facial swelling from a tooth is often a sign of infection that needs prompt treatment. If the swelling is affecting your breathing or swallowing, spreading towards your eye or neck, or you feel seriously unwell, call 000 or go to a hospital emergency department straight away rather than waiting for a dental appointment.',
  },
  {
    q: 'What should I do if my tooth is knocked out?',
    a: "Act immediately. Hold the tooth by the crown, not the root, and don't scrub it. If it's dirty, rinse it gently in milk or saline. If you can, put it back in the socket and bite gently on a clean cloth. Otherwise keep it in milk and see a dentist as quickly as possible, ideally within 30 minutes.",
  },
  {
    q: 'Can I see an emergency dentist on Saturday?',
    a: `Yes. We're open on Saturdays${saturday ? ` from ${clock(saturday.opens)} to ${clock(saturday.closes)}` : ''} and keep emergency appointments available, with same-day care where possible. Call us in the morning on ${business.telephoneDisplay} to find the soonest time. If a serious problem happens outside our opening hours, such as swelling affecting your breathing, call 000 or go to a hospital emergency department.`,
  },
  {
    q: 'Can I use private health insurance for emergency dental treatment?',
    a: "Yes, if your extras cover includes dental. We can process eligible claims on the spot through [HICAPS](/fees#funds), so you pay only the gap on the day. Your rebate depends on your fund, policy and level of cover, including any waiting periods or annual limits, so it's worth checking with your fund if you're unsure.",
  },
  {
    q: 'How much does an emergency dentist cost?',
    a: "The cost depends on what's needed: the emergency examination, any X-rays, and the treatment itself, which can range from a temporary filling to root canal treatment or an extraction. We'll tell you the cost of the emergency exam up front and give you an estimate before any treatment goes ahead. [Payment options](/fees#payment) are available.",
  },
  {
    q: "I'm really nervous. Can you still help?",
    a: "Absolutely. Gentle care for anxious patients is one of the things we're known for. Tell us you're nervous when you call, and we'll explain each step before we do it, agree a stop signal, and keep you calm and in control, with happy gas available if it helps. Read more about our care for [nervous patients](/nervous-patients).",
  },
  {
    q: "It's after hours. What should I do?",
    a: "If it's serious — trouble breathing or swallowing, heavy bleeding, a facial injury or spreading swelling — call 000 or go to a hospital emergency department. Otherwise, follow the first-aid steps on this page for your symptom, then call us when we open and we'll fit you in as soon as we can.",
  },
]

/** The three things that happen at an emergency appointment, in order. */
const appointmentSteps: { icon: IconName; title: string; body: string }[] = [
  { icon: 'search', title: 'Find the cause', body: 'An examination of the tooth and surrounding tissues, with an X-ray where needed.' },
  { icon: 'heart', title: 'Relieve and stabilise', body: 'Easing the pain, controlling infection or stabilising the tooth comes first.' },
  { icon: 'chat', title: 'Explain before we proceed', body: 'Your diagnosis, treatment options and costs, before anything goes ahead.' },
]

/** The suburbs named in the service-area line. */
const namedSuburbs = ['St Kilda East', 'St Kilda', 'Balaclava', 'Caulfield', 'Elwood', 'Elsternwick', 'Windsor']

const breadcrumbTrail: Crumb[] = [
  { name: 'Home', href: '/' },
  { name: 'Emergency dentist' },
]

/**
 * Emergency structured data.
 *
 *   MedicalWebPage — the page, with dateModified; reviewedBy and lastReviewed
 *     only once a reviewing clinician is set in REVIEW above.
 *   Dentist        — the practice, shared @id with the home page.
 *   Service        — emergency dental care, available across the practice's
 *     opening hours (Monday to Saturday). Nothing here implies round-the-clock
 *     availability, because we are not.
 *   FAQPage        — every question on the page, from the same arrays that
 *     render it, with link markup stripped.
 *   Person         — the reviewing clinician, when set.
 *
 * The BreadcrumbList is emitted by <BreadcrumbBar>.
 */
const emergencySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalWebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': SCHEMA_ID.emergencyService },
      mainEntity: { '@id': SCHEMA_ID.emergencyFaq },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
      dateModified: REVIEW.iso,
      inLanguage: 'en-AU',
      ...(reviewer
        ? { reviewedBy: { '@id': personNode(reviewer)['@id'] }, lastReviewed: REVIEW.iso }
        : {}),
    },
    practiceNode(),
    {
      '@type': 'Service',
      '@id': SCHEMA_ID.emergencyService,
      serviceType: 'Emergency dental care',
      name: 'Emergency dental care',
      description: directAnswer,
      url: PAGE_URL,
      provider: { '@id': SCHEMA_ID.practice },
      areaServed: areasServed.map((name) => ({ '@type': 'City', name })),
      hoursAvailable: openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...h.days],
        opens: h.opens,
        closes: h.closes,
      })),
    },
    ...(reviewer ? [personNode(reviewer)] : []),
    {
      '@type': 'FAQPage',
      '@id': SCHEMA_ID.emergencyFaq,
      mainEntity: [...faq, ...firstAid].map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: faqPlainText(a) },
      })),
    },
  ],
}

export default function EmergencyPage() {
  return (
    /* .npv for the shared landing-page pieces (the answer card); .emg for the
       rules only this page uses. */
    <main className="npv emg">
      <JsonLd data={emergencySchema} />
      <BreadcrumbBar trail={breadcrumbTrail} id={`${PAGE_URL}#breadcrumb`} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="reveal hero-fit">
            <div className="eyebrow">Dental emergency?</div>
            {/* The search term and suburb as the H1; the emotional line
                directly beneath it, set large but not as a heading. */}
            <h1>Emergency Dentist in <em>St Kilda East</em></h1>
            <p className="emg-subline">In pain? We&apos;ll help you fast.</p>
            <p>
              Dental pain or an injury can be frightening. We keep emergency time available each day so you can get answers and appropriate care quickly. Call us and we&apos;ll talk you through what to do.
            </p>
            <div className="hero-cta">
              <a href={telHref} className="btn">Call {business.telephoneDisplay}</a>
              <Link href="/online-booking" className="btn btn-ghost">Book online</Link>
            </div>
          </div>
          <Photo
            tall
            className="reveal"
            priority
            src="/assets/emergency/emergency-dentistry.webp"
            alt="A friendly team member taking a call at the East St Kilda Dental reception"
            sizes="(max-width: 860px) 100vw, 48vw"
          />
        </div>
      </section>

      {/* ── THE DIRECT ANSWER ───────────────────────────── */}
      <section className="sec npv-answer">
        <div className="container reveal">
          <div className="npv-answer-card">
            <h2>Same-day emergency dental care in St Kilda East</h2>
            <p>{directAnswer}</p>
          </div>
        </div>
      </section>

      {/* ── IS THIS A DENTAL EMERGENCY? ──────────────────── */}
      <section className="sec alt" id="is-it-an-emergency">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Check your symptoms</div>
            <h2>Is this a <em>dental emergency?</em></h2>
          </div>
          <div className="emg-table-wrap reveal">
            <table className="emg-table">
              <thead>
                <tr>
                  <th scope="col">What you&apos;re experiencing</th>
                  <th scope="col">What to do</th>
                </tr>
              </thead>
              <tbody>
                {urgency.map((row) => (
                  <tr key={row.level} className={`emg-row-${row.level}`}>
                    <th scope="row">{row.symptoms}</th>
                    <td><span className="emg-level" aria-hidden="true" />{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="emg-note emg-note-line reveal">
            Not sure how urgent your symptoms are? Call us on <a href={telHref}>{business.telephoneDisplay}</a>, or see our{' '}
            <Link href="/dental-faqs#tooth-pain-emergencies">dental symptoms &amp; urgency guide</Link>.
          </p>
        </div>
      </section>

      {/* ── THESE USUALLY NEED PROMPT CARE ──────────────── */}
      <section className="sec">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">When to call us straight away</div>
            <h2>These usually need <em>prompt care</em></h2>
          </div>
          <ul className="offer-includes reveal emg-prompt-list">
            <li>Severe or throbbing toothache</li>
            <li>A knocked-out or loose adult tooth</li>
            <li>A broken, chipped or cracked tooth</li>
            <li>Swelling of the gum, jaw or face</li>
            <li>A lost filling or crown</li>
            <li>Bleeding that won&apos;t settle</li>
            <li>Pain after recent treatment</li>
            <li>An accident or knock to the mouth</li>
          </ul>
          <p className="emg-note reveal">
            Not sure? Call us anyway on <a href={telHref}>{business.telephoneDisplay}</a> and we&apos;ll help you work out what&apos;s needed.
          </p>
        </div>
      </section>

      {/* ── FIRST AID BY SYMPTOM ─────────────────────────── */}
      <section className="sec alt" id="first-aid">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Before you reach us</div>
            <h2>Simple first aid that <em>can save a tooth</em></h2>
          </div>
          <div className="svc-grid reveal">
            {firstAid.map((item) => (
              <article key={item.q} className="svc emg-aid">
                <h3>{item.q}</h3>
                <FaqAnswer text={item.a} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHEN TO CALL 000 ─────────────────────────────── */}
      <section className="sec">
        <div className="container reveal">
          <div className="emg-hospital">
            <h2>Some emergencies need a hospital, not a dental chair</h2>
            <p>
              Call <b>000</b> or go to your nearest hospital emergency department straight away if you have:
            </p>
            <ul>
              <li>Difficulty breathing or swallowing</li>
              <li>Heavy bleeding that won&apos;t stop</li>
              <li>A serious facial injury</li>
              <li>Swelling spreading towards your eye or neck, or you feel very unwell</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS AT AN EMERGENCY APPOINTMENT ──────── */}
      <section className="sec alt" id="appointment">
        <div className="container">
          <div className="sec-head center reveal emg-fit">
            <div className="eyebrow">What to expect</div>
            <h2>What happens at an emergency <em>dental appointment?</em></h2>
            <p>
              Your dentist will first assess the source of the pain or problem. This may include examining the tooth and surrounding tissues and taking an X-ray where needed. The immediate priority is to relieve pain, control infection or stabilise the tooth. We&apos;ll explain the diagnosis, treatment options and costs before proceeding.
            </p>
          </div>
          <ol className="npv-who emg-steps reveal">
            {appointmentSteps.map(({ icon, title, body }, i) => (
              <li key={title}>
                <span className="npv-who-ico"><Ico name={icon} /></span>
                <div>
                  <span className="emg-step-n">Step {i + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="emg-note reveal">
            See our <Link href="/fees">fees guide</Link> for how treatment is priced, or read how we look after{' '}
            <Link href="/nervous-patients">nervous patients</Link>.
          </p>
        </div>
      </section>

      {/* ── GENTLE REASSURANCE ───────────────────────────── */}
      <section className="sec">
        <div className="container reveal emg-gentle emg-fit">
          <div className="eyebrow">Calm, gentle, fast</div>
          <h2>We&apos;ll get you comfortable, <em>then sort the cause</em></h2>
          <p>
            We keep time aside each day for emergencies, and our first job is simply to get you out of pain. If you&apos;re{' '}
            <Link href="/nervous-patients">nervous about emergency treatment</Link>, that&apos;s completely fine. Looking after anxious patients is one of the things we&apos;re known for, and we&apos;ll go gently.
          </p>
          <p className="emg-gentle-sub">
            You&apos;ll get a clear written estimate before any treatment, and we have{' '}
            <Link href="/fees#payment">payment options</Link> if you need them. If it&apos;s outside our hours and serious, please use the hospital guidance above.
          </p>
          <div className="emg-gentle-cta">
            <a className="btn" href={telHref}>Call {business.telephoneDisplay}</a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────
          The site's accordion, the first question open. Each question is
          still a real H3 — inside the <summary>, which permits headings — and
          every answer is in the server-rendered HTML while closed. */}
      <section className="sec alt" id="faq">
        <div className="container">
          <div className="sec-head center reveal">
            <div className="eyebrow">Quick answers</div>
            <h2>Emergency dental <em>questions</em></h2>
          </div>
          <div className="faq emg-faq reveal">
            {faq.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary><h3>{item.q}</h3></summary>
                <div className="emg-faq-answer"><FaqAnswer text={item.a} /></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── COSTS & FUNDING ──────────────────────────────── */}
      <section className="sec emg-funding-sec">
        <div className="container reveal">
          <div className="emg-funding">
            <span className="emg-funding-ico"><Ico name="list" /></span>
            <div>
              <h2>Need help funding significant dental treatment?</h2>
              <p>
                Learn about <Link href="/fees#payment">payment options</Link> and eligible{' '}
                <Link href="/using-your-super">compassionate-release pathways</Link> for essential treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCAL SERVICE AREA ───────────────────────────── */}
      <section className="sec emg-area-sec">
        <div className="container reveal">
          <p className="serves">
            Emergency dental care for {namedSuburbs.slice(0, -1).join(', ')}, {namedSuburbs.at(-1)} and surrounding inner south-east Melbourne.{' '}
            <Link href="/areas-we-serve">View all areas we serve &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ── CLINICAL REVIEW & SOURCES ────────────────────── */}
      <section className="emg-review-sec">
        <div className="container reveal">
          <div className="emg-review">
            <p className="emg-review-meta">
              {reviewer && (
                <>
                  Clinically reviewed by <Link href={`/about/our-team#${reviewer.slug}`}>{reviewer.name}</Link>
                  <span className="proof-dot" />
                </>
              )}
              {reviewer ? 'Last reviewed' : 'Last updated'}: {REVIEW.label}
            </p>
            <div className="emg-sources">
              <span>Sources:</span>
              <ul>
                {SOURCES.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="emg-review-note">This page is general information and cannot replace an individual dental examination or diagnosis.</p>
          </div>
        </div>
      </section>

      <GetInTouch variant="emergency" id="contact" />

      <StickyCallBar />
    </main>
  )
}
