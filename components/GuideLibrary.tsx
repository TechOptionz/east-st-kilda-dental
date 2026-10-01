'use client'

import { useState } from 'react'
import Link from 'next/link'
import GuideGrid, { type GuideCard } from '@/components/GuideGrid'

export interface LibraryTopic {
  slug: string
  label: string
}

type SortOrder = 'latest' | 'oldest' | 'az'

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'Alphabetical (A–Z)' },
]

/**
 * The Learn hub's library: the topic chips, the sort control and the grid.
 *
 * Each topic chip is a real link to that topic's hub page (/learn/<slug>), so
 * the hierarchy Learn → topic → guide is crawlable from plain HTML. They used
 * to be buttons that filtered this grid in place, which no crawler could
 * follow; the topic pages now do that job, each with its own URL. "All guides"
 * is this page, marked as current.
 *
 * Only topics that already have a published guide are passed in, so no chip
 * can ever link to an empty page.
 */
export default function GuideLibrary({
  guides,
  topics,
  upcoming = [],
}: {
  guides: GuideCard[]
  topics: LibraryTopic[]
  /** Titles we intend to write. Plain text under the grid, never links. */
  upcoming?: string[]
}) {
  const [sort, setSort] = useState<SortOrder>('latest')

  // Dates are ISO strings, so they sort as text. A copy, because sort mutates
  // and the prop array is shared with every other order.
  const shown = [...guides].sort((a, b) => {
    if (sort === 'az') return a.title.localeCompare(b.title)
    const oldestFirst = a.date.localeCompare(b.date)
    return sort === 'oldest' ? oldestFirst : -oldestFirst
  })

  return (
    <>
      {/* ── TOPICS ───────────────────────────────────────── */}
      <section className="sec sage-bg">
        <div className="container reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Browse by topic</div>
          <h2>What would you like to understand?</h2>
          {/* Chips left, sort right — one control row under the heading. */}
          <div className="library-controls">
            <nav className="topic-tags" aria-label="Guide topics">
              <Link href="/learn" className="topic-tag on" aria-current="page">
                All guides
              </Link>
              {topics.map((topic) => (
                <Link key={topic.slug} href={`/learn/${topic.slug}`} className="topic-tag">
                  {topic.label}
                </Link>
              ))}
            </nav>

            <div className="library-sort">
              <label htmlFor="guide-sort">Sort by</label>
              <select
                id="guide-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ─────────────────────────────────────── */}
      <section className="sec">
        <div className="container">
          {/* <div className="sec-head center reveal">
            <div className="eyebrow">The library</div>
            <h2>Guides &amp; articles</h2>
            <p style={{ marginTop: '14px', fontSize: '17px' }}>
              Every guide we&apos;ve published, newest first. Read one, read none, or just bring the question in with you.
            </p>
          </div> */}

          {/* The whole library; each topic's own page narrows it. */}
          <GuideGrid guides={shown} />

          {/* Plain text, never links: these guides do not exist yet. */}
          {upcoming.length > 0 && (
            <p className="publishing-soon reveal">
              Publishing soon: {upcoming.join(' · ')}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
