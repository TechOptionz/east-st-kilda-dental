import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { publishedArticles, getPublishedArticle, type ArticleData } from '@/data/articles'
import GetInTouch from '@/components/GetInTouch'
import GuideGrid from '@/components/GuideGrid'
import ArticleVideo, { embedUrl, isHostedVideo } from '@/components/ArticleVideo'
import JsonLd from '@/components/JsonLd'
import BreadcrumbBar from '@/components/BreadcrumbBar'
import { learnArticleTrail } from '@/components/Breadcrumb'
import Photo from '@/components/Photo'
import TopicView from '@/components/TopicView'
import { getPopulatedTopic, populatedTopics } from '@/data/topics'
import { practitionerPath } from '@/data/practitioners'
import { withSocial } from '@/lib/seo'
import { SCHEMA_ID, SITE_URL, business, clinicianId, clinicians, telHref } from '@/lib/business'

/** The practice as a node reference: same entity as the home page's #practice. */
const practiceRef = { '@type': 'Dentist', '@id': SCHEMA_ID.practice, name: business.name }

/**
 * The author node for a guide.
 *
 * A guide reviewed by one of the named clinicians carries the @id the home page
 * graph declares for that Person, so the byline resolves to a real entity
 * rather than to a loose name. Anything else — a team byline, or no byline at
 * all — is authored by the practice itself.
 *
 * The name is repeated alongside the @id deliberately: the @id is what joins
 * the node to the site graph, and the name is what makes it readable on its own
 * to anything that reads this page in isolation.
 */
function byline(author: string | undefined) {
  const clinician = clinicians.find(c => c.name === author)
  if (!clinician) return practiceRef
  const profile = practitionerPath(clinician.slug)
  return {
    '@type': 'Person',
    '@id': clinicianId(clinician.slug),
    name: clinician.name,
    ...(profile ? { url: `${SITE_URL}${profile}` } : {}),
  }
}

/**
 * Heading text to a stable anchor.
 *
 * The contents list and the headings it points at are both built from this, so
 * a renamed heading moves its own anchor with it and the two cannot drift.
 */
function anchorId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * The guides offered at the foot of an article.
 *
 * Guides sharing a topic first, since they answer the neighbouring question,
 * topped up with the most recent of the rest so the block is never short. The
 * article you are reading is never in it.
 */
function readMoreGuides(article: ArticleData, limit = 3) {
  const others = publishedArticles.filter(a => a.slug !== article.slug)
  const sameTopic = others.filter(a => a.topics?.some(t => article.topics?.includes(t)))
  const rest = others.filter(a => !sameTopic.includes(a))
  return [...sameTopic, ...rest].slice(0, limit)
}

/**
 * Every video on the page, in the order it appears: the feature video first,
 * then any inside a section.
 *
 * One list drives both the markup and nothing else — the players themselves
 * are rendered where they belong — so a video can never be described in the
 * schema without being on the page.
 */
function articleVideos(article: ArticleData) {
  return [
    ...(article.video ? [article.video] : []),
    ...(article.sections ?? []).flatMap(section => (section.video ? [section.video] : [])),
  ]
}

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Both guides and topic landing pages live at /learn/<slug>, which reads better
 * and indexes more cleanly than a query parameter. This route resolves a slug
 * to whichever it is; data/topics.ts fails the build if the two ever collide.
 *
 * A draft guide and an empty topic both produce no params at all, so their URLs
 * 404 rather than serving a thin page.
 */
export async function generateStaticParams() {
  return [
    ...publishedArticles.map(a => ({ slug: a.slug })),
    ...populatedTopics.map(t => ({ slug: t.slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const topic = getPopulatedTopic(slug)
  if (topic) {
    return withSocial({
      title: `${topic.label} — dental guides | East St Kilda Dental`,
      description: topic.intro,
      alternates: { canonical: `${SITE_URL}/learn/${slug}` },
    })
  }

  const article = getPublishedArticle(slug)
  if (!article) return {}
  return withSocial({
    title: article.meta.title,
    description: article.meta.description,
    alternates: { canonical: `${SITE_URL}/learn/${slug}` },
  })
}

export default async function LearnEntryPage({ params }: Props) {
  const { slug } = await params

  const topic = getPopulatedTopic(slug)
  if (topic) return <TopicView topic={topic} />

  const article = getPublishedArticle(slug)
  if (!article) notFound()

  const url = `${SITE_URL}/learn/${slug}`

  const hasFaq = Boolean(article.faq && article.faq.length > 0)
  const faqHeading = `${article.eyebrow} FAQs`

  // The contents list, built from the headings that actually render below —
  // the body sections first, then the summary and the FAQs, which are headings
  // in their own right and the two things people scroll for.
  const contents = [
    ...(article.video ? [{ id: 'watch', label: `Watch: ${article.video.title}` }] : []),
    ...(article.sections ?? []).map(section => ({ id: anchorId(section.h2), label: section.h2 })),
    ...(article.summary ? [{ id: 'summary', label: 'Summary' }] : []),
    ...(hasFaq ? [{ id: 'faqs', label: faqHeading }] : []),
  ]

  // Topic chips in the aside. These are the article's own topics, resolved
  // against the populated list so a chip can never point at an empty page.
  const topicChips = populatedTopics.filter(t => article.topics?.includes(t.slug))
  // The breadcrumb's middle step: the first topic the article lists that has a
  // live page. Taken in the article's own order, so its lead topic wins.
  const primaryTopic = article.topics?.map(getPopulatedTopic).find(t => t !== undefined)
  const authorPath = practitionerPath(article.author)
  const readMore = readMoreGuides(article)
  const videos = articleVideos(article)

  // A VideoObject per player on the page. A hosted file gets contentUrl (the
  // file itself); an embed gets embedUrl (the player), which is what each of
  // those properties means. Thumbnail falls back to the guide's cover, since a
  // video result needs one.
  const videoNodes = videos.map((video, i) => {
    const thumbnail = video.poster ?? article.image
    return {
      '@type': 'VideoObject',
      '@id': `${url}#video-${i + 1}`,
      name: video.title,
      description: video.description ?? video.caption ?? article.meta.description,
      ...(thumbnail ? { thumbnailUrl: `${SITE_URL}${thumbnail}` } : {}),
      uploadDate: video.uploadDate ?? article.date,
      ...(video.duration ? { duration: video.duration } : {}),
      ...(isHostedVideo(video.src)
        ? { contentUrl: `${SITE_URL}${video.src}` }
        : { embedUrl: embedUrl(video.src) }),
      isPartOf: { '@id': `${url}#webpage` },
      publisher: practiceRef,
    }
  })

  // isPartOf, publisher and author all reference the site-wide nodes by @id
  // rather than restating a name, so each guide joins the one entity graph
  // instead of standing alone as an unattached page.
  //
  // The BreadcrumbList is not restated here: <BreadcrumbBar> emits it from the
  // same trail it renders, so the visible trail and the markup cannot disagree.
  // This node points at it by @id, the way the suburb and service pages do.
  const webPage = {
    '@type': 'MedicalWebPage',
    '@id': `${url}#webpage`,
    url,
    isPartOf: { '@id': SCHEMA_ID.website },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    name: article.title,
    headline: article.title,
    description: article.meta.description,
    ...(article.image ? { image: `${SITE_URL}${article.image}` } : {}),
    author: byline(article.author),
    publisher: practiceRef,
    inLanguage: 'en-AU',
    datePublished: article.date,
    dateModified: article.date,
    ...(hasFaq ? { mainEntity: { '@id': `${url}#faq` } } : {}),
    ...(videoNodes.length > 0
      ? { video: videoNodes.map(node => ({ '@id': node['@id'] })) }
      : {}),
  }

  // The questions on the page, marked up as the questions they are. Built from
  // the same array the accordion renders, so the two cannot disagree.
  const faqNode = hasFaq
    ? {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        name: faqHeading,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: article.faq!.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [webPage, ...(faqNode ? [faqNode] : []), ...videoNodes],
  }

  return (
    <main>
      <JsonLd data={schema} />

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <BreadcrumbBar trail={learnArticleTrail(article.title, primaryTopic)} id={`${url}#breadcrumb`} />

      <div className="container">
        <article className="post">
          <div className="post-head-grid">
            <div>
              {/* Category */}
              <div className="post-cat">{article.eyebrow}</div>

              {/* Title */}
              <h1>{article.title}</h1>

              {/* Byline */}
              {article.author && (
                <div className="byline">
                  {/* A clinician with a live profile page is linked from every
                      guide they review; anyone else stays plain text. */}
                  Reviewed by{' '}
                  {authorPath ? <Link href={authorPath}>{article.author}</Link> : article.author}{' '}
                  &middot; {article.readTime}
                </div>
              )}
              {!article.author && (
                <div className="byline">{article.readTime}</div>
              )}
            </div>

            {/* Hero image */}
            <Photo
              className="post-hero"
              src={article.image}
              alt={article.title}
              hint={`Article image — ${article.title}`}
              sizes="(max-width: 820px) 100vw, 42vw"
            />
          </div>

          <div className="post-layout">
            {/* ── ASIDE: contents, topics, related pages ───── */}
            <aside className="post-aside">
              {contents.length > 1 && (
                <nav className="post-toc" aria-labelledby="post-toc-title">
                  <p className="post-aside-title" id="post-toc-title">In this guide</p>
                  <ol>
                    {contents.map(entry => (
                      <li key={entry.id}>
                        <a href={`#${entry.id}`}>{entry.label}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {topicChips.length > 0 && (
                <div className="post-aside-block">
                  <p className="post-aside-title">Topics</p>
                  <div className="topic-tags">
                    {topicChips.map(chip => (
                      <Link key={chip.slug} href={`/learn/${chip.slug}`} className="topic-tag">
                        {chip.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {article.related && article.related.length > 0 && (
                <div className="post-aside-block">
                  <p className="post-aside-title">Related pages</p>
                  <ul className="post-aside-links">
                    {article.related.map((rel, i) => (
                      <li key={i}>
                        <Link href={rel.href}>{rel.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* ── MAIN COLUMN ──────────────────────────────── */}
            <div className="post-main">
              {/* Short answer box (optional) */}
              {article.shortAnswer && (
                <div className="ansbox">
                  <div className="lbl">The short answer</div>
                  <p>{article.shortAnswer}</p>
                </div>
              )}

              {/* Excerpt / intro answer */}
              {!article.shortAnswer && (
                <p className="answer">{article.excerpt}</p>
              )}

              {/* The guide's feature video, straight after the answer */}
              {article.video && (
                <div id="watch">
                  <ArticleVideo video={article.video} />
                </div>
              )}

              {/* Body: structured sections, each anchored from the contents */}
              {article.sections && article.sections.length > 0 && (
                <div className="post-body">
                  {article.sections.map((section, i) => (
                    <div key={i}>
                      <h2 id={anchorId(section.h2)}>{section.h2}</h2>
                      {section.paragraphs.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                      {section.video && <ArticleVideo video={section.video} />}
                    </div>
                  ))}
                </div>
              )}

              {/* Body: flat paragraphs (legacy articles, kept as a fallback) */}
              {!article.sections && article.body && article.body.length > 0 && (
                <div className="post-body">
                  {article.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {/* Summary: written to stand on its own for anyone who skipped */}
              {article.summary && (
                <div className="post-summary">
                  <h2 id="summary">Summary</h2>
                  <p>{article.summary}</p>
                </div>
              )}

              {/* CTA box */}
              {article.ctaH3 && (
                <div className="post-cta">
                  <h3>{article.ctaH3}</h3>
                  {article.ctaBody && <p>{article.ctaBody}</p>}
                  <div className="post-cta-actions">
                    <Link href="/online-booking" className="btn">Book a visit</Link>
                    <a href={telHref} className="btn btn-ghost">
                      Call {business.telephoneDisplay}
                    </a>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {hasFaq && (
                <div className="faq post-faq">
                  <h2 id="faqs">{faqHeading}</h2>
                  {article.faq!.map((item, i) => (
                    <details key={i} open={i === 0}>
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              )}

              {/* Bottom back link */}
              <Link href="/learn" className="post-back" style={{ marginTop: '40px', display: 'inline-flex' }}>
                &larr; Back to dental education
              </Link>
            </div>
          </div>
        </article>
      </div>

      {/* ── READ MORE ────────────────────────────────────── */}
      {readMore.length > 0 && (
        <section className="sec alt">
          <div className="container">
            <div className="sec-head center reveal">
              <div className="eyebrow">Keep reading</div>
              <h2>More on <em>{article.eyebrow.toLowerCase()}</em></h2>
            </div>
            <GuideGrid guides={readMore} />
            <div style={{ textAlign: 'center', marginTop: '36px' }} className="reveal">
              <Link href="/learn" className="btn btn-ghost">All dental education</Link>
            </div>
          </div>
        </section>
      )}

      <GetInTouch variant="default" id="contact" />
    </main>
  )
}
