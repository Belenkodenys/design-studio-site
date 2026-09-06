import MiamiLanding from './MiamiLanding'

const URL = 'https://www.belenko.design/florida'

export const metadata = {
  title: 'Miami Hospitality Interior Design | Restaurants, Bars & Hotels | Belenko',
  description:
    'Miami restaurant, bar and boutique hotel interior design by Belenko. 25+ years of European hospitality experience with local Florida execution — concept, interior design, branding and FF&E.',
  // Indexable ad/organic landing, but not linked from the main site navigation.
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
      // 'es-US': added together with the Spanish version.
    }
  },
  openGraph: {
    title: 'Miami Hospitality Interior Design | Belenko',
    description:
      'Restaurants, bars and boutique hotels designed to make guests come back. Concept, interiors, branding and FF&E, with Florida-licensed partners.',
    url: URL,
    siteName: 'Belenko Design Studio',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Belenko — Miami Hospitality Interior Design' }]
  }
}

export default function MiamiRoutePage() {
  return <MiamiLanding />
}
