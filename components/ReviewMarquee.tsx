/**
 * The home page's review row: six cards drifting slowly from right to left,
 * looping forever.
 *
 * The motion is pure CSS — the track holds the six cards twice over and slides
 * by exactly half its width, so the second copy is under the reader's eye at
 * the moment the first wraps and the seam never shows. That means no client
 * component, no requestAnimationFrame and nothing to hydrate; hover and
 * keyboard focus pause it through animation-play-state, and a reader who has
 * asked for reduced motion gets a scrollable row instead of a moving one.
 *
 * The duplicate set is aria-hidden, so assistive tech reads six reviews rather
 * than twelve.
 *
 * On the reviews being here at all: four other places in this repo say
 * testimonials are off limits under AHPRA's advertising guidelines, and that is
 * why this block spent a while commented out. Showing them was an explicit
 * product decision by the practice, who own that call. Every quote below is a
 * real Google review — do not add, reword or invent one. The structured data
 * stays clean either way: there is still no Review or aggregateRating node
 * anywhere on the site.
 */

import type { CSSProperties } from 'react'
import CarouselNav from './CarouselNav'

export interface Review {
  quote: string
  name: string
  /** Drawn from the Google listing. Absent where we do not have the date. */
  when?: string
}

/**
 * The site's one review source. The practitioner profiles pick their reviews
 * out of this list by name, so a quote exists in exactly one place.
 */
export const REVIEWS: Review[] = [
  {
    quote:
      'Dr Anbar was fantastic and extremely knowledgeable. Very comfortable experience as well, from my perspective there was no pain or discomfort. Would highly recommend to anyone looking for a new dentist.',
    name: 'Emily Wootton',
    when: '3 months ago',
  },
  {
    quote:
      'I’ve had years of care under this team. They are friendly, do not over charge, offer options of treatments that consider your circumstances. A clinic that has never failed to care and give me the most personalised treatment.',
    name: 'Bronwen Drinnan',
    when: '4 months ago',
  },
  {
    quote:
      'Dr Dean is caring, calm, patient, empathic, professional, warm and open to having a laugh. He and the team at St Kilda East Dental are amazing group who to me practice ‘dentistry as an art form’.',
    name: 'Gülşen Özer',
    when: '1 month ago',
  },
  {
    quote:
      'First up - precision and brilliant quality! Plus my dentist Anbar is so kind, gentle and careful. So I have got a dentist who I can absolutely trust, and also I get to have a friendly and nurturing, very personalized experience when I am in there.',
    name: 'Andrea Buck',
    when: '3 months ago',
  },
  {
    quote:
      'I’ve been going to Eddy for over 20 years and couldn’t recommend him more highly. He is always professional, gentle, and extremely knowledgeable. Eddy takes the time to explain everything clearly and makes every visit comfortable and stress-free.',
    name: 'Jackie Perkins',
    when: '2 months ago',
  },
  {
    quote:
      "Writing a review after a dentist visit is not something i'm normally compelled to do, however I have been really impressed with Dr Dean and his kind, gentle and informative service that I thought I should! This is my second visit amd I highly recommend.",
    name: 'Camille Thurnherr',
    when: '3 months ago',
  },
]

/**
 * Google's four-colour "G". Inline rather than a file so it costs no request
 * and cannot 404, and drawn in Google's own brand colours because that is the
 * only way the mark is licensed to be used — do not recolour it to the site
 * palette. Decorative here: the words "Google review" sit right beside it.
 */
function GoogleMark() {
  return (
    <svg className="rmq-glogo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8a10 10 0 0 1-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.5 6.6-16.3Z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7A22 22 0 0 0 24 46Z" />
      <path fill="#FBBC05" d="M11.8 28.3a13.2 13.2 0 0 1 0-8.6v-5.7H4.5a22 22 0 0 0 0 20l7.3-5.7Z" />
      <path fill="#EA4335" d="M24 10.1c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 3.5 29.9 1.5 24 1.5A22 22 0 0 0 4.5 14l7.3 5.7c1.7-5.2 6.5-9 12.2-9Z" />
    </svg>
  )
}

export function ReviewCard({ quote, name, when }: Review) {
  return (
    <figure className="rmq-card">
      {/* The faint mark in the corner. Decorative — the <blockquote> below is
          what tells a screen reader this is a quotation. */}
      <span className="rmq-mark" aria-hidden="true">
        &ldquo;
      </span>
      {/* Source and rating together at the top of the card: a reader decides
          whether a quote is worth reading from where it came from and how it
          scored, and both used to arrive after the quote itself. */}
      <div className="rmq-source">
        <GoogleMark />
        <span className="rmq-source-name">Google review</span>
        {/* role="img" as well as the label: aria-label on a bare span is not
            reliably announced without a role to hang it on. */}
        <span className="rmq-stars" role="img" aria-label="Rated 5 out of 5">
          <span aria-hidden="true">★★★★★</span>
        </span>
      </div>
      <blockquote className="rmq-quote">{quote}</blockquote>
      <figcaption className="rmq-person">
        <span className="rmq-avatar" aria-hidden="true">
          {name.charAt(0)}
        </span>
        <span>
          <b className="rmq-name">{name}</b>
          {when && <span className="rmq-when">{when}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

interface ReviewMarqueeProps {
  /** Defaults to the home page's six. A practitioner profile passes its own. */
  reviews?: Review[]
  /** The scroller's id, for the phone carousel's controls. Unique per page. */
  id?: string
  label?: string
}

export default function ReviewMarquee({
  reviews = REVIEWS,
  id = 'home-reviews',
  label = 'Reviews from our patients',
}: ReviewMarqueeProps) {
  // One lap of the row takes 16s a card, so a longer list drifts at the same
  // speed as the home page's six rather than racing to fit the 96s lap.
  const lap = { '--rmq-lap': `${reviews.length * 16}s` } as CSSProperties
  return (
    /* The wrapper is the positioning context for the phone-only arrows, and
       nothing more — on a wide screen it is a plain block around the row. */
    <div className="rmq-wrap">
      <div className="rmq" id={id} role="region" aria-label={label}>
        <div className="rmq-track" style={lap}>
          {reviews.map(r => (
            <ReviewCard key={r.name} {...r} />
          ))}
          {/* The second lap. Hidden from assistive tech so each review is
              announced once, not twice. On a phone the row is a carousel
              rather than a marquee and this copy is hidden outright. */}
          <div className="rmq-loop" aria-hidden="true">
            {reviews.map(r => (
              <ReviewCard key={`${r.name}-loop`} {...r} />
            ))}
          </div>
        </div>
      </div>
      {/* Phone only — display:none from 601px up. See globals.css. */}
      <CarouselNav
        targetId={id}
        count={reviews.length}
        itemSelector=".rmq-track > .rmq-card"
        className="rmq-nav"
      />
    </div>
  )
}
