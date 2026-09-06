import CaliforniaLanding from './CaliforniaLanding'

const URL = 'https://www.belenko.design/california-hospitality-design'

export const metadata = {
  title: 'California Hospitality Interior Design | Restaurants, Bars & Hotels | Belenko',
  description:
    'California restaurant, bar and boutique hotel interior design by Belenko — an award-winning European studio. Concept, interior design, branding and FF&E, delivered with California-licensed partners.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  alternates: {
    canonical: URL,
    languages: {
      'en-US': URL,
      'x-default': URL
    }
  },
  openGraph: {
    title: 'California Hospitality Interior Design | Belenko',
    description:
      'Restaurants, bars and boutique hotels designed to make guests come back. Concept, interiors, branding and FF&E, with California-licensed partners.',
    url: URL,
    siteName: 'Belenko Design Studio',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Belenko — California Hospitality Interior Design' }]
  }
}

export default function CaliforniaRoutePage() {
  return <CaliforniaLanding />
}
