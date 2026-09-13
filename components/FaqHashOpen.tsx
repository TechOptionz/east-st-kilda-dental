'use client'

import { useEffect } from 'react'

/**
 * Opens the <details> a URL fragment points at.
 *
 * The answers are closed accordions, so a link such as
 * /dental-faqs#what-is-a-dental-implant would otherwise scroll to a closed
 * question with its answer hidden. On load and on every hash change this opens
 * the matching question (or does nothing for a category anchor, which is a
 * plain section) and brings it into view. The answers themselves are already
 * in the server-rendered HTML; this only changes which are expanded.
 */
export default function FaqHashOpen() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return
      const el = document.getElementById(id)
      if (el instanceof HTMLDetailsElement) {
        el.open = true
        el.scrollIntoView({ block: 'start' })
      }
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])
  return null
}
