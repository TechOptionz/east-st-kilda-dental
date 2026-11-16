import type { Metadata } from 'next'
import { withSocial } from '@/lib/seo'
import { business, emailHref, fullAddress, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Privacy Policy | East St Kilda Dental',
  description: 'East St Kilda Dental\'s privacy policy: how we collect, use, store and protect your personal and health information, and how to access or correct it.',
  alternates: { canonical: `${SITE_URL}/privacy` },
})

export default function PrivacyPage() {
  return (
    <main>
      <section className="page-hero section" style={{ background: 'var(--surface-teal)', paddingBottom: '32px' }}>
        <div className="container">
          <div className="page-hero-inner" style={{ maxWidth: '760px' }}>
            <div className="page-hero-text reveal">
              <span className="eyebrow light">Legal</span>
              <h1>Privacy Policy</h1>
              <p style={{ color: 'rgba(246,239,227,.65)', marginTop: '12px', fontSize: '14px' }}>Last updated: January 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="prose reveal">
            <h2>1. Our Commitment</h2>
            <p>
              East St Kilda Dental (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting the privacy of our patients and website visitors. We comply with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect personal information that is necessary to provide dental services and manage our practice, including:</p>
            <ul>
              <li>Contact information (name, address, phone, email)</li>
              <li>Date of birth and Medicare/health fund details</li>
              <li>Medical and dental history, x-rays and clinical records</li>
              <li>Payment information (processed securely — we do not store card details)</li>
              <li>Correspondence and enquiries submitted via our website or phone</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Provide and manage your dental care</li>
              <li>Process health fund claims and payments</li>
              <li>Send appointment reminders and recalls</li>
              <li>Respond to your enquiries</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
            <p>We do not sell, rent or trade your personal information to third parties.</p>

            <h2>4. Disclosure of Information</h2>
            <p>
              We may share your information with other treating health professionals (with your consent), our contracted services providers (e.g. dental laboratories, software providers) who are bound by confidentiality obligations, and where required by law (e.g. mandatory reporting obligations).
            </p>

            <h2>5. Health Records</h2>
            <p>
              Your dental records are health records and are subject to both the Privacy Act and, in Victoria, the Health Records Act 2001 (Vic). You have the right to access your health records. Requests should be made in writing to our practice manager.
            </p>

            <h2>6. Security</h2>
            <p>
              We take reasonable steps to protect your personal information from misuse, interference, loss, and unauthorised access, modification or disclosure. Our patient management system is password-protected and access is restricted to authorised staff.
            </p>

            <h2>7. Website & Cookies</h2>
            <p>
              Our website may collect anonymised analytics data (e.g. page views, referrer information) via third-party tools. This data is not personally identifiable. We do not use tracking cookies for advertising purposes.
            </p>

            <h2>8. Access & Correction</h2>
            <p>
              You may request access to or correction of your personal information at any time by contacting us at <a href={emailHref}>{business.email}</a> or by calling <a href={telHref}>{business.telephoneDisplay}</a>.
            </p>

            <h2>9. Complaints</h2>
            <p>
              If you have a concern about how we handle your personal information, please contact us in the first instance. If your concern is not resolved, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>.
            </p>

            <h2>10. Contact</h2>
            <p>
              {business.name}<br />
              {fullAddress}<br />
              <a href={telHref}>{business.telephoneDisplay}</a><br />
              <a href={emailHref}>{business.email}</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
