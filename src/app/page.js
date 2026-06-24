import ClientLanding from './clients/proposal/ClientLanding'
import './clients/proposal/layout.css'

export const metadata = {
  title: 'Belenko Design Studio — Hospitality Interior Design',
  description: 'Barcelona-based hospitality design studio creating venues worldwide where interior, brand, and guest experience come together to make people fall in love and come back.',
  alternates: {
    canonical: 'https://belenko.design/'
  },
  openGraph: {
    title: 'Belenko Design Studio — Hospitality Interior Design',
    description: 'Barcelona-based hospitality design studio creating venues worldwide where interior, brand, and guest experience come together to make people fall in love and come back.',
    url: 'https://belenko.design/',
    siteName: 'Belenko Design Studio',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Belenko Design Studio — Hospitality Interior Design'
      }
    ]
  }
}

export default function HomePage() {
  return <ClientLanding />
}
