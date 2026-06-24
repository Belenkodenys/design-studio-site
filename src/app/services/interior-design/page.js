import { projects } from '../../../data/projects'
import ServicePageClient from '../ServicePageClient'

export const metadata = {
  title: 'Interior Design for Hospitality | Restaurants & Hotels | Belenko',
  description: 'Award-winning interior design for restaurants, bars, cafes, and hotels. We create immersive environments that elevate guest experiences and drive business success.',
  keywords: 'hospitality interior design, restaurant interior design, hotel interior design, commercial interior design',
  openGraph: {
    title: 'Interior Design | Belenko Design Studio',
    description: 'Creating interiors that tell stories and shape experiences. Award-winning hospitality design.',
    images: [{ url: 'https://belenko.design/service-3.png', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.belenko.design/services/interior-design' },
}

export default function InteriorDesignPage() {
  return (
    <ServicePageClient slug="interior-design"
      serviceKey="interior"
      heroImage="/service-3.png"
      stats={[
        { number: '200+', labelKey: 'interiorsDesigned' },
        { number: '25+', labelKey: 'yearsExperience' },
        { number: '15+', labelKey: 'countriesWorked' }
      ]}
      projects={projects.slice(0, 6)}
    />
  )
}
