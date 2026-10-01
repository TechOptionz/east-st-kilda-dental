import Link from 'next/link'
import Photo from '@/components/Photo'
import type { ArticleData } from '@/data/articles'

/**
 * Everything a card needs, and nothing else.
 *
 * The Learn hub filters its grid in the browser, so the guides cross the
 * server/client boundary — sending each article's full body and FAQ with them
 * would put the whole library in the page payload twice over.
 */
export type GuideCard = Pick<
  ArticleData,
  'slug' | 'title' | 'eyebrow' | 'author' | 'readTime' | 'image' | 'topics' | 'date' | 'video'
>

/**
 * The card grid for a set of guides.
 *
 * Shared by the Learn hub and every topic page so a guide looks and links the
 * same wherever it appears. Only ever pass published guides — an unwritten
 * guide has no page to link to.
 *
 * Editorial rather than boxed: a tall cover image carrying the category and the
 * title, with the title and byline repeated below it on the page itself. The
 * excerpt is not shown here — it opens the article instead, so a row of cards
 * stays scannable.
 */
export default function GuideGrid({ guides }: { guides: GuideCard[] }) {
  return (
    <div className="guide-grid reveal">
      {guides.map((guide) => (
        <Link key={guide.slug} href={`/learn/${guide.slug}`} className="guide-card">
          <div className="guide-card-media">
            <Photo
              src={guide.image}
              alt={guide.title}
              hint="Article image"
              sizes="(max-width: 900px) 50vw, 33vw"
            />
            <span className="guide-tag">{guide.eyebrow}</span>
            {/* A guide you can watch rather than read says so on the cover. */}
            {guide.video && (
              <span className="guide-video-flag">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
                Video
              </span>
            )}
            {/* The title set over the cover, the way their cover art carries
                it. Hidden from screen readers: the real heading is below, and
                hearing every title twice helps nobody. */}
            <span className="guide-cover-title" aria-hidden="true">
              <span>{guide.title}</span>
            </span>
          </div>
          <div className="guide-card-body">
            <h3>{guide.title}</h3>
            <p className="guide-byline">
              By {guide.author ?? 'East St Kilda Dental'}
              {guide.readTime && ` · ${guide.readTime}`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
