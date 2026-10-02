'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import styles from './PractitionerProfile.module.css'

/**
 * One interview question on a practitioner profile, opening on hover.
 *
 * Only the question is shown until a mouse rests on it; the whole answer
 * then opens, and folds away again when the mouse leaves. Without a mouse
 * there is no hover, so a tap or a keypress on the question toggles it
 * instead, and it stays as the reader left it.
 *
 * The full answer is server-rendered into the HTML either way (it arrives here
 * as children), so search engines and AI crawlers read all of it.
 */
export default function QAReveal({
  question,
  children,
}: {
  question: string
  /** The answer, revealed on hover. */
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const id = useId()

  return (
    <div
      className={styles.qa}
      data-open={open ? 'true' : undefined}
      // Short delays both ways: on the way in, so sweeping the cursor past a
      // question does not open it; on the way out, so a brief slip off the
      // edge does not snap it shut. Mouse only — a tap is handled by the
      // button's click, and would otherwise open and immediately re-close.
      onPointerEnter={e => {
        if (e.pointerType !== 'mouse') return
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setOpen(true), 140)
      }}
      onPointerLeave={e => {
        if (e.pointerType !== 'mouse') return
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setOpen(false), 160)
      }}
    >
      <h3 className={styles.qaQuestion}>
        <button
          type="button"
          className={styles.qaToggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            window.clearTimeout(timer.current)
            setOpen(o => !o)
          }}
        >
          <span>{question}</span>
          <span className={styles.qaMark} aria-hidden="true" />
        </button>
      </h3>
      <div id={id} className={styles.qaMore}>
        <div className={styles.answer}>{children}</div>
      </div>
    </div>
  )
}
