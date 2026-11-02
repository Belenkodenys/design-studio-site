import ClientLanding from './clients/proposal/ClientLanding'
import './clients/proposal/layout.css'

export const metadata = {
  title: 'Belenko Design Studio — Hospitality Interior Design',
  description: 'Belenko Design Studio — hospitality interior design studio in Barcelona, founded 1999. Restaurants, bars, hotels and beach clubs designed as business products: concept, interior, brand, FF&E and opening. 200+ venues in 11 countries, projects in Europe and the U.S.',
  alternates: {
    canonical: 'https://www.belenko.design/'
  },
  openGraph: {
    title: 'Belenko Design Studio — Hospitality Interior Design',
    description: 'Belenko Design Studio — hospitality interior design studio in Barcelona, founded 1999. Restaurants, bars, hotels and beach clubs designed as business products: concept, interior, brand, FF&E and opening. 200+ venues in 11 countries, projects in Europe and the U.S.',
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
