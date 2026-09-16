import Link from 'next/link'

/**
 * The offers row that sits between the hero stat cards and the services grid.
 *
 * Three identically styled cards — the icon tiles and the tinted wash are what
 * keep it from reading as a second services grid a screen-length above the
 * real one.
 *
 * The CTAs now say "book", so they link where they say: two go straight to
 * /online-booking and the emergency card to the page that carries the phone
 * number. (They used to read "Learn more" and point at explainer pages.)
 */

interface Offer {
  title: string
  body: string
  /** First card only: the health-fund caveat, set in italics. */
  fineprint?: string
  cta: string
  href: string
  /** Links are otherwise near-identical to a screen reader tabbing the row. */
  ariaLabel: string
  icon: 'shield' | 'clock' | 'heart' | 'tooth'
}

const OFFERS: Offer[] = [
  {
    title: 'New patient',
    body: 'A thorough first visit to understand your oral health and what needs attention.',
    cta: 'Book your first visit',
    href: '/online-booking',
    ariaLabel: 'Book your first visit as a new patient',
    icon: 'heart',
  },
  {
    title: 'Emergency',
    body: 'Pain, a broken tooth or something that just doesn’t feel right.',
    cta: 'Get urgent help',
    href: '/emergency-dentist',
    ariaLabel: 'Get urgent help with a dental problem or emergency',
    icon: 'clock',
  },
  {
    title: 'Existing patient',
    body: 'Ready for your next check-up, clean or planned treatment.',
    cta: 'Book your next visit',
    href: '/online-booking',
    ariaLabel: 'Book your next visit as an existing patient',
    icon: 'tooth',
  },
]

/** Hand-rolled to match the inline-SVG convention used everywhere else here. */
const ICONS: Record<Offer['icon'], React.ReactNode> = {
  shield: (
    <>
      <path d="M12 3 4 6v5c0 4.4 3.1 8.5 8 10 4.9-1.5 8-5.6 8-10V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />,
  tooth: (
    <path d="M12 4c-2 0-3-1-5 0-2.2 1.1-2.4 4-1.6 7 .6 2.3.9 4.2 1.3 6.3.2 1.2 1.9 1.4 2.3.2l1.1-3.5c.3-.9 1.5-.9 1.8 0l1.1 3.5c.4 1.2 2.1 1 2.3-.2.4-2.1.7-4 1.3-6.3.8-3 .6-5.9-1.6-7-2-1-3 0-5 0Z" />
  ),
}

export default function HomeOffers() {
  return (
    <section className="offers" aria-labelledby="offers-heading">
      <div className="container">
        {/* Heading only. The old eyebrow read "New to East St Kilda Dental?",
            which stopped being true once one of the three cards was aimed at
            existing patients. */}
        <div className="sec-head center reveal" style={{ marginBottom: '34px' }}>
          <h2 id="offers-heading">Choose the visit that fits</h2>
        </div>

        <div className="offers-row">
          {OFFERS.map(offer => (
            <article key={offer.title} className="offers-card">
              {/* The card's own icon again, oversized and barely there, bleeding
                  out of the top corner. Purely decorative — the real one is
                  right below it — so it is hidden from assistive tech. */}
              <svg className="offers-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[offer.icon]}
              </svg>

              <span className="offers-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[offer.icon]}
                </svg>
              </span>

              <h3 className="offers-title">{offer.title}</h3>
              <p className="offers-body">{offer.body}</p>

              {offer.fineprint && <p className="offers-fine">{offer.fineprint}</p>}

              <Link href={offer.href} className="offers-cta" aria-label={offer.ariaLabel}>
                {offer.cta}
                <svg className="offers-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
