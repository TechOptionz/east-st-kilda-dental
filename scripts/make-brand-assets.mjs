#!/usr/bin/env node
/**
 * Builds the web logo files from the master horizontal logo.
 *
 * Usage: npm run brand-assets
 *
 * Source: assets/brand-logos/new-logo.png (crescent mark + "East St Kilda
 * dental", transparent, dark lettering). Outputs:
 *
 *   public/assets/brand/eskd-logo.png           trimmed full-colour logo, for
 *                                               light grounds (header, schema)
 *   public/assets/brand/eskd-logo-reversed.png  cream tonal version for dark
 *                                               grounds (footer)
 *
 * The favicon is deliberately not built from this logo; it stays as it was.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets/brand-logos/new-logo.png'
const CREAM = [248, 247, 245] // --cream #F8F7F5
const SAND = [224, 196, 168] // between --clay-soft and --clay

await mkdir('public/assets/brand', { recursive: true })

const trimmed = await sharp(SRC).trim().png().toBuffer()
const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const raw = { raw: { width: info.width, height: info.height, channels: 4 } }

await sharp(trimmed).png({ compressionLevel: 9 }).toFile('public/assets/brand/eskd-logo.png')

// Reversed: dark source tones (lettering, deep green) become cream and light
// ones (the pale crescent) a warm sand, blended by luminance, so the mark keeps
// its two layers and the overlap between them instead of flattening into one
// shape.
const rev = Buffer.from(data)
for (let i = 0; i < rev.length; i += 4) {
  const lum = (0.2126 * rev[i] + 0.7152 * rev[i + 1] + 0.0722 * rev[i + 2]) / 255
  const t = Math.min(1, Math.max(0, (lum - 0.35) / 0.5))
  for (let c = 0; c < 3; c++) rev[i + c] = Math.round(CREAM[c] + (SAND[c] - CREAM[c]) * t)
}
await sharp(rev, raw).png({ compressionLevel: 9 }).toFile('public/assets/brand/eskd-logo-reversed.png')

console.log(`logo ${info.width}x${info.height}; wrote eskd-logo.png, eskd-logo-reversed.png`)
