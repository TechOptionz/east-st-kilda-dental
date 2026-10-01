import PractitionerProfilePage, { practitionerMetadata } from '@/components/PractitionerProfile'

const SLUG = 'dr-anbar-ganatra'

export const metadata = practitionerMetadata(SLUG)

export default function Page() {
  return <PractitionerProfilePage slug={SLUG} />
}
