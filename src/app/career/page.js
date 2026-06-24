import CareerPageClient from './CareerPageClient'

export const metadata = {
  title: 'Career',
  description: 'Join Belenko Design Studio team. Open positions for interior designers, 3D artists, and project managers in Barcelona.',
  openGraph: {
    title: 'Career | Belenko Design',
    description: 'Join Belenko Design Studio team. Open positions in Barcelona.',
    images: ['/og-image.jpg']
  },
  alternates: { canonical: 'https://www.belenko.design/career' }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.belenko.design/" },
    { "@type": "ListItem", "position": 2, "name": "Career", "item": "https://www.belenko.design/career" }
  ]
}

export default function CareerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CareerPageClient />
    </>
  )
}
