// Generates the 1200x630 Open Graph share card.
// Brand: sage background, reversed logo lockup, tagline, address.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SAGE_DEEP = '#37503F'
const SAGE = '#4C6B5A'
const CREAM = '#F7F3EC'
const CLAY_SOFT = '#EFD9C5'

// The cream/reversed lockup reads correctly on the dark sage field.
const LOGO = 'public/assets/brand/eskd-logo-reversed.png'
const LOGO_WIDTH = 680
const LOGO_LEFT = 96
const LOGO_TOP = 176

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="82%" cy="8%" r="95%">
      <stop offset="0%" stop-color="${SAGE}"/>
      <stop offset="62%" stop-color="${SAGE_DEEP}"/>
      <stop offset="100%" stop-color="#2C4033"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="1200" height="8" fill="${CLAY_SOFT}"/>

  <!-- eyebrow -->
  <text x="96" y="140" fill="${CLAY_SOFT}" font-family="Georgia, 'Times New Roman', serif"
        font-size="25" letter-spacing="5.5">EST. 1980</text>

  <!-- logo lockup sits here, composited on top -->

  <!-- tagline -->
  <text x="96" y="398" fill="${CREAM}" font-family="Georgia, 'Times New Roman', serif"
        font-size="42" font-style="italic" opacity="0.93">Your Local Gentle Dentist</text>

  <!-- rule -->
  <rect x="96" y="444" width="132" height="3" fill="${CLAY_SOFT}" opacity="0.85"/>

  <!-- address -->
  <text x="96" y="512" fill="${CREAM}" font-family="Georgia, 'Times New Roman', serif"
        font-size="26" opacity="0.62">364 Dandenong Rd, St Kilda East VIC 3183</text>
</svg>`

const logo = await sharp(LOGO)
  .resize({ width: LOGO_WIDTH, fit: 'inside' })
  .png()
  .toBuffer()

await mkdir('public/assets/social', { recursive: true })

const info = await sharp(Buffer.from(background))
  .composite([{ input: logo, left: LOGO_LEFT, top: LOGO_TOP }])
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toFile('public/assets/social/share-1200x630.jpg')

console.log(`written: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`)
