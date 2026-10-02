// Generates a practitioner's 1200x630 Open Graph share card.
// Same sage field as the site card (make-share-image.mjs), with the
// practitioner's approved portrait set unaltered on the right.
//
//   node scripts/make-practitioner-share.mjs
//
// Add an entry to CARDS for each published profile that should have its own.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SAGE_DEEP = '#37503F'
const SAGE = '#4C6B5A'
const CREAM = '#F7F3EC'
const CLAY_SOFT = '#EFD9C5'

const W = 1200
const H = 630

const CARDS = [
  {
    portrait: 'public/assets/team/anbar-ganatra.webp',
    out: 'public/assets/social/dr-anbar-ganatra-east-st-kilda-dental.jpg',
    name: 'Dr Anbar Ganatra',
    roles: ['Principal Dentist', 'General &amp; Cosmetic Dentist'],
  },
]

// The portrait fills the card's height on the right; the copy sits in the rest.
const PORTRAIT_W = 470

for (const card of CARDS) {
  const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g" cx="20%" cy="8%" r="95%">
      <stop offset="0%" stop-color="${SAGE}"/>
      <stop offset="62%" stop-color="${SAGE_DEEP}"/>
      <stop offset="100%" stop-color="#2C4033"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="${CLAY_SOFT}"/>

  <text x="80" y="200" fill="${CLAY_SOFT}" font-family="Georgia, 'Times New Roman', serif"
        font-size="22" letter-spacing="5">MEET YOUR DENTIST</text>
  <text x="80" y="290" fill="${CREAM}" font-family="Georgia, 'Times New Roman', serif"
        font-size="66">${card.name}</text>
  ${card.roles
    .map(
      (r, i) => `<text x="80" y="${352 + i * 42}" fill="${CREAM}" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" font-style="italic" opacity="0.9">${r}</text>`,
    )
    .join('\n  ')}
  <rect x="80" y="${352 + card.roles.length * 42 + 6}" width="120" height="3" fill="${CLAY_SOFT}" opacity="0.85"/>
  <text x="80" y="${352 + card.roles.length * 42 + 62}" fill="${CREAM}" font-family="Georgia, 'Times New Roman', serif"
        font-size="25" opacity="0.7">East St Kilda Dental · St Kilda East</text>
</svg>`

  const portrait = await sharp(card.portrait)
    .resize({ width: PORTRAIT_W, height: H, fit: 'cover', position: 'top' })
    .toBuffer()

  await mkdir('public/assets/social', { recursive: true })
  const info = await sharp(Buffer.from(background))
    .composite([{ input: portrait, left: W - PORTRAIT_W, top: 0 }])
    .jpeg({ quality: 86, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(card.out)

  console.log(`${card.out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`)
}
