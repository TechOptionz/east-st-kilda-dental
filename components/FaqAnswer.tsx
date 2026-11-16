import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Renders one answer from data/dental-faqs.ts: blank lines become paragraphs,
 * and [text](href) becomes a link — a Next <Link> for a site path, a new-tab
 * anchor for an external source. Nothing else in the string is interpreted, so
 * the same text can be handed to the FAQPage schema with only the link syntax
 * stripped (faqPlainText).
 */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

function inline(text: string) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    const [whole, label, href] = m
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    out.push(
      href.startsWith('/') ? (
        <Link key={at} href={href}>{label}</Link>
      ) : (
        <a key={at} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
      ),
    )
    last = at + whole.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export default function FaqAnswer({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{inline(para)}</p>
      ))}
    </>
  )
}
