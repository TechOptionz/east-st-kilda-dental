/**
 * The health funds shown in the "all major health funds" logo rows, on the
 * home page and on /fees.
 *
 * Single source of truth so the two rows can never drift apart. A fund with a
 * `logo` renders as an image; one without falls back to its name as text, so a
 * new fund can be listed the moment we claim through it and given artwork later.
 *
 * `width` and `height` are the file's INTRINSIC pixel size, not the rendered
 * size. They only exist so the browser can reserve the right box and avoid
 * layout shift — the row sizes every logo by height in CSS (.ins-logos .lg img).
 * If you replace a file, update these numbers to match it.
 *
 * These are third-party registered trademarks. Use the artwork exactly as each
 * fund supplies it: don't recolour, stretch, or add effects.
 */

export interface HealthFund {
  /** Fund name. Used as the alt text, and as the visible label when there is no logo. */
  name: string
  logo?: {
    /** Path under /public. */
    src: string
    /** Intrinsic width of the file in px. */
    width: number
    /** Intrinsic height of the file in px. */
    height: number
    /**
     * Rendered height in px, overriding the row default of 30.
     *
     * Logo rows never look right at one uniform height: a horizontal wordmark
     * and a square badge with the wordmark set inside it read at completely
     * different sizes at the same pixel height. Set this to bring a mark back
     * into optical balance with its neighbours.
     */
    opticalHeight?: number
  }
}

export const healthFunds: HealthFund[] = [
  {
    name: 'Medibank',
    logo: { src: '/assets/funds/Medibank_logo_2013.svg', width: 140, height: 45 },
  },
  {
    name: 'Bupa',
    // A full-bleed white-on-blue tile at 1.8:1, against wordmarks at 2.4-3.6:1.
    // At the row's 30px default its lettering reads well under the marks either
    // side, because the tile's padding is part of the artwork. 44px matches them.
    logo: { src: '/assets/funds/bupa.webp', width: 290, height: 161, opticalHeight: 44 },
  },
  {
    name: 'HCF',
    logo: { src: '/assets/funds/hcf-health-logo.webp', width: 812, height: 252 },
  },
  {
    name: 'nib',
    logo: { src: '/assets/funds/nib.webp', width: 351, height: 144 },
  },
  {
    name: 'AHM',
    // A stacked lockup ("ahm" over "by Medibank") inside a dashed coupon
    // border, at 1.6:1 — squarer even than Bupa, and the type sits well inside
    // the frame. Needs the largest bump in the row to match its neighbours.
    logo: { src: '/assets/funds/ahm.webp', width: 635, height: 393, opticalHeight: 46 },
  },
  {
    name: 'HBF',
    // Lowercase wordmark cropped tight to its ascenders, so the box height is
    // very nearly the glyph height. Trimmed back a little from the 30px default.
    logo: { src: '/assets/funds/hbf.webp', width: 1280, height: 458, opticalHeight: 26 },
  },
  {
    name: 'GMHBA',
    // The supplied file was a 1215x747 canvas holding a 958x151 mark — at the
    // row default the lettering would have rendered about 6px tall. Trimmed to
    // the artwork, it is a 6.3:1 all-caps wordmark whose caps fill the full box,
    // so it needs to come DOWN to sit level with the mixed-case marks near it.
    logo: { src: '/assets/funds/gmhba.webp', width: 958, height: 151, opticalHeight: 20 },
  },
  {
    name: 'Australian Unity',
    logo: { src: '/assets/funds/australian-unity-logo.webp', width: 599, height: 166 },
  },
  {
    name: 'Teachers Health',
    // Two lines of caps beside a heart symbol: each line is about 40% of the
    // box, so the mark reads small at a shared height.
    logo: { src: '/assets/funds/teachers-health.webp', width: 790, height: 316, opticalHeight: 36 },
  },
  {
    name: 'Defence Health',
    // Same two-line problem as Teachers Health, in a slightly squarer box.
    logo: { src: '/assets/funds/defence-health.webp', width: 334, height: 151, opticalHeight: 38 },
  },
  {
    name: 'CBHS Health',
    // Heavy "CBHS" caps over a letter-spaced "HEALTH" line, at 2.2:1. The caps
    // are only about half the box, so it needs a bump like the two-line marks.
    logo: { src: '/assets/funds/cbhs.webp', width: 708, height: 321, opticalHeight: 38 },
  },
  {
    name: 'Peoplecare',
    // A wide 4.5:1 wordmark with a small "health insurance" line beneath, so the
    // main lettering is about two-thirds of the box. A touch over the default.
    logo: { src: '/assets/funds/peoplecare.webp', width: 640, height: 141, opticalHeight: 32 },
  },
]

/** The closing tile. Always text — it stands for every fund not named above. */
export const otherFundsLabel = '+ all others'
