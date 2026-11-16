import Image from 'next/image'
import Link from 'next/link'
import { practitionersForService } from '@/data/practitioners'

/**
 * "Your dentist for this treatment": a practitioner link on a service page.
 *
 * Driven entirely by the `services` list on each profile in
 * data/practitioners.ts, so a practitioner appears only on the treatments the
 * practice has associated with them — never on every service by default — and
 * only once their profile is published. Renders nothing otherwise.
 */
export default function ServicePractitioners({ serviceSlug }: { serviceSlug: string }) {
  const list = practitionersForService(serviceSlug)
  if (list.length === 0) return null

  return (
    <div className="container" style={{ padding: '8px var(--gutter) 48px' }}>
      <div
        className="reveal"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}
      >
        {list.map(p => (
          <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Image
              src={p.image}
              alt=""
              width={64}
              height={64}
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: p.objectPosition ?? 'center top' }}
            />
            <div>
              <div className="eyebrow" style={{ marginBottom: '4px' }}>Your dentist</div>
              <Link href={`/about/${p.slug}`} className="name-link" style={{ fontFamily: 'var(--display)', fontSize: '22px', color: 'var(--ink)' }}>
                {p.name}
              </Link>
              <div style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{p.jobTitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
