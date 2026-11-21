import AwardsPageClient from './AwardsPageClient'

export const metadata = {
  title: 'Awards & Recognition',
  description:
    'International design awards won by Belenko Design Studio: Restaurant & Bar Design Awards, Kyoto Global Design Awards, FoodInSpace Awards, Mix Awards North. Finalists, shortlists and professional recognition.',
  openGraph: {
    title: 'Awards & Recognition | Belenko Design',
    description: 'International awards and recognition of Belenko Design Studio hospitality interiors.',
    images: ['/og-belenko-logo.jpg']
  },
  alternates: { canonical: 'https://www.belenko.design/awards' }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.belenko.design/' },
    { '@type': 'ListItem', position: 2, name: 'Awards & Recognition', item: 'https://www.belenko.design/awards' }
  ]
}

export default function AwardsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AwardsPageClient />
    </>
  )
}
