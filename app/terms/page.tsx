import type { Metadata } from 'next'
import { withSocial } from '@/lib/seo'
import { business, emailHref, fullAddress, SITE_URL, telHref } from '@/lib/business'

export const metadata: Metadata = withSocial({
  title: 'Terms & Conditions | East St Kilda Dental',
  description: 'Terms and conditions for East St Kilda Dental, covering use of this website, our appointment and cancellation policy, fees and service terms.',
  alternates: { canonical: `${SITE_URL}/terms` },
})

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero section" style={{ background: 'var(--surface-teal)', paddingBottom: '32px' }}>
        <div className="container">
          <div className="page-hero-inner" style={{ maxWidth: '760px' }}>
            <div className="page-hero-text reveal">
              <span className="eyebrow light">Legal</span>
              <h1>Terms &amp; Conditions</h1>
              <p style={{ color: 'rgba(246,239,227,.65)', marginTop: '12px', fontSize: '14px' }}>Last updated: January 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="prose reveal">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing this website or using the services of East St Kilda Dental (&quot;the Practice&quot;), you accept these Terms and Conditions in full. If you do not agree, please do not use this website or our services.
            </p>

            <h2>2. Website Use</h2>
            <p>
              The content of this website is for general information purposes only and does not constitute professional dental or medical advice. Information is provided &quot;as is&quot; without warranties of any kind. The Practice reserves the right to update or remove content at any time without notice.
            </p>

            <h2>3. Appointments</h2>
            <p>
              Appointments can be booked online, by phone, or via email. We ask that patients provide at least 24 hours&apos; notice when cancelling or rescheduling an appointment. Repeated failure to attend without notice may result in a late-cancellation fee.
            </p>

            <h2>4. Treatment Consent</h2>
            <p>
              All dental treatment is performed with the patient&apos;s informed consent. Patients will be provided with a clear explanation of proposed treatment, expected outcomes, risks and costs before any procedure is commenced. Consent may be withdrawn at any time.
            </p>

            <h2>5. Fees & Payment</h2>
            <p>
              Fees are payable on the day of service unless a prior arrangement has been made. Health fund benefits are applied at point of service via HICAPS. Any outstanding balance is the patient&apos;s responsibility. Fee estimates provided are indicative and may vary if clinical circumstances change.
            </p>

            <h2>6. New Patient Comprehensive Care Visit</h2>
            <p>
              The New Patient Comprehensive Care Visit is available to first-time patients only. It includes a comprehensive oral examination, digital bitewing x-rays, and a standard scale and polish. Health fund benefits are applied in addition to the advertised price. The Practice reserves the right to withdraw or modify it at any time.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and design — is the property of East St Kilda Dental and may not be reproduced or used without prior written permission.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, the Practice is not liable for any indirect, incidental or consequential loss arising from your use of this website or our services. Nothing in these terms excludes, restricts or modifies any right or remedy that cannot be excluded by law.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of Victoria, Australia. Any disputes are subject to the jurisdiction of Victorian courts.
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
