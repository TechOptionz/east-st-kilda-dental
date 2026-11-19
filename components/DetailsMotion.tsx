'use client'

import { useEffect } from 'react'

/**
 * Every <details> accordion on the site, behaving as the practitioner
 * profile's question cards do (components/QAReveal.tsx): only the question is
 * shown until a mouse rests on the card; the answer then folds open, and folds
 * away again when the mouse leaves. Without a mouse there is no hover, so a tap
 * or a keypress on the question toggles it instead, and it stays as the reader
 * left it.
 *
 * The accordions stay native <details> elements: they open without JavaScript,
 * their answers are in the server-rendered HTML, find-in-page still expands
 * them and /dental-faqs#question links still open them (FaqHashOpen). This
 * only decides when a card opens and animates its height between its closed
 * and open sizes. Mounted once in app/layout.tsx; delegated listeners cover
 * every page, including accordions rendered after navigation.
 *
 * In a list, the card above the one being pointed at usually has to fold shut
 * as the reader moves down — which would slide every question below it up and
 * out from under the cursor, leaving the mouse on the wrong question or on
 * none. So while a fold is running, the page is scrolled by exactly what the
 * hovered card would have moved: it stays where the reader is pointing, and
 * the fold is absorbed above it instead.
 *
 * While a card is closing it keeps its `open` attribute (the answer has to
 * stay rendered to be seen folding away) and carries `data-closing`, which the
 * stylesheet uses to turn the plus mark back at the start of the fold rather
 * than the end.
 */
const DURATION = 380
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
// The profile's delays. On the way in, so sweeping the cursor past a question
// does not open it; on the way out, so a brief slip off the edge does not snap
// it shut.
const HOVER_IN = 140
const HOVER_OUT = 160

export default function DetailsMotion() {
  useEffect(() => {
    const running = new WeakMap<HTMLDetailsElement, Animation>()
    const timers = new WeakMap<HTMLDetailsElement, number>()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    // The card the mouse is on, and how many folds are running — the two
    // things the pinning loop below needs.
    let hovered: HTMLDetailsElement | null = null
    let folding = 0
    let pinning = false

    /** Where a card sits in the document, ignoring transforms (the hover lift). */
    const docTop = (el: HTMLElement) => {
      let y = 0
      for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop
      return y
    }

    /**
     * Holds the hovered card still in the window while folds are running, by
     * scrolling the page each frame by however far the layout above just moved
     * it. One loop however many cards are folding, so nothing is compensated
     * twice. 'instant' because the site sets scroll-behavior: smooth.
     */
    const pin = () => {
      if (pinning || !hovered) return
      pinning = true
      let anchor = hovered
      let top = docTop(anchor)
      const step = () => {
        if (!folding || !hovered) {
          pinning = false
          return
        }
        if (hovered !== anchor) {
          anchor = hovered
          top = docTop(anchor)
        }
        const now = docTop(anchor)
        if (now !== top) {
          window.scrollBy({ top: now - top, behavior: 'instant' })
          top = now
        }
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    /** The accordion card an event happened in, if any. */
    const cardOf = (node: EventTarget | null) => {
      const details = node instanceof Element ? node.closest('details') : null
      return details instanceof HTMLDetailsElement && details.closest('main') ? details : null
    }

    /** Open as the reader sees it: a card that is folding shut counts as closed. */
    const isOpen = (details: HTMLDetailsElement) => details.open && !details.hasAttribute('data-closing')

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

    const cancelTimer = (details: HTMLDetailsElement) => {
      window.clearTimeout(timers.get(details))
      timers.delete(details)
    }

    /** Fold the card open or shut. Does nothing if it is already there. */
    const setOpen = (details: HTMLDetailsElement, open: boolean) => {
      if (isOpen(details) === open) return
      const summary = details.querySelector<HTMLElement>(':scope > summary')

      // Reduced motion, no summary to measure against, or a browser without
      // the Web Animations API: change the state and skip the fold.
      if (!summary || reduced.matches || typeof details.animate !== 'function') {
        running.get(details)?.cancel()
        settle(details)
        details.open = open
        return
      }

      // Read the height before cancelling: mid-animation it is the height the
      // card is showing right now, which is where the next fold has to start.
      const from = details.offsetHeight
      running.get(details)?.cancel()
      details.style.overflow = 'hidden'

      let to: number
      if (open) {
        details.removeAttribute('data-closing')
        details.open = true
        to = details.offsetHeight
      } else {
        details.setAttribute('data-closing', '')
        to = closedHeight(details, summary)
      }

      const animation = details.animate(
        { height: [`${from}px`, `${to}px`] },
        { duration: DURATION, easing: EASING },
      )
      running.set(details, animation)
      folding++
      pin()
      animation.oncancel = () => {
        folding--
      }
      animation.onfinish = () => {
        if (!open) details.open = false
        settle(details)
        // A frame later, so the loop makes its last correction against the
        // settled layout before it is allowed to stop.
        requestAnimationFrame(() => {
          folding--
        })
      }
    }

    // A tap, a click or a keypress on the question toggles it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      const target = e.target as Element | null
      const summary = target?.closest?.('summary')
      if (!summary) return
      // A link inside a question is a link, not a toggle.
      if (target?.closest('a')) return
      const details = summary.parentElement
      if (!(details instanceof HTMLDetailsElement) || !details.closest('main')) return

      e.preventDefault()
      cancelTimer(details)
      setOpen(details, !isOpen(details))
    }

    // Mouse only — a tap is handled by the click above, and would otherwise
    // open the card and immediately re-close it. pointerover/out rather than
    // enter/leave because those two do not bubble to a delegated listener; the
    // relatedTarget test is what turns them back into enter and leave.
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const details = cardOf(e.target)
      if (!details || (e.relatedTarget instanceof Node && details.contains(e.relatedTarget))) return
      hovered = details
      pin()
      cancelTimer(details)
      timers.set(details, window.setTimeout(() => setOpen(details, true), HOVER_IN))
    }
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const details = cardOf(e.target)
      if (!details || (e.relatedTarget instanceof Node && details.contains(e.relatedTarget))) return
      if (hovered === details) hovered = null
      cancelTimer(details)
      timers.set(details, window.setTimeout(() => setOpen(details, false), HOVER_OUT))
    }

    document.addEventListener('click', onClick)
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return null
}
