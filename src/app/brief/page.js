import BriefPageClient from './BriefPageClient'

export const metadata = {
  title: 'Project Brief',
  description: 'Fill out the project brief for Belenko Design Studio',
  robots: {
    index: false,
    follow: false
  }
}

export default function BriefPage() {
  return <BriefPageClient />
}
