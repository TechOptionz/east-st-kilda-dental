#!/usr/bin/env node
/**
 * Builds branded profile cards for team members who don't have a designed one,
 * matching the layout of the supplied clinician cards (1086x1448: photo, green
 * name banner, info panel, tags, booking bar).
 *
 * Usage:
 *   node scripts/make-team-cards.mjs                 # every card below
 *   node scripts/make-team-cards.mjs maddy-coventry  # just one
 *
 * Renders an HTML template in headless Chrome (for the Google fonts the site
 * uses) and writes public/assets/team/<slug>-card.webp. Set CHROME_PATH if
 * Chrome or Edge isn't in the usual Windows/macOS/Linux location.
 *
 * `crop` is the region of the source photo, in source pixels, that fills the
 * photo area. Keep it at the photo area's aspect (1086:1000) and put the top of
 * the head a little below the top edge, as on the designed cards.
 */
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const W = 1086
const H = 1448
const PHOTO_H = 1000
const PHONE = '(03) 9527 3678'

const cards = [
  {
    slug: 'beverly-spector',
    src: 'public/assets/team/beverly-spector.webp',
    crop: { left: 0, top: 0, width: 1122, height: 1033 },
    name: 'Beverly Spector',
    role: 'Dental Hygienist',
    highlights: [['Gentle', 'Attentive'], ['Preventive Care', 'Gum Health']],
    tags: ['Dental Hygienist', 'Gum Health', 'Preventive Care', 'Scale & Clean', 'St Kilda East'],
    cta: 'Book your hygiene appointment today',
  },
  {
    slug: 'michelle-mirjam',
    src: '_archive/team/michelle-mirjam.webp',
    crop: { left: 519, top: 300, width: 3636, height: 3348 },
    name: 'Michelle Mirjam',
    role: 'Dental Assistant & Receptionist',
    highlights: [['Welcoming', 'Caring'], ['Reception', 'Chairside Support']],
    tags: ['Dental Assistant', 'Reception', 'Chairside Care', 'Patient Support', 'St Kilda East'],
    cta: 'Book your dental appointment today',
  },
  {
    slug: 'indiana-oconnor',
    src: '_archive/team/indiana-oconnor.webp',
    crop: { left: 785, top: 430, width: 3100, height: 2855 },
    name: "Indiana O'Connor",
    role: 'Dental Assistant & Receptionist',
    highlights: [['Friendly', 'Helpful'], ['Front Desk', 'Chairside Support']],
    tags: ['Dental Assistant', 'Reception', 'Patient Care', 'Appointments', 'St Kilda East'],
    cta: 'Book your dental appointment today',
  },
  {
    slug: 'maddy-coventry',
    src: '_archive/team/maddy-coventry.webp',
    crop: { left: 695, top: 57, width: 3900, height: 3591 },
    name: 'Maddy Coventry',
    role: 'Dental Assistant & Receptionist',
    highlights: [['Friendly', 'Reassuring'], ['Reception', 'Chairside Support']],
    tags: ['Dental Assistant', 'Reception', 'Chairside Care', 'Patient Support', 'St Kilda East'],
    cta: 'Book your dental appointment today',
  },
]

const GREEN = '#15432f'
const PANEL = '#f3efea'
const TAG_BG = '#d6dacd'
const RULE = '#c4c3ba'
const INK = '#1f2a24'

const icon = {
  pin: `<svg viewBox="0 0 24 24" width="52" height="70"><path fill="${GREEN}" d="M12 0C6.5 0 2.2 4.3 2.2 9.7 2.2 16.6 12 24 12 24s9.8-7.4 9.8-14.3C21.8 4.3 17.5 0 12 0zm0 13.6a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8z"/></svg>`,
  tooth: `<svg viewBox="0 0 24 24" width="62" height="66"><path fill="${GREEN}" d="M7.2 1C3.9 1 1.8 3.6 1.8 7c0 2.3.9 4 1.6 5.8.7 1.9.9 4.1 1.3 6.5.4 2.6 1.1 3.7 2.2 3.7 1.3 0 1.7-1.6 2.1-3.7.4-2 .9-3.8 3-3.8s2.6 1.8 3 3.8c.4 2.1.8 3.7 2.1 3.7 1.1 0 1.8-1.1 2.2-3.7.4-2.4.6-4.6 1.3-6.5.7-1.8 1.6-3.5 1.6-5.8C22.2 3.6 20.1 1 16.8 1c-2 0-3.2.9-4.8.9S9.2 1 7.2 1z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" width="58" height="58" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"><rect x="2.5" y="4" width="19" height="17.5" rx="2.5"/><path d="M2.5 9h19M7.5 2v4M16.5 2v4"/><g fill="#fff" stroke="none"><circle cx="7.5" cy="13" r="1"/><circle cx="12" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/><circle cx="7.5" cy="17" r="1"/><circle cx="12" cy="17" r="1"/></g></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="44" height="44"><path fill="#fff" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`,
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;')

function html(card, photoDataUri) {
  const [a, b] = card.highlights
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Hanken+Grotesk:wght@400;500;600&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden;background:#111}
  body{position:relative;font-family:'Hanken Grotesk',system-ui,sans-serif;color:${INK}}
  .photo{position:absolute;inset:0 0 auto 0;height:${PHOTO_H}px;background:url(${photoDataUri}) center/cover}
  .fade{position:absolute;left:0;right:0;top:${PHOTO_H - 60}px;height:${H - PHOTO_H + 60}px;background:#15171a}
  .panel{position:absolute;left:0;right:0;top:947px;bottom:0;background:${PANEL};border-radius:26px;overflow:hidden}
  .banner{position:absolute;left:50px;top:793px;background:${GREEN};color:#f5f1e8;border-radius:18px;padding:30px 46px 34px 44px;max-width:990px}
  .banner h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:${card.name.length > 16 ? 84 : 90}px;line-height:1;letter-spacing:.5px;white-space:nowrap}
  .banner p{margin-top:18px;font-size:33px;font-weight:500;letter-spacing:3.2px;text-transform:uppercase;white-space:nowrap}
  .info{position:absolute;top:98px;left:55px;right:30px;display:flex;align-items:center;height:96px}
  .info .loc{display:flex;align-items:center;gap:36px;width:447px;border-right:2px solid ${RULE};height:88px}
  .info .hl{display:flex;align-items:center;gap:38px;padding-left:52px}
  .t1{font-size:30px;font-weight:600;color:${GREEN};line-height:1.45}
  .t2{font-size:28px;color:#2b332e;line-height:1.55;white-space:nowrap}
  .dot{display:inline-block;margin:0 12px;font-size:20px;vertical-align:3px}
  .rule{position:absolute;top:236px;left:55px;right:55px;height:2px;background:${RULE}}
  .tags{position:absolute;top:277px;left:50px;right:48px;display:flex;justify-content:space-between;gap:14px}
  .tags span{background:${TAG_BG};border-radius:16px;height:52px;padding:0 24px;display:flex;align-items:center;font-size:21.5px;color:#2d3a31;white-space:nowrap}
  .bar{position:absolute;left:0;right:0;bottom:0;height:136px;background:${GREEN};color:#fff;display:flex;align-items:center;padding-left:55px}
  .bar .cta{display:flex;align-items:center;gap:28px;font-size:${card.cta.length > 34 ? 28 : 30}px;white-space:nowrap;padding-right:34px;border-right:2px solid rgba(255,255,255,.75);height:64px}
  .bar .ph{display:flex;align-items:center;gap:26px;padding-left:36px;font-size:${card.cta.length > 34 ? 34 : 35}px;white-space:nowrap;font-weight:600;letter-spacing:.3px}
</style></head><body>
  <div class="photo"></div>
  <div class="fade"></div>
  <div class="panel">
    <div class="info">
      <div class="loc">${icon.pin}<div><div class="t1">East St Kilda Dental</div><div class="t2">St Kilda East, Melbourne</div></div></div>
      <div class="hl">${icon.tooth}<div><div class="t2">${esc(a[0])}<span class="dot">&#9679;</span>${esc(a[1])}</div><div class="t2">${esc(b[0])}<span class="dot">&#9679;</span>${esc(b[1])}</div></div></div>
    </div>
    <div class="rule"></div>
    <div class="tags">${card.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    <div class="bar">
      <div class="cta">${icon.calendar}<span>${esc(card.cta)}</span></div>
      <div class="ph">${icon.phone}<span>${PHONE}</span></div>
    </div>
  </div>
  <div class="banner"><h1>${esc(card.name)}</h1><p>${esc(card.role)}</p></div>
</body></html>`
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean)
  const found = candidates.find(p => existsSync(p))
  if (!found) {
    console.error('Chrome/Edge not found. Set CHROME_PATH.')
    process.exit(1)
  }
  return found
}

const only = process.argv.slice(2)
const chrome = findChrome()
const dir = await mkdtemp(path.join(tmpdir(), 'team-cards-'))

try {
  for (const card of cards.filter(c => only.length === 0 || only.includes(c.slug))) {
    const photo = await sharp(card.src)
      .extract(card.crop)
      .resize(W, PHOTO_H, { fit: 'cover' })
      .jpeg({ quality: 92 })
      .toBuffer()
    const page = path.join(dir, `${card.slug}.html`)
    const png = path.join(dir, `${card.slug}.png`)
    await writeFile(page, html(card, `data:image/jpeg;base64,${photo.toString('base64')}`))

    execFileSync(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--window-size=${W},${H}`, '--virtual-time-budget=10000',
      `--screenshot=${png}`, pathToFileURL(page).href,
    ], { stdio: 'ignore' })

    const out = `public/assets/team/${card.slug}-card.webp`
    const info = await sharp(png).resize(W, H, { fit: 'cover', position: 'top' }).webp({ quality: 84 }).toFile(out)
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
} finally {
  await rm(dir, { recursive: true, force: true })
}
