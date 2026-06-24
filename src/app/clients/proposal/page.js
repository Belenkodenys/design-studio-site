import ClientLanding from './ClientLanding'

export const metadata = {
  title: 'Belenko Studio — Proposal',
  description: 'Private proposal from Belenko Design Studio',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  },
  alternates: {
    canonical: null
  }
}

export default function ProposalPage() {
  return <ClientLanding />
}
