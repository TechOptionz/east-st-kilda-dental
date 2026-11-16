'use client'

import { useEffect } from 'react'

/**
 * Opens and closes every <details> accordion on the site with the same eased
 * fold the practitioner profile's question cards use, instead of the browser's
 * instant snap.
 *
 * The accordions stay native <details> elements: they open without JavaScript,
 * their answers are in the server-rendered HTML, find-in-page still expands
 * them and /dental-faqs#question links still open them (FaqHashOpen). This only
 * takes over the click on a <summary> to animate the card's height between its
 * closed and open sizes. Mounted once in app/layout.tsx; one delegated
 * listener covers every page, including accordions rendered after navigation.
 *
 * While a card is closing it keeps its `open` attribute (the answer has to
 * stay rendered to be seen folding away) and carries `data-closing`, which the
 * stylesheet uses to turn the plus mark back at the start of the fold rather
 * than the end.
 */
const DURATION = 380
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function DetailsMotion() {
  useEffect(() => {
    const running = new WeakMap<HTMLDetailsElement, Animation>()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    /** The card's height with only its <summary> showing. */
    const closedHeight = (details: HTMLDetailsElement, summary: HTMLElement) => {
      const cs = getComputedStyle(details)
      const edges =
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        parseFloat(cs.borderTopWidth) +
        parseFloat(cs.borderBottomWidth)
      return summary.offsetHeight + edges
    }

    const settle = (details: HTMLDetailsElement) => {
      details.style.overflow = ''
      details.removeAttribute('data-closing')
      running.delete(details)
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      const target = e.target as Element | null
      const summary = target?.closest?.('summary') as HTMLElement | null
      if (!summary) return
      // A link inside a question is a link, not a toggle.
      if (target?.closest('a')) return
      const details = summary.parentElement
      if (!(details instanceof HTMLDetailsElement) || !details.closest('main')) return
      // Reduced motion, or a browser without the Web Animations API: leave the
      // native toggle alone.
      if (reduced.matches || typeof details.animate !== 'function') return

      e.preventDefault()

      // Read the height before cancelling: mid-animation it is the height the
      // card is showing right now, which is where the next fold has to start.
      const from = details.offsetHeight
      running.get(details)?.cancel()

      const closing = details.open && !details.hasAttribute('data-closing')
      details.style.overflow = 'hidden'

      let to: number
      if (closing) {
        details.setAttribute('data-closing', '')
        to = closedHeight(details, summary)
      } else {
        details.removeAttribute('data-closing')
        details.open = true
        to = details.offsetHeight
      }

      const animation = details.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: DURATION, easing: EASING },
      )
      running.set(details, animation)
      animation.onfinish = () => {
        if (closing) details.open = false
        settle(details)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
