import type { ReactNode } from 'react'

/**
 * The closing line of a card that is itself a link: its label ("Learn more",
 * "Explore") and the round arrow button from the practitioner profile's
 * areas-of-care rows. The disc fills clay as the card is pointed at — see
 * .card-more in globals.css.
 *
 * Not a link of its own. The card around it is the link, so this is its
 * affordance rather than a second target; the arrow is hidden from screen
 * readers, which already announce the card's text as the link.
 */
export default function CardMore({ children }: { children: ReactNode }) {
  return (
    <span className="card-more">
      <span>{children}</span>
      <span className="card-go" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </span>
  )
}
