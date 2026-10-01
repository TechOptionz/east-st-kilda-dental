import Image from 'next/image'
import type { CSSProperties } from 'react'

interface PhotoProps {
  /** Path under /public, e.g. "/assets/heroes/home-hero.webp". Omit while the photo is pending — the hint placeholder renders instead. */
  src?: string
  alt?: string
  /** Placeholder text shown until a src is supplied. Doubles as the photography brief. */
  hint?: string
  /** Responsive sizes attr matching the layout column this photo sits in. See docs/photo-infrastructure.md. */
  sizes?: string
  /** Adds the .tall variant (min-height 420px hero frame). */
  tall?: boolean
  /** Only for the single above-the-fold hero image on a page. */
  priority?: boolean
  className?: string
  style?: CSSProperties
  objectPosition?: string
  /** Zoom factor for the image within its frame. 1 = fit (cover), >1 zooms in. */
  scale?: number
  /** How the image fills its frame. 'cover' (default) crops to fill; 'contain' shows the whole image. */
  objectFit?: 'cover' | 'contain'
}

export default function Photo({
  src,
  alt = '',
  hint,
  sizes = '100vw',
  tall = false,
  priority = false,
  className,
  style,
  objectPosition = 'center',
  scale = 1,
  objectFit = 'cover',
}: PhotoProps) {
  const classes = ['ph', tall && 'tall', className].filter(Boolean).join(' ')

  return (
    <div className={classes} style={style}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          // next/image's priority preloads the image but leaves the <img> itself
          // at default fetch priority; the hero is the LCP, so say so outright.
          fetchPriority={priority ? 'high' : undefined}
          style={{
            objectFit,
            objectPosition,
            ...(scale !== 1 && { transform: `scale(${scale})`, transformOrigin: objectPosition }),
          }}
        />
      ) : (
        hint && <span>{hint}</span>
      )}
    </div>
  )
}
