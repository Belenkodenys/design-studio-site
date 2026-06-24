import PresentationPage from './PresentationPage'

export const metadata = {
  title: 'Belenko Studio — Presentation',
  description: 'Private presentation by Belenko Design Studio',
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

export default function PresentationRoutePage() {
  return <PresentationPage />
}
