import BriefsAdminClient from './BriefsAdminClient'

export const metadata = {
  title: 'Briefs Admin',
  robots: {
    index: false,
    follow: false
  }
}

export default function BriefsAdminPage() {
  return <BriefsAdminClient />
}
