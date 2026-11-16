'use client'

import { useEffect, useState } from 'react'

// Phones (the ≤600px layout) get a 720×720 centre crop — the only part of the
// frame that layout shows — at ~0.75MB. Everything wider gets a 1080p encode
// at ~3.9MB. The 2560×1440 master (13.5MB) is no longer served.
const MOBILE_QUERY = '(max-width: 600px)'
const MOBILE_SRC = '/assets/video/hero-clinic-mobile.mp4'
const DESKTOP_SRC = '/assets/video/hero-clinic-1080.mp4'

// Ambient background video for the home hero.
//
// The poster frame is painted by CSS on .hero-video itself, so the hero is
// visually complete on first paint and the video never competes with the LCP.
// This component only mounts the <video> once the page has finished loading,
// then fades it in once it can actually play. Visitors who ask for reduced
// motion or reduced data keep the still poster and never download the clip.
export default function HeroVideoBg() {
  const [src, setSrc] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return

    const start = () => setSrc(window.matchMedia(MOBILE_QUERY).matches ? MOBILE_SRC : DESKTOP_SRC)
    if (document.readyState === 'complete') {
      start()
      return
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  if (!src) return null

  return (
    <video
      className={`hero-video-media${ready ? ' is-ready' : ''}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      tabIndex={-1}
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
